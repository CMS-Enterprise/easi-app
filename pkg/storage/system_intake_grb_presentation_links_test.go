package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestSystemIntakeGRBPresentationLinks() {
	ctx := context.Background()
	euaID := "ABCD"

	intake, err := CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(euaID),
	})
	s.NoError(err)
	s.NotNil(intake)

	// build links
	links := models.NewSystemIntakeGRBPresentationLinks(appcontext.Principal(ctx).Account().ID)
	links.SystemIntakeID = intake.ID
	links.RecordingLink = new("test recording link")
	links.RecordingPasscode = new("secret password")
	links.PresentationDeckS3Key = new("prez deck s3 key")
	links.PresentationDeckFileName = new("prez file name")

	// set initial links
	s.Run("handle link operations on a system intake", func() {
		out, err := s.store.SetSystemIntakeGRBPresentationLinks(ctx, links)
		s.NoError(err)
		s.NotNil(out)

		// check that those links can be retrieved
		data, err := s.store.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(data, 1)

		s.NotNil(data[0].RecordingLink)
		s.NotNil(data[0].RecordingPasscode)
		s.NotNil(data[0].PresentationDeckS3Key)
		s.NotNil(data[0].PresentationDeckFileName)

		s.Nil(data[0].TranscriptLink)
		s.Nil(data[0].TranscriptS3Key)
		s.Nil(data[0].TranscriptFileName)

		// update the links and save, confirming the upsert functions as expected
		newRecordingLink := "new recording link"
		links.RecordingLink = new(newRecordingLink)
		out, err = s.store.SetSystemIntakeGRBPresentationLinks(ctx, links)
		s.NoError(err)
		s.NotNil(out)

		// retrieve links again
		data, err = s.store.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(data, 1)

		s.NotNil(data[0].RecordingLink)

		s.Equal(*data[0].RecordingLink, newRecordingLink)

		// update links to something they are not allowed to be (i.e., containing fields that cannot both be set
		links.TranscriptLink = new("transcript link should not be allowed")
		links.TranscriptFileName = new("transcript file name should not be allowed")
		links.TranscriptS3Key = new("transcript s3 key should not be allowed")

		out, err = s.store.SetSystemIntakeGRBPresentationLinks(ctx, links)
		s.Error(err)
		s.Nil(out)

		// delete these links
		err = s.store.DeleteSystemIntakeGRBPresentationLinks(ctx, intake.ID)
		s.NoError(err)

		// confirm deleted
		data, err = s.store.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(data, 0)
	})

}
