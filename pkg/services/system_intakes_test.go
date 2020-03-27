package services

import (
	"database/sql"

	"github.com/google/uuid"
	"github.com/spf13/viper"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestSystemIntakesFetcher() {
	if viper.Get("ENVIRONMENT") == "LOCAL" {
		s.Run("successfully fetches System Intakes", func() {
			tx := s.db.MustBegin()
			// Todo is this the best way to generate a random string?
			fakeEuaID := uuid.New().String()
			_, err := tx.NamedExec("INSERT INTO system_intake (id, eua_user_id) VALUES (:id, :eua_user_id)", &models.SystemIntake{ID: uuid.New(), EUAUserID: fakeEuaID})
			s.NoError(err)
			err = tx.Commit()
			s.NoError(err)

			systemIntakes, err := FetchSystemIntakesByEuaID(fakeEuaID, s.db)
			s.NoError(err)
			s.Len(systemIntakes, 1)
		})
	}
}

func (s ServicesTestSuite) TestSystemIntakeSaver() {
	if viper.Get("ENVIRONMENT") == "LOCAL" {
		s.Run("successfully saves new System Intakes", func() {
			fakeID := uuid.New()
			euaID := "FAKE"
			submittedIntake := models.SystemIntake{
				ID:        fakeID,
				EUAUserID: euaID,
				Requester: models.NullableString{
					NullString: sql.NullString{
						String: "Requester",
						Valid:  true,
					},
				},
			}
			err := NewSaveSystemIntake(s.store)(&submittedIntake)
			s.NoError(err)
			fetchedIntake := models.SystemIntake{}
			err = s.db.Get(&fetchedIntake, "SELECT * FROM system_intake WHERE id=$1", fakeID)
			s.NoError(err)
			s.Equal(euaID, fetchedIntake.EUAUserID)
			s.Equal("Requester", fetchedIntake.Requester.String)
		})
	}
}
