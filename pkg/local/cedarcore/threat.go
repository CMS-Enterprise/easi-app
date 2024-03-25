package cedarcoremock

import "github.com/cmsgov/easi-app/pkg/models"

var mockThreats = []*models.CedarThreat{}

func GetMockThreats() []*models.CedarThreat {
	return mockThreats
}
