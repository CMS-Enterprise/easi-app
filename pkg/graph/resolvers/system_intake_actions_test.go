package resolvers

import (
	"context"
	"fmt"

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
			adminNotes := models.HTMLPointer("apple")
			actionedIntake, err := CreateSystemIntakeActionCloseRequest(
				ctx,
				s.testConfigs.Store,
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
					AdminNotes:     adminNotes,
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
			adminNotes := models.HTMLPointer("apple")
			_, err = CreateSystemIntakeActionCloseRequest(
				ctx,
				s.testConfigs.Store,
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
					AdminNotes:     adminNotes,
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
		adminNotes := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			s.testConfigs.Store,
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
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			s.testConfigs.Store,
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
		actionedIntake, err := CreateSystemIntakeActionCloseRequest(
			ctx,
			s.testConfigs.Store,
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
			adminNotes := models.HTMLPointer("apple")
			actionedIntake, err := CreateSystemIntakeActionReopenRequest(
				ctx,
				s.testConfigs.Store,
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
					AdminNotes:     adminNotes,
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
			adminNotes := models.HTMLPointer("apple")
			_, err = CreateSystemIntakeActionReopenRequest(
				ctx,
				s.testConfigs.Store,
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
					AdminNotes:     adminNotes,
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
		adminNotes := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			s.testConfigs.Store,
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
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		adminNotes := models.HTMLPointer("apple")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			s.testConfigs.Store,
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
			State:       models.SystemIntakeStateCLOSED,
		})
		s.NoError(err)
		additionalInfo := models.HTMLPointer("banana")
		actionedIntake, err := CreateSystemIntakeActionReopenRequest(
			ctx,
			s.testConfigs.Store,
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
				adminNotes := models.HTMLPointer("apple")
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
						AdminNotes:     adminNotes,
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
		adminNotes := models.HTMLPointer("apple")
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
				AdminNotes:     adminNotes,
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
		adminNotes := models.HTMLPointer("apple")
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
