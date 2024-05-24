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

// SystemIntakeContractNumbersBySystemIntakeIDLOADER gets multiple groups of Contract Numbers by System Intake ID
func (s *Store) SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx context.Context, paramTableJSON string) (map[string][]*models.SystemIntakeContractNumber, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.SystemIntakeContractNumberForm.SelectBySystemIntakeIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var contracts []*models.SystemIntakeContractNumber
	err = stmt.Select(&contracts, map[string]interface{}{
		"param_table_json": paramTableJSON,
	})
	if err != nil {
		return nil, err
	}

	ids, err := extractSystemIntakeIDs(paramTableJSON)
	if err != nil {
		return nil, err
	}

	store := map[string][]*models.SystemIntakeContractNumber{}

	for _, id := range ids {
		store[id] = []*models.SystemIntakeContractNumber{}
	}

	for _, contract := range contracts {
		key := contract.SystemIntakeID.String()
		store[key] = append(store[key], contract)
	}

	return store, nil
}

func (s *Store) SystemIntakeContractNumbersBySystemIntakeIDLOADER2(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeContractNumber, error) {
	rows, err := s.db.QueryContext(ctx, sqlqueries.SystemIntakeContractNumberForm.SelectBySystemIntakeIDLOADER2, pq.Array(systemIntakeIDs))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var systemIntakeContractNumbers []*models.SystemIntakeContractNumber
	for rows.Next() {
		var systemIntakeContractNumber models.SystemIntakeContractNumber
		if err := rows.Scan(
			&systemIntakeContractNumber.ID,
			&systemIntakeContractNumber.SystemIntakeID,
			&systemIntakeContractNumber.ContractNumber,
			&systemIntakeContractNumber.CreatedBy,
			&systemIntakeContractNumber.CreatedAt,
			&systemIntakeContractNumber.ModifiedBy,
			&systemIntakeContractNumber.ModifiedAt,
		); err != nil {
			return nil, err
		}

		systemIntakeContractNumbers = append(systemIntakeContractNumbers, &systemIntakeContractNumber)
	}

	contractNumberMap := map[uuid.UUID][]*models.SystemIntakeContractNumber{}

	// populate map
	for _, id := range systemIntakeIDs {
		contractNumberMap[id] = []*models.SystemIntakeContractNumber{}
	}

	for _, contractNumber := range systemIntakeContractNumbers {
		contractNumberMap[contractNumber.SystemIntakeID] = append(contractNumberMap[contractNumber.SystemIntakeID], contractNumber)
	}

	// return in order received
	var out [][]*models.SystemIntakeContractNumber
	for _, id := range systemIntakeIDs {
		out = append(out, contractNumberMap[id])
	}

	return out, nil
}
