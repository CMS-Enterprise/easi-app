package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/pkg/errors"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func SendGRBReviewPresentationDeckReminderEmail(
	ctx context.Context,
	systemIntakeID uuid.UUID,
	emailClient *email.Client,
	store *storage.Store,
) (bool, error) {
	intake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
	if err != nil {
		return false, err
	}

	if intake.RequesterEmailAddress.Ptr() == nil {
		return false, &apperrors.ResourceNotFoundError{Err: errors.New("no requester email address found")}
	}

	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails: []models.EmailAddress{
			models.NewEmailAddress(intake.RequesterEmailAddress.ValueOrZero()),
		},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}

	err = emailClient.SystemIntake.SendPresentationDeckUploadReminder(
		ctx,
		recipients,
		intake.ID,
		intake.ProjectName.ValueOrZero(),
	)
	if err != nil {
		return false, err
	}

	curTime := time.Now().UTC()
	intake.GrbPresentationDeckRequesterReminderEmailSentTime = &curTime
	_, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return true, err // return true to indicate email was sent, but include the error as the cache was not updated
	}

	return true, nil
}
