package main

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

	err = client.SendSystemIntakeReviewInvalidRequester(ctx, "Intake review body filler", uuid.New())
	noErr(err)

	err = client.SendIssueLCIDInvalidRequesterEmail(ctx, "Issue LCID body filler", uuid.New())
	noErr(err)

	err = client.SendRejectRequestInvalidRequesterEmail(ctx, "Reject request body filler", uuid.New())
	noErr(err)
}
