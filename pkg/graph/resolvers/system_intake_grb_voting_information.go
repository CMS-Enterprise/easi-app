package resolvers

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GRBVotingInformationGetBySystemIntake wraps a system intake and its GRB reviewers.
// it is used in this manner to easily provide calculations about voting information of the reviewers
func GRBVotingInformationGetBySystemIntake(ctx context.Context, intake *models.SystemIntake) (*models.GRBVotingInformation, error) {
	if intake == nil {
		return nil, fmt.Errorf("intake is nil, unable to fetch GRB voting information")
	}

	reviewers, err := SystemIntakeGRBReviewers(ctx, intake.ID)
	if err != nil {
		return nil, err
	}

	visibleReviewers := reviewers
	if !userCanViewSystemIntakeGRBReviewerIdentities(ctx, reviewers) {
		visibleReviewers = []*models.SystemIntakeGRBReviewer{}
	}

	votingInformation := &models.GRBVotingInformation{
		SystemIntake:    intake,
		GRBReviewers:    visibleReviewers,
		AllGRBReviewers: reviewers,
	}
	return votingInformation, nil

}
