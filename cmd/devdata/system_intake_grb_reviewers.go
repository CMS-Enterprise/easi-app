package main

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func createSystemIntakeGRBReviewer(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	euaUserID string,
	votingRole models.SystemIntakeGRBReviewerVotingRole,
	grbRole models.SystemIntakeGRBReviewerRole,
) {
	userEUA := intake.EUAUserID.ValueOrZero()
	if userEUA == "" {
		userEUA = mock.PrincipalUser
	}
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, userEUA)
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
