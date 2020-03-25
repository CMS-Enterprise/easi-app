package services

import (
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
)

// FetchSystemIntakesByEuaID fetches all system intakes by a given user
func FetchSystemIntakesByEuaID(euaID string, db *sqlx.DB) (models.SystemIntakes, error) {
	var intakes []models.SystemIntake
	err := db.Select(&intakes, "SELECT * FROM system_intake WHERE eua_user_id=$1", euaID)
	if err != nil {
		return models.SystemIntakes{}, err
	}
	return intakes, nil
}

// NewSaveSystemIntake is a service to save the system intake to postgres
func NewSaveSystemIntake(db *sqlx.DB) func(intake *models.SystemIntake) error {
	return func(intake *models.SystemIntake) error {
		_, err := db.NamedExec(
			"INSERT INTO system_intake (id, eua_user_id) VALUES (:id, :eua_user_id)",
			intake,
		)
		return err
	}
}
