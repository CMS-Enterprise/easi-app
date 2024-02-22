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

func makeSystemIntakeAndIssueLCID(
	requestName string,
	intakeID *uuid.UUID,
	requesterEUA string,
	logger *zap.Logger,
	store *storage.Store,
	lcidExpirationDate time.Time,
) *models.SystemIntake {
	pastMeetingDate := time.Now().AddDate(0, -1, 0)
	var intake *models.SystemIntake
	// business cases require EUA ID to be set in DB constraint
	if requesterEUA == "" {
		intake = makeSystemIntakeAndProgressToStep(
			requestName,
			intakeID,
			requesterEUA,
			logger,
			store,
			model.SystemIntakeStepToProgressToDraftBusinessCase,
			nil,
		)
	} else {
		intake = makeSystemIntakeAndProgressToStep(
			requestName,
			intakeID,
			requesterEUA,
			logger,
			store,
			model.SystemIntakeStepToProgressToGrbMeeting,
			&progressOptions{
				completeOtherSteps: true,
				meetingDate:        &pastMeetingDate,
			},
		)
	}
	intake = issueLCID(
		logger,
		store,
		intake,
		lcidExpirationDate,
		models.TRBFRNotRecommended,
	)
	return intake
}

// There is a limit on how many LCIDs can be issued in a day
// Instead of generating them, we pass in faked LCIDs
var lcidToIssue = 0

func issueLCID(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	expiresAt time.Time,
	trbFollowUp models.SystemIntakeTRBFollowUp,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	scope := models.HTML("scope for this lcid")
	nextSteps := models.HTML("next steps for this intake")
	costBaseline := "cost baseline for this request"
	additionalInfo := models.HTML("additional info about issuing this LCID")
	adminNote := models.HTML("admin note about issuing this LCID")

	lcidToIssue++
	// The %06d adds leading 0s to the fake LCID so it's 6 digits
	lcidStr := fmt.Sprintf("%06d", lcidToIssue)
	input := model.SystemIntakeIssueLCIDInput{
		SystemIntakeID: intake.ID,
		Lcid:           &lcidStr,
		Scope:          scope,
		NextSteps:      nextSteps,
		ExpiresAt:      expiresAt,
		TrbFollowUp:    trbFollowUp,
		CostBaseline:   &costBaseline,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.IssueLCID(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func updateLCID(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	expiresAt time.Time,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	scope := models.HTML("scope for this lcid")
	nextSteps := models.HTML("next steps for this intake")
	costBaseline := "cost baseline for this request"
	additionalInfo := models.HTML("additional info about updating this LCID")
	adminNote := models.HTML("admin note about updating this LCID")

	input := model.SystemIntakeUpdateLCIDInput{
		SystemIntakeID: intake.ID,
		Scope:          &scope,
		NextSteps:      &nextSteps,
		ExpiresAt:      &expiresAt,
		CostBaseline:   &costBaseline,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.UpdateLCID(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func confirmLCID(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	expiresAt time.Time,
	trbFollowUp models.SystemIntakeTRBFollowUp,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	scope := models.HTML("scope for this lcid")
	nextSteps := models.HTML("next steps for this intake")
	costBaseline := "cost baseline for this request"
	additionalInfo := models.HTML("additional info about confirming this LCID")
	adminNote := models.HTML("admin note about confirming this LCID")

	input := model.SystemIntakeConfirmLCIDInput{
		SystemIntakeID: intake.ID,
		Scope:          scope,
		NextSteps:      nextSteps,
		ExpiresAt:      expiresAt,
		TrbFollowUp:    trbFollowUp,
		CostBaseline:   &costBaseline,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.ConfirmLCID(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func expireLCID(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	reason := models.HTML("reason for expiring this LCID")
	nextSteps := models.HTML("next steps for this intake")
	additionalInfo := models.HTML("additional info about expiring this LCID")
	adminNote := models.HTML("admin note about expiring this LCID")

	input := model.SystemIntakeExpireLCIDInput{
		SystemIntakeID: intake.ID,
		Reason:         reason,
		NextSteps:      &nextSteps,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.ExpireLCID(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func retireLCID(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	retiresAt time.Time,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	reason := models.HTML("reason for retiring this LCID")
	additionalInfo := models.HTML("additional info about retiring this LCID")
	adminNote := models.HTML("admin note about retiring this LCID")

	input := model.SystemIntakeRetireLCIDInput{
		SystemIntakeID: intake.ID,
		Reason:         &reason,
		RetiresAt:      retiresAt,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.RetireLCID(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func changeLCIDRetireDate(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	retiresAt time.Time,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	additionalInfo := models.HTML("additional info about retiring this LCID")
	adminNote := models.HTML("admin note about retiring this LCID")

	input := model.SystemIntakeChangeLCIDRetirementDateInput{
		SystemIntakeID: intake.ID,
		RetiresAt:      retiresAt,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.ChangeLCIDRetirementDate(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func closeIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	reason := models.HTML("reason for closing this intake")
	additionalInfo := models.HTML("additional info about closing this request")
	adminNote := models.HTML("admin note about closing this intake")

	input := model.SystemIntakeCloseRequestInput{
		SystemIntakeID: intake.ID,
		Reason:         &reason,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.CreateSystemIntakeActionCloseRequest(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func reopenIntake(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	reason := models.HTML("reason for reopening this intake")
	additionalInfo := models.HTML("additional info about reopening this request")
	adminNote := models.HTML("admin note about reopening this intake")

	input := model.SystemIntakeReopenRequestInput{
		SystemIntakeID: intake.ID,
		Reason:         &reason,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.CreateSystemIntakeActionReopenRequest(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func closeIntakeNotApproved(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
	trbFollowUp models.SystemIntakeTRBFollowUp,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	reason := models.HTML("reason for rejecting this intake")
	nextSteps := models.HTML("next steps for this rejected intake")
	additionalInfo := models.HTML("additional info about rejecting this request")
	adminNote := models.HTML("admin note about rejecting this intake")

	input := model.SystemIntakeRejectIntakeInput{
		SystemIntakeID: intake.ID,
		Reason:         reason,
		NextSteps:      nextSteps,
		TrbFollowUp:    trbFollowUp,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.RejectIntakeAsNotApproved(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}

func closeIntakeNotITGovRequest(
	logger *zap.Logger,
	store *storage.Store,
	intake *models.SystemIntake,
) *models.SystemIntake {
	ctx := mock.CtxWithLoggerAndPrincipal(logger, store, mock.PrincipalUser)

	reason := models.HTML("reason for rejecting this intake")
	additionalInfo := models.HTML("additional info about rejecting this request")
	adminNote := models.HTML("admin note about rejecting this intake")

	input := model.SystemIntakeNotITGovReqInput{
		SystemIntakeID: intake.ID,
		Reason:         &reason,
		AdditionalInfo: &additionalInfo,
		AdminNote:      &adminNote,
	}

	intake, err := resolvers.CreateSystemIntakeActionNotITGovRequest(ctx, store, nil, mock.FetchUserInfoMock, input)
	if err != nil {
		panic(err)
	}
	return intake
}
