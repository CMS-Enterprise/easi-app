package main

import (
	"context"
	"fmt"

	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/cmd/devdata/mock"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

var lcid = 0

func makeAccessibilityRequest(name string, store *storage.Store, callbacks ...func(*models.AccessibilityRequest)) *models.AccessibilityRequest {
	ctx := context.Background()

	lifecycleID := fmt.Sprintf("%06d", lcid)
	lcid = lcid + 1

	intake := models.SystemIntake{
		RequestType:            models.SystemIntakeRequestTypeNEW,
		ProjectName:            null.StringFrom(name),
		BusinessOwner:          null.StringFrom("Shane Clark"),
		BusinessOwnerComponent: null.StringFrom("OIT"),
		LifecycleID:            null.StringFrom(lifecycleID),
	}
	must(store.CreateSystemIntake(ctx, &intake))
	must(store.UpdateSystemIntake(ctx, &intake)) // required to set lifecycle id

	accessibilityRequest := models.AccessibilityRequest{
		Name:      fmt.Sprintf("%s v2", name),
		IntakeID:  &intake.ID,
		EUAUserID: mock.PrincipalUser,
	}
	for _, cb := range callbacks {
		cb(&accessibilityRequest)
	}
	must(store.CreateAccessibilityRequestAndInitialStatusRecord(ctx, &accessibilityRequest))
	return &accessibilityRequest
}

func makeTestDate(logger *zap.Logger, store *storage.Store, callbacks ...func(*models.TestDate)) {
	ctx := appcontext.WithLogger(context.Background(), logger)

	testDate := models.TestDate{}
	for _, cb := range callbacks {
		cb(&testDate)
	}

	must(store.CreateTestDate(ctx, &testDate))
}
