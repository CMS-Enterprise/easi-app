package resolvers

import (
	"context"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// CreateTRBRequestFeedback creates a TRBRequestFeedback in the database
func CreateTRBRequestFeedback(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
	feedback *models.TRBRequestFeedback,
) (*models.TRBRequestFeedback, error) {
	feedback.CreatedBy = appcontext.Principal(ctx).ID()
	var formToUpdate *models.TRBRequestForm

	// start fetching info we'll need to send notifications now, but don't wait on results until we're ready to send emails
	var recipientEmails []models.EmailAddress
	var request models.TRBRequest
	var requester models.UserInfo

	emailInfoErrGroup := new(errgroup.Group)

	emailInfoErrGroup.Go(func() error {
		// declare new error variable so we don't interfere with calls outside of this goroutine
		recipientInfos, getRecipientInfosErr := fetchUserInfos(ctx, feedback.NotifyEUAIDs)
		if getRecipientInfosErr != nil {
			return getRecipientInfosErr
		}

		for _, recipientInfo := range recipientInfos {
			if recipientInfo != nil {
				recipientEmails = append(recipientEmails, recipientInfo.Email)
			}
		}
		return nil
	})

	emailInfoErrGroup.Go(func() error {
		// declare new error variable so we don't interfere with calls outside of this goroutine
		requestPtr, getRequestErr := store.GetTRBRequestByID(ctx, feedback.TRBRequestID)
		if getRequestErr != nil {
			return getRequestErr
		}
		request = *requestPtr

		requesterPtr, getRequesterErr := fetchUserInfo(ctx, request.CreatedBy)
		if getRequesterErr != nil {
			return getRequesterErr
		}
		requester = *requesterPtr

		return nil
	})

	// If action is edits requested, change the form status to "in progress"
	if feedback.Action == models.TRBFeedbackActionRequestEdits {
		form, err := store.GetTRBRequestFormByTRBRequestID(ctx, feedback.TRBRequestID)
		if err != nil {
			return nil, err
		}

		// Update the TRB form status to in progress
		formChanges := map[string]interface{}{
			"status": models.TRBFormStatusInProgress,
		}

		err = ApplyChangesAndMetaData(formChanges, form, appcontext.Principal(ctx))
		if err != nil {
			return nil, err
		}

		formToUpdate = form
	}

	createdFeedback, err := store.CreateTRBRequestFeedback(ctx, feedback, formToUpdate)
	if err != nil {
		return nil, err
	}

	// send notification email last; make sure database has been updated first
	if err = emailInfoErrGroup.Wait(); err != nil {
		return nil, err
	}

	if emailClient != nil {
		if feedback.Action == models.TRBFeedbackActionRequestEdits {
			err = emailClient.SendTRBEditsNeededOnFormNotification(
				ctx,
				recipientEmails,
				feedback.CopyTRBMailbox,
				feedback.TRBRequestID,
				request.GetName(),
				requester.DisplayName,
				feedback.FeedbackMessage,
			)
			if err != nil {
				return nil, err
			}
		} else if feedback.Action == models.TRBFeedbackActionReadyForConsult {
			err = emailClient.SendTRBReadyForConsultNotification(
				ctx,
				recipientEmails,
				feedback.CopyTRBMailbox,
				feedback.TRBRequestID,
				request.GetName(),
				requester.DisplayName,
				feedback.FeedbackMessage,
			)
			if err != nil {
				return nil, err
			}
		}
	}

	return createdFeedback, nil
}

// GetTRBRequestFeedbackByTRBRequestID retrieves TRB request feedback records for a given TRB request ID
func GetTRBRequestFeedbackByTRBRequestID(ctx context.Context, id uuid.UUID) ([]*models.TRBRequestFeedback, error) {
	results, err := dataloaders.GetTRBRequestFeedbackByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	return results, err
}
