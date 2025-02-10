package models

// NOTE: these types are used to create a schema used by the CEDAR Intake API
// When changing any of these types, update the biz case version in pkg/cedar/intake/translation/constants.go (IntakeInputSchemaEASIBizCaseVersion)

// NOTE: Optional fields are marked with omitempty JSON tag
// All fields are optional for draft Business Cases (all are required in final Business Case);
// we are not making any distinction between draft and final Business Cases in CEDAR

// EASIBizCase represents a Business Case for a system
type EASIBizCase struct {
	ArchivedAt             *string                 `json:"archivedAt,omitempty" jsonschema:"description=Timestamp of when request was archived,example=2023-02-27T14:34:43Z"`
	BusinessCaseID         string                  `json:"businessCaseId" jsonschema:"description=Unique ID of this Business Case,example=91e5c1f3-11fb-4124-805c-adbdd02c5395"`
	BusinessNeed           *string                 `json:"businessNeed,omitempty" jsonschema:"description=Business Need for this effort,example=Process takes too long and holds up key stakeholders"`
	BusinessOwner          string                  `json:"businessOwner" jsonschema:"description=Business owner of this request,example=John Doe"`
	BusinessSolutions      []*EASIBusinessSolution `json:"businessSolutions,omitempty" jsonschema:"description=Array Business Solutions (preferred and alternatives),example=N/A"`
	CmsBenefit             *string                 `json:"cmsBenefit,omitempty" jsonschema:"description=How CMS will benefit from this effort,example=Reduce FTE hours and generate better end products"`
	CurrentSolutionSummary *string                 `json:"currentSolutionSummary,omitempty" jsonschema:"description=Summary of the current solution,example=Managed through spreadsheets and email"`
	IntakeID               *string                 `json:"intakeId,omitempty" jsonschema:"description=Unique ID of the intake associated with this Business Case,example=36b85781-169a-4539-aa66-916663d8118c"`
	PriorityAlignment      *string                 `json:"priorityAlignment,omitempty" jsonschema:"description=The ways this effort align with organizational priorities,example=Aligns with CMS' automation push"`
	ProjectName            string                  `json:"projectName" jsonschema:"description=Name of the project,example=Easy Access to System"`
	Requester              string                  `json:"requester" jsonschema:"description=Name of the requester,example=John Doe"`
	RequesterPhoneNumber   *string                 `json:"requesterPhoneNumber,omitempty" jsonschema:"description=Phone number of requester,example=410-123-4567,example=4431234567"`
	Status                 string                  `json:"status" jsonschema:"Current status of the Business Case within EASi,example=OPEN"`
	SuccessIndicators      *string                 `json:"successIndicators,omitempty" jsonschema:"description=How this effort will be determined as successful,example=Workflows are streamlined"`
	UserEUA                string                  `json:"userEUA" jsonschema:"description=EUA id of the requester,example=J8YN"`
}

// EASIBusinessSolution represents a business solution submitted through EASi as part of a Business Case
type EASIBusinessSolution struct {
	AcquisitionApproach     *string             `json:"acquisitionApproach,omitempty" jsonschema:"description=Approach to acquiring the products and services required to deliver the system,example=COTS"`
	Cons                    *string             `json:"cons,omitempty" jsonschema:"description=Cons of this solution,example=A lot of money and time required"`
	CostSavings             *string             `json:"costSavings,omitempty" jsonschema:"description=Cost savings of this solution,example=over ten million dollars"`
	HasUI                   *string             `json:"hasUI,omitempty" jsonschema:"description=Does this solution have/need a UI,example=Yes"`
	HostingCloudServiceType *string             `json:"hostingCloudServiceType,omitempty" jsonschema:"description=What type of cloud service will be used,example=PaaS"`
	HostingLocation         *string             `json:"hostingLocation,omitempty" jsonschema:"description=Where will this solution be hosted,example=AWS"`
	HostingType             *string             `json:"hostingType,omitempty" jsonschema:"description=What type of hosting will this solution use,example=cloud"`
	LifecycleCostLines      []EASILifecycleCost `json:"lifecycleCostLines,omitempty" jsonschema:"description=Array of LifecycleCostLines (costs associated with upcoming Fiscal Years) for this business solution,example=N/A"`
	Pros                    *string             `json:"pros,omitempty" jsonschema:"description=Pros of this solution,example=Will reduce FTE hours needed"`
	SecurityIsApproved      *bool               `json:"securityIsApproved,omitempty" jsonschema:"description=Is this solution FedRAMP/FISMA approved,example=True"`
	SecurityIsBeingReviewed *string             `json:"securityIsBeingReviewed,omitempty" jsonschema:"description=Is this solution in the process of getting FedRAMP/FISMA approval,example=Yes"`
	SolutionType            string              `json:"solutionType" jsonschema:"enum=preferred,enum=alternativeA,enum=alternativeB,description=Which solution is this (preferred or alternatives),example=preferred"`
	Summary                 *string             `json:"summary,omitempty" jsonschema:"description=Summary of this solution,example=Building a new application in ServiceNow"`
	Title                   *string             `json:"title,omitempty" jsonschema:"description=Name of this solution,example=ServiceNow"`
}

// EASILifecycleCost represents a lifecycle cost item submitted through EASi as part of a Business Case
type EASILifecycleCost struct {
	Cost     *string `json:"cost,omitempty" jsonschema:"description=Fiscal year cost,example=10000"`
	Phase    *string `json:"phase,omitempty" jsonschema:"description=Type of work to be performed (can be more then one),example=Development,example=Operations and Maintenance"`
	Solution string  `json:"solution" jsonschema:"description=Which solution is this (preferred or alternatives),example=Preferred"`
	Year     string  `json:"year" jsonschema:"description=Which fiscal year does this line pertain to,example=3"`
}
