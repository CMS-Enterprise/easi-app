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
			IntakeID:       intake.ID,
			ActionType:     models.ActionTypeSUBMIT,
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
			IntakeID:       intake.ID,
			ActionType:     models.ActionTypeSUBMIT,
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
			IntakeID:   intake.ID,
			ActionType: "fake_status",
		}

		_, err = s.store.CreateAction(ctx, &action)
		s.Equal("pq: invalid input value for enum action_type: \"fake_status\"", err.Error())
	})
}
