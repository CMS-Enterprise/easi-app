package intake

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
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

	s.Run("Instantiation successful", func() {
		c := NewClient("fake", "fake", nil)
		s.NotNil(c)
	})

	s.Run("LD protects invocation", func() {
		c := &Client{emitToCedar: func(context.Context) bool { return false }}
		err := c.CheckConnection(ctx)
		s.NoError(err)
		err = c.PublishSnapshot(ctx, nil, nil, nil, nil, nil)
		s.NoError(err)
	})

	s.Run("Not yet implemented", func() {
		c := &Client{emitToCedar: func(context.Context) bool { return true }}
		err := c.CheckConnection(ctx)
		s.Error(err)
		err = c.PublishSnapshot(ctx, nil, nil, nil, nil, nil)
		s.Error(err)
	})

}
