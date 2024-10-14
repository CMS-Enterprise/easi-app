package main

import (
	"context"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func createSystemIntakeGRBReviewers(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	reviewers []*models.CreateGRBReviewerInput,
) {
	_, err := resolvers.CreateSystemIntakeGRBReviewers(
		ctx,
		store,
		nil, // email client
		userhelpers.GetUserInfoAccountInfosWrapperFunc(mock.FetchUserInfosMock),
		&models.CreateSystemIntakeGRBReviewersInput{
			SystemIntakeID: intake.ID,
			Reviewers:      reviewers,
		},
	)
	if err != nil {
		panic(err)
	}
}
