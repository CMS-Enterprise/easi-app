package resolvers

import (
	"bytes"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/easiencoding"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSetSystemIntakeGRBPresentationLinks() {
	systemIntake, err := CreateSystemIntake(s.testConfigs.Context, s.testConfigs.Store, models.CreateSystemIntakeInput{
		RequestType: models.SystemIntakeRequestTypeNEW,
		Requester: &models.SystemIntakeRequesterInput{
			Name: "Requester Name",
		},
	})
	s.NoError(err)
	s.NotNil(systemIntake)

	createdLinks := createSystemIntakeGRBPresentationLinkUploadSet(s, systemIntake.ID)
	s.NotNil(createdLinks)
}

func (s *ResolverSuite) TestUploadSystemIntakeGRBPresentationDeck() {
	input := s.createUploadSystemIntakeGRBPresentationDeckInput(s.createUploadSystemIntakeGRBPresentationDeckFileData())

	// Assert insert portion of upsert
	createdLinks, err := UploadSystemIntakeGRBPresentationDeck(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.S3Client,
		input,
	)
	s.NoError(err)
	s.NotNil(createdLinks)
	s.Nil(createdLinks.ModifiedBy)

	// Assert update portion of upsert
	updatedLinks, err := UploadSystemIntakeGRBPresentationDeck(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.S3Client,
		input,
	)
	s.NoError(err)
	s.NotNil(updatedLinks)
	s.NotNil(updatedLinks.ModifiedBy)
}

func (s *ResolverSuite) TestUploadSystemIntakeGRBPresentationDeck_NilFile() {
	input := s.createUploadSystemIntakeGRBPresentationDeckInput(nil)

	_, err := UploadSystemIntakeGRBPresentationDeck(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.S3Client,
		input,
	)
	s.NoError(err)
}

func (s *ResolverSuite) createUploadSystemIntakeGRBPresentationDeckFileData() *graphql.Upload {
	testContents := "Test Presentation Link"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	return &graphql.Upload{
		File:        fileToUpload,
		Filename:    "test presentation link upload.txt",
		Size:        fileToUpload.Size(),
		ContentType: "text/plain",
	}
}

func (s *ResolverSuite) createUploadSystemIntakeGRBPresentationDeckInput(fileData *graphql.Upload) models.UploadSystemIntakeGRBPresentationDeckInput {
	systemIntake, err := CreateSystemIntake(s.testConfigs.Context, s.testConfigs.Store, models.CreateSystemIntakeInput{
		RequestType: models.SystemIntakeRequestTypeNEW,
		Requester: &models.SystemIntakeRequesterInput{
			Name: "Requester Name",
		},
	})
	s.NoError(err)
	s.NotNil(systemIntake)

	input := models.UploadSystemIntakeGRBPresentationDeckInput{
		SystemIntakeID:           systemIntake.ID,
		PresentationDeckFileData: fileData,
	}
	s.NoError(err)

	return input
}

func createSystemIntakeGRBPresentationLinkUploadSet(suite *ResolverSuite, systemIntakeID uuid.UUID) *models.SystemIntakeGRBPresentationLinks {
	testContents := "Test Presentation Link"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := models.SystemIntakeGRBPresentationLinksInput{
		SystemIntakeID:    systemIntakeID,
		RecordingLink:     graphql.OmittableOf[*string](helpers.PointerTo("recording link")),
		RecordingPasscode: graphql.OmittableOf[*string](helpers.PointerTo("recording pass")),
		TranscriptLink:    graphql.OmittableOf[*string](helpers.PointerTo("transcript link")),
		TranscriptFileData: graphql.OmittableOf[*graphql.Upload](&graphql.Upload{
			File:        fileToUpload,
			Filename:    "test transcript link upload.txt",
			Size:        fileToUpload.Size(),
			ContentType: "text/plain",
		}),
		PresentationDeckFileData: graphql.OmittableOf[*graphql.Upload](&graphql.Upload{
			File:        fileToUpload,
			Filename:    "test presentation link upload.txt",
			Size:        fileToUpload.Size(),
			ContentType: "text/plain",
		}),
	}

	createdLinks, err := SetSystemIntakeGRBPresentationLinks(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		gqlInput,
	)
	suite.NoError(err)
	suite.NotNil(createdLinks)

	suite.Nil(createdLinks.ModifiedBy)

	updatedLinks, err := SetSystemIntakeGRBPresentationLinks(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.S3Client,
		gqlInput,
	)
	suite.NoError(err)
	suite.NotNil(updatedLinks)

	suite.NotNil(updatedLinks.ModifiedBy)

	return createdLinks
}
