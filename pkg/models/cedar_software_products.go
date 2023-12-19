package models

// SoftwareProductItem represents a single SoftwareProductSearchItem object which is an internal struct used in SoftwareProduct
type SoftwareProductItem struct {
	APIGatewayUse                  bool   `json:"api_gateway_use,omitempty"`
	ElaPurchase                    string `json:"ela_purchase,omitempty"`
	ElaVendorID                    string `json:"ela_vendor_id,omitempty"`
	ProvidesAiCapability           bool   `json:"provides_ai_capability,omitempty"`
	Refstr                         string `json:"refstr,omitempty"`
	SoftwareCatagoryConnectionGUID string `json:"softwareCatagoryConnectionGuid,omitempty"`
	SoftwareVendorConnectionGUID   string `json:"softwareVendorConnectionGuid,omitempty"`
	SoftwareCost                   string `json:"software_cost,omitempty"`
	SoftwareElaOrganization        string `json:"software_ela_organization,omitempty"`
	SoftwareName                   string `json:"software_name,omitempty"`
	SystemSoftwareConnectionGUID   string `json:"systemSoftwareConnectionGuid,omitempty"`
	TechnopediaCategory            string `json:"technopedia_category,omitempty"`
	TechnopediaID                  string `json:"technopedia_id,omitempty"`
	VendorName                     string `json:"vendor_name,omitempty"`
}

// CedarSoftwareProduct represents a single SoftwareProduct object returned from the CEDAR API
type CedarSoftwareProducts struct {
	// Always present fields
	AiSolnCatg       []string               `json:"aiSolnCatg"`
	ApiDataArea      []string               `json:"apiDataArea"`
	SoftwareProducts []*SoftwareProductItem `json:"softwareProducts"`

	// Possibly null fields
	AISolnCatgOther     string `json:"aiSolnCatgOther,omitempty"`
	ApiDescPubLocation  string `json:"apiDescPubLocation,omitempty"`
	ApiDescPublished    string `json:"apiDescPublished,omitempty"`
	ApiFHIRUse          string `json:"apiFHIRUse,omitempty"`
	ApiFHIRUseOther     string `json:"apiFHIRUseOther,omitempty"`
	ApiHasPortal        bool   `json:"apiHasPortal,omitempty"`
	ApisAccessibility   string `json:"apisAccessibility,omitempty"`
	ApisDeveloped       string `json:"apisDeveloped,omitempty"`
	DevelopmentStage    string `json:"developmentStage,omitempty"`
	SystemHasApiGateway bool   `json:"systemHasApiGateway,omitempty"`
	UsesAiTech          string `json:"usesAiTech,omitempty"`
}
