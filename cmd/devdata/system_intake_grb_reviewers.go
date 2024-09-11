package main

import (
	"context"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func createSystemIntakeGRBReviewer(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	votingRole models.SystemIntakeGRBReviewerVotingRole,
	grbRole models.SystemIntakeGRBReviewerRole,
) {
	_, err := resolvers.CreateSystemIntakeGRBReviewer(
		ctx,
		store,
		nil, // email client
		userhelpers.GetUserInfoAccountInfoWrapperFunc(mock.FetchUserInfoMock),
		&models.CreateSystemIntakeGRBReviewerInput{
			SystemIntakeID: intake.ID,
			EuaUserID:      euaUserID,
			VotingRole:     votingRole,
			GrbRole:        grbRole,
		},
	)
	if err != nil {
		panic(err)
	}
}
