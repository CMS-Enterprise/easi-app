package models

import (
	"time"
)

// NOTE: this type is used to create a schema used by the CEDAR Intake API
// When changing this type, update the version for it in pkg/cedar/intake/translation/constants.go (IntakeInputSchemaEASIIntakeVersion)

// NOTE: Optional fields are marked with omitempty JSON tag

// EASIIntake represents a system intake
type EASIIntake struct {
	IntakeID                        string               `json:"intakeId" jsonschema:"description=Unique UUID of this system intake,example=0a16ce4e-8d8a-41ab-aeba-9303067f065b"`
	AdminLead                       *string              `json:"adminLead,omitempty" jsonschema:"description=Government Admin responsible for handling request,example=John Doe"`
	ArchivedAt                      *string              `json:"archivedAt,omitempty" jsonschema:"description=Timestamp of when request was archived,example=2022-02-17T14:34:43Z"`
	BusinessNeed                    string               `json:"businessNeed" jsonschema:"description=Business Need for the effort detailed in this request,example=Process takes too long and holds up key stakeholders"`
	BusinessOwner                   string               `json:"businessOwner" jsonschema:"description=Person who owns a line of business related to this request,example=John Doe"`
	BusinessOwnerComponent          string               `json:"businessOwnerComponent" jsonschema:"description=Component of the Business Owner,example=OIT"`
	CollaboratorName508             *string              `json:"collaboratorName508" jsonschema:"description=508 Collaborator,example=John Doe"`
	Component                       string               `json:"component" jsonschema:"description=Component of the person who submitted this request,example=OIT"`
	ContractEndDate                 *string              `json:"contractEndDate,omitempty" jsonschema:"description=The contract's end date,example=2026-10-20"`
	ContractStartDate               *string              `json:"contractStartDate,omitempty" jsonschema:"description=The contract's start date,example=2022-10-20"`
	ContractVehicle                 *string              `json:"contractVehicle,omitempty" jsonschema:"description=Contract vehicle for this effort,example=8(a)"`
	ContractNumber                  *string              `json:"contractNumber,omitempty" jsonschema:"description=Contract number for this effort,example=8(a)"`
	Contractor                      *string              `json:"contractor,omitempty" jsonschema:"description=Contractor who will perform the work detailed in this request,example=Oddball"`
	CostIncrease                    string               `json:"costIncrease" jsonschema:"description=Is there a cost increase associated with this request,example=YES,example=NOT_SURE"`
	CostIncreaseAmount              *string              `json:"costIncreaseAmount,omitempty" jsonschema:"description=How much is the cost increase,example=Over two million dollars"`
	DecidedAt                       *string              `json:"decidedAt,omitempty" jsonschema:"description=Timestamp of when decision was reached,example=2022-02-17T14:34:43Z"`
	DecisionNextSteps               *string              `json:"decisionNextSteps,omitempty" jsonschema:"description=Steps that the Business Owner should take after receiving their decision,example=Go get a contract"`
	EaCollaboratorName              *string              `json:"eaCollaboratorName,omitempty" jsonschema:"description=Enterprise Architecture (EA) Collaborator,example=John Doe"`
	EaSupportRequest                *bool                `json:"eaSupportRequest,omitempty" jsonschema:"description=Does the request need EA support,example=True"`
	ExistingContract                string               `json:"existingContract" jsonschema:"description=Is there an existing contract for this effort,example=HAVE_CONTRACT"`
	ExistingFunding                 *bool                `json:"existingFunding,omitempty" jsonschema:"description=Will this project be funded out of an existing source,example=True"`
	FundingNumber                   *string              `json:"fundingNumber,omitempty" jsonschema:"description=six digit funding number,example=123456"`
	FundingSource                   *string              `json:"fundingSource,omitempty" jsonschema:"description=Source of funding,example=Prog Ops"`
	FundingSources                  []*EASIFundingSource `json:"fundingSources,omitempty" jsonschema:"description=Array of funding sources, which contain a source of funding and a six-digit funding number,example=N/A"`
	GrbDate                         *string              `json:"grbDate,omitempty" jsonschema:"description=Scheduled date for the Governance Review Board (GRB) meeting,example=2025-12-12"`
	GrtDate                         *string              `json:"grtDate,omitempty" jsonschema:"description=Scheduled date for the Governance Review Team (GRT) meeting,example=2025-10-20"` // TODO: doesn't seem like this is ever populated, remove?
	IssoName                        *string              `json:"issoName,omitempty" jsonschema:"description=Information System Security Officer (ISSO) for the effort detailed in this request,example=John Doe"`
	LifecycleCostBaseline           *string              `json:"lifecycleCostBaseline,omitempty" jsonschema:"description=Cost baseline associated with this LCID,example=about $10 million"`
	LifecycleExpiresAt              *string              `json:"lifecycleExpiresAt,omitempty" jsonschema:"description=Expiration date for the LCID associated with this request,example=2030-12-23"`
	LifecycleID                     *string              `json:"lifecycleID,omitempty" jsonschema:"description=LCID (if one is issued) associated with this request,example=220970"`
	LifecycleScope                  *string              `json:"lifecycleScope,omitempty" jsonschema:"description=Scope of LCID,example=This LCID covers development and operation of the application"`
	OitSecurityCollaboratorName     *string              `json:"oitSecurityCollaboratorName,omitempty" jsonschema:"description=OIT's Security and Privacy (ISPG) Collaborator,example=John Doe"`
	ProcessStatus                   string               `json:"processStatus" jsonschema:"description=Where is the Business Owner in process,example=Initial development underway"`
	ProductManager                  string               `json:"productManager" jsonschema:"description=Product Manager for the effort deatiled in this request,example=John Doe"`
	ProductManagerComponent         string               `json:"productManagerComponent" jsonschema:"description=Component of the Product Manager,example=OIT"`
	ProjectAcronym                  *string              `json:"projectAcronym,omitempty" jsonschema:"description=Acronym for project,example=EASi"`
	ProjectName                     string               `json:"projectName" jsonschema:"description=Name of project,example=Easy Access to System Information"`
	RejectionReason                 *string              `json:"rejectionReason,omitempty" jsonschema:"description=Reasoning for why this request was rejected,example=Costs too much money"`
	RequestType                     string               `json:"requestType" jsonschema:"description=Type of request,example=NEW"`
	Requester                       string               `json:"requester" jsonschema:"description=Person who submitted request in EASi,example=John Doe"`
	RequesterEmailAddress           *string              `json:"requesterEmailAddress,omitempty" jsonschema:"description=Email address of the person who submitted this request,example=John.Doe@cms.hhs.gov"`
	Solution                        string               `json:"solution" jsonschema:"description=Initial solution,example=Build new application in ServiceNow"`
	Status                          string               `json:"status" jsonschema:"description=Current status of this request,example=INTAKE_SUBMITTED"`
	SubmittedAt                     string               `json:"submittedAt" jsonschema:"description=Timestamp of when request was submitted,example=2022-02-17T14:34:43Z"`
	TrbCollaboratorName             *string              `json:"trbCollaboratorName,omitempty" jsonschema:"description=Technical Review Board (TRB) Collaborator,example=John Doe"`
	UserEUA                         string               `json:"userEUA" jsonschema:"description=EUA id of the requester,example=J8YN"`
	HasUIChanges                    *bool                `json:"hasUiChanges,omitempty" jsonschema:"description=Does the request have UI changes,example=True"`
	UsesAITech                      *bool                `json:"usesAiTech,omitempty" jsonschema:"description=Does the request use AI technology,example=True"`
	UsingSoftware                   *string              `json:"usingSoftware,omitempty" jsonschema:"description=Is the request using software,example=Not Sure"`
	AcquisitionMethods              []string             `json:"acquisitionMethods,omitempty" jsonschema:"description=Acquisition methods for the software related to this request,example=N/A"`
	CurrentAnnualSpending           *string              `json:"currentAnnualSpending,omitempty" jsonschema:"description=Current annual spending for the request,example=Less than $1 million"`
	CurrentAnnualSpendingITPortion  *string              `json:"currentAnnualSpendingITPortion,omitempty" jsonschema:"description=Current annual spending IT portion for the request,example=25%"`
	PlannedYearOneSpending          *string              `json:"plannedYearOneSpending,omitempty" jsonschema:"description=Planned year one spending for the request,example=Less than $1 million"`
	PlannedYearOneSpendingITPortion *string              `json:"plannedYearOneSpendingITPortion,omitempty" jsonschema:"description=Planned year one spending IT portion for the request,example=30%"`
	ScheduledProductionDate         *string              `json:"scheduledProductionDate,omitempty" jsonschema:"description=Scheduled production date for the request,example=2025-10-20"`

	CurrentEstimatedCost                       *string    `json:"currentEstimatedCost,omitempty" jsonschema:"description=Current estimated annual contract cost for the request,example=Less than $1 million"`
	CurrentEstimatedCostITPortion              *string    `json:"currentEstimatedCostITPortion,omitempty" jsonschema:"description=IT portion of the current estimated annual contract cost for the request,example=25%"`
	DecisionState                              string     `json:"decisionState" jsonschema:"description=Current decision state for this request,example=NO_DECISION,example=LCID_ISSUED,example=NOT_APPROVED,example=NOT_GOVERNANCE"`
	DigitalServiceInteraction                  *string    `json:"digitalServiceInteraction,omitempty" jsonschema:"description=Does the request involve interaction with a digital service,example=YES,example=NO,example=NOT_SURE"`
	DigitalServiceInteractionDescription       *string    `json:"digitalServiceInteractionDescription,omitempty" jsonschema:"description=Description of the request's digital service interaction,example=Users will submit enrollment updates through a public-facing web form"`
	DoesNotSupportSystems                      *bool      `json:"doesNotSupportSystems,omitempty" jsonschema:"description=Does this request not support any CEDAR systems,example=false"`
	DraftBusinessCaseState                     string     `json:"draftBusinessCaseState" jsonschema:"description=Current state of the draft Business Case form,example=NOT_STARTED,example=IN_PROGRESS,example=EDITS_REQUESTED,example=SUBMITTED"`
	EstimatedTotalContractValue                *string    `json:"estimatedTotalContractValue,omitempty" jsonschema:"description=Estimated total contract value for the request,example=Between $1 million and $5 million"`
	EstimatedTotalContractValueITPortion       *string    `json:"estimatedTotalContractValueITPortion,omitempty" jsonschema:"description=IT portion of the estimated total contract value for the request,example=30%"`
	FinalBusinessCaseState                     string     `json:"finalBusinessCaseState" jsonschema:"description=Current state of the final Business Case form,example=NOT_STARTED,example=IN_PROGRESS,example=EDITS_REQUESTED,example=SUBMITTED"`
	GovernanceTeamsIsPresent                   *bool      `json:"governanceTeamsIsPresent,omitempty" jsonschema:"description=Whether governance team contacts are present for this request,example=true"`
	LCIDType                                   *string    `json:"lcidType,omitempty" jsonschema:"description=Type of LCID issued for this request,example=NEW_SYSTEM,example=RECOMPETE"`
	LCIDComponent                              *string    `json:"lcidComponent,omitempty" jsonschema:"description=CMS component associated with the LCID,example=OFFICE_OF_INFORMATION_TECHNOLOGY_OIT"`
	LCIDIsLowIT                                *bool      `json:"lcidIsLowIt,omitempty" jsonschema:"description=Whether the LCID is marked as low IT,example=false"`
	LCIDIsShortened                            *bool      `json:"lcidIsShortened,omitempty" jsonschema:"description=Whether the LCID duration was shortened,example=false"`
	LifecycleExpirationAlertTS                 *time.Time `json:"lcidExpirationAlertTS,omitempty" jsonschema:"description=Timestamp of the last LCID expiration alert for this request,example=2025-10-20T14:34:43Z"`
	LifecycleRetiresAt                         *time.Time `json:"lcidRetiresAt,omitempty" jsonschema:"description=Retirement date for the LCID associated with this request,example=2030-12-23T14:34:43Z"`
	LifecycleIssuedAt                          *time.Time `json:"lcidIssuedAt,omitempty" jsonschema:"description=Timestamp of when the LCID associated with this request was issued,example=2025-10-20T14:34:43Z"`
	PriorityAlignment                          *string    `json:"priorityAlignment,omitempty" jsonschema:"description=The ways this effort aligns with organizational priorities,example=Aligns with CMS modernization goals"`
	ProtectedCmsDataAccessedOutside            *string    `json:"protectedCmsDataAccessedOutside,omitempty" jsonschema:"description=Will protected CMS data be accessed outside CMS systems,example=YES,example=NO,example=NOT_SURE"`
	ProtectedCmsDataAccessedOutsideDescription *string    `json:"protectedCmsDataAccessedOutsideDescription,omitempty" jsonschema:"description=Description of protected CMS data accessed outside CMS systems,example=Contractor staff will access beneficiary data through approved secure tooling"`
	RequestFormState                           string     `json:"requestFormState" jsonschema:"description=Current state of the intake request form,example=NOT_STARTED,example=IN_PROGRESS,example=EDITS_REQUESTED,example=SUBMITTED"`
	State                                      string     `json:"state" jsonschema:"description=Whether the intake request is open or closed,example=OPEN,example=CLOSED"`
	Step                                       string     `json:"step" jsonschema:"description=Current step in the intake workflow,example=INITIAL_REQUEST_FORM,example=DRAFT_BUSINESS_CASE,example=DECISION_AND_NEXT_STEPS"`
	TRBFollowUpRecommendation                  *string    `json:"trbFollowUpRecommendation,omitempty" jsonschema:"description=Recommendation for whether the requester should follow up with TRB,example=STRONGLY_RECOMMENDED,example=RECOMMENDED_BUT_NOT_CRITICAL,example=NOT_RECOMMENDED"`
	UpdatedAt                                  *time.Time `json:"updatedAt,omitempty" jsonschema:"description=Timestamp of when request was last updated,example=2025-10-20T14:34:43Z"`
}

// EASIFundingSource represents a source of funding for a system intake
type EASIFundingSource struct {
	FundingSourceID string  `json:"fundingSourceId" jsonschema:"description=Unique ID of this funding source,example=91e5c1f3-11fb-4124-805c-adbdd02c5395"`
	FundingNumber   *string `json:"fundingNumber,omitempty" jsonschema:"description=six digit funding number,example=123456"`
	Source          *string `json:"fundingSource,omitempty" jsonschema:"description=Source of funding,example=Prog Ops"`
}
