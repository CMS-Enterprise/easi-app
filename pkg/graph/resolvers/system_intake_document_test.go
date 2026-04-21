package resolvers

import (
	"bytes"
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func newResolveUploaderRoleContext(principalID uuid.UUID, isAdmin bool, contacts []*models.SystemIntakeContact, loadErr error) context.Context {
	ctx := context.Background()
	principal := &authentication.EUAPrincipal{
		EUAID:      "TEST",
		JobCodeGRT: isAdmin,
		UserAccount: &authentication.UserAccount{
			ID:       principalID,
			Username: "TEST",
		},
	}
	ctx = appcontext.WithPrincipal(ctx, principal)

	buildDataloaders := func() *dataloaders.Dataloaders {
		dl := dataloaders.NewDataloaders(
			nil,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
		dl.SystemIntakeContactsBySystemIntakeID = dataloadgen.NewLoader(func(ctx context.Context, ids []uuid.UUID) ([][]*models.SystemIntakeContact, []error) {
			if loadErr != nil {
				return nil, []error{loadErr}
			}
			results := make([][]*models.SystemIntakeContact, len(ids))
			for i := range ids {
				results[i] = contacts
			}
			return results, nil
		})
		return dl
	}

	return dataloaders.CTXWithLoaders(ctx, buildDataloaders)
}

func newResolveUploaderRoleContextWithoutDataloaders(principalID uuid.UUID, isAdmin bool) context.Context {
	ctx := context.Background()
	principal := &authentication.EUAPrincipal{
		EUAID:      "TEST",
		JobCodeGRT: isAdmin,
		UserAccount: &authentication.UserAccount{
			ID:       principalID,
			Username: "TEST",
		},
	}
	return appcontext.WithPrincipal(ctx, principal)
}

func (s *ResolverSuite) TestSystemIntakeDocumentResolvers() {
	// Create a system intake
	intake := s.createNewIntakeWithResolver(func(si *models.SystemIntake) {
		si.RequestType = models.SystemIntakeRequestTypeMAJORCHANGES
	})
	s.NotNil(intake)

	// Check that there are no docs by default
	docs, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), intake.ID)
	s.NoError(err)
	s.Len(docs, 0)

	// Create a document
	documentToCreate := &models.SystemIntakeDocument{
		SystemIntakeID:     intake.ID,
		CommonDocumentType: models.SystemIntakeDocumentCommonTypeDraftIGCE,
		Version:            models.SystemIntakeDocumentVersionHISTORICAL,
		FileName:           "create_and_get.pdf",
		Bucket:             "bukkit",
		S3Key:              uuid.NewString(),
		UploaderRole:       models.RequesterUploaderRole,
	}

	createdDocument := createSystemIntakeDocumentSubtest(s, intake.ID, documentToCreate)
	getSystemIntakeDocumentsByRequestIDSubtest(s, intake.ID, createdDocument)
	deleteSystemIntakeDocumentSubtest(s, createdDocument)
}

func TestShouldSend(t *testing.T) {
	testCases := []struct {
		name         string
		role         models.DocumentUploaderRole
		send         *bool
		expectResult bool
	}{
		{
			name:         "admin selected yes",
			role:         models.AdminUploaderRole,
			send:         new(true),
			expectResult: true,
		},
		{
			name:         "admin selected no",
			role:         models.AdminUploaderRole,
			send:         new(false),
			expectResult: false,
		},
		{
			name:         "admin did not make a selection",
			role:         models.AdminUploaderRole,
			send:         nil,
			expectResult: false,
		},
		{
			name:         "requester selected yes",
			role:         models.RequesterUploaderRole,
			send:         new(true),
			expectResult: false,
		},
		{
			name:         "requester selected no",
			role:         models.RequesterUploaderRole,
			send:         new(false),
			expectResult: false,
		},
		{
			name:         "requester did not make a selection",
			role:         models.RequesterUploaderRole,
			send:         nil,
			expectResult: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if got := shouldSend(tc.role, tc.send); got != tc.expectResult {
				t.Fatalf("expected shouldSend(%q) to be %t, got %t", tc.role, tc.expectResult, got)
			}
		})
	}
}

// subtests are regular functions, not suite methods, so we can guarantee they run sequentially
func createSystemIntakeDocumentSubtest(s *ResolverSuite, systemIntakeID uuid.UUID, documentToCreate *models.SystemIntakeDocument) *models.SystemIntakeDocument {
	testContents := "Test file content"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := models.CreateSystemIntakeDocumentInput{
		RequestID:            documentToCreate.SystemIntakeID,
		DocumentType:         documentToCreate.CommonDocumentType,
		Version:              documentToCreate.Version,
		OtherTypeDescription: &documentToCreate.OtherType,
		FileData: graphql.Upload{
			File:        fileToUpload,
			Filename:    documentToCreate.FileName,
			Size:        fileToUpload.Size(),
			ContentType: "application/pdf",
		},
	}

	createdDocument, err := CreateSystemIntakeDocument(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.S3Client,
		s.testConfigs.EmailClient,
		gqlInput,
	)
	s.NoError(err)
	s.NotNil(createdDocument)

	checkSystemIntakeDocumentEquality(s, documentToCreate, s.testConfigs.Principal.ID(), systemIntakeID, createdDocument)
	s.EqualValues(s.testConfigs.S3Client.GetBucket(), createdDocument.Bucket)

	return createdDocument // used by other tests
}

func getSystemIntakeDocumentsByRequestIDSubtest(s *ResolverSuite, systemIntakeID uuid.UUID, createdDocument *models.SystemIntakeDocument) {
	documents, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), systemIntakeID)
	s.NoError(err)
	s.Equal(1, len(documents))

	fetchedDocument := documents[0]
	s.NotNil(fetchedDocument)

	checkSystemIntakeDocumentEquality(s, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeID, fetchedDocument)
	// TODO - try downloading fetchedDocument.URL? compare content to fileToUpload from create subtest?
}

func TestResolveUploaderRole(t *testing.T) {
	intakeID := uuid.New()
	userID := uuid.New()

	intake := &models.SystemIntake{
		ID: intakeID,
	}

	requesterContact := models.NewSystemIntakeContact(userID, uuid.New())
	requesterContact.SystemIntakeID = intakeID
	requesterContact.IsRequester = true

	otherRequesterContact := models.NewSystemIntakeContact(uuid.New(), uuid.New())
	otherRequesterContact.SystemIntakeID = intakeID
	otherRequesterContact.IsRequester = true

	testCases := []struct {
		name              string
		ctx               context.Context
		expectRole        models.DocumentUploaderRole
		expectErrContains string
	}{
		{
			name:       "user is requester",
			ctx:        newResolveUploaderRoleContext(userID, false, []*models.SystemIntakeContact{requesterContact}, nil),
			expectRole: models.RequesterUploaderRole,
		},
		{
			name:       "user is not requester but is admin",
			ctx:        newResolveUploaderRoleContext(userID, true, []*models.SystemIntakeContact{otherRequesterContact}, nil),
			expectRole: models.AdminUploaderRole,
		},
		{
			name:       "user is requester and admin",
			ctx:        newResolveUploaderRoleContext(userID, true, []*models.SystemIntakeContact{requesterContact}, nil),
			expectRole: models.AdminUploaderRole,
		},
		{
			name:       "admin short-circuits before requester lookup",
			ctx:        newResolveUploaderRoleContextWithoutDataloaders(userID, true),
			expectRole: models.AdminUploaderRole,
		},
		{
			name:              "user is neither requester nor admin",
			ctx:               newResolveUploaderRoleContext(userID, false, []*models.SystemIntakeContact{otherRequesterContact}, nil),
			expectErrContains: "user is not authorized to upload system intake documents",
		},
		{
			name:       "requester not found for admin",
			ctx:        newResolveUploaderRoleContext(userID, true, []*models.SystemIntakeContact{}, nil),
			expectRole: models.AdminUploaderRole,
		},
		{
			name:              "requester not found and user is not admin",
			ctx:               newResolveUploaderRoleContext(userID, false, []*models.SystemIntakeContact{}, nil),
			expectErrContains: "system intake requester not found",
		},
		{
			name:              "requester lookup error",
			ctx:               newResolveUploaderRoleContext(userID, false, nil, errors.New("boom")),
			expectErrContains: "fetching system intake requester",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			role, err := resolveUploaderRole(tc.ctx, intake)
			if tc.expectErrContains != "" {
				if err == nil {
					t.Fatalf("expected error containing %q, got nil", tc.expectErrContains)
				}
				if !strings.Contains(err.Error(), tc.expectErrContains) {
					t.Fatalf("expected error containing %q, got %q", tc.expectErrContains, err.Error())
				}
				if role != models.DocumentUploaderRole("") {
					t.Fatalf("expected empty role, got %q", role)
				}
				return
			}

			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}
			if role != tc.expectRole {
				t.Fatalf("expected role %q, got %q", tc.expectRole, role)
			}
		})
	}
}

func deleteSystemIntakeDocumentSubtest(s *ResolverSuite, createdDocument *models.SystemIntakeDocument) {
	deletedDocument, err := DeleteSystemIntakeDocument(s.testConfigs.Context, s.testConfigs.Store, createdDocument.ID)
	s.NoError(err)
	checkSystemIntakeDocumentEquality(s, createdDocument, createdDocument.CreatedBy, createdDocument.SystemIntakeID, deletedDocument)

	remainingDocuments, err := GetSystemIntakeDocumentsByRequestID(s.ctxWithNewDataloaders(), createdDocument.SystemIntakeID)
	s.NoError(err)
	s.Equal(0, len(remainingDocuments))
}

func checkSystemIntakeDocumentEquality(
	suite *ResolverSuite,
	expectedDocument *models.SystemIntakeDocument,
	expectedCreatedBy string,
	expectedSystemIntakeID uuid.UUID,
	actualDocument *models.SystemIntakeDocument,
) {
	// baseStruct fields
	suite.NotNil(actualDocument.ID)
	suite.EqualValues(expectedCreatedBy, actualDocument.CreatedBy)
	suite.NotNil(actualDocument.CreatedAt)
	suite.Nil(actualDocument.ModifiedBy)
	suite.Nil(actualDocument.ModifiedAt)

	// SystemIntakeDocument-specific fields
	suite.EqualValues(expectedSystemIntakeID, actualDocument.SystemIntakeID)
	suite.EqualValues(expectedDocument.CommonDocumentType, actualDocument.CommonDocumentType)
	suite.EqualValues(expectedDocument.OtherType, actualDocument.OtherType)
	suite.EqualValues(expectedDocument.FileName, actualDocument.FileName)
}
