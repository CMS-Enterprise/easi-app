package cedartestconfigs

import (
	"context"

	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func GetCedarMockClient(ctx context.Context) *cedarcore.Client {
	return cedarcore.NewClient(ctx, "", "", "", true, true)
}

func StubGetCedarSystems(ctx context.Context) ([]*models.CedarSystem, error) {
	mockClient := GetCedarMockClient(ctx)
	return mockClient.GetSystemSummary(ctx)
}
