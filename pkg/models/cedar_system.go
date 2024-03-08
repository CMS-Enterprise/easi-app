package models

// CedarSystem is the model for a single system that comes back from the CEDAR Core API
type CedarSystem struct {
	ID                      string `json:"id"`
	Name                    string `json:"name"`
	Description             string `json:"description"`
	Acronym                 string `json:"acronym"`
	Status                  string `json:"status"`
	BusinessOwnerOrg        string `json:"businessOwnerOrg"`
	BusinessOwnerOrgComp    string `json:"businessOwnerOrgComp"`
	SystemMaintainerOrg     string `json:"systemMaintainerOrg"`
	SystemMaintainerOrgComp string `json:"systemMaintainerOrgComp"`
	VersionID               string `json:"versionId"`
}

// BusinessOwnerInformation contains information about the business owner for a CEDAR system
type BusinessOwnerInformation struct {
	BeneficiaryAddressPurpose      []string `json:"beneficiaryAddressPurpose"`
	BeneficiaryAddressPurposeOther string   `json:"beneficiaryAddressPurposeOther"`
	BeneficiaryAddressSource       []string `json:"beneficiaryAddressSource"`
	BeneficiaryAddressSourceOther  string   `json:"beneficiaryAddressSourceOther"`
	CostPerYear                    string   `json:"costPerYear"`
	IsCmsOwned                     bool     `json:"isCmsOwned"`
	NumberOfContractorFte          string   `json:"numberOfContractorFte"`
	NumberOfFederalFte             string   `json:"numberOfFederalFte"`
	NumberOfSupportedUsersPerMonth string   `json:"numberOfSupportedUsersPerMonth"`
	StoresBankingData              bool     `json:"storesBankingData"`
	StoresBeneficiaryAddress       bool     `json:"storesBeneficiaryAddress"`
}

// SystemMaintainerInformation contains information about the system maintainer of a CEDAR system
type SystemMaintainerInformation struct {
	AgileUsed                  bool     `json:"agileUsed"`
	BusinessArtifactsOnDemand  bool     `json:"businessArtifactsOnDemand"`
	DeploymentFrequency        string   `json:"deploymentFrequency"`
	DevCompletionPercent       string   `json:"devCompletionPercent"`
	DevWorkDescription         string   `json:"devWorkDescription"`
	EcapParticipation          bool     `json:"ecapParticipation"`
	FrontendAccessType         string   `json:"frontendAccessType"`
	HardCodedIPAddress         bool     `json:"hardCodedIpAddress"`
	IP6EnabledAssetPercent     string   `json:"ip6EnabledAssetPercent"`
	IP6TransitionPlan          string   `json:"ip6TransitionPlan"`
	IPEnabledAssetCount        int32    `json:"ipEnabledAssetCount"`
	MajorRefreshDate           string   `json:"majorRefreshDate"`
	NetAccessibility           string   `json:"netAccessibility"`
	OmDocumentationOnDemand    bool     `json:"omDocumentationOnDemand"`
	PlansToRetireReplace       string   `json:"plansToRetireReplace"`
	QuarterToRetireReplace     string   `json:"quarterToRetireReplace"`
	RecordsManagementBucket    []string `json:"recordsManagementBucket"`
	SourceCodeOnDemand         bool     `json:"sourceCodeOnDemand"`
	SystemCustomization        string   `json:"systemCustomization"`
	SystemDesignOnDemand       bool     `json:"systemDesignOnDemand"`
	SystemProductionDate       string   `json:"systemProductionDate"`
	SystemRequirementsOnDemand bool     `json:"systemRequirementsOnDemand"`
	TestPlanOnDemand           bool     `json:"testPlanOnDemand"`
	TestReportsOnDemand        bool     `json:"testReportsOnDemand"`
	TestScriptsOnDemand        bool     `json:"testScriptsOnDemand"`
	YearToRetireReplace        string   `json:"yearToRetireReplace"`
}

// CedarSystemDetails contains more detailed information related to a CEDAR system
type CedarSystemDetails struct {
	CedarSystem                 *CedarSystem
	BusinessOwnerInformation    *BusinessOwnerInformation
	SystemMaintainerInformation *SystemMaintainerInformation
	Roles                       []*CedarRole       `json:"roles"`
	Deployments                 []*CedarDeployment `json:"deployments"`
	Threats                     []*CedarThreat     `json:"threats"`
	URLs                        []*CedarURL        `json:"urls"`
}
