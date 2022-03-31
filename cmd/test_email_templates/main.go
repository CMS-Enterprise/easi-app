package main

// Prerequisites: MailCatcher container running (use scripts/dev up:backend to start)

// This script tests the email notifications for invalid/missing EUA IDs introduced for EASI-1569;
// other email methods can be tested by calling email.Client's methods.
// To view emails, visit the MailCatcher web UI at http://127.0.0.1:1080/.

import (
	"context"
	"fmt"
	"os"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

func createEmailClient() email.Client {
	emailConfig := email.Config{
		GRTEmail:               models.NewEmailAddress("grt_email@cms.gov"),
		AccessibilityTeamEmail: models.NewEmailAddress("508_team@cms.gov"),
		URLHost:                os.Getenv("CLIENT_HOSTNAME"),
		URLScheme:              os.Getenv("CLIENT_PROTOCOL"),
		TemplateDirectory:      os.Getenv("EMAIL_TEMPLATE_DIR"),
	}

	sender := local.NewPostfixSender("localhost:1025")
	emailClient, err := email.NewClient(emailConfig, sender)
	noErr(err)
	return emailClient
}

func main() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)
	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	client := createEmailClient()

	err = client.SendIntakeInvalidEUAIDEmail(ctx, "Some Project With An Invalid EUA ID", "ABCD", uuid.New())
	noErr(err)

	err = client.SendIntakeNoEUAIDEmail(ctx, "Some Project With No EUA ID", uuid.New())
	noErr(err)
}
