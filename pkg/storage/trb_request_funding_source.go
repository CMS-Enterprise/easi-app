package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

// UpdateTRBRequestFundingSources upserts a list of funding sources to a TRB Request Form by funding number
func (s *Store) UpdateTRBRequestFundingSources(
	ctx context.Context,
	trbRequestID uuid.UUID,
	fundingNumber string,
	fundingSources []*models.TRBFundingSource,
) ([]*models.TRBFundingSource, error) {

	insertedFundingSources := []*models.TRBFundingSource{}
	return insertedFundingSources, sqlutils.WithTransaction(s.db, func(tx *sqlx.Tx) error {

		deleteFundingSourcesSQL := `
		DELETE FROM trb_request_funding_sources
		WHERE trb_request_id = $1 AND funding_number = $2;
	`
		_, err := tx.Exec(deleteFundingSourcesSQL, trbRequestID, fundingNumber)

		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return err
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
		_, err = tx.NamedExec(insertFundingSourcesSQL, fundingSources)
		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return err
		}

		getSourcesSQL := `SELECT * FROM trb_request_funding_sources WHERE trb_request_id = $1 AND funding_number = $2`
		err = tx.Select(&insertedFundingSources, getSourcesSQL, trbRequestID, fundingNumber)
		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return err
		}

		return nil
	})
}

// DeleteTRBRequestFundingSources deletes all funding sources from a TRB Request Form by funding number
func (s *Store) DeleteTRBRequestFundingSources(
	ctx context.Context,
	trbRequestID uuid.UUID,
	fundingNumber string,
) ([]*models.TRBFundingSource, error) {

	fundingSources := []*models.TRBFundingSource{}
	return fundingSources, sqlutils.WithTransaction(s.db, func(tx *sqlx.Tx) error {

		deleteFundingSourcesSQL := `
		DELETE FROM trb_request_funding_sources
		WHERE trb_request_id = $1 AND funding_number = $2;
	`
		_, err := tx.Exec(deleteFundingSourcesSQL, trbRequestID, fundingNumber)

		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return err
		}

		getSourcesSQL := `SELECT * FROM trb_request_funding_sources WHERE trb_request_id = $1 AND funding_number = $2`

		err = tx.Select(&fundingSources, getSourcesSQL, trbRequestID, fundingNumber)
		if err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
			return err
		}

		return nil
	})
}
