package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CreatePresentationDeck creates a new presentation deck in the database
func (s *Store) CreatePresentationDeck(
	ctx context.Context,
	presentationDeck *models.PresentationDeck,
) (*models.PresentationDeck, error) {
	const presentationDeckCreateSQL = `
		INSERT INTO presentation_decks (
			id,
			file_name,
			bucket,
			s3_key,
			created_by,
			modified_by,
			deleted_at
		) VALUES (
			:id,
			:file_name,
			:bucket,
			:s3_key,
			:created_by,
			:modified_by,
			NULL
		) RETURNING
			id,
			file_name,
			bucket,
			s3_key,
			created_by,
			created_at,
			modified_by,
			modified_at,
			deleted_at
	`

	if presentationDeck.ID == uuid.Nil {
		presentationDeck.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(presentationDeckCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create presentation deck with error %s", err),
			zap.Error(err),
			zap.String("user", presentationDeck.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()

	var retPresentationDeck models.PresentationDeck
	err = stmt.Get(&retPresentationDeck, presentationDeck)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create presentation deck with error %s", err),
			zap.Error(err),
			zap.String("user", presentationDeck.CreatedBy),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     presentationDeck,
			Operation: apperrors.QueryPost,
		}
	}

	return &retPresentationDeck, nil
}
