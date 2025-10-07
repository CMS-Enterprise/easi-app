package resolvers

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

const missingComponentFallbackText = "an unspecified component"

// UpdateTRBRequestForm updates a TRBRequestForm record in the database
func UpdateTRBRequestForm(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input map[string]interface{},
) (*models.TRBRequestForm, error) {
	idIface, idFound := input["trbRequestId"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	id, ok := idIface.(uuid.UUID)
	if !ok {
		return nil, fmt.Errorf("unable to convert incoming trbRequestId to uuid when updating TRB request form: %v", idIface)
	}

	isSubmitted := false
	if isSubmittedVal, isSubmittedFound := input["isSubmitted"]; isSubmittedFound {

		switch v := isSubmittedVal.(type) {
		case *bool:
			isSubmitted = *v
		case bool:
			isSubmitted = v
		default:
			return nil, fmt.Errorf("expected bool or *bool value for isSubmitted, got: %T", v)
		}

		delete(input, "isSubmitted")
	}

	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}
	previousStatus := form.Status

	willSendNotifications := isSubmitted && previousStatus != models.TRBFormStatusCompleted

	// start fetching info we'll need to send notifications now, but don't wait on results until we're ready to send emails
	var request models.TRBRequest
	var requesterInfo models.UserInfo

	emailInfoErrGroup := new(errgroup.Group)

	if willSendNotifications {
		emailInfoErrGroup.Go(func() error {
			// declare new error variable so we don't interfere with calls outside of this goroutine
			requestPtr, getRequestErr := store.GetTRBRequestByID(ctx, id)
			if getRequestErr != nil {
				return getRequestErr
			}
			request = *requestPtr
			return nil
		})

		emailInfoErrGroup.Go(func() error {
			// declare new error variable so we don't interfere with calls outside of this goroutine
			requesterInfoPtr, fetchUserInfoErr := fetchUserInfo(ctx, form.CreatedBy)
			if fetchUserInfoErr != nil {
				return fetchUserInfoErr
			}
			requesterInfo = *requesterInfoPtr
			return nil
		})
	}

	// if systemIntakes is provided, we need to delete all intake relations and remake them
	// additionally, delete it from the input so it's not included with ApplyChangesAndMetadata
	if systemIntakes, systemIntakesProvided := input["systemIntakes"]; systemIntakesProvided {
		delete(input, "systemIntakes")

		if systemIntakeUUIDs, ok := systemIntakes.([]uuid.UUID); ok {
			_, err = store.CreateTRBRequestSystemIntakes(ctx, id, systemIntakeUUIDs)
			if err != nil {
				return nil, err
			}
		}
	}

	err = BaseStructPreUpdate(input, form, appcontext.Principal(ctx), true)
	if err != nil {
		return nil, err
	}

	if isSubmitted && previousStatus != models.TRBFormStatusCompleted {
		form.Status = models.TRBFormStatusCompleted
		now := time.Now()
		form.SubmittedAt = &now
	} else if previousStatus != models.TRBFormStatusCompleted {
		form.Status = models.TRBFormStatusInProgress
	}

	updatedForm, err := store.UpdateTRBRequestForm(ctx, form)
	if err != nil {
		return nil, err
	}

	// send notification emails last; make sure database has been updated first

	// don't need to check willSendNotifications here; emailInfoErrGroup only launches goroutines if willSendNotifications is true above
	if err = emailInfoErrGroup.Wait(); err != nil {
		return nil, err
	}

	if willSendNotifications && emailClient != nil {
		emailErrGroup := new(errgroup.Group)

		componentText := missingComponentFallbackText
		if updatedForm.Component != nil {
			componentText = *updatedForm.Component
		}

		emailErrGroup.Go(func() error {
			return emailClient.SendTRBFormSubmissionNotificationToAdmins(
				ctx,
				id,
				request.GetName(),
				requesterInfo.DisplayName,
				componentText,
			)
		})

		emailErrGroup.Go(func() error {
			return emailClient.SendTRBFormSubmissionNotificationToRequester(
				ctx,
				request.ID,
				request.GetName(),
				requesterInfo.Email,
				requesterInfo.DisplayName,
			)
		})

		if err := emailErrGroup.Wait(); err != nil {
			return nil, err
		}
	}

	return updatedForm, nil
}

// GetTRBRequestFormByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetTRBRequestFormByTRBRequestID(ctx context.Context, id uuid.UUID) (*models.TRBRequestForm, error) {
	form, err := dataloaders.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return form, err
}
