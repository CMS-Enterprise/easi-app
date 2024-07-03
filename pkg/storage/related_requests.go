package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// RelatedSystemIntakesBySystemIntakeIDs retrieves related system intakes by system intake ID
func (s *Store) RelatedSystemIntakesBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.RelatedSystemIntake, error) {
	return []*models.RelatedSystemIntake{}, nil
}

// RelatedSystemIntakesByTRBRequestIDs retrieves related system intakes by TRB Request ID
func (s *Store) RelatedSystemIntakesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.RelatedSystemIntake, error) {
	return []*models.RelatedSystemIntake{}, nil
}

// RelatedTRBRequestsBySystemIntakeIDs retrieves related TRB Requests by system intake ID
func (s *Store) RelatedTRBRequestsBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.RelatedTRBRequest, error) {
	return []*models.RelatedTRBRequest{}, nil
}

// RelatedTRBRequestsByTRBRequestIDs retrieves related TRB Requests by TRB Request ID
func (s *Store) RelatedTRBRequestsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.RelatedTRBRequest, error) {
	return []*models.RelatedTRBRequest{}, nil
}
