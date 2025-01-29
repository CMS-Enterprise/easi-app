package resolvers

import (
	"context"
	"errors"
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

	var fileToUse *graphql.Upload
	if input.TranscriptFileData != nil {
		links.TranscriptFileName = &input.TranscriptFileData.Filename
		fileToUse = input.TranscriptFileData
	}

	if input.PresentationDeckFileData != nil {
		links.PresentationDeckFileName = &input.PresentationDeckFileData.Filename
		fileToUse = input.PresentationDeckFileData
	}

	if fileToUse == nil {
		return nil, errors.New("no file found when setting system intake GRB presentation links")
	}

	s3Key := uuid.New().String()
	ext := filepath.Ext(fileToUse.Filename)
	if len(ext) > 0 {
		s3Key += ext
	} else {
		s3Key += fallbackExtension
	}

	decodedReadSeeker, err := easiencoding.DecodeBase64File(&fileToUse.File)
	if err != nil {
		return nil, err
	}

	if err := s3Client.UploadFile(s3Key, decodedReadSeeker); err != nil {
		return nil, err
	}

	return store.SetSystemIntakeGRBPresentationLinks(ctx, links)
}
