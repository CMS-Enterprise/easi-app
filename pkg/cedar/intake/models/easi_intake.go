package models

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, add a new version for it in pkg/cedar/intake/translation/constants.go
// and update the associated version in cmd/gen_intake_schema/main.go

// EASIIntake represents a system intake
type EASIIntake struct {
	AdminLead                   string `json:"adminLead" jsonschema:"description=Government Admin responsible for handling request,example=John Doe"`
	ArchivedAt                  string `json:"archivedAt" jsonschema:"description=Timestamp of when request was archived,example=2022-02-17T14:34:43Z"`
	BusinessNeed                string `json:"businessNeed" jsonschema:"description=Business Need for the effort detailed in this request,example=Process takes too long and holds up key stakeholders"`
	BusinessOwner               string `json:"businessOwner" jsonschema:"description=Person who owns a line of business related to this request,example=John Doe"`
	BusinessOwnerComponent      string `json:"businessOwnerComponent" jsonschema:"description=Component of the Business Owner,example=OIT"`
	Component                   string `json:"component" jsonschema:"description=Component of the person who submitted this request,example=OIT"`
	ContractEndDate             string `json:"contractEndDate" jsonschema:"description=The contract's end date,example=2026-10-20"`
	ContractStartDate           string `json:"contractStartDate" jsonschema:"description=The contract's start date,example=2022-10-20"`
	ContractVehicle             string `json:"contractVehicle" jsonschema:"description=Contract vehicle for this effort,example=8(a)"`
	Contractor                  string `json:"contractor" jsonschema:"description=Contractor who will perform the work detailed in this request,example=Oddball"`
	CostIncrease                string `json:"costIncrease" jsonschema:"description=Is there a cost increase associated with this request,example=YES"`
	CostIncreaseAmount          string `json:"costIncreaseAmount" jsonschema:"description=How much is the cost increase,example=Over two million dollars"`
	DecidedAt                   string `json:"decidedAt" jsonschema:"description=Timestamp of when decision was reached,example=2022-02-17T14:34:43Z"`
	DecisionNextSteps           string `json:"decisionNextSteps" jsonschema:"description=Steps that the business owner should take after receiving their decision,example=Go get a contract"`
	EaCollaborator              string `json:"eaCollaborator" jsonschema:"description=N/A,example=N/A"` // TODO: doesn't seem like this is ever populated, remove?
	EaCollaboratorName          string `json:"eaCollaboratorName" jsonschema:"description=Enterprise Architecture (EA) Collaborator,example=John Doe"`
	EaSupportRequest            *bool  `json:"eaSupportRequest,omitempty" jsonschema:"description=Does the request need EA support,example=True"`
	ExistingContract            string `json:"existingContract" jsonschema:"description=Is there an existing contract for this effort,example=HAVE_CONTRACT"`
	ExistingFunding             *bool  `json:"existingFunding,omitempty" jsonschema:"description=Will this project be funded out of an existing source,example=True"`
	FundingNumber               string `json:"fundingNumber" jsonschema:"description=six digit funding number,example=123456"`
	FundingSource               string `json:"fundingSource" jsonschema:"description=Source of funding,example=Prog Ops"`
	GrbDate                     string `json:"grbDate" jsonschema:"description=Scheduled date for the Governance Review Board (GRB) meeting,example=2025-12-12T00:00:00Z"`
	GrtDate                     string `json:"grtDate" jsonschema:"description=Scheduled date for the Governance Review Team (GRT) meeting,example=2025-10-20T00:00:00Z"`
	GrtReviewEmailBody          string `json:"grtReviewEmailBody" jsonschema:"description=N/A,example=N/A"` // TODO: not sure when/if this is populated
	Isso                        string `json:"isso" jsonschema:"description=N/A,example=N/A"`               // TODO: doesn't seem like this is ever populated, remove?
	IssoName                    string `json:"issoName" jsonschema:"description=Information System Security Officer (ISSO) for the effort detailed in this request,example=John Doe"`
	LifecycleCostBaseline       string `json:"lifecycleCostBaseline" jsonschema:"description=Cost baseline associated with this LCID,example=about $10 million"`
	LifecycleExpiresAt          string `json:"lifecycleExpiresAt" jsonschema:"description=Expiration date for the LCID associated with this request,example=2030-12-23T00:00:00Z"`
	LifecycleID                 string `json:"lifecycleID" jsonschema:"description=LCID (if one is issued) associated with this request,example=220970"`
	LifecycleScope              string `json:"lifecycleScope" jsonschema:"description=Scope of LCID,example=This LCID covers development and operation of the application"`
	OitSecurityCollaborator     string `json:"oitSecurityCollaborator" jsonschema:"description=N/A,example=N/A"` // TODO: doesn't seem like this is ever populated, remove?
	OitSecurityCollaboratorName string `json:"oitSecurityCollaboratorName" jsonschema:"description=OIT's Security and Privacy (ISPG) Collaborator,example=John Doe"`
	ProcessStatus               string `json:"processStatus" jsonschema:"description=Where is the business owner in process,example=Initial development underway"`
	ProductManager              string `json:"productManager" jsonschema:"description=Product Manager for the effort deatiled in this request,example=John Doe"`
	ProductManagerComponent     string `json:"productManagerComponent" jsonschema:"description=Component of the Product Manager,example=OIT"`
	ProjectAcronym              string `json:"projectAcronym" jsonschema:"description=Acronym for project,example=EASi"`
	ProjectName                 string `json:"projectName" jsonschema:"description=Name of project,example=Easy Access to System Information"`
	RejectionReason             string `json:"rejectionReason" jsonschema:"description=Reasoning for why this request was rejected,example=Costs too much money"`
	RequestType                 string `json:"requestType" jsonschema:"description=Type of request,example=NEW"`
	Requester                   string `json:"requester" jsonschema:"description=Person who submitted request in EASi,example=John Doe"`
	RequesterEmailAddress       string `json:"requesterEmailAddress" jsonschema:"description=Email address of the person who submitted this request,example=John.Doe@cms.hhs.gov"`
	Solution                    string `json:"solution" jsonschema:"description=Initial solution,example=Build new application in ServiceNow"`
	Status                      string `json:"status" jsonschema:"description=Current status of this request,example=INTAKE_SUBMITTED"`
	SubmittedAt                 string `json:"submittedAt" jsonschema:"description=Timestamp of when request was submitted,example=2022-02-17T14:34:43Z"`
	TrbCollaborator             string `json:"trbCollaborator" jsonschema:"description=N/A,example=N/A"` // TODO: doesn't seem like this is ever populated, remove?
	TrbCollaboratorName         string `json:"trbCollaboratorName" jsonschema:"description=Technical Review Board (TRB) Collaborator,example=John Doe"`
	UserEUA                     string `json:"userEUA" jsonschema:"description=EUA id of the requester,example=J8YN"`
}
