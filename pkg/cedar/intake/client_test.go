package intake

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
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

func (s ClientTestSuite) TestClient() {
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

func (s ClientTestSuite) TestTranslation() {
	s.Run("action", func() {
		action := translation.TranslatableAction(testhelpers.NewAction())
		id := uuid.New()
		action.IntakeID = &id

		ii, err := action.CreateIntakeModel()
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("system intake", func() {
		si := translation.TranslatableSystemIntake(testhelpers.NewSystemIntake())
		si.CreatedAt = si.ContractStartDate
		si.UpdatedAt = si.ContractStartDate

		ii, err := si.CreateIntakeModel()
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("note", func() {
		note := translation.TranslatableNote(testhelpers.NewNote())

		ii, err := note.CreateIntakeModel()
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("biz case", func() {
		bc := translation.TranslatableBusinessCase(testhelpers.NewBusinessCase())

		ii, err := bc.CreateIntakeModel()
		s.NoError(err)
		s.NotNil(ii)
	})

	s.Run("feedback", func() {
		fb := translation.TranslatableFeedback(testhelpers.NewGRTFeedback())

		ii, err := fb.CreateIntakeModel()
		s.NoError(err)
		s.NotNil(ii)
	})
}
