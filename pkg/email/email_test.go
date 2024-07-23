package email

import (
	"context"
	"errors"
	"io"
	"regexp"
	"strings"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

type EmailTestSuite struct {
	suite.Suite
	logger                      *zap.Logger
	config                      Config
	multipleRecipientsTestCases []multipleRecipientsTestCase
}

// EqualHTML removes extra whitespace and linebreaks from HTML strings before comparing
func (s *EmailTestSuite) EqualHTML(expected string, actual string) bool {
	clean := func(str string) string {
		// remove linebreaks and tabs
		breaksAndTabs := regexp.MustCompile(`[\n\r\t]`)
		str = breaksAndTabs.ReplaceAllString(str, "")
		// don't test the CSS
		removeHeadTag := regexp.MustCompile(`<head>[\s\S]*</head>`)
		str = removeHeadTag.ReplaceAllString(str, "")
		// remove leading/trailing spaces
		str = strings.Trim(str, " ")
		// normalize multiple spaces to be 1 space
		multipleSpaces := regexp.MustCompile(`[\s]{2,}`)
		str = multipleSpaces.ReplaceAllString(str, " ")
		// trim strings inside and before/after tags
		spacesBeforeTags := regexp.MustCompile(`[\s]+<`)
		str = spacesBeforeTags.ReplaceAllString(str, "<")
		spacesAfterTags := regexp.MustCompile(`>[\s]+`)
		str = spacesAfterTags.ReplaceAllString(str, ">")
		return str
	}
	return s.Equal(clean(expected), clean(actual))
}

type mockSender struct {
	toAddresses  []models.EmailAddress
	ccAddresses  []models.EmailAddress
	bccAddresses []models.EmailAddress
	subject      string
	body         string
}

func (s *mockSender) Send(ctx context.Context, emailData Email) error {
	s.toAddresses = emailData.ToAddresses
	s.ccAddresses = emailData.CcAddresses
	s.bccAddresses = emailData.BccAddresses
	s.subject = emailData.Subject
	s.body = emailData.Body
	return nil
}

type mockFailedSender struct{}

func (s *mockFailedSender) Send(ctx context.Context, email Email) error {
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
		TRBEmail:          models.NewEmailAddress("trb_email@cms.fake"),
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
