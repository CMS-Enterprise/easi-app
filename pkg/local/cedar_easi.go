package local

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewCedarEasiClient returns a fake CEDAR Easi Client
func NewCedarEasiClient(logger *zap.Logger) CedarEasiClient {
	return CedarEasiClient{logger: logger}
}

// CedarEasiClient mocks the CEDAR Easi client for local/test use
type CedarEasiClient struct {
	logger *zap.Logger
}

// FetchSystems fetches a system list from CEDAR
func (c CedarEasiClient) FetchSystems(_ context.Context) (models.SystemShorts, error) {
	system1 := models.SystemShort{Acronym: "CHSE", Name: "Cheese"}
	system2 := models.SystemShort{Acronym: "PPRN", Name: "Pepperoni"}
	system3 := models.SystemShort{Acronym: "MTLV", Name: "Meat Lovers"}

	c.logger.Info("Mock fetching System Shorts")
	return models.SystemShorts{system1, system2, system3}, nil
}

// ValidateAndSubmitSystemIntake submits a system intake to CEDAR
func (c CedarEasiClient) ValidateAndSubmitSystemIntake(_ context.Context, intake *models.SystemIntake) (string, error) {
	fakeAlfabetID := "000-000-0"
	c.logger.Info("Mock Submit System Intake to CEDAR",
		zap.String("intakeID", intake.ID.String()),
		zap.String("AlfabetID", fakeAlfabetID))
	return fakeAlfabetID, nil
}
