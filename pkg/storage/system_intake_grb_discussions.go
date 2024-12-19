package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

func (s *Store) CreateSystemIntakeGRBDiscussionPost(ctx context.Context, np sqlutils.NamedPreparer, post *models.SystemIntakeGRBReviewDiscussionPost) (*models.SystemIntakeGRBReviewDiscussionPost, error) {
	if post.ID == uuid.Nil {
		post.ID = uuid.New()
	}
	createdPost := &models.SystemIntakeGRBReviewDiscussionPost{}
	return createdPost, namedGet(ctx, np, createdPost, sqlqueries.SystemIntakeGRBDiscussion.Create, post)
}

func (s *Store) GetSystemIntakeGRBDiscussionPostByID(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	discussionID uuid.UUID,
) (*models.SystemIntakeGRBReviewDiscussionPost, error) {
	post := &models.SystemIntakeGRBReviewDiscussionPost{}
	return post, namedGet(ctx, np, post, sqlqueries.SystemIntakeGRBDiscussion.GetByID, args{
		"id": discussionID,
	})
}

func (s *Store) SystemIntakeGRBDiscussionPostsBySystemIntakeIDs(
	ctx context.Context,
	systemIntakeIDs []uuid.UUID,
) ([]*models.SystemIntakeGRBReviewDiscussionPost, error) {
	posts := []*models.SystemIntakeGRBReviewDiscussionPost{}
	return posts, namedSelect(ctx, s, &posts, sqlqueries.SystemIntakeGRBDiscussion.GetBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}
