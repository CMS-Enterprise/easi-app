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
	// TODO - remove this commented block once I'm done
	/*
			// update workflow state
		intake.Step = models.SystemIntakeStepDECISION
		intake.State = models.SystemIntakeStateCLOSED
		intake.DecisionState = models.SIDSNotApproved

		// update other fields
		intake.RejectionReason = &input.Reason
		intake.DecisionNextSteps = &input.NextSteps
		intake.TRBFollowUpRecommendation = &input.TrbFollowUp
	*/

	// TODO - check workflow state (step, state, decision state)

	// TODO - check fields from input (rejection reason, next steps, TRB follow up)
	// don't need to check UpdatedAt - not deterministic

	// TODO - should create action

	// TODO - Should create admin note given input

	// TODO - Should NOT create admin note without input

	// TODO - check that rejecting the same intake twice is valid
}

func (s *ResolverSuite) TestIssueLCID() {
	// TODO - remove this commented block once I'm done
	/*
		// update workflow state
		intake.Step = models.SystemIntakeStepDECISION
		intake.State = models.SystemIntakeStateCLOSED
		intake.DecisionState = models.SIDSLcidIssued

		// update LCID-related fields
		intake.LifecycleID = null.StringFrom(newLCID)
		intake.LifecycleExpiresAt = &input.ExpiresAt
		intake.LifecycleScope = &input.Scope
		intake.DecisionNextSteps = &input.NextSteps
		intake.TRBFollowUpRecommendation = &input.TrbFollowUp
		intake.LifecycleCostBaseline = null.StringFromPtr(input.CostBaseline)

		// update other fields
		updatedTime := time.Now()
		intake.UpdatedAt = &updatedTime
	*/

	s.Run("When LCID is provided, that LCID is set on the intake", func() {
		newIntake := s.createNewIntake()

		providedLCID := "123456"

		input := model.SystemIntakeIssueLCIDInput{
			Lcid: &providedLCID,

			// set required fields
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

			// set required fields
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

	// TODO - check workflow state (step, state, decision state)

	// TODO - check fields from input (LifecycleExpiresAt, scope, next steps, TRB follow up, cost baseline)
	// don't need to check UpdatedAt - not deterministic

	// TODO - should create action

	// TODO - Should create admin note given input

	// TODO - Should NOT create admin note without input

	// TODO - check that issuing an LCID twice is *not* valid
}
