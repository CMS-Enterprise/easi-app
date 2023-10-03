package types

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// interface that's implemented by both our actual store and our model (used for testing)
// just has the functions we need for testing
type RecommendationStore interface {
	CreateTRBAdviceLetterRecommendation(ctx context.Context, recommendation *models.TRBAdviceLetterRecommendation) (*models.TRBAdviceLetterRecommendation, error)
	DeleteTRBAdviceLetterRecommendation(ctx context.Context, id uuid.UUID) (*models.TRBAdviceLetterRecommendation, error)

	// TODO - unsure if this is the correct signature
	// UpdateTRBAdviceLetterRecommendationOrder(ctx context.Context, trbAdviceLetterID uuid.UUID) ([]*models.TRBAdviceLetterRecommendation, error)

	UpdateTRBAdviceLetterRecommendationOrder(ctx context.Context, trbAdviceLetterID uuid.UUID, newRanks map[uuid.UUID]int) ([]*models.TRBAdviceLetterRecommendation, error)
}
