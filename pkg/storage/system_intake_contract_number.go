package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
)

// SetSystemIntakeContractNumbers links given Contract Numbers to given System Intake ID
// This function opts to take a *sqlx.Tx instead of a NamedPreparer because the SQL calls inside this function are heavily intertwined, and we never want to call them outside the scope of a transaction
func (s *Store) SetSystemIntakeContractNumbers(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, contractNumbers []string) error {
	if systemIntakeID == uuid.Nil {
		return errors.New("unexpected nil system intake ID when linking system intake to contract numbers")
	}

	if _, err := tx.NamedExec(sqlqueries.SystemIntakeContractNumberForm.Delete, map[string]interface{}{
		"contract_numbers": pq.StringArray(contractNumbers),
		"system_intake_id": systemIntakeID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete contract numbers linked to system intake", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new contract numbers for this System Intake ID
	if len(contractNumbers) < 1 {
		return nil
	}

	userID := appcontext.Principal(ctx).Account().ID

	setSystemIntakeContractNumbersLinks := make([]models.SystemIntakeContractNumber, len(contractNumbers))

	for i, contractNumber := range contractNumbers {
		contractNumberLink := models.NewSystemIntakeContractNumber(userID)
		contractNumberLink.ID = uuid.New()
		contractNumberLink.ModifiedBy = &userID
		contractNumberLink.SystemIntakeID = systemIntakeID
		contractNumberLink.ContractNumber = contractNumber

		setSystemIntakeContractNumbersLinks[i] = contractNumberLink
	}

	if _, err := tx.NamedExec(sqlqueries.SystemIntakeContractNumberForm.Set, setSystemIntakeContractNumbersLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked system intake to contract numbers", zap.Error(err))
		return err
	}

	return nil
}

func (s *Store) SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeContractNumber, error) {
	var systemIntakeContractNumbers []*models.SystemIntakeContractNumber
	if err := selectNamed(ctx, s, &systemIntakeContractNumbers, sqlqueries.SystemIntakeContractNumberForm.SelectBySystemIntakeIDLOADER, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	}); err != nil {
		return nil, err
	}

	return oneToMany[*models.SystemIntakeContractNumber](systemIntakeIDs, systemIntakeContractNumbers), nil
}
