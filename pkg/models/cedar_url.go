package models

// CedarURL represents a single URL object returned from the CEDAR API
type CedarURL struct {
	// always-present field
	ID string

	// possibly-null fields
	Address                        string // the actual URL
	IsBehindWebApplicationFirewall bool
	IsAPIEndpoint                  bool
	IsVersionCodeRepository        bool   // does this URL provide access to a versioned code repository?
	URLHostingEnv                  string // should correspond with .DeploymentType on a CedarDeployment object
}
