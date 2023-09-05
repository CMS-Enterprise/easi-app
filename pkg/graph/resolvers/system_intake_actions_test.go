package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/lcidactions"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakeRequestEditsAction() {
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
		s.Run(fmt.Sprintf("Should error targetting %s step", invalidStep), func() {
			intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        models.SystemIntakeStepINITIALFORM,
			})
			s.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNotes := models.HTML("apple")
			_, err = CreateSystemIntakeActionRequestEdits(
				ctx,
				s.testConfigs.Store,
				s.fetchUserInfoStub,
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
					AdminNotes:     &adminNotes,
				},
			)
			s.Error(err)
		})
	}
	for _, initialStep := range initialSteps {
		for _, step := range model.AllSystemIntakeFormStep {
			s.Run(fmt.Sprintf("Should set state and %s step as active when in %s step", step, initialStep), func() {
				intakeToCreate := &models.SystemIntake{
					Status:      models.SystemIntakeStatusINTAKEDRAFT,
					RequestType: models.SystemIntakeRequestTypeNEW,
					Step:        initialStep,
				}
				if initialStep == models.SystemIntakeStepDECISION {
					intakeToCreate.DecisionState = models.SIDSLcidIssued
				}
				intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
				s.NoError(err)
				additionalInfo := models.HTMLPointer("banana")
				adminNotes := models.HTMLPointer("apple")
				actionedIntake, err := CreateSystemIntakeActionRequestEdits(
					ctx,
					s.testConfigs.Store,
					s.fetchUserInfoStub,
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
						AdminNotes:     adminNotes,
					},
				)
				s.NoError(err)
				// ensure correct intake was edited
				s.Equal(intake.ID, actionedIntake.ID)
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
				s.Equal(models.SIRFSEditsRequested, stepState)
				// test that step is changed to requested step
				s.Equal(formStepMap[step], actionedIntake.Step)
			})
		}
	}
	// test that feedback is created
	s.Run("Should create feedback", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNotes := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
				AdminNotes:     adminNotes,
			},
		)
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allFeedback, err := s.testConfigs.Store.GetGovernanceRequestFeedbacksByIntakeID(ctx, actionedIntake.ID)
		s.NoError(err)
		createdFeedback := allFeedback[0]
		s.Equal(models.HTML("meatloaf"), createdFeedback.Feedback)
	})
	s.Run("Should create action", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNotes := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
				AdminNotes:     adminNotes,
			},
		)
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allActions, err := s.testConfigs.Store.GetActionsByRequestID(ctx, actionedIntake.ID)
		s.NoError(err)
		createdAction := allActions[0]
		s.Equal(additionalInfo, createdAction.Feedback)
		s.Equal(models.SystemIntakeStepINITIALFORM, *createdAction.Step)
	})
	s.Run("Should create admin note given input", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNotes := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
				AdminNotes:     adminNotes,
			},
		)
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		s.NoError(err)
		createdNote := allNotes[0]
		s.Equal(models.HTMLPointer("apple"), createdNote.Content)
	})
	s.Run("Should NOT create admin note without input", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
				AdminNotes:     nil,
			},
		)
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		s.NoError(err)
		s.Len(allNotes, 0)
	})
}

// this is a ResolverSuite method in this file instead of issue_lcid_test.go because it's not a pure unit test;
// it requires a store to call store.GenerateLifecycleID()
func (s *ResolverSuite) TestGenerateNewLCID() {
	s.Run("Should return existing LCID if one is provided", func() {
		providedLCID := "220181"

		generatedLCID, err := lcidactions.GenerateNewLCID(s.testConfigs.Context, s.testConfigs.Store, &providedLCID)

		s.NoError(err)
		s.Equal(providedLCID, generatedLCID)
	})

	s.Run("Should generate new LCID if nil is passed", func() {
		providedLCID := (*string)(nil)

		generatedLCID, err := lcidactions.GenerateNewLCID(s.testConfigs.Context, s.testConfigs.Store, providedLCID)

		s.NoError(err)
		s.NotEmpty(generatedLCID)
	})

	s.Run("Should generate new LCID if empty string is passed", func() {
		providedLCID := ""

		generatedLCID, err := lcidactions.GenerateNewLCID(s.testConfigs.Context, s.testConfigs.Store, &providedLCID)

		s.NoError(err)
		s.NotEmpty(generatedLCID)
	})
}

func (s *ResolverSuite) TestRejectIntakeAsNotApproved() {
	newIntake := s.createNewIntake()

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

	updatedIntake, err := RejectIntakeAsNotApproved(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, input)
	s.NoError(err)

	// check workflow state
	s.EqualValues(models.SystemIntakeStepDECISION, updatedIntake.Step)
	s.EqualValues(models.SystemIntakeStateCLOSED, updatedIntake.State)
	s.EqualValues(models.SIDSNotApproved, updatedIntake.DecisionState)

	// check fields from input
	s.EqualValues(input.Reason, *updatedIntake.RejectionReason)
	s.EqualValues(input.NextSteps, *updatedIntake.DecisionNextSteps)
	s.EqualValues(input.TrbFollowUp, *updatedIntake.TRBFollowUpRecommendation)

	// should create action
	allActionsForIntake, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, updatedIntake.ID)
	s.NoError(err)
	s.NotEmpty(allActionsForIntake)
	action := allActionsForIntake[0]
	s.EqualValues(updatedIntake.ID, *action.IntakeID)
	s.EqualValues(models.ActionTypeREJECT, action.ActionType)
	s.EqualValues(additionalInfo, *action.Feedback)
	s.EqualValues(models.SystemIntakeStepDECISION, *action.Step)

	// should create admin note (since input included it)
	allNotesForIntake, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, updatedIntake.ID)
	s.NoError(err)
	s.NotEmpty(allNotesForIntake)
	s.EqualValues(adminNote, *allNotesForIntake[0].Content)

	// check that rejecting the same intake twice is valid
	input.Reason = "further rejection testing"
	_, err = RejectIntakeAsNotApproved(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, input)
	s.NoError(err)
}

func (s *ResolverSuite) TestIssueLCID() {
	s.Run("When LCID is provided, that LCID is set on the intake", func() {
		newIntake := s.createNewIntake()

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

		updatedIntake, err := IssueLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, input)
		s.NoError(err)

		s.EqualValues(providedLCID, updatedIntake.LifecycleID.ValueOrZero())
	})

	s.Run("When LCID is *not* provided, a new LCID is generated", func() {
		newIntake := s.createNewIntake()

		input := model.SystemIntakeIssueLCIDInput{
			Lcid: nil,

			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      time.Now().AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}

		updatedIntake, err := IssueLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, input)
		s.NoError(err)

		s.NotEmpty(updatedIntake.LifecycleID.ValueOrZero())
	})

	s.Run("Issuing an LCID sets the correct fields, creates an action, and disallows further issuing on the intake", func() {
		newIntake := s.createNewIntake()

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

		updatedIntake, err := IssueLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, input)
		s.NoError(err)

		// check workflow state
		s.EqualValues(models.SystemIntakeStepDECISION, updatedIntake.Step)
		s.EqualValues(models.SystemIntakeStateCLOSED, updatedIntake.State)
		s.EqualValues(models.SIDSLcidIssued, updatedIntake.DecisionState)

		// check fields from input
		s.EqualValues(input.Scope, *updatedIntake.LifecycleScope)
		s.EqualValues(input.NextSteps, *updatedIntake.DecisionNextSteps)
		s.EqualValues(input.TrbFollowUp, *updatedIntake.TRBFollowUpRecommendation)
		s.EqualValues(*input.CostBaseline, updatedIntake.LifecycleCostBaseline.ValueOrZero())

		// expiration date requires some special test code;
		// - EqualValues() doesn't necessarily work, because the timezones might be different
		// - using the .Equal() method from time.Time doesn't work, because input.ExpiresAt has more precision than updatedIntake.LifecycleExpiresAt
		// - using EqualValues() with input.ExpiresAt.Date() and updatedIntake.LifecycleExpiresAt.Date() doesn't work, because those functions both return triples
		// we just care about the date, so check that, and check year/month/day individually
		s.EqualValues(input.ExpiresAt.Year(), updatedIntake.LifecycleExpiresAt.Year())
		s.EqualValues(input.ExpiresAt.Month(), updatedIntake.LifecycleExpiresAt.Month())
		s.EqualValues(input.ExpiresAt.Day(), updatedIntake.LifecycleExpiresAt.Day())

		// should create action
		allActionsForIntake, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, updatedIntake.ID)
		s.NoError(err)
		s.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		s.EqualValues(updatedIntake.ID, *action.IntakeID)
		s.EqualValues(models.ActionTypeISSUELCID, action.ActionType)
		s.EqualValues(additionalInfo, *action.Feedback)
		s.EqualValues(models.SystemIntakeStepDECISION, *action.Step)

		// should create admin note (since input included it)
		allNotesForIntake, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, updatedIntake.ID)
		s.NoError(err)
		s.NotEmpty(allNotesForIntake)
		s.EqualValues(adminNote, *allNotesForIntake[0].Content)

		// check that issuing an LCID twice is not valid
		input.NextSteps = "issuing again will work, right?" // input still refers to the same intake
		_, err = IssueLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, input)
		s.Error(err)
	})
}
