package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/translation/schema_versions.go
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
