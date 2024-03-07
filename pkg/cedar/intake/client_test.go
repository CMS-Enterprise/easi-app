package intake

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	intakemodels "github.com/cmsgov/easi-app/pkg/cedar/intake/models"
	"github.com/cmsgov/easi-app/pkg/cedar/intake/translation"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type ClientTestSuite struct {
	suite.Suite
	logger *zap.Logger
}

func TestClientTestSuite(t *testing.T) {
	tests := &ClientTestSuite{
		Suite:  suite.Suite{},
		logger: zap.NewExample(),
	}
	suite.Run(t, tests)
}

func (s *ClientTestSuite) TestClient() {
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	s.NoError(err)

	s.Run("Instantiation successful", func() {
		c := NewClient("fake", "fake", ldClient)
		s.NotNil(c)
	})

	s.Run("LD defaults protects invocation", func() {
		c := NewClient("fake", "fake", ldClient)
		err := c.CheckConnection(ctx)
		s.NoError(err)

		si := testhelpers.NewSystemIntake()
		si.CreatedAt = si.ContractStartDate
		si.UpdatedAt = si.ContractStartDate
		err = c.PublishSystemIntake(ctx, si)
		s.NoError(err)
	})

	// s.Run("functional test", func() {
	// 	c := NewClient(
	// 		"webmethods-apigw.cedardev.cms.gov",
	// 		"n/a", // TODO: pull in from env var?
	// 		ldClient,
	// 	)
	// 	c.emitToCedar = func(context.Context) bool { return true }

	// 	err := c.CheckConnection(ctx)
	// 	s.NoError(err)

	// 	si := testhelpers.NewSystemIntake()
	// 	si.CreatedAt = si.ContractStartDate
	// 	si.UpdatedAt = si.ContractStartDate
	// 	err = c.PublishSnapshot(ctx, &si, nil, nil, nil, nil)
	// 	s.NoError(err)
	// })
}

func (s *ClientTestSuite) TestTranslation() {
	s.Run("action", func() {
		ctx := context.Background()
		action := translation.TranslatableAction(testhelpers.NewAction())
		id := uuid.New()
		action.IntakeID = &id

		ii, err := action.CreateIntakeModel(ctx)
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("system intake", func() {
		ctx := context.Background()
		si := translation.TranslatableSystemIntake(testhelpers.NewSystemIntake())
		si.CreatedAt = si.ContractStartDate
		si.UpdatedAt = si.ContractStartDate

		ii, err := si.CreateIntakeModel(ctx)
		s.NoError(err)
		s.NotNil(ii)

		// Unmarshal the body so we can check that fields are being set properly
		intakeBody := &intakemodels.EASIIntake{}
		err = json.Unmarshal([]byte(*ii.Body), intakeBody)
		s.NoError(err)

		// Check that the ID of the Intake is Correct
		s.EqualValues(si.ID.String(), intakeBody.IntakeID)

		// Check that the Funding Source ID is being pulled from the FundingSources array of the Intake
		s.EqualValues(si.FundingSources[0].ID.String(), intakeBody.FundingSources[0].FundingSourceID)

	})

	s.Run("note", func() {
		ctx := context.Background()
		note := translation.TranslatableNote(testhelpers.NewNote())

		ii, err := note.CreateIntakeModel(ctx)
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("biz case", func() {
		ctx := context.Background()
		bc := translation.TranslatableBusinessCase(testhelpers.NewBusinessCase(uuid.New()))

		ii, err := bc.CreateIntakeModel(ctx)
		s.NoError(err)
		s.NotNil(ii)
	})

	// s.Run("feedback", func() {
	// 	fb := translation.TranslatableFeedback(testhelpers.NewGRTFeedback())

	// 	ii, err := fb.CreateIntakeModel()
	// 	s.NoError(err)
	// 	s.NotNil(ii)
	// })
}
