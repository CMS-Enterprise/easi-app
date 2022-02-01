package models

// EASIBusinessSolution represents a business solution submitted through EASi
type EASIBusinessSolution struct {
	AcquisitionApproach     string `json:"acquisitionApproach"`
	Cons                    string `json:"cons"`
	CostSavings             string `json:"costSavings"`
	HasUI                   string `json:"hasUI"`
	HostingCloudServiceType string `json:"hostingCloudServiceType"`
	HostingLocation         string `json:"hostingLocation"`
	HostingType             string `json:"hostingType"`
	Pros                    string `json:"pros"`

	// TODO - nullable boolean
	SecurityIsApproved string `json:"securityIsApproved" jsonschema:"enum=,enum=false,enum=true"`

	SecurityIsBeingReviewed string `json:"securityIsBeingReviewed"`
	SolutionType            string `json:"solutionType" jsonschema:"enum=preferred,enum=alternativeA,enum=alternativeB"`
	Summary                 string `json:"summary"`
	Title                   string `json:"title"`
}
