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

	createdLinks := createSystemIntakeGRBPresentationLinkUpload(s, systemIntake.ID)
	s.NotNil(createdLinks)
}

func createSystemIntakeGRBPresentationLinkUpload(suite *ResolverSuite, systemIntakeID uuid.UUID) *models.SystemIntakeGRBPresentationLinks {
	testContents := "Test Presentation Link"
	encodedFileContent := easiencoding.EncodeBase64String(testContents)
	fileToUpload := bytes.NewReader([]byte(encodedFileContent))
	gqlInput := models.SystemIntakeGRBPresentationLinksInput{
		SystemIntakeID:    systemIntakeID,
		RecordingLink:     helpers.PointerTo("recording link"),
		RecordingPasscode: helpers.PointerTo("recording pass"),
		TranscriptLink:    helpers.PointerTo("transcript link"),
		TranscriptFileData: graphql.OmittableOf[*graphql.Upload](&graphql.Upload{
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
