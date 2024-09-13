package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// SetTRBRequestContractNumbers links given Contract Numbers to given TRB Request ID
// This function opts to take a *sqlx.Tx instead of a NamedPreparer because the SQL calls inside this function are heavily intertwined, and we never want to call them outside the scope of a transaction
func (s *Store) SetTRBRequestContractNumbers(ctx context.Context, tx *sqlx.Tx, trbRequestID uuid.UUID, contractNumbers []string) error {
	if trbRequestID == uuid.Nil {
		return errors.New("unexpected nil TRB Request ID when linking TRB Request to contract numbers")
	}

	if _, err := tx.NamedExec(sqlqueries.TRBRequestContractNumbersForm.Delete, args{
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

	if _, err := tx.NamedExec(sqlqueries.TRBRequestContractNumbersForm.Set, setTRBRequestContractNumbersLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked TRB Request to contract numbers", zap.Error(err))
		return err
	}

	return nil
}

func (s *Store) TRBRequestContractNumbersByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestContractNumber, error) {
	var trbRequestContractNumbers []*models.TRBRequestContractNumber
	return trbRequestContractNumbers, namedSelect(ctx, s.DB, &trbRequestContractNumbers, sqlqueries.TRBRequestContractNumbersForm.SelectByTRBRequestIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})
}
