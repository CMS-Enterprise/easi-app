package models

import (
	"github.com/guregu/null/zero"
)

// CedarURL represents a single URL object returned from the CEDAR API
type CedarURL struct {
	// always-present field
	ID zero.String

	// possibly-null fields

	Address                        zero.String // The actual URL.
	IsBehindWebApplicationFirewall bool
	IsAPIEndpoint                  bool
	IsVersionCodeRepository        bool        // Represents whether this URL provides access to a versioned code repository.
	URLHostingEnv                  zero.String // This should correspond with .DeploymentType on a CedarDeployment object.
}
