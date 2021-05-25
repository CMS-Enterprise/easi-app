package appconfig

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/suite"
)

type ConfigTestSuite struct {
	suite.Suite
}

func TestConfigTestSuite(t *testing.T) {
	configTestSuite := &ConfigTestSuite{
		Suite: suite.Suite{},
	}
	suite.Run(t, configTestSuite)
}

func (s ConfigTestSuite) TestNewEnvironment() {
	var envTests = []struct {
		env string
	}{
		{env: "local"},
		{env: "test"},
		{env: "dev"},
		{env: "impl"},
		{env: "prod"},
	}
	for _, t := range envTests {
		s.Run(fmt.Sprintf("Can create a new %s environment", t.env), func() {
			env, err := NewEnvironment(t.env)

			s.NoError(err)
			s.Equal(t.env, env.String())
		})
	}

	s.Run("Fails with unknown environment", func() {
		env, err := NewEnvironment("Unknown")

		s.Error(err)
		s.Empty(env)
	})
}

func (s ConfigTestSuite) TestLocal() {
	env, _ := NewEnvironment("local")

	s.True(env.Local())
}

func (s ConfigTestSuite) TestTest() {
	env, _ := NewEnvironment("test")

	s.True(env.Test())
}

func (s ConfigTestSuite) TestDev() {
	env, _ := NewEnvironment("dev")

	s.True(env.Dev())
}

func (s ConfigTestSuite) TestImpl() {
	env, _ := NewEnvironment("impl")

	s.True(env.Impl())
}

func (s ConfigTestSuite) TestProd() {
	env, _ := NewEnvironment("prod")

	s.True(env.Prod())
}

func (s ConfigTestSuite) TestDeployed() {
	s.Run("local isn't deployed environment", func() {
		s.False(localEnv.Deployed())
	})
	s.Run("test isn't deployed environment", func() {
		s.False(testEnv.Deployed())
	})
	s.Run("dev is deployed environment", func() {
		s.True(devEnv.Deployed())
	})
	s.Run("impl is deployed environment", func() {
		s.True(implEnv.Deployed())
	})
	s.Run("prod is deployed environment", func() {
		s.True(prodEnv.Deployed())
	})
}
