package models

// NOTE: these types are used to create a schema used by the CEDAR Intake API
// When changing any of these types, add a new version for BizCase in pkg/cedar/intake/translation/schema_versions.go
// and update the associated version in cmd/gen_intake_schema/main.go

// EASIBizCase represents a business case for a system
type EASIBizCase struct {
	ArchivedAt           string                  `json:"archivedAt" jsonschema:"description=Timestamp of when request was archived,example=2023-02-27T14:34:43Z"`
	AsIsCons             string                  `json:"asIsCons" jsonschema:"description=Cons of the current solution,example=Multiple FTEs required"`
	AsIsCostSavings      string                  `json:"asIsCostSavings" jsonschema:"description=Cost savings of the current solution,example=No additional development required"`
	AsIsPros             string                  `json:"asIsPros" jsonschema:"description=Pros of the current solution,example=Well known workflows and end products"`
	AsIsSummary          string                  `json:"asIsSummary" jsonschema:"description=Summary of the current solution,example=Managed through spreadsheets and email"`
	AsIsTitle            string                  `json:"asIsTitle" jsonschema:"description=Name of the current solution,example=Spreadsheets and Email"`
	BusinessNeed         string                  `json:"businessNeed" jsonschema:"description=Business Need for this effort,example=Process takes too long and holds up key stakeholders"`
	BusinessOwner        string                  `json:"businessOwner" jsonschema:"description=Business owner of this request,example=John Doe"`
	BusinessSolutions    []*EASIBusinessSolution `json:"businessSolutions" jsonschema:"description=Array Business Solutions (preferred and alternatives),example=N/A"`
	CmsBenefit           string                  `json:"cmsBenefit" jsonschema:"description=How CMS will benefit from this effort,example=Reduce FTE hours and generate better end products"`
	InitialSubmittedAt   string                  `json:"initialSubmittedAt" jsonschema:"description=Timestamp of when request was initially submitted,example=2022-02-17T07:34:43Z"`
	IntakeID             string                  `json:"intakeId" jsonschema:"description=Unique ID of the intake associated with this business case,example=36b85781-169a-4539-aa66-916663d8118c"`
	LastSubmittedAt      string                  `json:"lastSubmittedAt" jsonschema:"description=Timestamp of when request was last submitted,example=2022-02-11T16:34:43Z"`
	LifecycleCostLines   []*EASILifecycleCost    `json:"lifecycleCostLines" jsonschema:"description=Array of LifecycleCostLines (costs associated with upcoming Fiscal Years),example=N/A"`
	PriorityAlignment    string                  `json:"priorityAlignment" jsonschema:"description=The ways this effort align with organizational priorities,example=Aligns with CMS' automation push"`
	ProjectName          string                  `json:"projectName" jsonschema:"description=Name of the project,example=Easy Access to System"`
	Requester            string                  `json:"requester" jsonschema:"description=Name of the requester,example=John Doe"`
	RequesterPhoneNumber string                  `json:"requesterPhoneNumber" jsonschema:"description=Phone number of requester,example=410-123-4567,example=4431234567"`
	SubmittedAt          string                  `json:"submittedAt" jsonschema:"description=Timestamp of when request was submitted,example=2022-02-10T19:34:43Z"`
	SuccessIndicators    string                  `json:"successIndicators" jsonschema:"description=How this effort will be determined as successful,example=Workflows are streamlined"`
	UserEUA              string                  `json:"userEUA" jsonschema:"description=EUA id of the requester,example=J8YN"`
}

// EASIBusinessSolution represents a business solution submitted through EASi as part of a business case
type EASIBusinessSolution struct {
	AcquisitionApproach     string `json:"acquisitionApproach" jsonschema:"description=Approach to acquiring the products and services required to deliver the system,example=COTS"`
	Cons                    string `json:"cons" jsonschema:"description=Cons of this solution,example=A lot of money and time required"`
	CostSavings             string `json:"costSavings" jsonschema:"description=Cost savings of this solution,example=over ten million dollars"`
	HasUI                   string `json:"hasUI" jsonschema:"description=Does this solution have/need a UI,example=Yes"`
	HostingCloudServiceType string `json:"hostingCloudServiceType" jsonschema:"description=What type of cloud service will be used,example=PaaS"`
	HostingLocation         string `json:"hostingLocation" jsonschema:"description=Where will this solution be hosted,example=AWS"`
	HostingType             string `json:"hostingType" jsonschema:"description=What type of hosting will this solution use,example=cloud"`
	Pros                    string `json:"pros" jsonschema:"description=Pros of this solution,example=Will reduce FTE hours needed"`
	SecurityIsApproved      string `json:"securityIsApproved" jsonschema:"enum=,enum=false,enum=true,description=Is this solution FedRAMP/FISMA approved,example=True"`
	SecurityIsBeingReviewed string `json:"securityIsBeingReviewed" jsonschema:"description=Is this solution in the process of getting FedRAMP/FISMA approval,example=Yes"`
	SolutionType            string `json:"solutionType" jsonschema:"enum=preferred,enum=alternativeA,enum=alternativeB,description=Which solution is this (preferred or alternatives),example=preferred"`
	Summary                 string `json:"summary" jsonschema:"description=Summary of this solution,example=Building a new application in ServiceNow"`
	Title                   string `json:"title" jsonschema:"description=Name of this solution,example=ServiceNow"`
}

// EASILifecycleCost represents a lifecycle cost item submitted through EASi as part of a business case
type EASILifecycleCost struct {
	BusinessCaseID string `json:"businessCaseId" jsonschema:"description=Unique ID of the business case this cost line is associated with,example=91e5c1f3-11fb-4124-805c-adbdd02c5395"`
	Cost           string `json:"cost" jsonschema:"description=Fiscal year cost,example=10000"`
	ID             string `json:"id" jsonschema:"description=Unique ID of this cost line,example=17f51e0f-c9ab-4d8a-8d6f-03aef2d3404d"`
	Phase          string `json:"phase" jsonschema:"description=Type of work to be performed (can be more then one),example=Development,example=Operations and Maintenance"`
	Solution       string `json:"solution" jsonschema:"description=Which solution is this (preferred or alternatives),example=Preferred"`
	Year           string `json:"year" jsonschema:"description=Which fiscal year does this line pertain to,example=3"`
}
