package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, update the version for it in pkg/cedar/intake/translation/constants.go (IntakeInputSchemaEASIIntakeVersion)

// NOTE: Optional fields are marked with omitempty JSON tag

// EASIIntake represents a system intake
type EASIIntake struct {
	IntakeID                    string               `json:"intakeId" jsonschema:"description=Unique UUID of this system intake,example=0a16ce4e-8d8a-41ab-aeba-9303067f065b"`
	AdminLead                   *string              `json:"adminLead,omitempty" jsonschema:"description=Government Admin responsible for handling request,example=John Doe"`
	ArchivedAt                  *string              `json:"archivedAt,omitempty" jsonschema:"description=Timestamp of when request was archived,example=2022-02-17T14:34:43Z"`
	BusinessNeed                string               `json:"businessNeed" jsonschema:"description=Business Need for the effort detailed in this request,example=Process takes too long and holds up key stakeholders"`
	BusinessOwner               string               `json:"businessOwner" jsonschema:"description=Person who owns a line of business related to this request,example=John Doe"`
	BusinessOwnerComponent      string               `json:"businessOwnerComponent" jsonschema:"description=Component of the Business owner,example=OIT"`
	Component                   string               `json:"component" jsonschema:"description=Component of the person who submitted this request,example=OIT"`
	ContractEndDate             *string              `json:"contractEndDate,omitempty" jsonschema:"description=The contract's end date,example=2026-10-20"`
	ContractStartDate           *string              `json:"contractStartDate,omitempty" jsonschema:"description=The contract's start date,example=2022-10-20"`
	ContractVehicle             *string              `json:"contractVehicle,omitempty" jsonschema:"description=Contract vehicle for this effort,example=8(a)"`
	ContractNumber              *string              `json:"contractNumber,omitempty" jsonschema:"description=Contract number for this effort,example=8(a)"`
	Contractor                  *string              `json:"contractor,omitempty" jsonschema:"description=Contractor who will perform the work detailed in this request,example=Oddball"`
	CostIncrease                string               `json:"costIncrease" jsonschema:"description=Is there a cost increase associated with this request,example=YES,example=NOT_SURE"`
	CostIncreaseAmount          *string              `json:"costIncreaseAmount,omitempty" jsonschema:"description=How much is the cost increase,example=Over two million dollars"`
	DecidedAt                   *string              `json:"decidedAt,omitempty" jsonschema:"description=Timestamp of when decision was reached,example=2022-02-17T14:34:43Z"`
	DecisionNextSteps           *string              `json:"decisionNextSteps,omitempty" jsonschema:"description=Steps that the Business Owner should take after receiving their decision,example=Go get a contract"`
	EaCollaboratorName          *string              `json:"eaCollaboratorName,omitempty" jsonschema:"description=Enterprise Architecture (EA) Collaborator,example=John Doe"`
	EaSupportRequest            *bool                `json:"eaSupportRequest,omitempty" jsonschema:"description=Does the request need EA support,example=True"`
	ExistingContract            string               `json:"existingContract" jsonschema:"description=Is there an existing contract for this effort,example=HAVE_CONTRACT"`
	ExistingFunding             *bool                `json:"existingFunding,omitempty" jsonschema:"description=Will this project be funded out of an existing source,example=True"`
	FundingNumber               *string              `json:"fundingNumber,omitempty" jsonschema:"description=six digit funding number,example=123456"`
	FundingSource               *string              `json:"fundingSource,omitempty" jsonschema:"description=Source of funding,example=Prog Ops"`
	FundingSources              []*EASIFundingSource `json:"fundingSources,omitempty" jsonschema:"description=Array of funding sources, which contain a source of funding and a six-digit funding number,example=N/A"`
	GrbDate                     *string              `json:"grbDate,omitempty" jsonschema:"description=Scheduled date for the Governance Review Board (GRB) meeting,example=2025-12-12"`
	GrtDate                     *string              `json:"grtDate,omitempty" jsonschema:"description=Scheduled date for the Governance Review Team (GRT) meeting,example=2025-10-20"` // TODO: doesn't seem like this is ever populated, remove?
	IssoName                    *string              `json:"issoName,omitempty" jsonschema:"description=Information System Security Officer (ISSO) for the effort detailed in this request,example=John Doe"`
	LifecycleCostBaseline       *string              `json:"lifecycleCostBaseline,omitempty" jsonschema:"description=Cost baseline associated with this LCID,example=about $10 million"`
	LifecycleExpiresAt          *string              `json:"lifecycleExpiresAt,omitempty" jsonschema:"description=Expiration date for the LCID associated with this request,example=2030-12-23"`
	LifecycleID                 *string              `json:"lifecycleID,omitempty" jsonschema:"description=LCID (if one is issued) associated with this request,example=220970"`
	LifecycleScope              *string              `json:"lifecycleScope,omitempty" jsonschema:"description=Scope of LCID,example=This LCID covers development and operation of the application"`
	OitSecurityCollaboratorName *string              `json:"oitSecurityCollaboratorName,omitempty" jsonschema:"description=OIT's Security and Privacy (ISPG) Collaborator,example=John Doe"`
	ProcessStatus               string               `json:"processStatus" jsonschema:"description=Where is the Business Owner in process,example=Initial development underway"`
	ProductManager              string               `json:"productManager" jsonschema:"description=Product Manager for the effort deatiled in this request,example=John Doe"`
	ProductManagerComponent     string               `json:"productManagerComponent" jsonschema:"description=Component of the Product Manager,example=OIT"`
	ProjectAcronym              *string              `json:"projectAcronym,omitempty" jsonschema:"description=Acronym for project,example=EASi"`
	ProjectName                 string               `json:"projectName" jsonschema:"description=Name of project,example=Easy Access to System Information"`
	RejectionReason             *string              `json:"rejectionReason,omitempty" jsonschema:"description=Reasoning for why this request was rejected,example=Costs too much money"`
	RequestType                 string               `json:"requestType" jsonschema:"description=Type of request,example=NEW"`
	Requester                   string               `json:"requester" jsonschema:"description=Person who submitted request in EASi,example=John Doe"`
	RequesterEmailAddress       *string              `json:"requesterEmailAddress,omitempty" jsonschema:"description=Email address of the person who submitted this request,example=John.Doe@cms.hhs.gov"`
	Solution                    string               `json:"solution" jsonschema:"description=Initial solution,example=Build new application in ServiceNow"`
	Status                      string               `json:"status" jsonschema:"description=Current status of this request,example=INTAKE_SUBMITTED"`
	SubmittedAt                 string               `json:"submittedAt" jsonschema:"description=Timestamp of when request was submitted,example=2022-02-17T14:34:43Z"`
	TrbCollaboratorName         *string              `json:"trbCollaboratorName,omitempty" jsonschema:"description=Technical Review Board (TRB) Collaborator,example=John Doe"`
	UserEUA                     string               `json:"userEUA" jsonschema:"description=EUA id of the requester,example=J8YN"`
	HasUIChanges                *bool                `json:"hasUiChanges,omitempty" jsonschema:"description=Does the request have UI changes,example=True"`
}

// EASIFundingSource represents a source of funding for a system intake
type EASIFundingSource struct {
	FundingSourceID string  `json:"fundingSourceId" jsonschema:"description=Unique ID of this funding source,example=91e5c1f3-11fb-4124-805c-adbdd02c5395"`
	FundingNumber   *string `json:"fundingNumber,omitempty" jsonschema:"description=six digit funding number,example=123456"`
	Source          *string `json:"fundingSource,omitempty" jsonschema:"description=Source of funding,example=Prog Ops"`
}
