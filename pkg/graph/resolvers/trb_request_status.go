package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func getTRBFormStatus(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBFormStatus, error) {
	form, err := dataloaders.GetTRBRequestFormByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}
	return &form.Status, nil
}

func getTRBFeedbackStatus(ctx context.Context, trbRequestID uuid.UUID) (*models.TRBFeedbackStatus, error) {
	status := models.TRBFeedbackStatusCannotStartYet

	form, err := dataloaders.GetTRBRequestFormByTRBRequestID(ctx, trbRequestID)
	if err != nil {
		return nil, err
	}

	feedback, err := dataloaders.GetNewestTRBRequestFeedbackByTRBRequestID(ctx, trbRequestID)
	if err != nil {
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

func getTRBConsultPrepStatus(ctx context.Context, trbRequest models.TRBRequest) (*models.TRBConsultPrepStatus, error) {
	status := models.TRBConsultPrepStatusCannotStartYet
	feedbackStatus, err := getTRBFeedbackStatus(ctx, trbRequest.ID)
	if err != nil {
		return nil, err
	}
	if feedbackStatus == nil {
		return nil, fmt.Errorf("feedback status is nil for trb request %v", trbRequest.ID)
	}

	if *feedbackStatus == models.TRBFeedbackStatusCompleted {
		if trbRequest.ConsultMeetingTime != nil && time.Now().After(*trbRequest.ConsultMeetingTime) {
			status = models.TRBConsultPrepStatusCompleted
		} else {
			status = models.TRBConsultPrepStatusReadyToStart
		}
	}
	return &status, nil
}

func getTRBAttendConsultStatus(ctx context.Context, trbRequest models.TRBRequest) (*models.TRBAttendConsultStatus, error) {
	status := models.TRBAttendConsultStatusCannotStartYet
	feedbackStatus, err := getTRBFeedbackStatus(ctx, trbRequest.ID)
	if err != nil {
		return nil, err
	}
	if feedbackStatus == nil {
		return nil, fmt.Errorf("feedback status is nil for trb request %v", trbRequest.ID)
	}

	if *feedbackStatus == models.TRBFeedbackStatusCompleted {
		if trbRequest.ConsultMeetingTime != nil {
			if time.Now().Before(*trbRequest.ConsultMeetingTime) {
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

func getTRBGuidanceLetterStatus(ctx context.Context, trbRequest models.TRBRequest) (*models.TRBGuidanceLetterStatus, error) {
	var status models.TRBGuidanceLetterStatus

	letter, err := dataloaders.GetTRBGuidanceLetterByTRBRequestID(ctx, trbRequest.ID)
	if err != nil {
		return nil, err
	}

	// if letter hasn't been created yet
	if letter == nil {
		if trbRequest.ConsultMeetingTime != nil && time.Now().After(*trbRequest.ConsultMeetingTime) {
			status = models.TRBGuidanceLetterStatusReadyToStart
		} else {
			status = models.TRBGuidanceLetterStatusCannotStartYet
		}
	} else {
		status = letter.Status
	}

	return &status, nil
}

// GetTRBTaskStatuses retrieves all of the statuses for the steps of a given TRB request's task list
func GetTRBTaskStatuses(ctx context.Context, trbRequest models.TRBRequest) (*models.TRBTaskStatuses, error) {
	formStatus, err := getTRBFormStatus(ctx, trbRequest.ID)
	if err != nil {
		return nil, err
	}
	if formStatus == nil {
		return nil, fmt.Errorf("form status is nil for trb request %v", trbRequest.ID)
	}

	feedbackStatus, err := getTRBFeedbackStatus(ctx, trbRequest.ID)
	if err != nil {
		return nil, err
	}
	if feedbackStatus == nil {
		return nil, fmt.Errorf("feedback status is nil for trb request %v", trbRequest.ID)
	}

	consultPrepStatus, err := getTRBConsultPrepStatus(ctx, trbRequest)
	if err != nil {
		return nil, err
	}
	if consultPrepStatus == nil {
		return nil, fmt.Errorf("consult prep status is nil for trb request %v", trbRequest.ID)
	}

	attendConsultStatus, err := getTRBAttendConsultStatus(ctx, trbRequest)
	if err != nil {
		return nil, err
	}
	if attendConsultStatus == nil {
		return nil, fmt.Errorf("attend consult status is nil for trb request %v", trbRequest.ID)
	}

	guidanceLetterStatus, err := getTRBGuidanceLetterStatus(ctx, trbRequest)
	if err != nil {
		return nil, err
	}
	if guidanceLetterStatus == nil {
		return nil, fmt.Errorf("guidance letter status is nil for trb request %v", trbRequest.ID)
	}

	guidanceLetterStatusTaskList := models.TRBGuidanceLetterStatusTaskListInReview
	if *guidanceLetterStatus == models.TRBGuidanceLetterStatusCannotStartYet {
		guidanceLetterStatusTaskList = models.TRBGuidanceLetterStatusTaskListCannotStartYet
	} else if *guidanceLetterStatus == models.TRBGuidanceLetterStatusCompleted {
		guidanceLetterStatusTaskList = models.TRBGuidanceLetterStatusTaskListCompleted
	}

	statuses := models.TRBTaskStatuses{
		FormStatus:                   *formStatus,
		FeedbackStatus:               *feedbackStatus,
		ConsultPrepStatus:            *consultPrepStatus,
		AttendConsultStatus:          *attendConsultStatus,
		GuidanceLetterStatus:         *guidanceLetterStatus,
		GuidanceLetterStatusTaskList: guidanceLetterStatusTaskList,
	}

	return &statuses, nil
}

// GetTRBRequestStatus calculates the overall status of the TRB request
func GetTRBRequestStatus(ctx context.Context, trbRequest models.TRBRequest) (models.TRBRequestStatus, error) {
	var status models.TRBRequestStatus
	status = models.TRBRequestStatusNew

	taskStatuses, err := GetTRBTaskStatuses(ctx, trbRequest)
	if err != nil {
		return status, err
	}

	formStatus := taskStatuses.FormStatus
	feedbackStatus := taskStatuses.FeedbackStatus
	consultPrepStatus := taskStatuses.ConsultPrepStatus
	attendConsultStatus := taskStatuses.AttendConsultStatus
	guidanceLetterStatus := taskStatuses.GuidanceLetterStatus

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
	if trbRequest.ConsultMeetingTime != nil || consultPrepStatus == models.TRBConsultPrepStatusCompleted {
		status = models.TRBRequestStatusConsultScheduled
	}

	// Consult complete
	if attendConsultStatus == models.TRBAttendConsultStatusCompleted && guidanceLetterStatus == models.TRBGuidanceLetterStatusReadyToStart {
		status = models.TRBRequestStatusConsultComplete
	}

	// Draft guidance letter
	if guidanceLetterStatus == models.TRBGuidanceLetterStatusInProgress {
		status = models.TRBRequestStatusDraftGuidanceLetter
	}

	// Guidance letter in review
	if guidanceLetterStatus == models.TRBGuidanceLetterStatusReadyForReview {
		status = models.TRBRequestStatusGuidanceLetterInReview
	}

	// Guidance letter sent
	if guidanceLetterStatus == models.TRBGuidanceLetterStatusCompleted {
		// Get the guidance letter and check if follow-up was recommended
		guidanceLetter, err := GetTRBGuidanceLetterByTRBRequestID(ctx, trbRequest.ID)
		if err != nil {
			return status, err
		}
		followupRecommended := guidanceLetter.IsFollowupRecommended
		if followupRecommended != nil && *followupRecommended {
			status = models.TRBRequestStatusFollowUpRequested
		} else {
			status = models.TRBRequestStatusGuidanceLetterSent
		}
	}
	return status, nil
}
