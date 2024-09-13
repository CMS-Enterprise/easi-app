package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// UpdateTRBRequestFundingSources upserts a list of funding sources to a TRB Request Form by funding number
func (s *Store) UpdateTRBRequestFundingSources(
	ctx context.Context,
	trbRequestID uuid.UUID,
	fundingNumber string,
	fundingSources []*models.TRBFundingSource,
) ([]*models.TRBFundingSource, error) {
	return sqlutils.WithTransactionRet[[]*models.TRBFundingSource](ctx, s.DB, func(tx *sqlx.Tx) ([]*models.TRBFundingSource, error) {
		deleteFundingSourcesSQL := `
		DELETE FROM trb_request_funding_sources
		WHERE trb_request_id = $1 AND funding_number = $2;
	`
		if _, err := tx.Exec(deleteFundingSourcesSQL, trbRequestID, fundingNumber); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return nil, err
		}
		insertFundingSourcesSQL := `
		INSERT INTO trb_request_funding_sources (
			id,
			trb_request_id,
			source,
			funding_number,
			created_at,
			created_by
		) VALUES (
			:id,
			:trb_request_id,
			:source,
			:funding_number,
			:created_at,
			:created_by
		)
		`
		if _, err := tx.NamedExec(insertFundingSourcesSQL, fundingSources); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return nil, err
		}

		insertedFundingSources := []*models.TRBFundingSource{}
		getSourcesSQL := `SELECT * FROM trb_request_funding_sources WHERE trb_request_id = $1 AND funding_number = $2`
		if err := tx.Select(&insertedFundingSources, getSourcesSQL, trbRequestID, fundingNumber); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return nil, err
		}

		return insertedFundingSources, nil
	})
}

// DeleteTRBRequestFundingSources deletes all funding sources from a TRB Request Form by funding number
func (s *Store) DeleteTRBRequestFundingSources(
	ctx context.Context,
	trbRequestID uuid.UUID,
	fundingNumber string,
) ([]*models.TRBFundingSource, error) {
	return sqlutils.WithTransactionRet[[]*models.TRBFundingSource](ctx, s.DB, func(tx *sqlx.Tx) ([]*models.TRBFundingSource, error) {

		deleteFundingSourcesSQL := `
		DELETE FROM trb_request_funding_sources
		WHERE trb_request_id = $1 AND funding_number = $2;
		`

		if _, err := tx.Exec(deleteFundingSourcesSQL, trbRequestID, fundingNumber); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return nil, err
		}

		fundingSources := []*models.TRBFundingSource{}
		getSourcesSQL := `SELECT * FROM trb_request_funding_sources WHERE trb_request_id = $1 AND funding_number = $2`

		if err := tx.Select(&fundingSources, getSourcesSQL, trbRequestID, fundingNumber); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return nil, err
		}

		return fundingSources, nil
	})
}
