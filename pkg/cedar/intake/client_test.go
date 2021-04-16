package intake

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
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
		err = c.PublishSnapshot(ctx, &si, nil, nil, nil, nil)
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
	ctx := appcontext.WithLogger(context.Background(), s.logger)

	s.Run("action", func() {
		action := testhelpers.NewAction()
		id := uuid.New()
		action.IntakeID = &id

		ii, err := translateAction(ctx, &action)
		s.NoError(err)

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.NoError(err)
	})

	s.Run("system intake", func() {
		si := testhelpers.NewSystemIntake()
		si.CreatedAt = si.ContractStartDate
		si.UpdatedAt = si.ContractStartDate

		ii, err := translateSystemIntake(ctx, &si)
		s.NoError(err)

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.NoError(err)
	})

	s.Run("note", func() {
		note := testhelpers.NewNote()

		ii, err := translateNote(ctx, &note)
		s.NoError(err)

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.NoError(err)
	})

	s.Run("biz case", func() {
		bc := testhelpers.NewBusinessCase()

		ii, err := translateBizCase(ctx, &bc)
		s.NoError(err)

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.NoError(err)
	})

	s.Run("feedback", func() {
		fb := testhelpers.NewGRTFeedback()

		ii, err := translateFeedback(ctx, &fb)
		s.NoError(err)

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.NoError(err)
	})

	s.Run("nil entry throws exception", func() {
		err := validateInputs(context.Background(), []*wire.IntakeInput{nil})
		s.Error(err)
	})

	s.Run("unrecognized type", func() {
		note := testhelpers.NewNote()

		ii, err := translateNote(ctx, &note)
		s.NoError(err)
		inType := "FakeType"
		ii.Type = &inType

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.Error(err)
	})

	s.Run("unrecognized schema", func() {
		note := testhelpers.NewNote()

		ii, err := translateNote(ctx, &note)
		s.NoError(err)
		inSchema := "FakeType01"
		ii.Schema = &inSchema

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.Error(err)
	})

	s.Run("mismatch type and schema", func() {
		note := testhelpers.NewNote()

		ii, err := translateNote(ctx, &note)
		s.NoError(err)
		inSchema := wire.IntakeInputSchemaEASIActionV01
		ii.Schema = &inSchema

		err = validateInputs(ctx, []*wire.IntakeInput{ii})
		s.Error(err)
	})

}
