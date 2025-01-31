package resolvers

import (
	"context"
	"path/filepath"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/upload"
)

func SetSystemIntakeGRBPresentationLinks(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, input models.SystemIntakeGRBPresentationLinksInput) (*models.SystemIntakeGRBPresentationLinks, error) {
	userID := appcontext.Principal(ctx).Account().ID
	links := models.NewSystemIntakeGRBPresentationLinks(userID)
	links.SystemIntakeID = input.SystemIntakeID
	links.CreatedAt = time.Now()
	links.CreatedBy = userID
	links.RecordingLink = input.RecordingLink
	links.RecordingPasscode = input.RecordingPasscode
	links.TranscriptLink = input.TranscriptLink

	switch {
	case input.TranscriptFileData != nil:
		// set this to nil in order to use s3key instead
		links.TranscriptLink = nil

		links.TranscriptFileName = &input.TranscriptFileData.Filename

		s3Key, err := handleFile(s3Client, input.TranscriptFileData)
		if err != nil {
			return nil, err
		}

		links.TranscriptS3Key = &s3Key

	case input.PresentationDeckFileData != nil:
		// set this to nil as we will not be using a transcript in this case
		links.TranscriptLink = nil

		links.PresentationDeckFileName = &input.PresentationDeckFileData.Filename

		s3Key, err := handleFile(s3Client, input.PresentationDeckFileData)
		if err != nil {
			return nil, err
		}

		links.PresentationDeckS3Key = &s3Key
	}

	return store.SetSystemIntakeGRBPresentationLinks(ctx, links)
}

func handleFile(s3Client *upload.S3Client, upload *graphql.Upload) (string, error) {
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
