package models

// EASIBizCase represents a business case for a system
type EASIBizCase struct {

	// archived at
	// Required: true
	ArchivedAt *string `json:"archivedAt"`

	// as is cons
	// Required: true
	AsIsCons *string `json:"asIsCons"`

	// as is cost savings
	// Required: true
	AsIsCostSavings *string `json:"asIsCostSavings"`

	// as is pros
	// Required: true
	AsIsPros *string `json:"asIsPros"`

	// as is summary
	// Required: true
	AsIsSummary *string `json:"asIsSummary"`

	// as is title
	// Required: true
	AsIsTitle *string `json:"asIsTitle"`

	// business need
	// Required: true
	BusinessNeed *string `json:"businessNeed"`

	// business owner
	// Required: true
	BusinessOwner *string `json:"businessOwner"`

	// business solutions
	// Required: true
	BusinessSolutions []*EASIBusinessSolution `json:"businessSolutions"`

	// cms benefit
	// Required: true
	CmsBenefit *string `json:"cmsBenefit"`

	// initial submitted at
	// Required: true
	InitialSubmittedAt *string `json:"initialSubmittedAt"`

	// intake Id
	// Required: true
	IntakeID *string `json:"intakeId"`

	// last submitted at
	// Required: true
	LastSubmittedAt *string `json:"lastSubmittedAt"`

	// lifecycle cost lines
	// Required: true
	LifecycleCostLines []*EASILifecycleCost `json:"lifecycleCostLines"`

	// priority alignment
	// Required: true
	PriorityAlignment *string `json:"priorityAlignment"`

	// project name
	// Required: true
	ProjectName *string `json:"projectName"`

	// requester
	// Required: true
	Requester *string `json:"requester"`

	// requester phone number
	// Required: true
	RequesterPhoneNumber *string `json:"requesterPhoneNumber"`

	// submitted at
	// Required: true
	SubmittedAt *string `json:"submittedAt"`

	// success indicators
	// Required: true
	SuccessIndicators *string `json:"successIndicators"`

	// user e u a
	// Required: true
	UserEUA *string `json:"userEUA"`
}
