package storage

import (
	"context"
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

// SystemIntakeContractNumbersBySystemIntakeIDLOADER gets multiple groups of Contract Numbers by System Intake ID
func (s *Store) SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx context.Context, paramTableJSON string) (map[string][]*models.SystemIntakeContractNumber, error) {
	stmt, err := s.db.PrepareNamedContext(ctx, sqlqueries.SystemIntakeContractNumberForm.SelectBySystemIntakeIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	store := map[string][]*models.SystemIntakeContractNumber{}

	rows, err := stmt.QueryContext(ctx, map[string]interface{}{"paramTableJSON": paramTableJSON})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var contractNumber models.SystemIntakeContractNumber

		if err := rows.Scan(
			&contractNumber.ID,
			&contractNumber.SystemIntakeID,
			&contractNumber.ContractNumber,
			&contractNumber.CreatedBy,
			&contractNumber.CreatedAt,
			&contractNumber.ModifiedBy,
			&contractNumber.ModifiedAt,
		); err != nil {
			return nil, err
		}

		key := contractNumber.SystemIntakeID.String()
		val, ok := store[key]
		if !ok {
			store[key] = []*models.SystemIntakeContractNumber{&contractNumber}
		} else {
			store[key] = append(val, &contractNumber)
		}
	}

	return store, nil
}
