package seed

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/cmd/devdata/mocks"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// TRBRequests seeds the database with a number of TRB requests in various states
func TRBRequests(logger *zap.Logger, store *storage.Store) error {
	// Fresh request, no actions taken
	makeTRBRequest(models.TRBTNeedHelp, logger, store, mocks.PrincipalUser, func(t *models.TRBRequest) {
		t.Name = "0 - Brand new request"
	})

	// In progress form, not submitted
	inProgress := makeTRBRequest(models.TRBTNeedHelp, logger, store, mocks.PrincipalUser, func(t *models.TRBRequest) {
		t.Name = "1 - In progress form"
	})

	updateTRBRequestForm(logger, store, mocks.PrincipalUser, map[string]interface{}{
		"trbRequestId":             inProgress.ID.String(),
		"isSubmitted":              false,
		"component":                "Center for Medicare",
		"needsAssistanceWith":      "Something is wrong with my system",
		"hasSolutionInMind":        true,
		"proposedSolution":         "Get a tech support guru to fix it",
		"whereInProcess":           models.TRBWhereInProcessOptionOther,
		"whereInProcessOther":      "Just starting",
		"hasExpectedStartEndDates": true,
		"expectedStartDate":        "2023-02-27T05:00:00.000Z",
		"expectedEndDate":          "2023-01-31T05:00:00.000Z",
		"collabGroups": []models.TRBCollabGroupOption{
			models.TRBCollabGroupOptionEnterpriseArchitecture,
			models.TRBCollabGroupOptionOther,
		},
		"collabDateEnterpriseArchitecture": "The other day",
		"collabGroupOther":                 "CMS Splunk Team",
		"collabDateOther":                  "Last week",
		"collabGRBConsultRequested":        true,
		"subjectAreaOptions": []models.TRBSubjectAreaOption{
			models.TRBSubjectAreaOptionAssistanceWithSystemConceptDev,
			models.TRBSubjectAreaOptionCloudMigration,
		},
		"subjectAreaOptionOther": "Rocket science",
	})

	must(nil, updateTRBRequestFundingSources(logger, store, mocks.PrincipalUser, inProgress.ID, "33311", []string{"meatloaf", "spaghetti", "cereal"}))

	must(nil, makeTRBLeadOptions(logger, store))

	return nil
}

func makeTRBRequest(rType models.TRBRequestType, logger *zap.Logger, store *storage.Store, userEUA string, callbacks ...func(*models.TRBRequest)) *models.TRBRequest {
	ctx := mocks.CtxWithLoggerAndPrincipal(logger, userEUA)
	trb, err := resolvers.CreateTRBRequest(ctx, rType, mocks.FetchUserInfoMock, store)
	if err != nil {
		panic(err)
	}
	for _, cb := range callbacks {
		cb(trb)
	}
	trb, err = store.UpdateTRBRequest(ctx, trb)
	if err != nil {
		panic(err)
	}
	return trb
}

func updateTRBRequestForm(logger *zap.Logger, store *storage.Store, userEUA string, changes map[string]interface{}) *models.TRBRequestForm {
	ctx := mocks.CtxWithLoggerAndPrincipal(logger, userEUA)

	form, err := resolvers.UpdateTRBRequestForm(ctx, store, nil, mocks.FetchUserInfoMock, changes)
	if err != nil {
		panic(err)
	}
	return form
}

func updateTRBRequestFundingSources(logger *zap.Logger, store *storage.Store, userEUA string, trbID uuid.UUID, fundingNumber string, fundingSources []string) error {
	ctx := mocks.CtxWithLoggerAndPrincipal(logger, userEUA)
	_, err := resolvers.UpdateTRBRequestFundingSources(
		ctx,
		store,
		trbID,
		fundingNumber,
		fundingSources,
	)

	if err != nil {
		return err
	}
	return nil
}

func makeTRBLeadOptions(logger *zap.Logger, store *storage.Store) error {
	ctx := appcontext.WithLogger(context.Background(), logger)
	leadUsers := map[string]*models.UserInfo{
		"ABCD": {
			CommonName: "Adeline Aarons",
			Email:      "adeline.aarons@local.fake",
			EuaUserID:  "ABCD",
		},
		"TEST": {
			CommonName: "Terry Thompson",
			Email:      "terry.thompson@local.fake",
			EuaUserID:  "TEST",
		},
		"A11Y": {
			CommonName: "Ally Anderson",
			Email:      "ally.anderson@local.fake",
			EuaUserID:  "A11Y",
		},
		"GRTB": {
			CommonName: "Gary Gordon",
			Email:      "gary.gordon@local.fake",
			EuaUserID:  "GRTB",
		},
	}

	stubFetchUserInfo := func(ctx context.Context, euaID string) (*models.UserInfo, error) {
		if userInfo, ok := leadUsers[euaID]; ok {
			return userInfo, nil
		}
		return nil, nil
	}

	for euaID := range leadUsers {
		_, err := resolvers.CreateTRBLeadOption(ctx, store, stubFetchUserInfo, euaID)
		if err != nil {
			return err
		}
	}

	return nil
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}
