package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *Store) UpdateTRBRequestFundingSources(
	ctx context.Context,
	trbRequestId uuid.UUID,
	fundingNumber string,
	fundingSources []*models.TRBFundingSource,
) ([]*models.TRBFundingSource, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()
	deleteFundingSourcesSQL := `
		DELETE FROM trb_request_funding_sources
		WHERE trb_request_id = $1 AND funding_number = $2;
	`
	_, err := tx.Exec(deleteFundingSourcesSQL, trbRequestId, fundingNumber)

	if err != nil {
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
	fmt.Printf("%v", fundingSources)
	_, err = tx.NamedExec(insertFundingSourcesSQL, fundingSources)

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
		return nil, err
	}
	getSourcesSQL := `SELECT * FROM trb_request_funding_sources WHERE trb_request_id = $1 AND funding_number = $2`
	insertedFundingSources := []*models.TRBFundingSource{}
	err = tx.Select(&insertedFundingSources, getSourcesSQL, trbRequestId, fundingNumber)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
		return nil, err
	}
	tx.Commit()
	return insertedFundingSources, nil
}

func (s *Store) DeleteTRBRequestFundingSources(
	ctx context.Context,
	trbRequestId uuid.UUID,
	fundingNumber string,
) ([]*models.TRBFundingSource, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()
	deleteFundingSourcesSQL := `
		DELETE FROM trb_request_funding_sources
		WHERE trb_request_id = $1 AND funding_number = $2;
	`
	_, err := tx.Exec(deleteFundingSourcesSQL, trbRequestId, fundingNumber)

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
		return nil, err
	}

	getSourcesSQL := `SELECT * FROM trb_request_funding_sources WHERE trb_request_id = $1 AND funding_number = $2`
	fundingSources := []*models.TRBFundingSource{}
	err = tx.Select(&fundingSources, getSourcesSQL, trbRequestId, fundingNumber)
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
		return nil, err
	}
	tx.Commit()
	return fundingSources, nil
}
