package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

func progressIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	newStep model.SystemIntakeStepToProgressTo,
	meetingDate *time.Time,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, mock.PrincipalUser)

	feedbackText := models.HTML(fmt.Sprintf("feedback for %s progressing to %s", string(intake.Step), string(newStep)))
	grbRecommendations := models.HTML(fmt.Sprintf("grb recommendations for %s progressing to %s", string(intake.Step), string(newStep)))
	additionalInfo := models.HTML(fmt.Sprintf("additional info for %s progressing to %s", string(intake.Step), string(newStep)))
	adminNote := models.HTML(fmt.Sprintf("admin note about %s progressing to %s", string(intake.Step), string(newStep)))

	input := model.SystemIntakeProgressToNewStepsInput{
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

type progressOptions struct {
	meetingDate        *time.Time
	completeOtherSteps bool
	fillForm           bool
	submitForm         bool
	requestEdits       bool
}

func makeSystemIntakeAndProgressToStep(
	name string,
	logger *zap.Logger,
	store *storage.Store,
	intakeID *uuid.UUID,
	newStep model.SystemIntakeStepToProgressTo,
	options *progressOptions,
) *models.SystemIntake {
	intake := makeSystemIntakeAndSubmit(name, intakeID, logger, store)
	if options == nil {
		return progressIntake(logger, store, intake, newStep, nil)
	}
	if options.meetingDate != nil &&
		(newStep == model.SystemIntakeStepToProgressToDraftBusinessCase ||
			newStep == model.SystemIntakeStepToProgressToFinalBusinessCase) {
		panic("cannot assign meeting date to business case")
	}
	if options.completeOtherSteps {
		pastMeetingDate := time.Now().AddDate(0, -2, 0)
		switch newStep {
		case model.SystemIntakeStepToProgressToDraftBusinessCase:
			panic("no prior steps to fill!")
		case model.SystemIntakeStepToProgressToGrtMeeting:
			// completed draft biz case step
			intake = progressIntake(logger, store, intake, model.SystemIntakeStepToProgressToDraftBusinessCase, nil)
			intake = makeDraftBusinessCaseV1("draft biz case", logger, store, intake) // partially fills biz case form
			intake = submitBusinessCaseV1(logger, store, intake)
		case model.SystemIntakeStepToProgressToFinalBusinessCase:
			// complete draft biz case step
			intake = progressIntake(logger, store, intake, model.SystemIntakeStepToProgressToDraftBusinessCase, nil)
			intake = makeFinalBusinessCaseV1("final biz case", logger, store, intake) // fully fills biz case form
			intake = submitBusinessCaseV1(logger, store, intake)
			// complete GRT meeting step
			intake = progressIntake(logger, store, intake, model.SystemIntakeStepToProgressToGrtMeeting, &pastMeetingDate)
		case model.SystemIntakeStepToProgressToGrbMeeting:
			// complete draft biz case step
			intake = progressIntake(logger, store, intake, model.SystemIntakeStepToProgressToDraftBusinessCase, nil)
			intake = makeFinalBusinessCaseV1("final biz case", logger, store, intake) // fully fills biz case form
			intake = submitBusinessCaseV1(logger, store, intake)
			// complete GRT meeting step
			intake = progressIntake(logger, store, intake, model.SystemIntakeStepToProgressToGrtMeeting, &pastMeetingDate)
			// complete final biz case step
			intake = progressIntake(logger, store, intake, model.SystemIntakeStepToProgressToFinalBusinessCase, nil)
			// no need to fill biz case form again, draft/final are the same form
			intake = submitBusinessCaseV1(logger, store, intake)
		}
	}
	intake = progressIntake(logger, store, intake, newStep, options.meetingDate)
	// skip if previous steps already filled out the business case
	if options.fillForm && !options.completeOtherSteps {
		switch newStep {
		case model.SystemIntakeStepToProgressToDraftBusinessCase:
			intake = makeDraftBusinessCaseV1("draft biz case", logger, store, intake)
		case model.SystemIntakeStepToProgressToFinalBusinessCase:
			intake = makeFinalBusinessCaseV1("final biz case", logger, store, intake)
		case model.SystemIntakeStepToProgressToGrbMeeting:
			fallthrough
		case model.SystemIntakeStepToProgressToGrtMeeting:
			panic("cannot fill non-form step")
		}
	}
	if options.submitForm {
		if !(options.fillForm || options.completeOtherSteps) {
			panic("must fill form or complete prior steps to submit")
		}
		switch newStep {
		case model.SystemIntakeStepToProgressToDraftBusinessCase:
			intake = submitBusinessCaseV1(logger, store, intake)
		case model.SystemIntakeStepToProgressToFinalBusinessCase:
			intake = submitBusinessCaseV1(logger, store, intake)
		case model.SystemIntakeStepToProgressToGrbMeeting:
			fallthrough
		case model.SystemIntakeStepToProgressToGrtMeeting:
			panic("cannot submit non-form step")
		}
	}
	if options.requestEdits {
		if !options.submitForm {
			panic("must submit form to request edits")
		}
		var targetedForm model.SystemIntakeFormStep
		switch newStep {
		case model.SystemIntakeStepToProgressToDraftBusinessCase:
			targetedForm = model.SystemIntakeFormStepDraftBusinessCase
		case model.SystemIntakeStepToProgressToFinalBusinessCase:
			targetedForm = model.SystemIntakeFormStepFinalBusinessCase
		case model.SystemIntakeStepToProgressToGrbMeeting:
			fallthrough
		case model.SystemIntakeStepToProgressToGrtMeeting:
			panic("cannot request edits to non-form step")
		}
		requestEditsToIntakeForm(logger, store, intake, targetedForm)
	}
	return intake
}

func makeSystemIntakeAndRequestEditsToForm(
	name string,
	logger *zap.Logger,
	store *storage.Store,
	intakeID *uuid.UUID,
) *models.SystemIntake {
	intake := makeSystemIntakeAndSubmit(name, intakeID, logger, store)
	return requestEditsToIntakeForm(logger, store, intake, model.SystemIntakeFormStepInitialRequestForm)
}

func requestEditsToIntakeForm(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	targetedForm model.SystemIntakeFormStep,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, mock.PrincipalUser)
	adminNote := models.HTML(fmt.Sprintf("admin note that edits were requested to %s form", string(targetedForm)))
	additionalInfo := models.HTML(fmt.Sprintf("add'l info about edits requested on %s form", string(targetedForm)))

	input := &model.SystemIntakeRequestEditsInput{
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
