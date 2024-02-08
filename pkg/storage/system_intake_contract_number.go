package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
)

// SetSystemIntakeContractNumbers links given Contract Numbers to given System Intake ID
func (s *Store) SetSystemIntakeContractNumbers(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, contractNumbers []string) error {
	if systemIntakeID == uuid.Nil {
		return errors.New("unexpected nil system intake ID when linking system intake to contract number")
	}

	if _, err := tx.ExecContext(ctx, sqlqueries.SystemIntakeContractNumberForm.Delete, systemIntakeID); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete contract numbers linked to system intake", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new Contract Numbers
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

	if _, err := tx.NamedExecContext(ctx, sqlqueries.SystemIntakeContractNumberForm.Set, setSystemIntakeContractNumbersLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked system intake to contract numbers", zap.Error(err))
		return err
	}

	return nil
}

// GetSystemIntakeContractNumbersBySystemIntakeID retrieves all Contract Numbers for a given System Intake ID
func (s *Store) GetSystemIntakeContractNumbersBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]models.SystemIntakeContractNumber, error) {
	var results []models.SystemIntakeContractNumber

	if err := s.db.SelectContext(ctx, &results, sqlqueries.SystemIntakeContractNumberForm.SelectBySystemIntakeID, systemIntakeID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		appcontext.ZLogger(ctx).Error("Failed to select contract numbers by system intake ID", zap.Error(err))
		return nil, err
	}

	return results, nil
}

// SystemIntakeContractNumbersBySystemIntakeIDLOADER gets multiple groups of Contract Numbers by System Intake ID
func (s *Store) SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx context.Context, paramTableJSON string) ([]*models.SystemIntakeContractNumber, error) {
	stmt, err := s.db.PrepareNamedContext(ctx, sqlqueries.SystemIntakeContractNumberForm.SelectBySystemIntakeIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var data []*models.SystemIntakeContractNumber
	if err := stmt.SelectContext(ctx, &data, map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}); err != nil {
		return nil, err
	}

	return data, nil
}
