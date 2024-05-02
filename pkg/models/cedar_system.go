package models

import (
	"github.com/guregu/null/zero"
)

// CedarSystem is the model for a single system that comes back from the CEDAR Core API
type CedarSystem struct {
	ID                      zero.String `json:"id"`
	Name                    zero.String `json:"name"`
	Description             zero.String `json:"description"`
	Acronym                 zero.String `json:"acronym"`
	Status                  zero.String `json:"status"`
	BusinessOwnerOrg        zero.String `json:"businessOwnerOrg"`
	BusinessOwnerOrgComp    zero.String `json:"businessOwnerOrgComp"`
	SystemMaintainerOrg     zero.String `json:"systemMaintainerOrg"`
	SystemMaintainerOrgComp zero.String `json:"systemMaintainerOrgComp"`
	VersionID               zero.String `json:"versionId"`
	IsBookmarked            bool        `json:"isBookMarked"`
}

// CedarSubSystem is the model for a sub system that comes back from the CEDAR Core API
type CedarSubSystem struct {
	ID          zero.String `json:"id"`
	Name        zero.String `json:"name"`
	Description zero.String `json:"description"`
	Acronym     zero.String `json:"acronym"`
}

// BusinessOwnerInformation contains information about the business owner for a CEDAR system
type BusinessOwnerInformation struct {
	BeneficiaryAddressPurpose      []zero.String `json:"beneficiaryAddressPurpose"`
	BeneficiaryAddressPurposeOther zero.String   `json:"beneficiaryAddressPurposeOther"`
	BeneficiaryAddressSource       []zero.String `json:"beneficiaryAddressSource"`
	BeneficiaryAddressSourceOther  zero.String   `json:"beneficiaryAddressSourceOther"`
	CostPerYear                    zero.String   `json:"costPerYear"`
	IsCmsOwned                     bool          `json:"isCmsOwned"`
	NumberOfContractorFte          zero.String   `json:"numberOfContractorFte"`
	NumberOfFederalFte             zero.String   `json:"numberOfFederalFte"`
	NumberOfSupportedUsersPerMonth zero.String   `json:"numberOfSupportedUsersPerMonth"`
	StoresBankingData              bool          `json:"storesBankingData"`
	StoresBeneficiaryAddress       bool          `json:"storesBeneficiaryAddress"`
}

// SystemMaintainerInformation contains information about the system maintainer of a CEDAR system
type SystemMaintainerInformation struct {
	AgileUsed                  bool          `json:"agileUsed"`
	BusinessArtifactsOnDemand  bool          `json:"businessArtifactsOnDemand"`
	DeploymentFrequency        zero.String   `json:"deploymentFrequency"`
	DevCompletionPercent       zero.String   `json:"devCompletionPercent"`
	DevWorkDescription         zero.String   `json:"devWorkDescription"`
	EcapParticipation          bool          `json:"ecapParticipation"`
	FrontendAccessType         zero.String   `json:"frontendAccessType"`
	HardCodedIPAddress         bool          `json:"hardCodedIpAddress"`
	IP6EnabledAssetPercent     zero.String   `json:"ip6EnabledAssetPercent"`
	IP6TransitionPlan          zero.String   `json:"ip6TransitionPlan"`
	IPEnabledAssetCount        int           `json:"ipEnabledAssetCount"`
	MajorRefreshDate           zero.Time     `json:"majorRefreshDate"`
	NetAccessibility           zero.String   `json:"netAccessibility"`
	OmDocumentationOnDemand    bool          `json:"omDocumentationOnDemand"`
	PlansToRetireReplace       zero.String   `json:"plansToRetireReplace"`
	QuarterToRetireReplace     zero.String   `json:"quarterToRetireReplace"`
	RecordsManagementBucket    []zero.String `json:"recordsManagementBucket"`
	SourceCodeOnDemand         bool          `json:"sourceCodeOnDemand"`
	SystemCustomization        zero.String   `json:"systemCustomization"`
	SystemDesignOnDemand       bool          `json:"systemDesignOnDemand"`
	SystemProductionDate       zero.Time     `json:"systemProductionDate"`
	SystemRequirementsOnDemand bool          `json:"systemRequirementsOnDemand"`
	TestPlanOnDemand           bool          `json:"testPlanOnDemand"`
	TestReportsOnDemand        bool          `json:"testReportsOnDemand"`
	TestScriptsOnDemand        bool          `json:"testScriptsOnDemand"`
	YearToRetireReplace        zero.String   `json:"yearToRetireReplace"`
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
