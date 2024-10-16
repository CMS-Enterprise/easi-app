package appses

import (
	"context"
	"fmt"
	"regexp"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

type SESTestSuite struct {
	suite.Suite
	logger *zap.Logger
	sender Sender
}

func TestSESTestSuite(t *testing.T) {
	// since this is an external service,
	// skip when testing with --short
	if testing.Short() {
		return
	}

	logger := zap.NewNop()
	config := testhelpers.NewConfig()

	env, err := appconfig.NewEnvironment(config.GetString(appconfig.EnvironmentKey))
	if err != nil {
		fmt.Printf("Failed to get environment: %v", err)
		t.Fail()
	}
	if env.Local() {
		fmt.Println("Skipping AWS SES test in local environment")
		return
	}

	sesConfig := Config{
		SourceARN: config.GetString(appconfig.AWSSESSourceARNKey),
		Source:    config.GetString(appconfig.AWSSESSourceKey),
	}

	sender := NewSender(sesConfig, env, nil)

	sesTestSuite := &SESTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		sender: sender,
	}

	suite.Run(t, sesTestSuite)
}

func (s *SESTestSuite) TestSend() {
	s.Run("Sends successfully", func() {
		err := s.sender.Send(
			context.Background(),
			email.NewEmail().
				WithToAddresses([]models.EmailAddress{"success@simulator.amazonses.com"}).
				WithSubject("Test Subject").
				WithBody("Test Body"),
		)

		s.NoError(err)
	})
	s.Run("Does nothing when passing empty toAddresses", func() {
		err := s.sender.Send(
			context.Background(),
			email.NewEmail().
				WithSubject("Test Subject").
				WithBody("Test Body"),
		)

		s.NoError(err)
	})
	s.Run("Sends email when only BCC or CC addresses are passed", func() {
		err := s.sender.Send(
			context.Background(),
			email.NewEmail().
				WithBCCAddresses([]models.EmailAddress{"success@simulator.amazonses.com"}).
				WithSubject("Test Subject").
				WithBody("Test Body"),
		)

		s.NoError(err)

		err = s.sender.Send(
			context.Background(),
			email.NewEmail().
				WithCCAddresses([]models.EmailAddress{"success@simulator.amazonses.com"}).
				WithSubject("Test Subject").
				WithBody("Test Body"),
		)

		s.NoError(err)
	})
}

// TestFilterAddresses is just a unit test for one of the helper functions (filterAddresses) in the ses package, so it's purposefully
// not part of the SES Test suite, which tests real SES logic
func TestFilterAddresses(t *testing.T) {
	emails := []models.EmailAddress{"abc", "123", "", "hell0world"}

	// Should filter nothing out when nil
	assert.ElementsMatch(t, filterAddresses(emails, nil), emails)

	// Filters out elements that don't match
	assert.ElementsMatch(
		t,
		filterAddresses(emails, regexp.MustCompile(`\d`)),
		[]models.EmailAddress{"123", "hell0world"},
	)

	// Filters out everything with no match
	assert.Len(
		t,
		filterAddresses(emails, regexp.MustCompile("wooooooooooooo")),
		0,
	)
}
