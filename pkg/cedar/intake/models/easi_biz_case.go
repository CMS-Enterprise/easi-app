package models

// NOTE: these types are used to create a schema used by the CEDAR Intake API
// When changing any of these types, add a new version for BizCase in pkg/cedar/intake/translation/constants.go
// and update the associated version in cmd/gen_intake_schema/main.go

// EASIBizCase represents a business case for a system
type EASIBizCase struct {
	ArchivedAt           string                  `json:"archivedAt"`
	AsIsCons             string                  `json:"asIsCons"`
	AsIsCostSavings      string                  `json:"asIsCostSavings"`
	AsIsPros             string                  `json:"asIsPros"`
	AsIsSummary          string                  `json:"asIsSummary"`
	AsIsTitle            string                  `json:"asIsTitle"`
	BusinessNeed         string                  `json:"businessNeed"`
	BusinessOwner        string                  `json:"businessOwner"`
	BusinessSolutions    []*EASIBusinessSolution `json:"businessSolutions"`
	CmsBenefit           string                  `json:"cmsBenefit"`
	InitialSubmittedAt   string                  `json:"initialSubmittedAt"`
	IntakeID             string                  `json:"intakeId"`
	LastSubmittedAt      string                  `json:"lastSubmittedAt"`
	LifecycleCostLines   []*EASILifecycleCost    `json:"lifecycleCostLines"`
	PriorityAlignment    string                  `json:"priorityAlignment"`
	ProjectName          string                  `json:"projectName"`
	Requester            string                  `json:"requester"`
	RequesterPhoneNumber string                  `json:"requesterPhoneNumber"`
	SubmittedAt          string                  `json:"submittedAt"`
	SuccessIndicators    string                  `json:"successIndicators"`
	UserEUA              string                  `json:"userEUA"`
}

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

// EASILifecycleCost represents a lifecycle cost item submitted through EASi as part of a business case
type EASILifecycleCost struct {
	BusinessCaseID string `json:"businessCaseId"`
	Cost           string `json:"cost"`
	ID             string `json:"id"`
	Phase          string `json:"phase"`
	Solution       string `json:"solution"`
	Year           string `json:"year"`
}
