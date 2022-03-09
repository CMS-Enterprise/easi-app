package main

import (
	"context"
	"fmt"
	"os"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
	mailsender "github.com/jordan-wright/email"
	"go.uber.org/zap"
)

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

type localPostfixSender struct {
}

func (sender localPostfixSender) Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error {
	e := mailsender.Email{
		From:    "testsender@oddball.dev",
		To:      []string{toAddress.String()},
		Subject: subject,
		HTML:    []byte(body),
	}
	if ccAddress != nil {
		e.Cc = []string{ccAddress.String()}
	}

	mailserverAddr := "localhost:1025"
	err := e.Send(mailserverAddr, nil)
	return err
}

func createEmailClient() email.Client {
	emailConfig := email.Config{
		GRTEmail:               models.NewEmailAddress("grt_email@cms.gov"),
		AccessibilityTeamEmail: models.NewEmailAddress("508_team@cms.gov"),
		URLHost:                os.Getenv("CLIENT_HOSTNAME"),
		URLScheme:              os.Getenv("CLIENT_PROTOCOL"),
		TemplateDirectory:      os.Getenv("EMAIL_TEMPLATE_DIR"),
	}

	sender := localPostfixSender{}
	emailClient, err := email.NewClient(emailConfig, sender)
	noErr(err)
	return emailClient
}

func main() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)
	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	client := createEmailClient()

	err = client.SendSystemIntakeReviewInvalidRequester(ctx, "Intake review body filler", uuid.New())
	noErr(err)

	err = client.SendIssueLCIDInvalidRequesterEmail(ctx, "Issue LCID body filler", uuid.New())
	noErr(err)

	err = client.SendRejectRequestInvalidRequesterEmail(ctx, "Reject request body filler", uuid.New())
	noErr(err)
}
