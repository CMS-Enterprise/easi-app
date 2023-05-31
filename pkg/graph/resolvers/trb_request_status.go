package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

func getTRBFormStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBFormStatus, error) {
	form, err := store.GetTRBRequestFormByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}
	return &form.Status, nil
}

func getTRBFeedbackStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBFeedbackStatus, error) {
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
			if form.Status == models.TRBFormStatusCompleted {
				// If the form is completed, that means the edits were made
				status = models.TRBFeedbackStatus(models.TRBFeedbackStatusInReview)
			} else {
				// If the form isn't complete, then "edits requested" still applies
				status = models.TRBFeedbackStatus(models.TRBFeedbackStatusEditsRequested)
			}
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

func getTRBConsultPrepStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBConsultPrepStatus, error) {
	status := models.TRBConsultPrepStatusCannotStartYet
	feedbackStatus, err := getTRBFeedbackStatus(ctx, store, trbRequestID)
	if err != nil {
		return nil, err
	}

	if *feedbackStatus == models.TRBFeedbackStatusCompleted {
		trb, err := store.GetTRBRequestByID(ctx, trbRequestID)
		if err != nil {
			return nil, err
		}

		if trb.ConsultMeetingTime != nil && time.Now().After(*trb.ConsultMeetingTime) {
			status = models.TRBConsultPrepStatusCompleted
		} else {
			status = models.TRBConsultPrepStatusReadyToStart
		}
	}
	return &status, nil
}

func getTRBAttendConsultStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (*models.TRBAttendConsultStatus, error) {
	status := models.TRBAttendConsultStatusCannotStartYet
	feedbackStatus, err := getTRBFeedbackStatus(ctx, store, trbRequestID)
	if err != nil {
		return nil, err
	}

	if *feedbackStatus == models.TRBFeedbackStatusCompleted {
		trb, err := store.GetTRBRequestByID(ctx, trbRequestID)
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
	var status models.TRBAdviceLetterStatus

	errGroup := new(errgroup.Group)

	var trb *models.TRBRequest
	var errGetRequest error

	var letter *models.TRBAdviceLetter
	var errGetLetter error

	errGroup.Go(func() error {
		trb, errGetRequest = store.GetTRBRequestByID(ctx, trbRequestID)
		if errGetRequest != nil {
			return errGetRequest
		}
		return nil
	})

	errGroup.Go(func() error {
		letter, errGetLetter = store.GetTRBAdviceLetterByTRBRequestID(ctx, trbRequestID)
		if errGetLetter != nil {
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
		formStatus, errForm = getTRBFormStatus(ctx, store, trbRequestID)
		return errForm
	})

	var feedbackStatus *models.TRBFeedbackStatus
	var errFeedback error
	errGroup.Go(func() error {
		feedbackStatus, errFeedback = getTRBFeedbackStatus(ctx, store, trbRequestID)
		return errFeedback
	})

	var consultPrepStatus *models.TRBConsultPrepStatus
	var errConsultPrep error
	errGroup.Go(func() error {
		consultPrepStatus, errConsultPrep = getTRBConsultPrepStatus(ctx, store, trbRequestID)
		return errConsultPrep
	})

	var attendConsultStatus *models.TRBAttendConsultStatus
	var errAttendConsult error
	errGroup.Go(func() error {
		attendConsultStatus, errAttendConsult = getTRBAttendConsultStatus(ctx, store, trbRequestID)
		return errAttendConsult
	})

	var adviceLetterStatus *models.TRBAdviceLetterStatus
	adviceLetterStatusTaskList := models.TRBAdviceLetterStatusTaskListInReview
	var errAdviceLetter error
	errGroup.Go(func() error {
		adviceLetterStatus, errAdviceLetter = getTRBAdviceLetterStatus(ctx, store, trbRequestID)
		if *adviceLetterStatus == models.TRBAdviceLetterStatusCannotStartYet {
			adviceLetterStatusTaskList = models.TRBAdviceLetterStatusTaskListCannotStartYet
		} else if *adviceLetterStatus == models.TRBAdviceLetterStatusCompleted {
			adviceLetterStatusTaskList = models.TRBAdviceLetterStatusTaskListCompleted
		}
		return errAdviceLetter
	})

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	statuses := models.TRBTaskStatuses{
		FormStatus:                 *formStatus,
		FeedbackStatus:             *feedbackStatus,
		ConsultPrepStatus:          *consultPrepStatus,
		AttendConsultStatus:        *attendConsultStatus,
		AdviceLetterStatus:         *adviceLetterStatus,
		AdviceLetterStatusTaskList: adviceLetterStatusTaskList,
	}

	return &statuses, nil
}

// GetTRBRequestStatus calculates the overall status of the TRB request
func GetTRBRequestStatus(ctx context.Context, store *storage.Store, trbRequestID uuid.UUID) (models.TRBRequestStatus, error) {
	var status models.TRBRequestStatus
	status = models.TRBRequestStatusNew

	taskStatuses, err := GetTRBTaskStatuses(ctx, store, trbRequestID)
	if err != nil {
		return status, err
	}
	trb, err := store.GetTRBRequestByID(ctx, trbRequestID)
	if err != nil {
		return status, err
	}
	formStatus := taskStatuses.FormStatus
	feedbackStatus := taskStatuses.FeedbackStatus
	consultPrepStatus := taskStatuses.ConsultPrepStatus
	attendConsultStatus := taskStatuses.AttendConsultStatus
	adviceLetterStatus := taskStatuses.AdviceLetterStatus

	// New - form status will be "ready to start"
	if formStatus == models.TRBFormStatusReadyToStart {
		status = models.TRBRequestStatusNew
	}

	// Draft request form - form status will be "in progress"
	if formStatus == models.TRBFormStatusInProgress {
		status = models.TRBRequestStatusDraftRequestForm
	}

	// Request form complete
	if formStatus == models.TRBFormStatusCompleted {
		status = models.TRBRequestStatusRequestFormComplete
	}

	// Ready for consult
	if feedbackStatus == models.TRBFeedbackStatusCompleted {
		status = models.TRBRequestStatusReadyForConsult
	}

	// Consult scheduled
	if trb.ConsultMeetingTime != nil || consultPrepStatus == models.TRBConsultPrepStatusCompleted {
		status = models.TRBRequestStatusConsultScheduled
	}

	// Consult complete
	if attendConsultStatus == models.TRBAttendConsultStatusCompleted && adviceLetterStatus == models.TRBAdviceLetterStatusReadyToStart {
		status = models.TRBRequestStatusConsultComplete
	}

	// Draft advice letter
	if adviceLetterStatus == models.TRBAdviceLetterStatusInProgress {
		status = models.TRBRequestStatusDraftAdviceLetter
	}

	// Advice letter in review
	if adviceLetterStatus == models.TRBAdviceLetterStatusReadyForReview {
		status = models.TRBRequestStatusAdviceLetterInReview
	}

	// Advice letter sent
	if adviceLetterStatus == models.TRBAdviceLetterStatusCompleted {
		// Get the advice letter and check if follow-up was recommended
		adviceLetter, err := GetTRBAdviceLetterByTRBRequestID(ctx, store, trbRequestID)
		if err != nil {
			return status, err
		}
		followupRecommended := adviceLetter.IsFollowupRecommended
		if followupRecommended != nil && *followupRecommended {
			status = models.TRBRequestStatusFollowUpRequested
		} else {
			status = models.TRBRequestStatusAdviceLetterSent
		}
	}
	return status, nil
}
