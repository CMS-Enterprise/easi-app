package storage

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// CreateSystemIntakeGRBReviewer creates a GRB Reviewer
func (s *Store) CreateSystemIntakeGRBReviewer(ctx context.Context, np sqlutils.NamedPreparer, reviewer *models.SystemIntakeGRBReviewer) (*models.SystemIntakeGRBReviewer, error) {
	if reviewer.ID == uuid.Nil {
		reviewer.ID = uuid.New()
	}
	createdReviewer := &models.SystemIntakeGRBReviewer{}
	if err := namedGet(ctx, np, createdReviewer, sqlqueries.SystemIntakeGRBReviewer.Create, reviewer); err != nil {
		appcontext.ZLogger(ctx).Error("failed to create GRB reviewer", zap.Error(err))
		return nil, err
	}

	return createdReviewer, nil
}

// CreateSystemIntakeGRBReviewers creates a GRB Reviewer
func (s *Store) CreateSystemIntakeGRBReviewers(ctx context.Context, np sqlutils.NamedPreparer, reviewers []*models.SystemIntakeGRBReviewer) ([]*models.SystemIntakeGRBReviewer, error) {
	for i := range reviewers {
		if reviewers[i].ID == uuid.Nil {
			reviewers[i].ID = uuid.New()
		}
	}
	if _, err := namedExec(ctx, np, sqlqueries.SystemIntakeGRBReviewer.Create, reviewers); err != nil {
		appcontext.ZLogger(ctx).Error("failed to create GRB reviewer", zap.Error(err))
		return nil, err
	}

	return reviewers, nil
}

func (s *Store) UpdateSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, input *models.UpdateSystemIntakeGRBReviewerInput) (*models.SystemIntakeGRBReviewer, error) {
	updatedReviewer := &models.SystemIntakeGRBReviewer{}
	if err := namedGet(ctx, tx, updatedReviewer, sqlqueries.SystemIntakeGRBReviewer.Update, args{
		"reviewer_id": input.ReviewerID,
		"grb_role":    input.GrbRole,
		"voting_role": input.VotingRole,
		"modified_by": appcontext.Principal(ctx).Account().ID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error(
			"error updating system intake GRB reviewer",
			zap.Error(err),
			zap.String("reviewer_id", input.ReviewerID.String()),
		)

		return nil, err
	}

	return updatedReviewer, nil
}

// CastSystemIntakeGRBReviewerVote inserts or updates the vote selection for a GRB Reviewer
// requires the requesting user to be the GRB reviewer casting the vote (i.e., an admin cannot set another user's vote)
func (s *Store) CastSystemIntakeGRBReviewerVote(ctx context.Context, input models.CastSystemIntakeGRBReviewerVoteInput) (*models.SystemIntakeGRBReviewer, error) {
	userID := appcontext.Principal(ctx).Account().ID

	var updatedReviewer models.SystemIntakeGRBReviewer
	if err := namedGet(ctx, s.db, &updatedReviewer, sqlqueries.SystemIntakeGRBReviewer.CastVote, args{
		"system_intake_id": input.SystemIntakeID,
		"user_id":          userID,
		"vote":             input.Vote,
		"vote_comment":     input.VoteComment,
	}); err != nil {
		appcontext.ZLogger(ctx).Error(
			"error casting system intake GRB reviewer vote",
			zap.Error(err),
			zap.String("user_id", userID.String()),
			zap.String("system_intake_id", input.SystemIntakeID.String()),
		)

		return nil, err
	}

	return &updatedReviewer, nil
}

func (s *Store) DeleteSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, reviewerID uuid.UUID) error {
	if _, err := namedExec(ctx, tx, sqlqueries.SystemIntakeGRBReviewer.Delete, args{
		"reviewer_id": reviewerID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error("failed to delete GRB reviewer", zap.Error(err))
		return err
	}
	return nil
}

func (s *Store) SystemIntakeGRBReviewersBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBReviewer, error) {
	return sqlutils.WithTransactionRet[[]*models.SystemIntakeGRBReviewer](ctx, s, func(tx *sqlx.Tx) ([]*models.SystemIntakeGRBReviewer, error) {
		return s.SystemIntakeGRBReviewersBySystemIntakeIDsNP(ctx, tx, systemIntakeIDs)
	})
}

func (s *Store) SystemIntakeGRBReviewersBySystemIntakeIDsNP(ctx context.Context, np sqlutils.NamedPreparer, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBReviewer, error) {
	var systemIntakeGRBReviewers []*models.SystemIntakeGRBReviewer
	return systemIntakeGRBReviewers, namedSelect(ctx, np, &systemIntakeGRBReviewers, sqlqueries.SystemIntakeGRBReviewer.GetBySystemIntakeID, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}

func (s *Store) CompareSystemIntakeGRBReviewers(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeGRBReviewerComparisonResponse, error) {
	var comparisons []*models.SystemIntakeGRBReviewerComparisonResponse
	return comparisons, namedSelect(ctx, s.db, &comparisons, sqlqueries.SystemIntakeGRBReviewer.CompareGRBReviewers, args{
		"system_intake_id": systemIntakeID,
	})
}

func UpdateSystemIntakeGRBReviewType(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	systemIntakeID uuid.UUID,
	reviewType models.SystemIntakeGRBReviewType,
) (*models.UpdateSystemIntakePayload, error) {
	updatedIntake := &models.SystemIntake{}

	if err := namedGet(ctx, np, updatedIntake, sqlqueries.SystemIntakeGRBReviewType.Update, args{
		"system_intake_id": systemIntakeID,
		"grb_review_type":  reviewType,
	}); err != nil {
		appcontext.ZLogger(ctx).Error(
			"error updating system intake GRB reviewer",
			zap.String("system_intake_id", systemIntakeID.String()),
			zap.String("grb_review_type", string(reviewType)),
		)

		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

func SetSystemIntakeGRBReviewerReminderSent(ctx context.Context, np sqlutils.NamedPreparer, systemIntakeID uuid.UUID, sendTime time.Time) error {
	if _, err := namedExec(ctx, np, sqlqueries.SystemIntakeGRBReviewer.SetLastReminderSentTime, args{
		"time_sent": sendTime,
		"id":        systemIntakeID,
	}); err != nil {
		appcontext.ZLogger(ctx).
			Error("error setting last GRB Reviewer reminder sent time",
				zap.String("system_intake_id", systemIntakeID.String()))

		return err
	}

	return nil
}
