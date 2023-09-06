package resolvers

import (
	"context"
	"fmt"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/graph/model"
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
		s.EqualValues(costBaseline, updatedIntakeLCID.LifecycleCostBaseline)

		// assert acion is created
		allActionsForIntake, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, updatedIntakeLCID.ID)
		s.NoError(err)
		s.NotEmpty(allActionsForIntake)
		action := allActionsForIntake[0]
		s.EqualValues(updatedIntakeLCID.ID, *action.IntakeID)
		s.EqualValues(models.ActionTypeUPDATELCID, action.ActionType)
		s.EqualValues(additionalInfo, *action.Feedback)

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
			s.EqualValues(costBaseline, secondUpdateIntake.LifecycleCostBaseline) // This should not be updated since it wasn't included

			allActionsForIntake2, err := s.testConfigs.Store.GetActionsByRequestID(s.testConfigs.Context, secondUpdateIntake.ID)
			s.NoError(err)
			s.NotEmpty(allActionsForIntake2)
			action := allActionsForIntake2[1] //should be the second action
			s.EqualValues(secondUpdateIntake.ID, *action.IntakeID)
			s.EqualValues(models.ActionTypeUPDATELCID, action.ActionType)
			s.EqualValues(additionalInfoUpdate, *action.Feedback)

			//There should be one admin note
			allNotesForIntake2, err := s.testConfigs.Store.FetchNotesBySystemIntakeID(s.testConfigs.Context, secondUpdateIntake.ID)
			s.NoError(err)
			s.NotEmpty(allNotesForIntake2)
			note := allNotesForIntake2[0]
			s.EqualValues(&adminNote, note.Content)
		})

		// assert admin note is created
	})

}
