package models

// EASIIntake represents a system intake
type EASIIntake struct {

	// admin lead
	// Required: true
	AdminLead *string `json:"adminLead"`

	// archived at
	// Required: true
	ArchivedAt *string `json:"archivedAt"`

	// business need
	// Required: true
	BusinessNeed *string `json:"businessNeed"`

	// business owner
	// Required: true
	BusinessOwner *string `json:"businessOwner"`

	// business owner component
	// Required: true
	BusinessOwnerComponent *string `json:"businessOwnerComponent"`

	// component
	// Required: true
	Component *string `json:"component"`

	// contract end date
	// Required: true
	ContractEndDate *string `json:"contractEndDate"`

	// contract start date
	// Required: true
	ContractStartDate *string `json:"contractStartDate"`

	// contract vehicle
	// Required: true
	ContractVehicle *string `json:"contractVehicle"`

	// contractor
	// Required: true
	Contractor *string `json:"contractor"`

	// cost increase
	// Required: true
	CostIncrease *string `json:"costIncrease"`

	// cost increase amount
	// Required: true
	CostIncreaseAmount *string `json:"costIncreaseAmount"`

	// decided at
	// Required: true
	DecidedAt *string `json:"decidedAt"`

	// decision next steps
	// Required: true
	DecisionNextSteps *string `json:"decisionNextSteps"`

	// ea collaborator
	// Required: true
	EaCollaborator *string `json:"eaCollaborator"`

	// ea collaborator name
	// Required: true
	EaCollaboratorName *string `json:"eaCollaboratorName"`

	// ea support request
	// Required: true
	// Enum: [ false true]
	EaSupportRequest *string `json:"eaSupportRequest"`

	// existing contract
	// Required: true
	ExistingContract *string `json:"existingContract"`

	// existing funding
	// Required: true
	// Enum: [ false true]
	ExistingFunding *string `json:"existingFunding"`

	// funding number
	// Required: true
	FundingNumber *string `json:"fundingNumber"`

	// funding source
	// Required: true
	FundingSource *string `json:"fundingSource"`

	// grb date
	// Required: true
	GrbDate *string `json:"grbDate"`

	// grt date
	// Required: true
	GrtDate *string `json:"grtDate"`

	// grt review email body
	// Required: true
	GrtReviewEmailBody *string `json:"grtReviewEmailBody"`

	// isso
	// Required: true
	Isso *string `json:"isso"`

	// isso name
	// Required: true
	IssoName *string `json:"issoName"`

	// lifecycle expires at
	// Required: true
	LifecycleExpiresAt *string `json:"lifecycleExpiresAt"`

	// lifecycle ID
	// Required: true
	LifecycleID *string `json:"lifecycleID"`

	// lifecycle scope
	// Required: true
	LifecycleScope *string `json:"lifecycleScope"`

	// oit security collaborator
	// Required: true
	OitSecurityCollaborator *string `json:"oitSecurityCollaborator"`

	// oit security collaborator name
	// Required: true
	OitSecurityCollaboratorName *string `json:"oitSecurityCollaboratorName"`

	// process status
	// Required: true
	ProcessStatus *string `json:"processStatus"`

	// product manager
	// Required: true
	ProductManager *string `json:"productManager"`

	// product manager component
	// Required: true
	ProductManagerComponent *string `json:"productManagerComponent"`

	// project acronym
	// Required: true
	ProjectAcronym *string `json:"projectAcronym"`

	// project name
	// Required: true
	ProjectName *string `json:"projectName"`

	// rejection reason
	// Required: true
	RejectionReason *string `json:"rejectionReason"`

	// request type
	// Required: true
	RequestType *string `json:"requestType"`

	// requester
	// Required: true
	Requester *string `json:"requester"`

	// requester email address
	// Required: true
	RequesterEmailAddress *string `json:"requesterEmailAddress"`

	// solution
	// Required: true
	Solution *string `json:"solution"`

	// status
	// Required: true
	Status *string `json:"status"`

	// submitted at
	// Required: true
	SubmittedAt *string `json:"submittedAt"`

	// trb collaborator
	// Required: true
	TrbCollaborator *string `json:"trbCollaborator"`

	// trb collaborator name
	// Required: true
	TrbCollaboratorName *string `json:"trbCollaboratorName"`

	// user e u a
	// Required: true
	UserEUA *string `json:"userEUA"`
}
