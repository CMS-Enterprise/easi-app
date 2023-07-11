package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
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
	idStr, idFound := input["trbRequestId"]
	if !idFound {
		return nil, errors.New("missing required property trbRequestId")
	}

	id, err := uuid.Parse(idStr.(string))
	if err != nil {
		return nil, err
	}

	isSubmitted := false
	if isSubmittedVal, isSubmittedFound := input["isSubmitted"]; isSubmittedFound {
		if isSubmittedBool, isSubmittedOk := isSubmittedVal.(bool); isSubmittedOk {
			isSubmitted = isSubmittedBool
			delete(input, "isSubmitted")
		}
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

		systemIntakeUUIDs := []uuid.UUID{}
		if systemIntakeIFCs, ok := systemIntakes.([]interface{}); ok {
			for _, systemIntakeIFC := range systemIntakeIFCs {
				if systemIntakeStr, ok := systemIntakeIFC.(string); ok {
					systemIntakeUUID, parseErr := uuid.Parse(systemIntakeStr)
					if parseErr != nil {
						return nil, parseErr
					}
					systemIntakeUUIDs = append(systemIntakeUUIDs, systemIntakeUUID)
				}
			}
			_, err = store.CreateTRBRequestSystemIntakes(ctx, id, systemIntakeUUIDs)
			if err != nil {
				return nil, err
			}
		}
	}

	err = ApplyChangesAndMetaData(input, form, appcontext.Principal(ctx))
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
				requesterInfo.CommonName,
				componentText,
			)
		})

		emailErrGroup.Go(func() error {
			return emailClient.SendTRBFormSubmissionNotificationToRequester(
				ctx,
				request.ID,
				request.GetName(),
				requesterInfo.Email,
				requesterInfo.CommonName,
			)
		})

		if err := emailErrGroup.Wait(); err != nil {
			return nil, err
		}
	}

	return updatedForm, nil
}

// GetTRBRequestFormByTRBRequestID retrieves a TRB request form record for a given TRB request ID
func GetTRBRequestFormByTRBRequestID(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestForm, error) {
	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, id)
	if err != nil {
		return nil, err
	}

	return form, err
}
