package resolvers

import (
	"context"
	"database/sql"
	"errors"
	"path/filepath"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/upload"
)

func SetSystemIntakeGRBPresentationLinks(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, input models.SystemIntakeGRBPresentationLinksInput) (*models.SystemIntakeGRBPresentationLinks, error) {
	userID := appcontext.Principal(ctx).Account().ID

	links, err := dataloaders.GetSystemIntakeGRBPresentationLinksByIntakeID(ctx, input.SystemIntakeID)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return nil, err
		}
	}

	if links == nil {
		// initialize new links struct if one does not already exist
		links = models.NewSystemIntakeGRBPresentationLinks(userID)
		links.SystemIntakeID = input.SystemIntakeID
	}

	if value, ok := input.RecordingLink.ValueOK(); ok {
		links.RecordingLink = value
	}

	if value, ok := input.RecordingPasscode.ValueOK(); ok {
		links.RecordingPasscode = value
	}

	if value, ok := input.TranscriptLink.ValueOK(); ok {
		links.TranscriptLink = value

		// setting a transcript link means we need to also un-set all the other transcript-related fields
		// for the transcript_link_or_doc_null_check SQL check
		links.TranscriptFileName = nil
		links.TranscriptS3Key = nil
	}

	links.ModifiedBy = &userID

	if value, ok := input.TranscriptFileData.ValueOK(); ok {
		// if no file is attached
		if value == nil {
			// remove references to file
			links.TranscriptFileName = nil
			links.TranscriptS3Key = nil
		} else {
			// set this to nil in order to use s3key instead
			links.TranscriptLink = nil

			links.TranscriptFileName = &value.Filename

			s3Key, err := handleS3Upload(s3Client, value)
			if err != nil {
				return nil, err
			}

			links.TranscriptS3Key = &s3Key
		}

	}

	if value, ok := input.PresentationDeckFileData.ValueOK(); ok {
		// if no file is attached
		if value == nil {
			// remove references to file
			links.PresentationDeckFileName = nil
			links.PresentationDeckS3Key = nil
		} else {
			links.PresentationDeckFileName = &value.Filename

			s3Key, err := handleS3Upload(s3Client, value)
			if err != nil {
				return nil, err
			}

			links.PresentationDeckS3Key = &s3Key
		}
	}

	return store.SetSystemIntakeGRBPresentationLinks(ctx, links)
}

func SystemIntakeGRBPresentationLinksTranscriptFileURL(ctx context.Context, s3Client *upload.S3Client, systemIntakeID uuid.UUID) (*string, error) {
	links, err := dataloaders.GetSystemIntakeGRBPresentationLinksByIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	if links == nil {
		return nil, nil
	}

	if links.TranscriptS3Key == nil {
		return nil, nil
	}

	data, err := s3Client.NewGetPresignedURL(*links.TranscriptS3Key)
	if err != nil {
		return nil, err
	}

	return helpers.PointerTo(data.URL), nil
}

func SystemIntakeGRBPresentationLinksTranscriptFileStatus(ctx context.Context, logger *zap.Logger, s3Client *upload.S3Client, systemIntakeID uuid.UUID) (*models.SystemIntakeDocumentStatus, error) {
	links, err := dataloaders.GetSystemIntakeGRBPresentationLinksByIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	if links == nil {
		return nil, nil
	}

	if links.TranscriptS3Key == nil {
		return nil, nil
	}

	fileStatus, err := GetStatusForSystemIntakeDocument(s3Client, *links.TranscriptS3Key)
	if err != nil {
		logger.Warn("failed to get status for GRBPresentationLinksTranscriptFileStatus", zap.Error(err), zap.Any("s3Key", links.TranscriptS3Key), zap.Any("systemIntakeID", systemIntakeID))
		return nil, nil
	}

	return helpers.PointerTo(fileStatus), nil
}

func SystemIntakeGRBPresentationLinksPresentationDeckFileURL(ctx context.Context, s3Client *upload.S3Client, systemIntakeID uuid.UUID) (*string, error) {
	links, err := dataloaders.GetSystemIntakeGRBPresentationLinksByIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	if links == nil {
		return nil, nil
	}

	if links.PresentationDeckS3Key == nil {
		return nil, nil
	}

	data, err := s3Client.NewGetPresignedURL(*links.PresentationDeckS3Key)
	if err != nil {
		return nil, err
	}

	return helpers.PointerTo(data.URL), nil
}

func SystemIntakeGRBPresentationLinksPresentationDeckFileStatus(ctx context.Context, logger *zap.Logger, s3Client *upload.S3Client, systemIntakeID uuid.UUID) (*models.SystemIntakeDocumentStatus, error) {
	links, err := dataloaders.GetSystemIntakeGRBPresentationLinksByIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	if links == nil {
		return nil, nil
	}

	if links.PresentationDeckS3Key == nil {
		return nil, nil
	}

	fileStatus, err := GetStatusForSystemIntakeDocument(s3Client, *links.PresentationDeckS3Key)
	if err != nil {
		logger.Warn("failed to get status for GRBPresentationDeckFileStatus", zap.Error(err), zap.Any("s3Key", links.TranscriptS3Key), zap.Any("systemIntakeID", systemIntakeID))
		return nil, nil
	}

	return helpers.PointerTo(fileStatus), nil
}

// handleS3Upload uploads a file to S3
func handleS3Upload(s3Client *upload.S3Client, upload *graphql.Upload) (string, error) {
	s3Key := uuid.New().String()
	ext := filepath.Ext(upload.Filename)
	if len(ext) > 0 {
		s3Key += ext
	} else {
		s3Key += fallbackExtension
	}

	decodedReadSeeker, err := easiencoding.DecodeBase64File(&upload.File)
	if err != nil {
		return "", err
	}

	if err := s3Client.UploadFile(s3Key, decodedReadSeeker); err != nil {
		return "", err
	}

	return s3Key, nil
}
