package models

import (
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
)

// CedarURL represents a single URL object returned from the CEDAR API
type CedarURL struct {
	// always-present field
	ID string

	// possibly-null fields

	Address                        zero.String // The actual URL.
	IsBehindWebApplicationFirewall null.Bool
	IsAPIEndpoint                  null.Bool
	IsVersionCodeRepository        null.Bool   // Represents whether this URL provides access to a versioned code repository.
	URLHostingEnv                  zero.String // This should correspond with .DeploymentType on a CedarDeployment object.
}
