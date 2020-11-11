package local

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// EasiClient mocks the CEDAR Easi client for local/test use
type EasiClient struct{}

// FetchSystems fetches a system list from CEDAR
func (c EasiClient) FetchSystems(_ context.Context) (models.SystemShorts, error) {
	system1 := models.SystemShort{Acronym: "CHSE", Name: "Cheese"}
	system2 := models.SystemShort{Acronym: "PPRN", Name: "Pepperoni"}
	system3 := models.SystemShort{Acronym: "MTLV", Name: "Meat Lovers"}

	return models.SystemShorts{system1, system2, system3}, nil
}

// ValidateAndSubmitSystemIntake submits a system intake to CEDAR
func (c EasiClient) ValidateAndSubmitSystemIntake(_ context.Context, intake *models.SystemIntake) (string, error) {
	return "000-000-0", nil
}
