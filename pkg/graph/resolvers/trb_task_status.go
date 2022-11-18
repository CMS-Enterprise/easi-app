package resolvers

import (
	"context"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBFormStatus retrieves the status of the form step of the TRB request task list
func GetTRBFormStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBFormStatus, error) {
	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}
	return &form.Status, nil
}

// GetTRBFeedbackStatus retrieves the status of the feedback step of the TRB request task list
func GetTRBFeedbackStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBTaskStatus, error) {
	status := models.TRBTaskStatusCannotStartYet
	errGroup := new(errgroup.Group)

	var form *models.TRBRequestForm
	var errForm error
	errGroup.Go(func() error {
		form, errForm = store.GetTRBRequestFormByTRBRequestID(ctx, trbRequestID)
		return errForm
	})

	var feedback *models.TRBRequestFeedback
	var errFeedback error
	errGroup.Go(func() error {
		feedback, errFeedback = store.GetNewestTRBRequestFeedbackByTRBRequestID(ctx, trbRequestID)
		return errFeedback
	})

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	if feedback != nil {
		// If the latest feedback exists, calculate the status based on the action
		if feedback.Action == models.TRBFeedbackActionRequestEdits {
			// If latest feedback requests edits, return "edits requested" status
			status = models.TRBTaskStatus(models.TRBFeedbackStatusEditsRequested)
		} else if feedback.Action == models.TRBFeedbackActionReadyForConsult {
			// If latest feedback action is "ready for consult", return "completed" status
			status = models.TRBTaskStatusCompleted
		}
	} else if form.Status == models.TRBFormStatusCompleted {
		// If feedback is nil (there are no feedback yet), calculate the status based on
		// form status (defaults to "cannot start yet" above)
		status = models.TRBTaskStatus(models.TRBTaskStatusInProgress)
	}

	return &status, nil
}

// GetTRBConsultStatus retrieves the status of the feedback step of the TRB request task list
func GetTRBConsultStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBTaskStatus, error) {
	status := models.TRBTaskStatusCannotStartYet
	feedbackStatus, err := GetTRBFeedbackStatus(ctx, store, trbRequestID)
	if err != nil {
		return nil, err
	}

	if *feedbackStatus == models.TRBTaskStatusCompleted {
		// TODO: actually implement the logic for this by checking the dates etc (separate ticket)
		status = models.TRBTaskStatusInProgress
	}
	return &status, nil
}

// GetTRBTaskStatuses retrieves all of the statuses for the steps of a given TRB request's task list
func GetTRBTaskStatuses(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBTaskStatuses, error) {
	errGroup := new(errgroup.Group)

	var formStatus *models.TRBFormStatus
	var errForm error
	errGroup.Go(func() error {
		formStatus, errForm = GetTRBFormStatus(ctx, store, trbRequestID)
		return errForm
	})

	var feedbackStatus *models.TRBTaskStatus
	var errFeedback error
	errGroup.Go(func() error {
		feedbackStatus, errFeedback = GetTRBFeedbackStatus(ctx, store, trbRequestID)
		return errFeedback
	})

	var consultStatus *models.TRBTaskStatus
	var errConsult error
	errGroup.Go(func() error {
		consultStatus, errConsult = GetTRBFeedbackStatus(ctx, store, trbRequestID)
		return errConsult
	})

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	statuses := models.TRBTaskStatuses{
		FormStatus:     *formStatus,
		FeedbackStatus: *feedbackStatus,
		ConsultStatus:  *consultStatus,
	}

	return &statuses, nil
}
