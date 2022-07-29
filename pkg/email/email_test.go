package email

import (
	"context"
	"errors"
	"io"
	"sync"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type EmailTestSuite struct {
	suite.Suite
	logger                      *zap.Logger
	config                      Config
	multipleRecipientsTestCases []multipleRecipientsTestCase
}

type mockSender struct {
	toAddress models.EmailAddress
	subject   string
	body      string
}

func (s *mockSender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	s.toAddress = toAddress
	s.subject = subject
	s.body = body
	return nil
}

type sentEmail struct {
	ToRecipients []models.EmailAddress
	CCRecipients []models.EmailAddress
	Subject      string
	Body         string
}

type mockMultipleRecipientsSender struct {
	SentEmails      []sentEmail
	sentEmailsMutex sync.Mutex // needed to guard access to sentEmails when client methods send emails concurrently
}

func (s *mockMultipleRecipientsSender) AllToRecipients() []models.EmailAddress {
	allToRecipients := []models.EmailAddress{}
	for _, sentEmail := range s.SentEmails {
		allToRecipients = append(allToRecipients, sentEmail.ToRecipients...)
	}
	return allToRecipients
}

func (s *mockMultipleRecipientsSender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	email := sentEmail{
		ToRecipients: []models.EmailAddress{toAddress},
		Subject:      subject,
		Body:         body,
	}

	if ccAddress != nil {
		email.CCRecipients = []models.EmailAddress{*ccAddress}
	}

	s.sentEmailsMutex.Lock()
	s.SentEmails = append(s.SentEmails, email)
	s.sentEmailsMutex.Unlock()

	return nil
}

type mockFailedSender struct{}

func (s *mockFailedSender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	return errors.New("sender had an error")
}

type mockFailedTemplateCaller struct{}

func (c mockFailedTemplateCaller) Execute(wr io.Writer, data interface{}) error {
	return errors.New("template caller had an error")
}

type multipleRecipientsTestCase struct {
	recipients models.EmailNotificationRecipients
}

func TestEmailTestSuite(t *testing.T) {
	logger := zap.NewNop()
	config := testhelpers.NewConfig()

	emailConfig := Config{
		GRTEmail:          models.NewEmailAddress("grt_email@cms.fake"),     // unique email address that can't get confused with ITInvestmentEmail
		ITInvestmentEmail: models.NewEmailAddress("it_investment@cms.fake"), // unique email address that can't get confused with GRTEmail
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	// construct list of test cases for emails to multiple recipients

	// possible values - nil, non-nil empty slice, slice with one element, slice with multiple elements
	possibleRegularRecipients := [][]models.EmailAddress{
		nil,
		{},
		{"abcd@fake.email"},
		{"efgh@fake.email", "ijkl@fake.email"},
	}

	multipleRecipientsTestCases := []multipleRecipientsTestCase{}
	for _, possibleRegularRecipientList := range possibleRegularRecipients {
		for _, shouldNotifyITGovernance := range []bool{true, false} {
			for _, shouldNotifyITInvestment := range []bool{true, false} {
				testCase := multipleRecipientsTestCase{
					recipients: models.EmailNotificationRecipients{
						RegularRecipientEmails:   possibleRegularRecipientList,
						ShouldNotifyITGovernance: shouldNotifyITGovernance,
						ShouldNotifyITInvestment: shouldNotifyITInvestment,
					},
				}
				multipleRecipientsTestCases = append(multipleRecipientsTestCases, testCase)
			}
		}
	}

	sesTestSuite := &EmailTestSuite{
		Suite:                       suite.Suite{},
		logger:                      logger,
		config:                      emailConfig,
		multipleRecipientsTestCases: multipleRecipientsTestCases,
	}

	suite.Run(t, sesTestSuite)
}

// helper method - call this from test cases for individual email methods
func (s *EmailTestSuite) runMultipleRecipientsTestAgainstAllTestCases(methodUnderTest func(client Client, recipients models.EmailNotificationRecipients) error) {
	for _, testCase := range s.multipleRecipientsTestCases {
		s.Run("Emails are only sent to the specified recipients", func() {
			sender := mockMultipleRecipientsSender{}
			client, err := NewClient(s.config, &sender)
			s.NoError(err)

			expectedRecipients := []models.EmailAddress{}
			expectedRecipients = append(expectedRecipients, testCase.recipients.RegularRecipientEmails...)
			if testCase.recipients.ShouldNotifyITGovernance {
				expectedRecipients = append(expectedRecipients, s.config.GRTEmail)
			}
			if testCase.recipients.ShouldNotifyITInvestment {
				expectedRecipients = append(expectedRecipients, s.config.ITInvestmentEmail)
			}

			err = methodUnderTest(client, testCase.recipients)
			s.NoError(err)

			actualRecipients := sender.AllToRecipients()
			s.ElementsMatch(expectedRecipients, actualRecipients)
		})
	}
}
