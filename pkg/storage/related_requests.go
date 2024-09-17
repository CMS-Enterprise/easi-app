package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// RelatedSystemIntakesBySystemIntakeIDs retrieves related system intakes by system intake ID
func (s *Store) RelatedSystemIntakesBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.RelatedSystemIntake, error) {
	var relatedIntakes []*models.RelatedSystemIntake
	return relatedIntakes, namedSelect(ctx, s.db, &relatedIntakes, sqlqueries.RelatedRequests.IntakesByIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}

// RelatedSystemIntakesByTRBRequestIDs retrieves related system intakes by TRB Request ID
func (s *Store) RelatedSystemIntakesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.RelatedSystemIntake, error) {
	var relatedIntakes []*models.RelatedSystemIntake
	return relatedIntakes, namedSelect(ctx, s.db, &relatedIntakes, sqlqueries.RelatedRequests.IntakesByTRBRequestIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})
}

// RelatedTRBRequestsBySystemIntakeIDs retrieves related TRB Requests by system intake ID
func (s *Store) RelatedTRBRequestsBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.RelatedTRBRequest, error) {
	var relatedTRBRequests []*models.RelatedTRBRequest
	return relatedTRBRequests, namedSelect(ctx, s.db, &relatedTRBRequests, sqlqueries.RelatedRequests.TRBRequestsByIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}

// RelatedTRBRequestsByTRBRequestIDs retrieves related TRB Requests by TRB Request ID
func (s *Store) RelatedTRBRequestsByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.RelatedTRBRequest, error) {
	var relatedTRBRequests []*models.RelatedTRBRequest
	return relatedTRBRequests, namedSelect(ctx, s.db, &relatedTRBRequests, sqlqueries.RelatedRequests.TRBRequestsByTRBRequestIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})
}
