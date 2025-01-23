package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestSystemIntakeGRBPresentationLinks() {
	ctx := context.Background()
	euaID := "ABCD"

	intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(euaID),
	})
	s.NoError(err)
	s.NotNil(intake)

	// build links
	links := models.NewSystemIntakeGRBPresentationLinks(appcontext.Principal(ctx).Account().ID)
	links.SystemIntakeID = intake.ID
	links.RecordingLink = helpers.PointerTo("test recording link")
	links.RecordingPasscode = helpers.PointerTo("secret password")
	links.PresentationDeckS3Key = helpers.PointerTo("prez deck s3 key")
	links.PresentationDeckFileName = helpers.PointerTo("prez file name")

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
		links.RecordingLink = helpers.PointerTo(newRecordingLink)
		out, err = s.store.SetSystemIntakeGRBPresentationLinks(ctx, links)
		s.NoError(err)
		s.NotNil(out)

		// retrieve links again
		data, err = s.store.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(data, 1)

		s.NotNil(data[0].RecordingLink)

		s.Equal(*data[0].RecordingLink, newRecordingLink)

		// delete these links
		err = s.store.DeleteSystemIntakeGRBPresentationLinks(ctx, intake.ID)
		s.NoError(err)

		// confirm deleted
		data, err = s.store.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(data, 0)
	})

}
