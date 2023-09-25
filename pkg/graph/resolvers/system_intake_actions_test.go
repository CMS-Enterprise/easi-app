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
				s.testConfigs.EmailClient,
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
					AdminNote:      &adminNotes,
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
				adminNote := models.HTMLPointer("apple")
				actionedIntake, err := CreateSystemIntakeActionRequestEdits(
					ctx,
					s.testConfigs.Store,
					s.testConfigs.EmailClient,
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
						AdminNote:      adminNote,
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
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
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
				AdminNote:      adminNote,
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
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
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
				AdminNote:      adminNote,
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
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionRequestEdits(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
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
				AdminNote:      adminNote,
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
			s.testConfigs.EmailClient,
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
				AdminNote:      nil,
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

func (s *ResolverSuite) TestSystemIntakeCloseRequestAction() {
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
		s.Run(fmt.Sprintf("Should close request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateOPEN,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			s.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			actionedIntake, err := CreateSystemIntakeActionCloseRequest(
				ctx,
				s.testConfigs.Store,
				s.testConfigs.EmailClient,
				s.fetchUserInfoStub,
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
			s.NoError(err)
			// ensure correct intake was edited
			s.Equal(intake.ID, actionedIntake.ID)
			// Intake should now be closed
			s.Equal(models.SystemIntakeStateCLOSED, actionedIntake.State)
			// Step and Decision State should be unaffected
			s.Equal(intake.Step, actionedIntake.Step)
			s.Equal(intake.DecisionState, actionedIntake.DecisionState)
		})
	}
	for _, formStep := range formSteps {
		s.Run(fmt.Sprintf("Should error on closed request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateCLOSED,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			s.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			_, err = CreateSystemIntakeActionCloseRequest(
				ctx,
				s.testConfigs.Store,
				s.testConfigs.EmailClient,
				s.fetchUserInfoStub,
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
			s.Error(err)
			// ensure intake is still closed and unaffected
			fetchedIntake, err := s.testConfigs.Store.FetchSystemIntakeByID(ctx, intake.ID)
			s.NoError(err)
			s.Equal(fetchedIntake.State, models.SystemIntakeStateCLOSED)
		})
	}
	s.Run("Should create action", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateOPEN,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
			s.fetchUserInfoStub,
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
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
			s.fetchUserInfoStub,
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
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
			s.fetchUserInfoStub,
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
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		s.NoError(err)
		s.Len(allNotes, 0)
	})
}

func (s *ResolverSuite) TestSystemIntakeReopenRequestAction() {
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
		s.Run(fmt.Sprintf("Should reopen request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateCLOSED,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			s.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			actionedIntake, err := CreateSystemIntakeActionReopenRequest(
				ctx,
				s.testConfigs.Store,
				s.testConfigs.EmailClient,
				s.fetchUserInfoStub,
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
			s.NoError(err)
			// ensure correct intake was edited
			s.Equal(intake.ID, actionedIntake.ID)
			// Intake should now be open
			s.Equal(actionedIntake.State, models.SystemIntakeStateOPEN)
			// Step and Decision State should be unaffected
			s.Equal(intake.Step, actionedIntake.Step)
			s.Equal(intake.DecisionState, actionedIntake.DecisionState)
		})
	}
	for _, formStep := range formSteps {
		s.Run(fmt.Sprintf("Should error on open request when in %s step", formStep), func() {
			intakeToCreate := &models.SystemIntake{
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
				RequestType: models.SystemIntakeRequestTypeNEW,
				Step:        formStep,
				State:       models.SystemIntakeStateOPEN,
			}
			// If in the decision step, an intake should always have a decision
			if formStep == models.SystemIntakeStepDECISION {
				intakeToCreate.DecisionState = models.SIDSLcidIssued
			}
			intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
			s.NoError(err)
			additionalInfo := models.HTMLPointer("banana")
			adminNote := models.HTMLPointer("apple")
			_, err = CreateSystemIntakeActionReopenRequest(
				ctx,
				s.testConfigs.Store,
				s.testConfigs.EmailClient,
				s.fetchUserInfoStub,
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
			s.Error(err)
			// ensure intake is still closed and unaffected
			fetchedIntake, err := s.testConfigs.Store.FetchSystemIntakeByID(ctx, intake.ID)
			s.NoError(err)
			s.Equal(models.SystemIntakeStateOPEN, fetchedIntake.State)
		})
	}
	s.Run("Should create action", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
			s.fetchUserInfoStub,
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
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
			s.fetchUserInfoStub,
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
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			s.testConfigs.Store,
			s.testConfigs.EmailClient,
			s.fetchUserInfoStub,
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
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		s.NoError(err)
		s.Len(allNotes, 0)
	})
}

func (s *ResolverSuite) TestSystemIntakeNotITGovRequestAction() {
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
		models.SystemIntakeStateCLOSED,
		models.SystemIntakeStateOPEN,
	}
	for _, formStep := range formSteps {
		for _, formState := range formStates {
			s.Run(fmt.Sprintf("Should issue decision on %s request in %s step", formState, formStep), func() {
				intakeToCreate := &models.SystemIntake{
					Status:      models.SystemIntakeStatusINTAKEDRAFT,
					RequestType: models.SystemIntakeRequestTypeNEW,
					Step:        formStep,
					State:       formState,
				}
				// If in the decision step, an intake should always have a decision
				if formStep == models.SystemIntakeStepDECISION {
					intakeToCreate.DecisionState = models.SIDSLcidIssued
				}
				intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, intakeToCreate)
				s.NoError(err)
				additionalInfo := models.HTMLPointer("banana")
				adminNote := models.HTMLPointer("apple")
				actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
					ctx,
					s.testConfigs.Store,
					s.fetchUserInfoStub,
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
				s.NoError(err)
				// ensure correct intake was edited
				s.Equal(intake.ID, actionedIntake.ID)
				// Intake should now be closed
				s.Equal(actionedIntake.State, models.SystemIntakeStateCLOSED)
				// Step should be decision
				s.Equal(models.SystemIntakeStepDECISION, actionedIntake.Step)
				// Decision state should be NOT_GOVERNANCE
				s.Equal(models.SIDSNotGovernance, actionedIntake.DecisionState)
			})
		}
	}
	s.Run("Should create action", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allActions, err := s.testConfigs.Store.GetActionsByRequestID(ctx, actionedIntake.ID)
		s.NoError(err)
		createdAction := allActions[0]
		s.Equal(additionalInfo, createdAction.Feedback)
		s.Equal(models.SystemIntakeStepDECISION, *createdAction.Step)
	})
	s.Run("Should create admin note given input", func() {
		intake, err := s.testConfigs.Store.CreateSystemIntake(ctx, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNote := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionNotITGovRequest(
			ctx,
			s.testConfigs.Store,
			s.fetchUserInfoStub,
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
		s.NoError(err)
		s.Equal(intake.ID, actionedIntake.ID)
		allNotes, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(ctx, actionedIntake.ID)
		s.NoError(err)
		s.Len(allNotes, 0)
	})
}

func (s *ResolverSuite) TestSystemIntakeUpdateLCID() {

	s.Run("Can't update an LCID that wasn't issued", func() {
		intakeNoLCID, err := s.testConfigs.Store.CreateSystemIntake(s.testConfigs.Context, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		_, err2 := UpdateLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, model.SystemIntakeUpdateLCIDInput{
			SystemIntakeID: intakeNoLCID.ID,
		})
		s.Error(err2)

	})

	s.Run("Can update an LCID that was issued", func() {
		intakeWLCID, err := s.testConfigs.Store.CreateSystemIntake(s.testConfigs.Context, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		intakeWLCID.LifecycleID = null.StringFrom("123456")
		_, err = s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, intakeWLCID)
		s.NoError(err)
		scope := models.HTMLPointer("A really great new scope")
		additionalInfo := models.HTMLPointer("My test info")
		costBaseline := "the original costBaseline"

		updatedIntakeLCID, err := UpdateLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, model.SystemIntakeUpdateLCIDInput{
			SystemIntakeID: intakeWLCID.ID,
			Scope:          scope,
			AdditionalInfo: additionalInfo,
			CostBaseline:   &costBaseline,
		})
		s.NoError(err)
		s.EqualValues(scope, updatedIntakeLCID.LifecycleScope)
		s.EqualValues(null.StringFrom(costBaseline), updatedIntakeLCID.LifecycleCostBaseline)

		// assert acion is created
		allActionsForIntake, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, updatedIntakeLCID.ID)
		s.NoError(err)
		s.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		s.EqualValues(updatedIntakeLCID.ID, *action.IntakeID)
		s.EqualValues(models.ActionTypeUPDATELCID, action.ActionType)
		s.EqualValues(additionalInfo, action.Feedback)

		//assert there is not an admin note since not included
		allNotesForIntake, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, updatedIntakeLCID.ID)
		s.NoError(err)
		s.Empty(allNotesForIntake)

		s.Run("Can update an already updated LCID", func() {
			adminNote := models.HTML("test admin note for updating LCID")

			updatedScope := models.HTMLPointer("A really great new scope")
			additionalInfoUpdate := models.HTMLPointer("My feedback for second update")
			secondUpdateIntake, err := UpdateLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, model.SystemIntakeUpdateLCIDInput{
				SystemIntakeID: updatedIntakeLCID.ID,
				Scope:          updatedScope,
				AdditionalInfo: additionalInfoUpdate,
				AdminNote:      &adminNote,
			})
			s.NoError(err)
			s.EqualValues(updatedScope, secondUpdateIntake.LifecycleScope)
			s.EqualValues(null.StringFrom(costBaseline), secondUpdateIntake.LifecycleCostBaseline) // This should not be updated since it wasn't included

			allActionsForIntake2, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, secondUpdateIntake.ID)
			s.NoError(err)
			s.NotEmpty(allActionsForIntake2)
			action := allActionsForIntake2[0] //The first action is the most recent
			s.EqualValues(secondUpdateIntake.ID, *action.IntakeID)
			s.EqualValues(models.ActionTypeUPDATELCID, action.ActionType)
			s.EqualValues(additionalInfoUpdate, action.Feedback)

			//There should be one admin note
			allNotesForIntake2, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, secondUpdateIntake.ID)
			s.NoError(err)
			s.NotEmpty(allNotesForIntake2)
			note := allNotesForIntake2[0]
			s.EqualValues(&adminNote, note.Content)
		})

	})

}

func (s *ResolverSuite) TestSystemIntakeConfirmLCID() {

	s.Run("Can't confirm an LCID that wasn't issued", func() {
		intakeNoLCID, err := s.testConfigs.Store.CreateSystemIntake(s.testConfigs.Context, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		_, err2 := ConfirmLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, model.SystemIntakeConfirmLCIDInput{
			SystemIntakeID: intakeNoLCID.ID,
		})
		s.Error(err2)

	})

	s.Run("Can confirm an LCID that was issued", func() {
		intakeWLCID, err := s.testConfigs.Store.CreateSystemIntake(s.testConfigs.Context, &models.SystemIntake{
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Step:        models.SystemIntakeStepINITIALFORM,
		})
		s.NoError(err)
		intakeWLCID.LifecycleID = null.StringFrom("123456")
		_, err = s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, intakeWLCID)
		s.NoError(err)
		scope := models.HTML("A really great new scope")
		additionalInfo := models.HTMLPointer("My test info")
		costBaseline := "the original costBaseline"
		expiresAt := time.Now()
		nextSteps := models.HTML("My next steps")
		trbFollowUp := models.TRBFRNotRecommended

		confirmedIntakeLCID, err := ConfirmLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, model.SystemIntakeConfirmLCIDInput{
			SystemIntakeID: intakeWLCID.ID,
			ExpiresAt:      expiresAt,
			Scope:          scope,
			NextSteps:      nextSteps,
			TrbFollowUp:    trbFollowUp,
			AdditionalInfo: additionalInfo,
			CostBaseline:   &costBaseline,
		})
		s.NoError(err)
		s.EqualValues(&scope, confirmedIntakeLCID.LifecycleScope)
		s.EqualValues(null.StringFrom(costBaseline), confirmedIntakeLCID.LifecycleCostBaseline)

		// assert acion is created
		allActionsForIntake, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, confirmedIntakeLCID.ID)
		s.NoError(err)
		s.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		s.EqualValues(confirmedIntakeLCID.ID, *action.IntakeID)
		s.EqualValues(models.ActionTypeCONFIRMLCID, action.ActionType)
		s.EqualValues(additionalInfo, action.Feedback)

		//assert there is not an admin note since not included
		allNotesForIntake, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, confirmedIntakeLCID.ID)
		s.NoError(err)
		s.Empty(allNotesForIntake)

		s.Run("Can confirm an already confirmd LCID", func() {
			adminNote := models.HTML("test admin note for updating LCID")

			confirmedScope := models.HTML("A really great new scope")
			additionalInfoconfirm := models.HTMLPointer("My feedback for second confirm")
			expiresAt := time.Now()
			nextSteps := models.HTML("My next steps")
			trbFollowUp := models.TRBFRNotRecommended

			secondconfirmIntake, err := ConfirmLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, model.SystemIntakeConfirmLCIDInput{
				SystemIntakeID: confirmedIntakeLCID.ID,
				ExpiresAt:      expiresAt,
				Scope:          confirmedScope,
				NextSteps:      nextSteps,
				TrbFollowUp:    trbFollowUp,
				AdditionalInfo: additionalInfoconfirm,
				AdminNote:      &adminNote,
			})
			s.NoError(err)
			s.EqualValues(&confirmedScope, secondconfirmIntake.LifecycleScope)
			s.EqualValues(null.StringFrom(costBaseline), secondconfirmIntake.LifecycleCostBaseline) // This should not be confirmd since it wasn't included

			allActionsForIntake2, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, secondconfirmIntake.ID)
			s.NoError(err)
			s.NotEmpty(allActionsForIntake2)
			action := allActionsForIntake2[0] //The first action is the most recent
			s.EqualValues(secondconfirmIntake.ID, *action.IntakeID)
			s.EqualValues(models.ActionTypeCONFIRMLCID, action.ActionType)
			s.EqualValues(additionalInfoconfirm, action.Feedback)

			//There should be one admin note
			allNotesForIntake2, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, secondconfirmIntake.ID)
			s.NoError(err)
			s.NotEmpty(allNotesForIntake2)
			note := allNotesForIntake2[0]
			s.EqualValues(&adminNote, note.Content)
		})
	})
}

func (s *ResolverSuite) TestExpireLCID() {
	s.Run("Expiring an LCID on an intake with an LCID issued sets it to expired, sets the correct fields, creates an action, and creates an admin note", func() {
		currentTime := time.Now()

		// create an intake, issue an LCID for it with an expiration date in the future
		newIntake := s.createNewIntake()
		issueLCIDInput := model.SystemIntakeIssueLCIDInput{
			// required fields
			SystemIntakeID: newIntake.ID,
			ExpiresAt:      currentTime.AddDate(2, 0, 0),
			Scope:          "test scope",
			NextSteps:      "test next steps after issuing LCID, before expiring",
			TrbFollowUp:    models.TRBFRStronglyRecommended,
		}
		updatedIntake, err := IssueLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, issueLCIDInput)
		s.NoError(err)

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

		expiredIntake, err := ExpireLCID(s.testConfigs.Context, s.testConfigs.Store, s.fetchUserInfoStub, expireLCIDInput)
		s.NoError(err)

		// check calculated LCID
		lcidStatus := CalculateSystemIntakeLCIDStatus(expiredIntake, currentTime)
		s.EqualValues(model.SystemIntakeLCIDStatusExpired, *lcidStatus)

		// check decision next steps from input
		s.EqualValues(expireLCIDInput.NextSteps, expiredIntake.DecisionNextSteps)

		// check expiration date - should be set to today (UTC) at midnight
		expectedExpirationDate := time.Date(currentTime.UTC().Year(), currentTime.UTC().Month(), currentTime.UTC().Day(), 0, 0, 0, 0, time.UTC)

		// EqualValues() works here because we know expectedExpirationDate is UTC, and calling .UTC() on updatedIntake.LifecycleExpiresAt will return a UTC time
		s.EqualValues(expectedExpirationDate, expiredIntake.LifecycleExpiresAt.UTC())

		// should create action
		allActionsForIntake, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, expiredIntake.ID)
		s.NoError(err)
		s.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0] // GetActionsByRequestID() orders actions by .CreatedAt in descending order, so most recent action is first in the slice
		s.EqualValues(expiredIntake.ID, *action.IntakeID)
		s.EqualValues(models.ActionTypeEXPIRELCID, action.ActionType)
		s.EqualValues(expireLCIDInput.AdditionalInfo, action.Feedback)
		s.EqualValues(models.SystemIntakeStepDECISION, *action.Step)

		// should create admin note (since input included it)
		allNotesForIntake, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, updatedIntake.ID)
		s.NoError(err)
		s.NotEmpty(allNotesForIntake)
		adminNote := allNotesForIntake[0] // should be the only admin note on the intake, since we didn't include one when issuing the LCID
		s.EqualValues(expireLCIDInput.AdminNote, adminNote.Content)
	})
}
