package models

import (
	"github.com/guregu/null/zero"
)

// CedarURL represents a single URL object returned from the CEDAR API
type CedarURL struct {
	// always-present field
	ID string

	// possibly-null fields
	Address                        zero.String // the actual URL
	IsBehindWebApplicationFirewall zero.Bool
	IsAPIEndpoint                  zero.Bool
	IsVersionCodeRepository        zero.Bool   // does this URL provide access to a versioned code repository?
	URLHostingEnv                  zero.String // should correspond with .DeploymentType on a CedarDeployment object
}
