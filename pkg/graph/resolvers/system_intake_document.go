package resolvers

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"path/filepath"
	"slices"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/services"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/upload"
)

// GetSystemIntakeDocumentsByRequestID fetches all documents attached to the system intake with the given ID.
func GetSystemIntakeDocumentsByRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.SystemIntakeDocument, error) {
	return store.GetSystemIntakeDocumentsByRequestID(ctx, id)
}

// GetURLForSystemIntakeDocument queries S3 for a presigned URL that can be used to fetch the document with the given s3Key
func GetURLForSystemIntakeDocument(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, s3Key string) (string, error) {
	if err := canView(ctx, store, s3Key); err != nil {
		return "", err
	}

	presignedURL, err := s3Client.NewGetPresignedURL(s3Key)
	if err != nil {
		return "", err
	}

	return presignedURL.URL, nil
}

// GetStatusForSystemIntakeDocument queries S3 for the virus-scanning status of a document with the given s3Key
func GetStatusForSystemIntakeDocument(s3Client *upload.S3Client, s3Key string) (models.SystemIntakeDocumentStatus, error) {
	avStatus, err := s3Client.TagValueForKey(s3Key, upload.AVStatusTagName)
	if err != nil {
		return "", err
	}

	// possible tag values come from virus scanning lambda
	if avStatus == "CLEAN" {
		return models.SystemIntakeDocumentStatusAvailable, nil
	} else if avStatus == "INFECTED" {
		return models.SystemIntakeDocumentStatusUnavailable, nil
	} else {
		return models.SystemIntakeDocumentStatusPending, nil
	}
}

// CreateSystemIntakeDocument uploads a document to S3, then saves its metadata to our database.
func CreateSystemIntakeDocument(
	ctx context.Context,
	store *storage.Store,
	s3Client *upload.S3Client,
	emailClient *email.Client,
	input models.CreateSystemIntakeDocumentInput) (*models.SystemIntakeDocument, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, input.RequestID)
	if err != nil {
		return nil, err
	}

	uploaderRole, err := getUploaderRole(ctx, intake)
	if err != nil {
		return nil, err
	}

	if err := canCreate(ctx, uploaderRole, intake); err != nil {
		return nil, err
	}

	s3Key := uuid.New().String()

	existingExtension := filepath.Ext(input.FileData.Filename)
	if existingExtension != "" {
		s3Key += existingExtension
	} else {
		s3Key += fallbackExtension
	}

	decodedReadSeeker, err := easiencoding.DecodeBase64File(&input.FileData.File)
	if err != nil {
		return nil, fmt.Errorf("...%w...FileName: %s", err, input.FileData.Filename) //Wrap error and provide filename
	}

	err = s3Client.UploadFile(s3Key, decodedReadSeeker)
	if err != nil {
		return nil, err
	}

	documentDatabaseRecord := models.SystemIntakeDocument{
		SystemIntakeRequestID: input.RequestID,
		CommonDocumentType:    input.DocumentType,
		FileName:              input.FileData.Filename,
		S3Key:                 s3Key,
		Bucket:                s3Client.GetBucket(),
		UploaderRole:          uploaderRole,
		// Status isn't saved in database - will be fetched from S3
		// URL isn't saved in database - will be generated by querying S3
	}
	documentDatabaseRecord.CreatedBy = appcontext.Principal(ctx).ID()
	if input.OtherTypeDescription != nil {
		documentDatabaseRecord.OtherType = *input.OtherTypeDescription
	}

	if uploaderRole == models.AdminUploaderRole && emailClient != nil {

		// send notification
		_ = 1
	}

	return store.CreateSystemIntakeDocument(ctx, &documentDatabaseRecord)
}

// DeleteSystemIntakeDocument deletes an existing SystemIntakeDocument, given its ID.
//
// Does *not* delete the uploaded file from S3, following the example of TRB request documents.
func DeleteSystemIntakeDocument(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.SystemIntakeDocument, error) {
	if err := canDelete(ctx, store, id); err != nil {
		return nil, err
	}

	return store.DeleteSystemIntakeDocument(ctx, id)
}

// canView guards unauthorized views (downloads) of system intake documents
// admins can view any document
// requesters can view any document
// GRB reviewers can view any document
func canView(ctx context.Context, store *storage.Store, s3Key string) error {
	// admins can view
	if services.HasRole(ctx, models.RoleEasiGovteam) {
		return nil
	}

	document, err := store.GetSystemIntakeDocumentByS3Key(ctx, s3Key)
	if err != nil {

		if errors.Is(err, sql.ErrNoRows) {
			// if the document was deleted, don't error and break
			return nil
		}

		return err
	}

	// requester can view
	user := appcontext.Principal(ctx).Account()
	if document.GetCreatedBy() == user.Username {
		return nil
	}

	// if needed, get GRB members for this intake
	grbUsers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{document.SystemIntakeRequestID})
	if err != nil {
		return err
	}

	if isGRBViewer := slices.ContainsFunc(grbUsers, func(reviewer *models.SystemIntakeGRBReviewer) bool {
		return reviewer.UserID == user.ID
	}); isGRBViewer {
		return nil
	}

	appcontext.ZLogger(ctx).Warn("unauthorized user attempted to view system intake document",
		zap.String("username", user.Username),
		zap.String("system_intake.id", document.SystemIntakeRequestID.String()),
		zap.String("document.id", document.ID.String()))

	return errors.New("unauthorized attempt to view system intake document")
}

// getUploaderRole guards unauthorized creation of system intake documents
// admins can upload documents
// requesters can upload documents
func getUploaderRole(ctx context.Context, intake *models.SystemIntake) (models.DocumentUploaderRole, error) {
	// check requester first as that role takes precedence over admin role for uploader roles
	user := appcontext.Principal(ctx).Account()
	if intake.EUAUserID.String == user.Username {
		return models.RequesterUploaderRole, nil
	}

	if services.HasRole(ctx, models.RoleEasiGovteam) {
		return models.AdminUploaderRole, nil
	}

	appcontext.ZLogger(ctx).Warn("unauthorized user attempted to create system intake document",
		zap.String("username", user.Username),
		zap.String("system_intake.id", intake.ID.String()))

	return "", errors.New("unauthorized attempt to create system intake document")
}

func canCreate(ctx context.Context, role models.DocumentUploaderRole, intake *models.SystemIntake) error {
	if role == models.RequesterUploaderRole || role == models.AdminUploaderRole {
		return nil
	}

	appcontext.ZLogger(ctx).Warn("unauthorized user attempted to create system intake document",
		zap.String("username", appcontext.Principal(ctx).Account().Username),
		zap.String("system_intake.id", intake.ID.String()))

	return errors.New("unauthorized attempt to create system intake document")
}

// canDelete guards unauthorized deletions of system intake documents
// an admin is allowed to delete admin-uploaded docs
// the intake requester is allowed to delete requester-uploaded docs
func canDelete(ctx context.Context, store *storage.Store, id uuid.UUID) error {
	document, err := store.GetSystemIntakeDocumentByID(ctx, id)
	if err != nil {
		return err
	}

	// admins can only delete admin-uploaded docs
	if services.HasRole(ctx, models.RoleEasiGovteam) && document.UploaderRole == models.AdminUploaderRole {
		return nil
	}

	// if the acting user is the requester, they can delete the doc
	user := appcontext.Principal(ctx).Account()
	if document.GetCreatedBy() == user.Username {
		return nil
	}

	appcontext.ZLogger(ctx).Warn("unauthorized user attempted to delete system intake document",
		zap.String("username", user.Username),
		zap.String("system_intake.id", document.SystemIntakeRequestID.String()),
		zap.String("document.id", document.ID.String()))

	return errors.New("unauthorized attempt to delete system intake document")
}
