package services

import (
	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestSystemIntakesFetcher() {
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
