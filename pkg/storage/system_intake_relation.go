package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TODO Implement store methods that have to deal with setting System Intake linking/relation data
func (s *Store) LinkSystemIntakeContractNumbers(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, contractNumbers []string) error {
	if systemIntakeID == uuid.Nil {
		return errors.New("unexpected nil system intake ID when linking system intake to contract number")
	}

	deleteStatement := `
		DELETE FROM system_intake_contract_numbers
		WHERE intake_id = $1
	`

	if _, err := tx.ExecContext(ctx, deleteStatement, systemIntakeID); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete contract numbers linked to system intake", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new contracts
	if len(contractNumbers) < 1 {
		return nil
	}

	// euaUserID := appcontext.Principal(ctx).ID()
	principal := appcontext.Principal(ctx)

	ceateSystemIntakeContractNumbersLinks := make([]models.SystemIntakeContractNumber, len(contractNumbers))

	for i, contractNumber := range contractNumbers {
		contractNumberLink := models.NewSystemIntakeContractNumber(principal.Account().ID)
		contractNumberLink.IntakeID = systemIntakeID
		contractNumberLink.ContractNumber = contractNumber
		ceateSystemIntakeContractNumbersLinks[i] = contractNumberLink
	}

	insertStatement := `INSERT INTO system_intake_contract_numbers (
		id,
		intake_id,
		contract_number,
		created_by,
		modified_by
	)
	VALUES (
		:id,
		:intake_id,
		:contract_number,
		:created_by,
		:modified_by
	) ON CONFLICT DO NOTHING`

	if _, err := tx.NamedExecContext(ctx, insertStatement, ceateSystemIntakeContractNumbersLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked system intake to contract numbers", zap.Error(err))
		return err
	}

	return nil
}
