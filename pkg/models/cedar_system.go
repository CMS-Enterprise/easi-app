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
	BeneficiaryAddressPurposeOther string   `json:"beneficiaryAddressPurposeOther,omitempty"`
	BeneficiaryAddressSource       []string `json:"beneficiaryAddressSource"`
	BeneficiaryAddressSourceOther  string   `json:"beneficiaryAddressSourceOther,omitempty"`
	CostPerYear                    string   `json:"costPerYear,omitempty"`
	IsCmsOwned                     bool     `json:"isCmsOwned,omitempty"`
	NumberOfContractorFte          string   `json:"numberOfContractorFte,omitempty"`
	NumberOfFederalFte             string   `json:"numberOfFederalFte,omitempty"`
	NumberOfSupportedUsersPerMonth string   `json:"numberOfSupportedUsersPerMonth,omitempty"`
	StoresBankingData              bool     `json:"storesBankingData,omitempty"`
	StoresBeneficiaryAddress       bool     `json:"storesBeneficiaryAddress,omitempty"`
}

// SystemMaintainerInformation contains information about the system maintainer of a CEDAR system
type SystemMaintainerInformation struct {
	AgileUsed                  bool     `json:"agileUsed,omitempty"`
	BusinessArtifactsOnDemand  bool     `json:"businessArtifactsOnDemand,omitempty"`
	DeploymentFrequency        string   `json:"deploymentFrequency,omitempty"`
	DevCompletionPercent       string   `json:"devCompletionPercent,omitempty"`
	DevWorkDescription         string   `json:"devWorkDescription,omitempty"`
	EcapParticipation          bool     `json:"ecapParticipation,omitempty"`
	FrontendAccessType         string   `json:"frontendAccessType,omitempty"`
	HardCodedIPAddress         bool     `json:"hardCodedIpAddress,omitempty"`
	IP6EnabledAssetPercent     string   `json:"ip6EnabledAssetPercent,omitempty"`
	IP6TransitionPlan          string   `json:"ip6TransitionPlan,omitempty"`
	IPEnabledAssetCount        int32    `json:"ipEnabledAssetCount,omitempty"`
	MajorRefreshDate           string   `json:"majorRefreshDate,omitempty"`
	NetAccessibility           string   `json:"netAccessibility,omitempty"`
	OmDocumentationOnDemand    bool     `json:"omDocumentationOnDemand,omitempty"`
	PlansToRetireReplace       string   `json:"plansToRetireReplace,omitempty"`
	QuarterToRetireReplace     string   `json:"quarterToRetireReplace,omitempty"`
	RecordsManagementBucket    []string `json:"recordsManagementBucket"`
	SourceCodeOnDemand         bool     `json:"sourceCodeOnDemand,omitempty"`
	SystemCustomization        string   `json:"systemCustomization,omitempty"`
	SystemDesignOnDemand       bool     `json:"systemDesignOnDemand,omitempty"`
	SystemProductionDate       string   `json:"systemProductionDate,omitempty"`
	SystemRequirementsOnDemand bool     `json:"systemRequirementsOnDemand,omitempty"`
	TestPlanOnDemand           bool     `json:"testPlanOnDemand,omitempty"`
	TestReportsOnDemand        bool     `json:"testReportsOnDemand,omitempty"`
	TestScriptsOnDemand        bool     `json:"testScriptsOnDemand,omitempty"`
	YearToRetireReplace        string   `json:"yearToRetireReplace,omitempty"`
}

// CedarSystemDetail contains more detailed information related to a CEDAR system
type CedarSystemDetail struct {
	CedarSystem
	BusinessOwnerInformation    *BusinessOwnerInformation
	SystemMaintainerInformation *SystemMaintainerInformation
}
