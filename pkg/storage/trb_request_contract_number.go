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

// SetTRBRequestContractNumbers links given Contract Numbers to given TRB Request ID
// This function opts to take a *sqlx.Tx instead of a NamedPreparer because the SQL calls inside this function are heavily intertwined, and we never want to call them outside the scope of a transaction
func (s *Store) SetTRBRequestContractNumbers(ctx context.Context, tx *sqlx.Tx, trbRequestID uuid.UUID, contractNumbers []string) error {
	if trbRequestID == uuid.Nil {
		return errors.New("unexpected nil TRB Request ID when linking TRB Request to contract numbers")
	}

	if _, err := tx.NamedExecContext(ctx, sqlqueries.TRBRequestContractNumbersForm.Delete, map[string]interface{}{
		"contract_numbers": pq.Array(contractNumbers),
		"trb_request_id":   trbRequestID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete contract numbers linked to TRB Request", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new contract numbers for this TRB Request ID
	if len(contractNumbers) < 1 {
		return nil
	}

	userID := appcontext.Principal(ctx).Account().ID

	setTRBRequestContractNumbersLinks := make([]models.TRBRequestContractNumber, len(contractNumbers))
	for i, contractNumber := range contractNumbers {
		contractNumberLink := models.NewTRBRequestContractNumber(userID)
		contractNumberLink.ID = uuid.New()
		contractNumberLink.ModifiedBy = &userID
		contractNumberLink.TRBRequestID = trbRequestID
		contractNumberLink.ContractNumber = contractNumber

		setTRBRequestContractNumbersLinks[i] = contractNumberLink
	}

	if _, err := tx.NamedExecContext(ctx, sqlqueries.TRBRequestContractNumbersForm.Set, setTRBRequestContractNumbersLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked TRB Request to contract numbers", zap.Error(err))
		return err
	}

	return nil
}

// TRBRequestContractNumbersByTRBRequestIDLOADER gets multiple groups of Contract Numbers by TRB Request ID
func (s *Store) TRBRequestContractNumbersByTRBRequestIDLOADER(ctx context.Context, paramTableJSON string) (map[string][]*models.TRBRequestContractNumber, error) {
	stmt, err := s.db.PrepareNamedContext(ctx, sqlqueries.TRBRequestContractNumbersForm.SelectByTRBRequestIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var contracts []*models.TRBRequestContractNumber
	err = stmt.SelectContext(ctx, &contracts, map[string]interface{}{
		"param_table_json": paramTableJSON,
	})
	if err != nil {
		return nil, err
	}

	ids, err := extractTRBRequestIDs(paramTableJSON)
	if err != nil {
		return nil, err
	}

	store := map[string][]*models.TRBRequestContractNumber{}

	for _, id := range ids {
		store[id] = []*models.TRBRequestContractNumber{}
	}

	for _, contract := range contracts {
		key := contract.TRBRequestID.String()
		store[key] = append(store[key], contract)
	}

	return store, nil
}
