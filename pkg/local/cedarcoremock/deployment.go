package cedarcoremock

import "github.com/cmsgov/easi-app/pkg/models"

var mockDeployments = []*models.CedarDeployment{}

func GetDeployments() []*models.CedarDeployment {
	return mockDeployments
}
