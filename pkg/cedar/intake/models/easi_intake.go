package models

// EASIIntake represents a system intake
type EASIIntake struct {
	AdminLead                   string `json:"adminLead"`
	ArchivedAt                  string `json:"archivedAt"`
	BusinessNeed                string `json:"businessNeed"`
	BusinessOwner               string `json:"businessOwner"`
	BusinessOwnerComponent      string `json:"businessOwnerComponent"`
	Component                   string `json:"component"`
	ContractEndDate             string `json:"contractEndDate"`
	ContractStartDate           string `json:"contractStartDate"`
	ContractVehicle             string `json:"contractVehicle"`
	Contractor                  string `json:"contractor"`
	CostIncrease                string `json:"costIncrease"`
	CostIncreaseAmount          string `json:"costIncreaseAmount"`
	DecidedAt                   string `json:"decidedAt"`
	DecisionNextSteps           string `json:"decisionNextSteps"`
	EaCollaborator              string `json:"eaCollaborator"`
	EaCollaboratorName          string `json:"eaCollaboratorName"`
	EaSupportRequest            string `json:"eaSupportRequest" jsonschema:"enum=,enum=false,enum=true"`
	ExistingContract            string `json:"existingContract"`
	ExistingFunding             string `json:"existingFunding" jsonschema:"enum=,enum=false,enum=true"`
	FundingNumber               string `json:"fundingNumber"`
	FundingSource               string `json:"fundingSource"`
	GrbDate                     string `json:"grbDate"`
	GrtDate                     string `json:"grtDate"`
	GrtReviewEmailBody          string `json:"grtReviewEmailBody"`
	Isso                        string `json:"isso"`
	IssoName                    string `json:"issoName"`
	LifecycleExpiresAt          string `json:"lifecycleExpiresAt"`
	LifecycleID                 string `json:"lifecycleID"`
	LifecycleScope              string `json:"lifecycleScope"`
	OitSecurityCollaborator     string `json:"oitSecurityCollaborator"`
	OitSecurityCollaboratorName string `json:"oitSecurityCollaboratorName"`
	ProcessStatus               string `json:"processStatus"`
	ProductManager              string `json:"productManager"`
	ProductManagerComponent     string `json:"productManagerComponent"`
	ProjectAcronym              string `json:"projectAcronym"`
	ProjectName                 string `json:"projectName"`
	RejectionReason             string `json:"rejectionReason"`
	RequestType                 string `json:"requestType"`
	Requester                   string `json:"requester"`
	RequesterEmailAddress       string `json:"requesterEmailAddress"`
	Solution                    string `json:"solution"`
	Status                      string `json:"status"`
	SubmittedAt                 string `json:"submittedAt"`
	TrbCollaborator             string `json:"trbCollaborator"`
	TrbCollaboratorName         string `json:"trbCollaboratorName"`
	UserEUA                     string `json:"userEUA"`
}
