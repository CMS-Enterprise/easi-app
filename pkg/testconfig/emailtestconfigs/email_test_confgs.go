// Package emailtestconfigs provides shared utilities when you need to do local testing that requires email configuration
package emailtestconfigs

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"

	"github.com/cms-enterprise/easi-app/pkg/email"
)

func getTestEmailConfig() email.Config {
	config := testhelpers.NewConfig()
	return email.Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail: models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		TRBEmail:          models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:     models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}
}

func NewEmailClient() (*email.Client, *MockSender) {
	sender := &MockSender{}
	emailConfig := getTestEmailConfig()
	emailClient, _ := email.NewClient(emailConfig, sender)
	return &emailClient, sender
}

type MockSender struct {
	toAddresses  []models.EmailAddress
	ccAddresses  []models.EmailAddress
	bccAddresses []models.EmailAddress
	subject      string
	body         string
	emailWasSent bool
	sentEmails   []email.Email
}

func (s *MockSender) Send(ctx context.Context, emailData email.Email) error {
	s.toAddresses = emailData.ToAddresses
	s.ccAddresses = emailData.CcAddresses
	s.bccAddresses = emailData.BccAddresses
	s.subject = emailData.Subject
	s.body = emailData.Body
	s.emailWasSent = true
	s.sentEmails = append(s.sentEmails, emailData)
	return nil
}

func (s *MockSender) Clear() {
	s.toAddresses = []models.EmailAddress{}
	s.ccAddresses = []models.EmailAddress{}
	s.bccAddresses = []models.EmailAddress{}
	s.subject = ""
	s.body = ""
	s.emailWasSent = false
	s.sentEmails = []email.Email{}
}
