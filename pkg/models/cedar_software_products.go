package models

import (
	"github.com/guregu/null/zero"
)

// SoftwareProductItem represents a single SoftwareProductSearchItem object which is an internal struct used in SoftwareProduct
type SoftwareProductItem struct {
	APIGatewayUse                  bool        `json:"api_gateway_use,omitempty"`
	ElaPurchase                    zero.String `json:"ela_purchase,omitempty"`
	ElaVendorID                    zero.String `json:"ela_vendor_id,omitempty"`
	ProvidesAiCapability           bool        `json:"provides_ai_capability,omitempty"`
	Refstr                         zero.String `json:"refstr,omitempty"`
	SoftwareCatagoryConnectionGUID zero.String `json:"softwareCatagoryConnectionGuid,omitempty"`
	SoftwareVendorConnectionGUID   zero.String `json:"softwareVendorConnectionGuid,omitempty"`
	SoftwareCost                   zero.String `json:"software_cost,omitempty"`
	SoftwareElaOrganization        zero.String `json:"software_ela_organization,omitempty"`
	SoftwareName                   zero.String `json:"software_name,omitempty"`
	SystemSoftwareConnectionGUID   zero.String `json:"systemSoftwareConnectionGuid,omitempty"`
	TechnopediaCategory            zero.String `json:"technopedia_category,omitempty"`
	TechnopediaID                  zero.String `json:"technopedia_id,omitempty"`
	VendorName                     zero.String `json:"vendor_name,omitempty"`
}

// CedarSoftwareProducts represents a single SoftwareProduct object returned from the CEDAR API
type CedarSoftwareProducts struct {
	// Always present fields
	AiSolnCatg       []zero.String          `json:"aiSolnCatg"`
	APIDataArea      []zero.String          `json:"apiDataArea"`
	SoftwareProducts []*SoftwareProductItem `json:"softwareProducts"`

	// Possibly null fields
	AISolnCatgOther     zero.String `json:"aiSolnCatgOther,omitempty"`
	APIDescPubLocation  zero.String `json:"apiDescPubLocation,omitempty"`
	APIDescPublished    zero.String `json:"apiDescPublished,omitempty"`
	APIFHIRUse          zero.String `json:"apiFHIRUse,omitempty"`
	APIFHIRUseOther     zero.String `json:"apiFHIRUseOther,omitempty"`
	APIHasPortal        bool        `json:"apiHasPortal,omitempty"`
	ApisAccessibility   zero.String `json:"apisAccessibility,omitempty"`
	ApisDeveloped       zero.String `json:"apisDeveloped,omitempty"`
	DevelopmentStage    zero.String `json:"developmentStage,omitempty"`
	SystemHasAPIGateway bool        `json:"systemHasApiGateway,omitempty"`
	UsesAiTech          zero.String `json:"usesAiTech,omitempty"`
}
