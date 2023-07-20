package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetGovernanceRequestFeedbacksByIntakeID returns all governance request feedback items for a given system intake
func GetGovernanceRequestFeedbacksByIntakeID(ctx context.Context, store *storage.Store, id uuid.UUID) ([]*models.GovernanceRequestFeedback, error) {
	return store.GetGovernanceRequestFeedbacksByIntakeID(ctx, id)
}

// GetGovernanceRequestFeedbackAuthor returns the full user info for a feedback item's author
func GetGovernanceRequestFeedbackAuthor(
	ctx context.Context,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	feedbackAuthorEUAID string,
) (*models.UserInfo, error) {
	authorInfo, err := fetchUserInfo(ctx, feedbackAuthorEUAID)
	if err != nil {
		return nil, err
	}

	return authorInfo, nil
}
