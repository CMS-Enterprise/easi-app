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
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9,
			$10,
			$11,
			$12,
			$13,
			$14,
			$15,
			$16,
			$17,
			$18,
			$19,
			$20
		)
		ON CONFLICT (id) DO UPDATE SET
			eua_user_id=$2,
			requester=$3,
			component=$4,
			business_owner=$5,
			business_owner_component=$6,
			product_manager=$7,
			product_manager_component=$8,
			isso=$9,
			trb_collaborator=$10,
			oit_security_collaborator=$11,
			ea_collaborator=$12,
			project_name=$13,
			existing_funding=$14,
			funding_source=$15,
			business_need=$16,
			solution=$17,
			process_status=$18,
			ea_support_request=$19,
			existing_contract=$20
	`
	return func(intake *models.SystemIntake) error {
		_, err := db.Exec(
			SystemIntakeInsertSQL,
			intake.ID,
			intake.EUAUserID,
			intake.Requester,
			intake.Component,
			intake.BusinessOwner,
			intake.BusinessOwnerComponent,
			intake.ProductManager,
			intake.ProductManagerComponent,
			intake.ISSO,
			intake.TRBCollaborator,
			intake.OITSecurityCollaborator,
			intake.EACollaborator,
			intake.ProjectName,
			intake.ExistingFunding,
			intake.FundingSource,
			intake.BusinessNeed,
			intake.Solution,
			intake.ProcessStatus,
			intake.EASupportRequest,
			intake.ExistingContract,
		)
		return err
	}
}
