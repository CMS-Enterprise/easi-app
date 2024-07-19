package main

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/cmd/devdata/mock"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

type progressOptions struct {
	meetingDate        *time.Time
	completeOtherSteps bool
	fillForm           bool
	submitForm         bool
	requestEdits       bool
}

// always fills out and submits the initial request form
func makeSystemIntakeAndProgressToStep(
	ctx context.Context,
	name string,
	intakeID *uuid.UUID,
	requesterEUA string,
	store *storage.Store,
	newStep models.SystemIntakeStepToProgressTo,
	options *progressOptions,
) *models.SystemIntake {
	intake := makeSystemIntakeAndSubmit(ctx, name, intakeID, requesterEUA, store)
	if options == nil {
		return progressIntake(ctx, store, intake, newStep, nil)
	}
	if options.meetingDate != nil &&
		(newStep == models.SystemIntakeStepToProgressToDraftBusinessCase ||
			newStep == models.SystemIntakeStepToProgressToFinalBusinessCase) {
		panic("cannot assign meeting date to business case")
	}
	if options.completeOtherSteps {
		pastMeetingDate := time.Now().AddDate(0, -2, 0)
		switch newStep {
		case models.SystemIntakeStepToProgressToDraftBusinessCase:
			panic("no prior steps to fill!")
		case models.SystemIntakeStepToProgressToGrtMeeting:
			// completed draft biz case step
			intake = progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToDraftBusinessCase, nil)
			intake = makeDraftBusinessCaseV1(ctx, "draft biz case", store, intake) // partially fills biz case form
			intake = submitBusinessCaseV1(ctx, store, intake)
		case models.SystemIntakeStepToProgressToFinalBusinessCase:
			// complete draft biz case step
			intake = progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToDraftBusinessCase, nil)
			intake = makeFinalBusinessCaseV1(ctx, "final biz case", store, intake) // fully fills biz case form
			intake = submitBusinessCaseV1(ctx, store, intake)
			// complete GRT meeting step
			intake = progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToGrtMeeting, &pastMeetingDate)
		case models.SystemIntakeStepToProgressToGrbMeeting:
			// complete draft biz case step
			intake = progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToDraftBusinessCase, nil)
			intake = makeFinalBusinessCaseV1(ctx, "final biz case", store, intake) // fully fills biz case form
			intake = submitBusinessCaseV1(ctx, store, intake)
			// complete GRT meeting step
			intake = progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToGrtMeeting, &pastMeetingDate)
			// complete final biz case step
			intake = progressIntake(ctx, store, intake, models.SystemIntakeStepToProgressToFinalBusinessCase, nil)
			// no need to fill biz case form again, draft/final are the same form
			intake = submitBusinessCaseV1(ctx, store, intake)
		}
	}
	intake = progressIntake(ctx, store, intake, newStep, options.meetingDate)
	// skip if previous steps already filled out the business case
	if options.fillForm && !options.completeOtherSteps {
		switch newStep {
		case models.SystemIntakeStepToProgressToDraftBusinessCase:
			intake = makeDraftBusinessCaseV1(ctx, "draft biz case", store, intake)
		case models.SystemIntakeStepToProgressToFinalBusinessCase:
			intake = makeFinalBusinessCaseV1(ctx, "final biz case", store, intake)
		case models.SystemIntakeStepToProgressToGrbMeeting:
			fallthrough
		case models.SystemIntakeStepToProgressToGrtMeeting:
			panic("cannot fill non-form step")
		}
	}
	if options.submitForm {
		if !(options.fillForm || options.completeOtherSteps) {
			panic("must fill form or complete prior steps to submit")
		}
		switch newStep {
		case models.SystemIntakeStepToProgressToDraftBusinessCase:
			intake = submitBusinessCaseV1(ctx, store, intake)
		case models.SystemIntakeStepToProgressToFinalBusinessCase:
			intake = submitBusinessCaseV1(ctx, store, intake)
		case models.SystemIntakeStepToProgressToGrbMeeting:
			fallthrough
		case models.SystemIntakeStepToProgressToGrtMeeting:
			panic("cannot submit non-form step")
		}
	}
	if options.requestEdits {
		if !options.submitForm {
			panic("must submit form to request edits")
		}
		var targetedForm models.SystemIntakeFormStep
		switch newStep {
		case models.SystemIntakeStepToProgressToDraftBusinessCase:
			targetedForm = models.SystemIntakeFormStepDraftBusinessCase
		case models.SystemIntakeStepToProgressToFinalBusinessCase:
			targetedForm = models.SystemIntakeFormStepFinalBusinessCase
		case models.SystemIntakeStepToProgressToGrbMeeting:
			fallthrough
		case models.SystemIntakeStepToProgressToGrtMeeting:
			panic("cannot request edits to non-form step")
		}
		requestEditsToIntakeForm(ctx, store, intake, targetedForm)
	}
	return intake
}

// Progresses an intake to a new step
func progressIntake(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	newStep models.SystemIntakeStepToProgressTo,
	meetingDate *time.Time,
) *models.SystemIntake {
	feedbackText := models.HTML(fmt.Sprintf("feedback for %s progressing to %s", string(intake.Step), string(newStep)))
	grbRecommendations := models.HTML(fmt.Sprintf("grb recommendations for %s progressing to %s", string(intake.Step), string(newStep)))
	additionalInfo := models.HTML(fmt.Sprintf("additional info for %s progressing to %s", string(intake.Step), string(newStep)))
	adminNote := models.HTML(fmt.Sprintf("admin note about %s progressing to %s", string(intake.Step), string(newStep)))

	input := models.SystemIntakeProgressToNewStepsInput{
		SystemIntakeID:     intake.ID,
		NewStep:            newStep,
		Feedback:           &feedbackText,
		GrbRecommendations: &grbRecommendations,
		AdditionalInfo:     &additionalInfo,
		AdminNote:          &adminNote,
	}
	if meetingDate != nil {
		input.MeetingDate = meetingDate
	}

	// this will move the intake to the new step and save it to the database, save the feedback, and save a record of the action
	progressedIntake, err := resolvers.ProgressIntake(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return progressedIntake
}

func requestEditsToIntakeForm(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	targetedForm models.SystemIntakeFormStep,
) *models.SystemIntake {
	adminNote := models.HTML(fmt.Sprintf("admin note that edits were requested to %s form", string(targetedForm)))
	additionalInfo := models.HTML(fmt.Sprintf("add'l info about edits requested on %s form", string(targetedForm)))

	input := &models.SystemIntakeRequestEditsInput{
		SystemIntakeID: intake.ID,
		IntakeFormStep: targetedForm,
		NotificationRecipients: &models.EmailNotificationRecipients{
			RegularRecipientEmails:   []models.EmailAddress{},
			ShouldNotifyITGovernance: false,
			ShouldNotifyITInvestment: false,
		},
		EmailFeedback:  models.HTML(fmt.Sprintf("feedback on %s form", string(targetedForm))),
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}
	intake, err := resolvers.CreateSystemIntakeActionRequestEdits(ctx, store, nil, mock.FetchUserInfoMock, *input)
	if err != nil {
		panic(err)
	}
	return intake
}
