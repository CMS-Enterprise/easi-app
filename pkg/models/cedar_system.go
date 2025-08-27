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
	ATOEffectiveDate        zero.Time   `json:"atoEffectiveDate"`
	ATOExpirationDate       zero.Time   `json:"atoExpirationDate"`
	State                   zero.String `json:"state"`
	Status                  zero.String `json:"status"`
	BusinessOwnerOrg        zero.String `json:"businessOwnerOrg"`
	BusinessOwnerOrgComp    zero.String `json:"businessOwnerOrgComp"`
	SystemMaintainerOrg     zero.String `json:"systemMaintainerOrg"`
	SystemMaintainerOrgComp zero.String `json:"systemMaintainerOrgComp"`
	VersionID               zero.String `json:"versionId"`
	UUID                    zero.String `json:"uuid"`

	// OaStatus is not always populated - we have to manually set this via separate API call at the time of this writing
	OaStatus zero.String `json:"oaStatus"`
}

type CedarSubSystem struct {
	ID          zero.String `json:"id"`
	Name        zero.String `json:"name"`
	Description zero.String `json:"description"`
	Acronym     zero.String `json:"acronym"`
}

// BusinessOwnerInformation contains information about the Business Owner for a CEDAR system
type BusinessOwnerInformation struct {
	BeneficiaryAddressPurpose      []zero.String `json:"beneficiaryAddressPurpose"`
	BeneficiaryAddressPurposeOther zero.String   `json:"beneficiaryAddressPurposeOther"`
	BeneficiaryAddressSource       []zero.String `json:"beneficiaryAddressSource"`
	BeneficiaryAddressSourceOther  zero.String   `json:"beneficiaryAddressSourceOther"`
	BeneficiaryInformation         []zero.String `json:"beneficiaryInformation"`
	CostPerYear                    zero.String   `json:"costPerYear"`
	EditBeneficiaryInformation     bool          `json:"editBeneficiaryInformation,omitempty"`
	IsCmsOwned                     bool          `json:"isCmsOwned"`
	Nr508UserInterface             zero.String   `json:"nr508UserInterface,omitempty"`
	NumberOfContractorFte          zero.String   `json:"numberOfContractorFte"`
	NumberOfFederalFte             zero.String   `json:"numberOfFederalFte"`
	NumberOfSupportedUsersPerMonth zero.String   `json:"numberOfSupportedUsersPerMonth"`
	StoresBankingData              bool          `json:"storesBankingData"`
	StoresBeneficiaryAddress       bool          `json:"storesBeneficiaryAddress"`
}

// SystemMaintainerInformation contains information about the system maintainer of a CEDAR system
type SystemMaintainerInformation struct {
	AdHocAgileDeploymentFrequency         zero.String   `json:"adHocAgileDeploymentFrequency,omitempty"`
	AgileUsed                             bool          `json:"agileUsed"`
	AuthoritativeDatasource               zero.String   `json:"authoritativeDatasource,omitempty"`
	BusinessArtifactsOnDemand             bool          `json:"businessArtifactsOnDemand"`
	DataAtRestEncryptionKeyManagement     zero.String   `json:"dataAtRestEncryptionKeyManagement,omitempty"`
	DeploymentFrequency                   zero.String   `json:"deploymentFrequency"`
	DevCompletionPercent                  zero.String   `json:"devCompletionPercent"`
	DevWorkDescription                    zero.String   `json:"devWorkDescription"`
	EcapParticipation                     bool          `json:"ecapParticipation"`
	FrontendAccessType                    zero.String   `json:"frontendAccessType"`
	HardCodedIPAddress                    bool          `json:"hardCodedIpAddress"`
	IP6EnabledAssetPercent                zero.String   `json:"ip6EnabledAssetPercent"`
	IP6TransitionPlan                     zero.String   `json:"ip6TransitionPlan"`
	IPEnabledAssetCount                   int           `json:"ipEnabledAssetCount"`
	LegalHoldCaseName                     zero.String   `json:"legalHoldCaseName,omitempty"`
	LocallyStoredUserInformation          bool          `json:"locallyStoredUserInformation,omitempty"`
	MajorRefreshDate                      zero.Time     `json:"majorRefreshDate"`
	MultifactorAuthenticationMethod       []zero.String `json:"multifactorAuthenticationMethod"`
	MultifactorAuthenticationMethodOther  zero.String   `json:"multifactorAuthenticationMethodOther,omitempty"`
	NetAccessibility                      zero.String   `json:"netAccessibility"`
	NetworkTrafficEncryptionKeyManagement zero.String   `json:"networkTrafficEncryptionKeyManagement,omitempty"`
	NoMajorRefresh                        bool          `json:"noMajorRefresh,omitempty"`
	NoPersistentRecordsFlag               bool          `json:"noPersistentRecordsFlag,omitempty"`
	NoPlannedMajorRefresh                 bool          `json:"noPlannedMajorRefresh,omitempty"`
	OmDocumentationOnDemand               bool          `json:"omDocumentationOnDemand"`
	PlansToRetireReplace                  zero.String   `json:"plansToRetireReplace"`
	QuarterToRetireReplace                zero.String   `json:"quarterToRetireReplace"`
	RecordsManagementBucket               []zero.String `json:"recordsManagementBucket"`
	RecordsManagementDisposalLocation     zero.String   `json:"recordsManagementDisposalLocation,omitempty"`
	RecordsManagementDisposalPlan         zero.String   `json:"recordsManagementDisposalPlan,omitempty"`
	RecordsUnderLegalHold                 bool          `json:"recordsUnderLegalHold,omitempty"`
	SourceCodeOnDemand                    bool          `json:"sourceCodeOnDemand"`
	SystemCustomization                   zero.String   `json:"systemCustomization"`
	SystemDesignOnDemand                  bool          `json:"systemDesignOnDemand"`
	SystemDataLocation                    []zero.String `json:"systemDataLocation"`
	SystemDataLocationNotes               zero.String   `json:"systemDataLocationNotes,omitempty"`
	SystemProductionDate                  zero.Time     `json:"systemProductionDate"`
	SystemRequirementsOnDemand            bool          `json:"systemRequirementsOnDemand"`
	TestPlanOnDemand                      bool          `json:"testPlanOnDemand"`
	TestReportsOnDemand                   bool          `json:"testReportsOnDemand"`
	TestScriptsOnDemand                   bool          `json:"testScriptsOnDemand"`
	YearToRetireReplace                   zero.String   `json:"yearToRetireReplace"`
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
	IsMySystem                  bool               `json:"isMySystem"`
	ATOEffectiveDate            zero.Time          `json:"atoEffectiveDate"`
	ATOExpirationDate           zero.Time          `json:"atoExpirationDate"`
}
