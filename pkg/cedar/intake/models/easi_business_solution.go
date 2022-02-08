package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/schema_versions.go
// and update the associated version in cmd/gen_intake_schema/main.go

// EASIBusinessSolution represents a business solution submitted through EASi as part of a business case
type EASIBusinessSolution struct {
	AcquisitionApproach     string `json:"acquisitionApproach"`
	Cons                    string `json:"cons"`
	CostSavings             string `json:"costSavings"`
	HasUI                   string `json:"hasUI"`
	HostingCloudServiceType string `json:"hostingCloudServiceType"`
	HostingLocation         string `json:"hostingLocation"`
	HostingType             string `json:"hostingType"`
	Pros                    string `json:"pros"`
	SecurityIsApproved      string `json:"securityIsApproved" jsonschema:"enum=,enum=false,enum=true"`
	SecurityIsBeingReviewed string `json:"securityIsBeingReviewed"`
	SolutionType            string `json:"solutionType" jsonschema:"enum=preferred,enum=alternativeA,enum=alternativeB"`
	Summary                 string `json:"summary"`
	Title                   string `json:"title"`
}
