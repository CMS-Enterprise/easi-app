package storage

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestCreateAction() {
	ctx := context.Background()

	s.Run("create a new action", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		action := models.Action{
			ID:             uuid.New(),
			IntakeID:       &intake.ID,
			ActionType:     models.ActionTypeSUBMITINTAKE,
			ActorName:      "name",
			ActorEmail:     "email@site.com",
			ActorEUAUserID: testhelpers.RandomEUAID(),
		}

		created, err := s.store.CreateAction(ctx, &action)
		s.NoError(err)
		s.NotNil(created)
		s.Equal(action.ID, created.ID)
		s.Equal(action.ActionType, created.ActionType)
		epochTime := time.Unix(0, 0)
		s.Equal(created.CreatedAt, &epochTime)
		s.False(created.ID == uuid.Nil)
	})

	s.Run("cannot save without actor name", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		action := models.Action{
			ID:             uuid.New(),
			IntakeID:       &intake.ID,
			ActionType:     models.ActionTypeSUBMITINTAKE,
			ActorEmail:     "email@site.com",
			ActorEUAUserID: testhelpers.RandomEUAID(),
		}

		_, err = s.store.CreateAction(ctx, &action)
		s.Equal("pq: new row for relation \"actions\" violates check constraint \"actions_actor_name_check\"", err.Error())
	})

	s.Run("cannot create with invalid type", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		action := models.Action{
			ID:         uuid.New(),
			IntakeID:   &intake.ID,
			ActionType: "fake_status",
		}

		_, err = s.store.CreateAction(ctx, &action)
		s.Equal("pq: invalid input value for enum action_type: \"fake_status\"", err.Error())
	})
}

func (s StoreTestSuite) TestFetchActionsByRequestID() {
	ctx := context.Background()

	intake := testhelpers.NewSystemIntake()
	createdIntake, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	s.Run("golden path to fetch actions", func() {
		action := testhelpers.NewAction()
		action2 := testhelpers.NewAction()
		action.IntakeID = &createdIntake.ID
		action2.IntakeID = &createdIntake.ID

		_, err := s.store.CreateAction(ctx, &action)
		s.NoError(err)
		_, err = s.store.CreateAction(ctx, &action2)
		s.NoError(err)
		fetched, err := s.store.GetActionsByRequestID(ctx, intake.ID)

		s.NoError(err, "failed to fetch actions")
		s.Len(fetched, 2)
		s.Equal(&intake.ID, fetched[0].IntakeID)
	})

	s.Run("does not fetch action for other request", func() {
		intake2 := testhelpers.NewSystemIntake()
		createdIntake2, err := s.store.CreateSystemIntake(ctx, &intake2)
		s.NoError(err)

		action := testhelpers.NewAction()
		action.IntakeID = &createdIntake2.ID
		_, err = s.store.CreateAction(ctx, &action)
		s.NoError(err)

		fetched, err := s.store.GetActionsByRequestID(ctx, intake.ID)

		s.NoError(err, "failed to fetch actions")
		s.Len(fetched, 2)
		s.Equal(&intake.ID, fetched[0].IntakeID)
	})
}
