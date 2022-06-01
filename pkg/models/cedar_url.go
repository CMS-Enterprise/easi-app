package models

// CedarURL represents a single URL object returned from the CEDAR API
type CedarURL struct {
	// always-present field
	ID string

	// possibly-null fields

	Address                        string // The actual URL.
	IsBehindWebApplicationFirewall bool
	IsAPIEndpoint                  bool
	IsVersionCodeRepository        bool   // Represents whether this URL provides access to a versioned code repository.
	URLHostingEnv                  string // This should correspond with .DeploymentType on a CedarDeployment object.
}
