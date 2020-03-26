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
	const SystemIntakeInsertSQL = `
		INSERT INTO system_intake (
			id,
			eua_user_id,
			requester,
			component,
			business_owner,
			business_owner_component,
			product_manager,
			product_manager_component,
			isso,
			trb_collaborator,
			oit_security_collaborator,
			ea_collaborator,
			project_name,
			existing_funding,
			funding_source,
			business_need,
			solution,
			process_status,
			ea_support_request,
			existing_contract
		) 
		VALUES (
			:id,
			:eua_user_id,
			:requester,
			:component,
			:business_owner,
			:business_owner_component,
			:product_manager,
			:product_manager_component,
			:isso,
			:trb_collaborator,
			:oit_security_collaborator,
			:ea_collaborator,
			:project_name,
			:existing_funding,
			:funding_source,
			:business_need,
			:solution,
			:process_status,
			:ea_support_request,
			:existing_contract
		)
		ON CONFLICT (id) DO UPDATE SET
			requester=:requester,
			component=:component,
			business_owner=:business_owner,
			business_owner_component=:business_owner_component,
			product_manager=:product_manager,
			product_manager_component=:product_manager_component,
			isso=:isso,
			trb_collaborator=:trb_collaborator,
			oit_security_collaborator=:oit_security_collaborator,
			ea_collaborator=:ea_collaborator,
			project_name=:project_name,
			existing_funding=:existing_funding,
			funding_source=:funding_source,
			business_need=:business_need,
			solution=:solution,
			process_status=:process_status,
			ea_support_request=:ea_support_request,
			existing_contract=:existing_contract
	`
	return func(intake *models.SystemIntake) error {
		_, err := db.NamedExec(
			SystemIntakeInsertSQL,
			intake,
		)
		return err
	}
}
