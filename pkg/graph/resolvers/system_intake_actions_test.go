package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/lcidactions"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestSystemIntakeRequestEditsAction() {
	ctx := context.Background()
	initialSteps := []models.SystemIntakeStep{
		models.SystemIntakeStepINITIALFORM,
		models.SystemIntakeStepDRAFTBIZCASE,
		models.SystemIntakeStepFINALBIZCASE,
		models.SystemIntakeStepGRBMEETING,
		models.SystemIntakeStepGRTMEETING,
		models.SystemIntakeStepDECISION,
	}
	formStepMap := map[model.SystemIntakeFormStep]models.SystemIntakeStep{
		model.SystemIntakeFormStepInitialRequestForm: models.SystemIntakeStepINITIALFORM,
		model.SystemIntakeFormStepDraftBusinessCase:  models.SystemIntakeStepDRAFTBIZCASE,
		model.SystemIntakeFormStepFinalBusinessCase:  models.SystemIntakeStepFINALBIZCASE,
	}
	invalidFormSteps := []model.SystemIntakeFormStep{
		"GRT_MEETING",
		"GRB_MEETING",
		"DECISION_AND_NEXT_STEPS",
		"meatloaf",
	}
	for _, invalidStep := range invalidFormSteps {
		suite.Run(fmt.Sprintf("Should error targetting %s step", invalidStep), func() {
			intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        models.SystemIntakeStepINITIALFORM,
			})
			suite.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNotes := models.HTML("apple")
			_, err = CreateSystemIntakeActionRequestEdits(
				ctx,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeRequestEditsInput{
					SystemIntakeID: intake.ID,
					IntakeFormStep: invalidStep,
					NotificationRecipients: &models.EmailNotificationRecipients{
						RegularRecipientEmails:   []models.EmailAddress{"banana"},
						ShouldNotifyITGovernance: false,
						ShouldNotifyITInvestment: false,
					},
					EmailFeedback:  "meatloaf",
					AdditionalInfo: additionalInfo,
					AdminNote:      &adminNotes,
				},
			)
			suite.Error(err)
		})
	}
	for _, initialStep := range initialSteps {
		for _, step := range model.AllSystemIntakeFormStep {
			suite.Run(fmt.Sprintf("Should set state and %s step as active when in %s step", step, initialStep), func() {
				intakeToCreate := &models.SystemIntake{
					RequestType: models.SystemIntakeRequestTypeNEW,
					Step:        initialStep,
				}
				if initialStep == models.SystemIntakeStepDECISION {
					intakeToCreate.DecisionState = models.SIDSLcidIssued
				}
				intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
				suite.NoError(err)
				additionalInfo := models.HTMLPointer("banana")
				adminNote := models.HTMLPointer("apple")
				actionedIntake, err := CreateSystemIntakeActionRequestEdits(
					ctx,
					suite.testConfigs.Store,
					suite.testConfigs.EmailClient,
					suite.fetchUserInfoStub,
					model.SystemIntakeRequestEditsInput{
						SystemIntakeID: intake.ID,
						IntakeFormStep: step,
						NotificationRecipients: &models.EmailNotificationRecipients{
							RegularRecipientEmails:   []models.EmailAddress{"banana"},
							ShouldNotifyITGovernance: false,
							ShouldNotifyITInvestment: false,
						},
						EmailFeedback:  "meatloaf",
						AdditionalInfo: additionalInfo,
						AdminNote:      adminNote,
					},
				)
				suite.NoError(err)
				// ensure correct intake was edited
				suite.Equal(intake.ID, actionedIntake.ID)
				// test that edits requested state was set
				var stepState models.SystemIntakeFormState
				switch step {
				case model.SystemIntakeFormStepInitialRequestForm:
					stepState = actionedIntake.RequestFormState
				case model.SystemIntakeFormStepDraftBusinessCase:
					stepState = actionedIntake.DraftBusinessCaseState
				case model.SystemIntakeFormStepFinalBusinessCase:
					stepState = actionedIntake.FinalBusinessCaseState
				default:
					stepState = ""
				}
				suite.Equal(models.SIRFSEditsRequested, stepState)
				// test that step is changed to requested step
				suite.Equal(formStepMap[step], actionedIntake.Step)
			})
		}
	}
	// test that feedback is created
	suite.Run("Should create feedback", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeRequestEditsInput{
				SystemIntakeID: intake.ID,
				IntakeFormStep: model.SystemIntakeFormStepInitialRequestForm,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				EmailFeedback:  "meatloaf",
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allFeedback, err := suite.testConfigs.Store.GetGovernanceRequestFeedbacksByIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdFeedback := allFeedback[0]
		suite.Equal(models.HTML("meatloaf"), createdFeedback.Feedback)
	})
	suite.Run("Should create action", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeRequestEditsInput{
				SystemIntakeID: intake.ID,
				IntakeFormStep: model.SystemIntakeFormStepInitialRequestForm,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				EmailFeedback:  "meatloaf",
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allActions, err := suite.testConfigs.Store.GetActionsByRequestID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdAction := allActions[0]
		suite.Equal(additionalInfo, createdAction.Feedback)
		suite.Equal(models.SystemIntakeStepINITIALFORM, *createdAction.Step)
	})
	suite.Run("Should create admin note given input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeRequestEditsInput{
				SystemIntakeID: intake.ID,
				IntakeFormStep: model.SystemIntakeFormStepInitialRequestForm,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				EmailFeedback:  "meatloaf",
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdNote := allNotes[0]
		suite.Equal(models.HTMLPointer("apple"), createdNote.Content)
	})
	suite.Run("Should NOT create admin note without input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeRequestEditsInput{
				SystemIntakeID: intake.ID,
				IntakeFormStep: model.SystemIntakeFormStepInitialRequestForm,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				EmailFeedback:  "meatloaf",
				AdditionalInfo: additionalInfo,
				AdminNote:      nil,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		suite.Len(allNotes, 0)
	})
}

// this is a ResolverSuite method in this file instead of issue_lcid_test.go because it's not a pure unit test;
// it requires a store to call store.GenerateLifecycleID()
func (suite *ResolverSuite) TestGenerateNewLCID() {
	suite.Run("Should return existing LCID if one is provided", func() {
		providedLCID := "220181"

		generatedLCID, err := lcidactions.GenerateNewLCID(suite.testConfigs.Context, suite.testConfigs.Store, &providedLCID)

		suite.NoError(err)
		suite.Equal(providedLCID, generatedLCID)
	})

	suite.Run("Should generate new LCID if nil is passed", func() {
		providedLCID := (*string)(nil)

		generatedLCID, err := lcidactions.GenerateNewLCID(suite.testConfigs.Context, suite.testConfigs.Store, providedLCID)

		suite.NoError(err)
		suite.NotEmpty(generatedLCID)
	})

	suite.Run("Should generate new LCID if empty string is passed", func() {
		providedLCID := ""

		generatedLCID, err := lcidactions.GenerateNewLCID(suite.testConfigs.Context, suite.testConfigs.Store, &providedLCID)

		suite.NoError(err)
		suite.NotEmpty(generatedLCID)
	})
}

func (suite *ResolverSuite) TestRejectIntakeAsNotApproved() {
	newIntake := suite.createNewIntake()

	adminNote := models.HTML("test admin note for rejecting")
	additionalInfo := models.HTML("test additional info for rejecting")
	input := model.SystemIntakeRejectIntakeInput{
		// required fields
		SystemIntakeID: newIntake.ID,
		Reason:         "test rejection reason",
		NextSteps:      "test next steps after rejection",
		TrbFollowUp:    models.TRBFRStronglyRecommended,

		// optional fields
		AdminNote:      &adminNote,
		AdditionalInfo: &additionalInfo,
	}

	updatedIntake, err := RejectIntakeAsNotApproved(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.EmailClient,
		suite.fetchUserInfoStub,
		input,
	)
	suite.NoError(err)

	// check workflow state
	suite.EqualValues(models.SystemIntakeStepDECISION, updatedIntake.Step)
	suite.EqualValues(models.SystemIntakeStateClosed, updatedIntake.State)
	suite.EqualValues(models.SIDSNotApproved, updatedIntake.DecisionState)

	// check fields from input
	suite.EqualValues(input.Reason, *updatedIntake.RejectionReason)
	suite.EqualValues(input.NextSteps, *updatedIntake.DecisionNextSteps)
	suite.EqualValues(input.TrbFollowUp, *updatedIntake.TRBFollowUpRecommendation)

	// should create action
	allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, updatedIntake.ID)
	suite.NoError(err)
	suite.NotEmpty(allActionsForIntake)
	action := allActionsForIntake[0]
	suite.EqualValues(updatedIntake.ID, *action.IntakeID)
	suite.EqualValues(models.ActionTypeREJECT, action.ActionType)
	suite.EqualValues(additionalInfo, *action.Feedback)
	suite.EqualValues(models.SystemIntakeStepDECISION, *action.Step)

	// should create admin note (since input included it)
	allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, updatedIntake.ID)
	suite.NoError(err)
	suite.NotEmpty(allNotesForIntake)
	suite.EqualValues(adminNote, *allNotesForIntake[0].Content)

	// check that rejecting the same intake twice is valid
	input.Reason = "further rejection testing"
	_, err = RejectIntakeAsNotApproved(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.EmailClient,
		suite.fetchUserInfoStub,
		input,
	)
	suite.NoError(err)
}

func (suite *ResolverSuite) TestIssueLCID() {
	suite.Run("When LCID is provided, that LCID is set on the intake", func() {
		newIntake := suite.createNewIntake()

		providedLCID := "123456"

		input := model.SystemIntakeIssueLCIDInput{
			Lcid: &providedLCID,

			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      time.Now().AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}

		updatedIntake, err := IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			input,
		)
		suite.NoError(err)

		suite.EqualValues(providedLCID, updatedIntake.LifecycleID.ValueOrZero())
	})

	suite.Run("When LCID is *not* provided, a new LCID is generated", func() {
		newIntake := suite.createNewIntake()

		input := model.SystemIntakeIssueLCIDInput{
			Lcid: nil,

			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      time.Now().AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}

		updatedIntake, err := IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			input,
		)
		suite.NoError(err)

		suite.NotEmpty(updatedIntake.LifecycleID.ValueOrZero())
	})

	suite.Run("Issuing an LCID sets the correct fields, creates an action, and disallows further issuing on the intake", func() {
		newIntake := suite.createNewIntake()

		costBaseline := "test cost baseline"
		adminNote := models.HTML("test admin note for issuing LCID")
		additionalInfo := models.HTML("test additional info for issuing LCID")
		input := model.SystemIntakeIssueLCIDInput{
			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      time.Now().AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps after issuing LCID",
			TrbFollowUp:    models.TRBFRStronglyRecommended,

			// optional fields
			CostBaseline:   &costBaseline,
			AdminNote:      &adminNote,
			AdditionalInfo: &additionalInfo,
		}

		updatedIntake, err := IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			input,
		)
		suite.NoError(err)

		// check workflow state
		suite.EqualValues(models.SystemIntakeStepDECISION, updatedIntake.Step)
		suite.EqualValues(models.SystemIntakeStateClosed, updatedIntake.State)
		suite.EqualValues(models.SIDSLcidIssued, updatedIntake.DecisionState)

		// check fields from input
		suite.EqualValues(input.Scope, *updatedIntake.LifecycleScope)
		suite.EqualValues(input.NextSteps, *updatedIntake.DecisionNextSteps)
		suite.EqualValues(input.TrbFollowUp, *updatedIntake.TRBFollowUpRecommendation)
		suite.EqualValues(*input.CostBaseline, updatedIntake.LifecycleCostBaseline.ValueOrZero())

		// expiration date and issued date require some special test code;
		// - EqualValues() doesn't necessarily work, because the timezones might be different
		// - using the .Equal() method from time.Time doesn't work, because input.ExpiresAt has more precision than updatedIntake.LifecycleExpiresAt
		// - using EqualValues() with input.ExpiresAt.Date() and updatedIntake.LifecycleExpiresAt.Date() doesn't work, because those functions both return triples
		// we just care about the date, so check that, and check year/month/day individually
		suite.EqualValues(input.ExpiresAt.UTC().Year(), updatedIntake.LifecycleExpiresAt.Year())
		suite.EqualValues(input.ExpiresAt.UTC().Month(), updatedIntake.LifecycleExpiresAt.Month())
		suite.EqualValues(input.ExpiresAt.UTC().Day(), updatedIntake.LifecycleExpiresAt.Day())
		suite.EqualValues(time.Now().UTC().Year(), updatedIntake.LifecycleIssuedAt.Year())
		suite.EqualValues(time.Now().UTC().Month(), updatedIntake.LifecycleIssuedAt.Month())
		suite.EqualValues(time.Now().UTC().Day(), updatedIntake.LifecycleIssuedAt.Day())

		// should create action
		allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, updatedIntake.ID)
		suite.NoError(err)
		suite.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		suite.EqualValues(updatedIntake.ID, *action.IntakeID)
		suite.EqualValues(models.ActionTypeISSUELCID, action.ActionType)
		suite.EqualValues(additionalInfo, *action.Feedback)
		suite.EqualValues(models.SystemIntakeStepDECISION, *action.Step)

		// should create admin note (since input included it)
		allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, updatedIntake.ID)
		suite.NoError(err)
		suite.NotEmpty(allNotesForIntake)
		suite.EqualValues(adminNote, *allNotesForIntake[0].Content)

		// check that issuing an LCID twice is not valid
		input.NextSteps = "issuing again will work, right?" // input still refers to the same intake
		_, err = IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			input,
		)
		suite.Error(err)
	})
}

func (suite *ResolverSuite) TestSystemIntakeCloseRequestAction() {
	ctx := context.Background()
	formSteps := []models.SystemIntakeStep{
		models.SystemIntakeStepINITIALFORM,
		models.SystemIntakeStepDRAFTBIZCASE,
		models.SystemIntakeStepFINALBIZCASE,
		models.SystemIntakeStepGRBMEETING,
		models.SystemIntakeStepGRTMEETING,
		models.SystemIntakeStepDECISION,
	}
	for _, formStep := range formSteps {
		suite.Run(fmt.Sprintf("Should close request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateOpen,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			suite.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			actionedIntake, err := CreateSystemIntakeActionCloseRequest(
				ctx,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeCloseRequestInput{
					SystemIntakeID: intake.ID,
					NotificationRecipients: &models.EmailNotificationRecipients{
						RegularRecipientEmails:   []models.EmailAddress{"banana"},
						ShouldNotifyITGovernance: false,
						ShouldNotifyITInvestment: false,
					},
					Reason:         models.HTMLPointer("meatloaf"),
					AdditionalInfo: additionalInfo,
					AdminNote:      adminNote,
				},
			)
			suite.NoError(err)
			// ensure correct intake was edited
			suite.Equal(intake.ID, actionedIntake.ID)
			// Intake should now be closed
			suite.Equal(models.SystemIntakeStateClosed, actionedIntake.State)
			// Step and Decision State should be unaffected
			suite.Equal(intake.Step, actionedIntake.Step)
			suite.Equal(intake.DecisionState, actionedIntake.DecisionState)
		})
	}
	for _, formStep := range formSteps {
		suite.Run(fmt.Sprintf("Should error on closed request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateClosed,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			suite.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			_, err = CreateSystemIntakeActionCloseRequest(
				ctx,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeCloseRequestInput{
					SystemIntakeID: intake.ID,
					NotificationRecipients: &models.EmailNotificationRecipients{
						RegularRecipientEmails:   []models.EmailAddress{"banana"},
						ShouldNotifyITGovernance: false,
						ShouldNotifyITInvestment: false,
					},
					Reason:         models.HTMLPointer("meatloaf"),
					AdditionalInfo: additionalInfo,
					AdminNote:      adminNote,
				},
			)
			suite.Error(err)
			// ensure intake is still closed and unaffected
			fetchedIntake, err := suite.testConfigs.Store.FetchSystemIntakeByID(ctx, intake.ID)
			suite.NoError(err)
			suite.Equal(fetchedIntake.State, models.SystemIntakeStateClosed)
		})
	}
	suite.Run("Should create action", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateOpen,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeCloseRequestInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allActions, err := suite.testConfigs.Store.GetActionsByRequestID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdAction := allActions[0]
		suite.Equal(additionalInfo, createdAction.Feedback)
		suite.Equal(models.SystemIntakeStepINITIALFORM, *createdAction.Step)
	})
	suite.Run("Should create admin note given input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeCloseRequestInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdNote := allNotes[0]
		suite.Equal(models.HTMLPointer("apple"), createdNote.Content)
	})
	suite.Run("Should NOT create admin note without input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeCloseRequestInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      nil,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		suite.Len(allNotes, 0)
	})
}

func (suite *ResolverSuite) TestSystemIntakeReopenRequestAction() {
	ctx := context.Background()
	formSteps := []models.SystemIntakeStep{
		models.SystemIntakeStepINITIALFORM,
		models.SystemIntakeStepDRAFTBIZCASE,
		models.SystemIntakeStepFINALBIZCASE,
		models.SystemIntakeStepGRBMEETING,
		models.SystemIntakeStepGRTMEETING,
		models.SystemIntakeStepDECISION,
	}
	for _, formStep := range formSteps {
		suite.Run(fmt.Sprintf("Should reopen request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateClosed,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			suite.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			actionedIntake, err := CreateSystemIntakeActionReopenRequest(
				ctx,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeReopenRequestInput{
					SystemIntakeID: intake.ID,
					NotificationRecipients: &models.EmailNotificationRecipients{
						RegularRecipientEmails:   []models.EmailAddress{"banana"},
						ShouldNotifyITGovernance: false,
						ShouldNotifyITInvestment: false,
					},
					Reason:         models.HTMLPointer("meatloaf"),
					AdditionalInfo: additionalInfo,
					AdminNote:      adminNote,
				},
			)
			suite.NoError(err)
			// ensure correct intake was edited
			suite.Equal(intake.ID, actionedIntake.ID)
			// Intake should now be open
			suite.Equal(actionedIntake.State, models.SystemIntakeStateOpen)
			// Step and Decision State should be unaffected
			suite.Equal(intake.Step, actionedIntake.Step)
			suite.Equal(intake.DecisionState, actionedIntake.DecisionState)
		})
	}
	for _, formStep := range formSteps {
		suite.Run(fmt.Sprintf("Should error on open request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateOpen,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			suite.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			_, err = CreateSystemIntakeActionReopenRequest(
				ctx,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeReopenRequestInput{
					SystemIntakeID: intake.ID,
					NotificationRecipients: &models.EmailNotificationRecipients{
						RegularRecipientEmails:   []models.EmailAddress{"banana"},
						ShouldNotifyITGovernance: false,
						ShouldNotifyITInvestment: false,
					},
					Reason:         models.HTMLPointer("meatloaf"),
					AdditionalInfo: additionalInfo,
					AdminNote:      adminNote,
				},
			)
			suite.Error(err)
			// ensure intake is still closed and unaffected
			fetchedIntake, err := suite.testConfigs.Store.FetchSystemIntakeByID(ctx, intake.ID)
			suite.NoError(err)
			suite.Equal(models.SystemIntakeStateOpen, fetchedIntake.State)
		})
	}
	suite.Run("Should create action", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateClosed,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeReopenRequestInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allActions, err := suite.testConfigs.Store.GetActionsByRequestID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdAction := allActions[0]
		suite.Equal(additionalInfo, createdAction.Feedback)
		suite.Equal(models.SystemIntakeStepINITIALFORM, *createdAction.Step)
	})
	suite.Run("Should create admin note given input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateClosed,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeReopenRequestInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdNote := allNotes[0]
		suite.Equal(models.HTMLPointer("apple"), createdNote.Content)
	})
	suite.Run("Should NOT create admin note without input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateClosed,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeReopenRequestInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      nil,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		suite.Len(allNotes, 0)
	})
}

func (suite *ResolverSuite) TestSystemIntakeNotITGovRequestAction() {
	ctx := context.Background()
	formSteps := []models.SystemIntakeStep{
		models.SystemIntakeStepINITIALFORM,
		models.SystemIntakeStepDRAFTBIZCASE,
		models.SystemIntakeStepFINALBIZCASE,
		models.SystemIntakeStepGRBMEETING,
		models.SystemIntakeStepGRTMEETING,
		models.SystemIntakeStepDECISION,
	}
	formStates := []models.SystemIntakeState{
		models.SystemIntakeStateClosed,
		models.SystemIntakeStateOpen,
	}
	for _, formStep := range formSteps {
		for _, formState := range formStates {
			suite.Run(fmt.Sprintf("Should issue decision on %s request in %s step", formState, formStep), func() {
				intakeToCreate := &models.SystemIntake{
					RequestType: models.SystemIntakeRequestTypeNEW,
					Step:        formStep,
					State:       formState,
				}
				// If in the decision step, an intake should always have a decision
				if formStep == models.SystemIntakeStepDECISION {
					intakeToCreate.DecisionState = models.SIDSLcidIssued
				}
				intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
				suite.NoError(err)
				additionalInfo := models.HTMLPointer("banana")
				adminNote := models.HTMLPointer("apple")
				reason := models.HTMLPointer("meatloaf")
				actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
					ctx,
					suite.testConfigs.Store,
					suite.testConfigs.EmailClient,
					suite.fetchUserInfoStub,
					model.SystemIntakeNotITGovReqInput{
						SystemIntakeID: intake.ID,
						NotificationRecipients: &models.EmailNotificationRecipients{
							RegularRecipientEmails:   []models.EmailAddress{"banana"},
							ShouldNotifyITGovernance: false,
							ShouldNotifyITInvestment: false,
						},
						Reason:         reason,
						AdditionalInfo: additionalInfo,
						AdminNote:      adminNote,
					},
				)
				suite.NoError(err)
				// ensure correct intake was edited
				suite.Equal(intake.ID, actionedIntake.ID)
				// Intake should now be closed
				suite.Equal(actionedIntake.State, models.SystemIntakeStateClosed)
				// Step should be decision
				suite.Equal(models.SystemIntakeStepDECISION, actionedIntake.Step)
				// Decision state should be NOT_GOVERNANCE
				suite.Equal(models.SIDSNotGovernance, actionedIntake.DecisionState)
				// Rejection Reason should be stored
				suite.Equal(reason, actionedIntake.RejectionReason)
			})
		}
	}
	suite.Run("Should create action", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateClosed,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeNotITGovReqInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allActions, err := suite.testConfigs.Store.GetActionsByRequestID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdAction := allActions[0]
		suite.Equal(additionalInfo, createdAction.Feedback)
		suite.Equal(models.SystemIntakeStepDECISION, *createdAction.Step)
	})
	suite.Run("Should create admin note given input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateClosed,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeNotITGovReqInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      adminNote,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		createdNote := allNotes[0]
		suite.Equal(models.HTMLPointer("apple"), createdNote.Content)
	})
	suite.Run("Should NOT create admin note without input", func() {
		intake, err := suite.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateClosed,
		})
		suite.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
			ctx,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeNotITGovReqInput{
				SystemIntakeID: intake.ID,
				NotificationRecipients: &models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{"banana"},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				Reason:         models.HTMLPointer("meatloaf"),
				AdditionalInfo: additionalInfo,
				AdminNote:      nil,
			},
		)
		suite.NoError(err)
		suite.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		suite.NoError(err)
		suite.Len(allNotes, 0)
	})
}

func (suite *ResolverSuite) TestSystemIntakeUpdateLCID() {

	suite.Run("Can't update an LCID that wasn't issued", func() {
		intakeNoLCID, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		_, err2 := UpdateLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeUpdateLCIDInput{
				SystemIntakeID: intakeNoLCID.ID,
			})
		suite.Error(err2)

	})

	suite.Run("Can update an LCID that was issued", func() {
		intakeWLCID, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		intakeWLCID.LifecycleID = null.StringFrom("123456")
		_, err = suite.testConfigs.Store.UpdateSystemIntake(suite.testConfigs.Context, intakeWLCID)
		suite.NoError(err)
		scope := models.HTMLPointer("A really great new scope")
		additionalInfo := models.HTMLPointer("My test info")
		costBaseline := "the original costBaseline"

		updatedIntakeLCID, err := UpdateLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeUpdateLCIDInput{
				SystemIntakeID: intakeWLCID.ID,
				Scope:          scope,
				AdditionalInfo: additionalInfo,
				CostBaseline:   &costBaseline,
			})
		suite.NoError(err)
		suite.EqualValues(scope, updatedIntakeLCID.LifecycleScope)
		suite.EqualValues(null.StringFrom(costBaseline), updatedIntakeLCID.LifecycleCostBaseline)

		// assert acion is created
		allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, updatedIntakeLCID.ID)
		suite.NoError(err)
		suite.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		suite.EqualValues(updatedIntakeLCID.ID, *action.IntakeID)
		suite.EqualValues(models.ActionTypeUPDATELCID, action.ActionType)
		suite.EqualValues(additionalInfo, action.Feedback)

		//assert there is not an admin note since not included
		allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, updatedIntakeLCID.ID)
		suite.NoError(err)
		suite.Empty(allNotesForIntake)

		suite.Run("Can update an already updated LCID", func() {
			adminNote := models.HTML("test admin note for updating LCID")

			updatedScope := models.HTMLPointer("A really great new scope")
			additionalInfoUpdate := models.HTMLPointer("My feedback for second update")
			secondUpdateIntake, err := UpdateLCID(
				suite.testConfigs.Context,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeUpdateLCIDInput{
					SystemIntakeID: updatedIntakeLCID.ID,
					Scope:          updatedScope,
					AdditionalInfo: additionalInfoUpdate,
					AdminNote:      &adminNote,
				})
			suite.NoError(err)
			suite.EqualValues(updatedScope, secondUpdateIntake.LifecycleScope)
			suite.EqualValues(null.StringFrom(costBaseline), secondUpdateIntake.LifecycleCostBaseline) // This should not be updated since it wasn't included

			allActionsForIntake2, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, secondUpdateIntake.ID)
			suite.NoError(err)
			suite.NotEmpty(allActionsForIntake2)
			action := allActionsForIntake2[0] //The first action is the most recent
			suite.EqualValues(secondUpdateIntake.ID, *action.IntakeID)
			suite.EqualValues(models.ActionTypeUPDATELCID, action.ActionType)
			suite.EqualValues(additionalInfoUpdate, action.Feedback)

			//There should be one admin note
			allNotesForIntake2, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, secondUpdateIntake.ID)
			suite.NoError(err)
			suite.NotEmpty(allNotesForIntake2)
			note := allNotesForIntake2[0]
			suite.EqualValues(&adminNote, note.Content)
		})

	})

}

func (suite *ResolverSuite) TestSystemIntakeConfirmLCID() {

	suite.Run("Can't confirm an LCID that wasn't issued", func() {
		intakeNoLCID, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		_, err2 := ConfirmLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeConfirmLCIDInput{
				SystemIntakeID: intakeNoLCID.ID,
			})
		suite.Error(err2)

	})

	suite.Run("Can confirm an LCID that was issued", func() {
		intakeWLCID, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, &models.SystemIntake{
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		suite.NoError(err)
		intakeWLCID.LifecycleID = null.StringFrom("123456")
		alertTS := time.Now()
		intakeWLCID.LifecycleExpirationAlertTS = &alertTS // set an alert timestamp that we expect to be cleared later
		_, err = suite.testConfigs.Store.UpdateSystemIntake(suite.testConfigs.Context, intakeWLCID)
		suite.NoError(err)
		scope := models.HTML("A really great new scope")
		additionalInfo := models.HTMLPointer("My test info")
		costBaseline := "the original costBaseline"
		expiresAt := time.Now()
		nextSteps := models.HTML("My next steps")
		trbFollowUp := models.TRBFRNotRecommended

		confirmedIntakeLCID, err := ConfirmLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			model.SystemIntakeConfirmLCIDInput{
				SystemIntakeID: intakeWLCID.ID,
				ExpiresAt:      expiresAt,
				Scope:          scope,
				NextSteps:      nextSteps,
				TrbFollowUp:    trbFollowUp,
				AdditionalInfo: additionalInfo,
				CostBaseline:   &costBaseline,
			})
		suite.NoError(err)
		suite.EqualValues(&scope, confirmedIntakeLCID.LifecycleScope)
		suite.EqualValues(null.StringFrom(costBaseline), confirmedIntakeLCID.LifecycleCostBaseline)
		suite.Nil(confirmedIntakeLCID.LifecycleExpirationAlertTS)

		// assert action is created
		allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, confirmedIntakeLCID.ID)
		suite.NoError(err)
		suite.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		suite.EqualValues(confirmedIntakeLCID.ID, *action.IntakeID)
		suite.EqualValues(models.ActionTypeCONFIRMLCID, action.ActionType)
		suite.EqualValues(additionalInfo, action.Feedback)

		//assert there is not an admin note since not included
		allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, confirmedIntakeLCID.ID)
		suite.NoError(err)
		suite.Empty(allNotesForIntake)

		suite.Run("Can confirm an already confirmd LCID", func() {
			adminNote := models.HTML("test admin note for updating LCID")

			// Set an alert timestamp that we expect to NOT be cleared later (since we're confirming with the same date as the original confirmation)
			alertTS := time.Now()
			confirmedIntakeLCID.LifecycleExpirationAlertTS = &alertTS // set an alert timestamp that we expect to be cleared later
			_, err = suite.testConfigs.Store.UpdateSystemIntake(suite.testConfigs.Context, confirmedIntakeLCID)

			confirmedScope := models.HTML("A really great new scope")
			additionalInfoconfirm := models.HTMLPointer("My feedback for second confirm")
			expiresAt := time.Now()
			nextSteps := models.HTML("My next steps")
			trbFollowUp := models.TRBFRNotRecommended

			secondconfirmIntake, err := ConfirmLCID(
				suite.testConfigs.Context,
				suite.testConfigs.Store,
				suite.testConfigs.EmailClient,
				suite.fetchUserInfoStub,
				model.SystemIntakeConfirmLCIDInput{
					SystemIntakeID: confirmedIntakeLCID.ID,
					ExpiresAt:      expiresAt,
					Scope:          confirmedScope,
					NextSteps:      nextSteps,
					TrbFollowUp:    trbFollowUp,
					AdditionalInfo: additionalInfoconfirm,
					AdminNote:      &adminNote,
				})
			suite.NoError(err)
			suite.EqualValues(&confirmedScope, secondconfirmIntake.LifecycleScope)
			suite.EqualValues(null.StringFrom(costBaseline), secondconfirmIntake.LifecycleCostBaseline) // This should not be confirmd since it wasn't included
			suite.NotNil(secondconfirmIntake)                                                           // Shouldn't be reset since we passed the same date as before

			allActionsForIntake2, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, secondconfirmIntake.ID)
			suite.NoError(err)
			suite.NotEmpty(allActionsForIntake2)
			action := allActionsForIntake2[0] //The first action is the most recent
			suite.EqualValues(secondconfirmIntake.ID, *action.IntakeID)
			suite.EqualValues(models.ActionTypeCONFIRMLCID, action.ActionType)
			suite.EqualValues(additionalInfoconfirm, action.Feedback)

			//There should be one admin note
			allNotesForIntake2, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, secondconfirmIntake.ID)
			suite.NoError(err)
			suite.NotEmpty(allNotesForIntake2)
			note := allNotesForIntake2[0]
			suite.EqualValues(&adminNote, note.Content)
		})
	})
}

func (suite *ResolverSuite) TestExpireLCID() {
	suite.Run("Expiring an LCID on an intake with an LCID issued sets it to expired, sets the correct fields, creates an action, and creates an admin note", func() {
		currentTime := time.Now()

		// create an intake, issue an LCID for it with an expiration date in the future
		newIntake := suite.createNewIntake()
		issueLCIDInput := model.SystemIntakeIssueLCIDInput{
			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      currentTime.AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps after issuing LCID, before expiring",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}
		updatedIntake, err := IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			issueLCIDInput,
		)
		suite.NoError(err)

		// expire the LCID
		expireLCIDInput := model.SystemIntakeExpireLCIDInput{
			// required fields
			SystemIntakeID: updatedIntake.ID,
			Reason:         "test reason for expiring LCID",

			// optional fields
			NextSteps:      models.HTMLPointer("test next steps after expiring LCID"),
			AdminNote:      models.HTMLPointer("test admin note for expiring LCID"),
			AdditionalInfo: models.HTMLPointer("test additional info for expiring LCID"),
		}

		expiredIntake, err := ExpireLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			expireLCIDInput,
		)
		suite.NoError(err)

		// check calculated LCID status
		lcidStatus := expiredIntake.LCIDStatus(currentTime)
		suite.EqualValues(models.SystemIntakeLCIDStatusExpired, *lcidStatus)

		// check decision next steps from input
		suite.EqualValues(expireLCIDInput.NextSteps, expiredIntake.DecisionNextSteps)

		// check expiration date - should be set to today (UTC) at midnight
		expectedExpirationDate := time.Date(currentTime.UTC().Year(), currentTime.UTC().Month(), currentTime.UTC().Day(), 0, 0, 0, 0, time.UTC)

		// EqualValues() works here because we know expectedExpirationDate is UTC, and calling .UTC() on updatedIntake.LifecycleExpiresAt will return a UTC time
		suite.EqualValues(expectedExpirationDate, expiredIntake.LifecycleExpiresAt.UTC())

		// should create action
		allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, expiredIntake.ID)
		suite.NoError(err)
		suite.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0] // GetActionsByRequestID() orders actions by .CreatedAt in descending order, so most recent action is first in the slice
		suite.EqualValues(expiredIntake.ID, *action.IntakeID)
		suite.EqualValues(models.ActionTypeEXPIRELCID, action.ActionType)
		suite.EqualValues(expireLCIDInput.AdditionalInfo, action.Feedback)
		suite.EqualValues(models.SystemIntakeStepDECISION, *action.Step)

		// should create admin note (since input included it)
		allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, expiredIntake.ID)
		suite.NoError(err)
		suite.NotEmpty(allNotesForIntake)
		adminNote := allNotesForIntake[0] // should be the only admin note on the intake, since we didn't include one when issuing the LCID
		suite.EqualValues(expireLCIDInput.AdminNote, adminNote.Content)
	})
}

func (suite *ResolverSuite) TestRetireLCID() {
	suite.Run("Retiring an LCID on an intake with an LCID issued (but not yet retired) sets it to retired if the retirement date is in the past,"+
		" sets the retirement date field, creates an action, and creates an admin note", func() {
		currentTime := time.Now()

		// create an intake, issue an LCID for it
		newIntake := suite.createNewIntake()
		issueLCIDInput := model.SystemIntakeIssueLCIDInput{
			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      currentTime.AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps after issuing LCID, before expiring",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}
		updatedIntake, err := IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			issueLCIDInput,
		)
		suite.NoError(err)

		// retire the LCID
		retirementDate := time.Unix(0, 0) // in the past, so LCID should be retired
		retireLCIDInput := model.SystemIntakeRetireLCIDInput{
			// required fields
			SystemIntakeID: updatedIntake.ID,
			RetiresAt:      retirementDate,

			// optional fields
			AdminNote:      models.HTMLPointer("test admin note for retiring LCID"),
			AdditionalInfo: models.HTMLPointer("test additional info for retiring LCID"),
		}

		retiredIntake, err := RetireLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			retireLCIDInput,
		)
		suite.NoError(err)

		// check calculated LCID status
		lcidStatus := retiredIntake.LCIDStatus(currentTime)
		suite.EqualValues(models.SystemIntakeLCIDStatusRetired, *lcidStatus)

		// check retirement date
		// call UTC() for consistency, since that's what the database will return
		suite.EqualValues(retirementDate.UTC(), retiredIntake.LifecycleRetiresAt.UTC())

		// should create action
		allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, retiredIntake.ID)
		suite.NoError(err)
		suite.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0] // GetActionsByRequestID() orders actions by .CreatedAt in descending order, so most recent action is first in the slice
		suite.EqualValues(retiredIntake.ID, *action.IntakeID)
		suite.EqualValues(models.ActionTypeRETIRELCID, action.ActionType)
		suite.EqualValues(retireLCIDInput.AdditionalInfo, action.Feedback)

		// should create admin note (since input included it)
		allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, retiredIntake.ID)
		suite.NoError(err)
		suite.NotEmpty(allNotesForIntake)
		adminNote := allNotesForIntake[0] // should be the only admin note on the intake, since we didn't include one when issuing the LCID
		suite.EqualValues(retireLCIDInput.AdminNote, adminNote.Content)
	})
}

func (suite *ResolverSuite) TestChangeLCIDRetirementDate() {
	suite.Run("Changing an LCID's retirement date on a retired intake updates the retirement date, creates an action, and creates an admin note", func() {
		currentTime := time.Now()
		expirationDate := currentTime.Add(1 * 24 * time.Hour)  // one day from now
		originalRetirementDate := currentTime.AddDate(1, 0, 0) // one year from now
		newRetirementDate := currentTime.AddDate(2, 0, 0)      // two years from now

		// create an intake, issue an LCID for it, retire the LCID
		newIntake := suite.createNewIntake()
		issueLCIDInput := model.SystemIntakeIssueLCIDInput{
			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      expirationDate,
			Scope:          "test scope",
			NextSteps:      "test next steps after issuing LCID, before retiring",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}
		intakeWithLCID, err := IssueLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			issueLCIDInput,
		)
		suite.NoError(err)

		// retire the LCID
		retireLCIDInput := model.SystemIntakeRetireLCIDInput{
			// required fields
			SystemIntakeID: intakeWithLCID.ID,
			RetiresAt:      originalRetirementDate,
		}
		retiredIntake, err := RetireLCID(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			retireLCIDInput,
		)
		suite.NoError(err)

		// change the LCID's retirement date
		changeRetirementDateInput := model.SystemIntakeChangeLCIDRetirementDateInput{
			// required fields
			SystemIntakeID: retiredIntake.ID,
			RetiresAt:      newRetirementDate,

			// optional fields
			AdminNote:      models.HTMLPointer("test admin note for changing LCID retirement date"),
			AdditionalInfo: models.HTMLPointer("test additional info for changing LCID retirement date"),
		}

		lcidWithUpdatedRetirementDate, err := ChangeLCIDRetirementDate(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.EmailClient,
			suite.fetchUserInfoStub,
			changeRetirementDateInput,
		)
		suite.NoError(err)

		// check retirement date

		// use s.WithinDuration() because Postgres doesn't have nanosecond-level precision;
		// time.Now() will return a timestamp with some number of nanoseconds,
		// but any timestamp returned from Postgres (i.e. the updated intake returned from ChangeLCIDRetirementDate()) will have nanoseconds set to 0
		suite.WithinDuration(newRetirementDate, *lcidWithUpdatedRetirementDate.LifecycleRetiresAt, 1*time.Microsecond)

		// should create action
		allActionsForIntake, err := suite.testConfigs.Store.GetActionsByRequestID(suite.testConfigs.Context, lcidWithUpdatedRetirementDate.ID)
		suite.NoError(err)
		suite.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0] // GetActionsByRequestID() orders actions by .CreatedAt in descending order, so most recent action is first in the slice
		suite.EqualValues(lcidWithUpdatedRetirementDate.ID, *action.IntakeID)
		suite.EqualValues(models.ActionTypeCHANGELCIDRETIREMENTDATE, action.ActionType)
		suite.EqualValues(changeRetirementDateInput.AdditionalInfo, action.Feedback)

		// should create admin note (since input included it)
		allNotesForIntake, err := suite.testConfigs.Store.FetchNotesBySystemIntakeID(suite.testConfigs.Context, lcidWithUpdatedRetirementDate.ID)
		suite.NoError(err)
		suite.NotEmpty(allNotesForIntake)
		adminNote := allNotesForIntake[0] // should be the only admin note on the intake, since we didn't include one when issuing the LCID or originally retiring the LCID
		suite.EqualValues(changeRetirementDateInput.AdminNote, adminNote.Content)
	})
}
