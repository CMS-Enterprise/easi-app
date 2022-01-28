package models

// EASIBusinessSolution represents a business solution submitted through EASi
type EASIBusinessSolution struct {

	// acquisition approach
	// Required: true
	AcquisitionApproach *string `json:"acquisitionApproach"`

	// cons
	// Required: true
	Cons *string `json:"cons"`

	// cost savings
	// Required: true
	CostSavings *string `json:"costSavings"`

	// has UI
	// Required: true
	HasUI *string `json:"hasUI"`

	// hosting cloud service type
	// Required: true
	HostingCloudServiceType *string `json:"hostingCloudServiceType"`

	// hosting location
	// Required: true
	HostingLocation *string `json:"hostingLocation"`

	// hosting type
	// Required: true
	HostingType *string `json:"hostingType"`

	// pros
	// Required: true
	Pros *string `json:"pros"`

	// security is approved
	// Required: true
	// Enum: [ false true]
	SecurityIsApproved *string `json:"securityIsApproved"`

	// security is being reviewed
	// Required: true
	SecurityIsBeingReviewed *string `json:"securityIsBeingReviewed"`

	// solution type
	// Required: true
	// Enum: [preferred alternativeA alternativeB]
	SolutionType *string `json:"solutionType"`

	// summary
	// Required: true
	Summary *string `json:"summary"`

	// title
	// Required: true
	Title *string `json:"title"`
}
