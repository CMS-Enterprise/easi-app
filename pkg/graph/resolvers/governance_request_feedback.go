package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetGovernanceRequestFeedbacksByIntakeID returns all governance request feedback items for a given system intake
func GetGovernanceRequestFeedbacksByIntakeID(ctx context.Context, id uuid.UUID) ([]*models.GovernanceRequestFeedback, error) {
	return dataloaders.GetSystemIntakeGovReqFeedbackByIntakeID(ctx, id)
}

// GetGovernanceRequestFeedbackAuthor returns the full user info for a feedback item's author
// nil values for feedbackAuthorEUAID are allowed and will return a nil *models.UserInfo
func GetGovernanceRequestFeedbackAuthor(
	ctx context.Context,
	feedbackAuthorEUAID *string,
) (*models.UserInfo, error) {
	// If there's no feedbackAuthorEUAID, don't try and query Okta, just return a nil userinfo
	if feedbackAuthorEUAID == nil {
		return nil, nil
	}

	// Handled nil value above, safe to dereference and pass to GetUserInfo
	authorInfo, err := dataloaders.FetchUserInfoByEUAUserID(ctx, *feedbackAuthorEUAID)
	if err != nil {
		return nil, err
	}

	return authorInfo, nil
}
