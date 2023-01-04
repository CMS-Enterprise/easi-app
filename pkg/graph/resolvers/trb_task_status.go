package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
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
func GetTRBFeedbackStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBFeedbackStatus, error) {
	status := models.TRBFeedbackStatusCannotStartYet
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
			status = models.TRBFeedbackStatus(models.TRBFeedbackStatusEditsRequested)
		} else if feedback.Action == models.TRBFeedbackActionReadyForConsult {
			// If latest feedback action is "ready for consult", return "completed" status
			status = models.TRBFeedbackStatusCompleted
		}
	} else if form.Status == models.TRBFormStatusCompleted {
		// If feedback is nil (there are no feedback yet), calculate the status based on
		// form status (defaults to "cannot start yet" above)
		status = models.TRBFeedbackStatus(models.TRBFeedbackStatusInReview)
	}

	return &status, nil
}

// GetTRBConsultPrepStatus retrieves the status of the consult step of the TRB request task list
func GetTRBConsultPrepStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBConsultPrepStatus, error) {
	status := models.TRBConsultPrepStatusCannotStartYet
	feedbackStatus, err := GetTRBFeedbackStatus(ctx, store, trbRequestID)
	if err != nil {
		return nil, err
	}

	if *feedbackStatus == models.TRBFeedbackStatusCompleted {
		trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), trbRequestID)
		if err != nil {
			return nil, err
		}

		if trb.ConsultMeetingTime != nil {
			status = models.TRBConsultPrepStatusCompleted
		} else {
			status = models.TRBConsultPrepStatusReadyToStart
		}
	}
	return &status, nil
}

// GetTRBAttendConsultStatus retrieves the status of the consult step of the TRB request task list
func GetTRBAttendConsultStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBAttendConsultStatus, error) {
	status := models.TRBAttendConsultStatusCannotStartYet
	feedbackStatus, err := GetTRBFeedbackStatus(ctx, store, trbRequestID)
	if err != nil {
		return nil, err
	}

	if *feedbackStatus == models.TRBFeedbackStatusCompleted {
		trb, err := store.GetTRBRequestByID(appcontext.ZLogger(ctx), trbRequestID)
		if err != nil {
			return nil, err
		}

		if trb.ConsultMeetingTime != nil {
			if time.Now().Before(*trb.ConsultMeetingTime) {
				status = models.TRBAttendConsultStatusScheduled
			} else {
				status = models.TRBAttendConsultStatusCompleted
			}
		} else {
			status = models.TRBAttendConsultStatusReadyToSchedule
		}
	}
	return &status, nil
}

func getTRBAdviceLetterStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBAdviceLetterStatus, error) {
	logger := appcontext.ZLogger(ctx)

	var status models.TRBAdviceLetterStatus

	errGroup := new(errgroup.Group)

	var trb *models.TRBRequest
	var errGetRequest error

	var letter *models.TRBAdviceLetter
	var errGetLetter error

	errGroup.Go(func() error {
		trb, errGetRequest = store.GetTRBRequestByID(logger, trbRequestID)
		if errGetRequest != nil {
			return errGetRequest
		}
		return nil
	})

	errGroup.Go(func() error {
		letter, errGetLetter = store.GetTRBAdviceLetterByTRBRequestID(appcontext.ZLogger(ctx), trbRequestID)
		if errGetLetter != nil {
			if _, isResourceNotFound := errGetLetter.(*apperrors.ResourceNotFoundError); isResourceNotFound {
				return nil
			}

			return errGetLetter
		}
		return nil
	})

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	// if letter hasn't been created yet
	if letter == nil {
		if trb.ConsultMeetingTime != nil && time.Now().After(*trb.ConsultMeetingTime) {
			status = models.TRBAdviceLetterStatusReadyToStart
		} else {
			status = models.TRBAdviceLetterStatusCannotStartYet
		}
	} else {
		status = letter.Status
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

	var feedbackStatus *models.TRBFeedbackStatus
	var errFeedback error
	errGroup.Go(func() error {
		feedbackStatus, errFeedback = GetTRBFeedbackStatus(ctx, store, trbRequestID)
		return errFeedback
	})

	var consultPrepStatus *models.TRBConsultPrepStatus
	var errConsultPrep error
	errGroup.Go(func() error {
		consultPrepStatus, errConsultPrep = GetTRBConsultPrepStatus(ctx, store, trbRequestID)
		return errConsultPrep
	})

	var attendConsultStatus *models.TRBAttendConsultStatus
	var errAttendConsult error
	errGroup.Go(func() error {
		attendConsultStatus, errAttendConsult = GetTRBAttendConsultStatus(ctx, store, trbRequestID)
		return errAttendConsult
	})

	var adviceLetterStatus *models.TRBAdviceLetterStatus
	var errAdviceLetter error
	errGroup.Go(func() error {
		adviceLetterStatus, errAdviceLetter = getTRBAdviceLetterStatus(ctx, store, trbRequestID)
		return errAdviceLetter
	})

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	statuses := models.TRBTaskStatuses{
		FormStatus:          *formStatus,
		FeedbackStatus:      *feedbackStatus,
		ConsultPrepStatus:   *consultPrepStatus,
		AttendConsultStatus: *attendConsultStatus,
		AdviceLetterStatus:  *adviceLetterStatus,
	}

	return &statuses, nil
}
