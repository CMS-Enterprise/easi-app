package models

import (
	"github.com/guregu/null/zero"
)

// SoftwareProductItem represents a single SoftwareProductSearchItem object which is an internal struct used in SoftwareProduct
type SoftwareProductItem struct {
	APIGatewayUse                  zero.Bool   `json:"api_gateway_use,omitempty"`
	ElaPurchase                    zero.String `json:"ela_purchase,omitempty"`
	ElaVendorID                    zero.String `json:"ela_vendor_id,omitempty"`
	ProvidesAiCapability           zero.Bool   `json:"provides_ai_capability,omitempty"`
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

// CedarSoftwareProduct represents a single SoftwareProduct object returned from the CEDAR API
type CedarSoftwareProducts struct {
	// Always present fields
	AiSolnCatg       []string               `json:"aiSolnCatg"`
	ApiDataArea      []string               `json:"apiDataArea"`
	SoftwareProducts []*SoftwareProductItem `json:"softwareProducts"`

	// Possibly null fields
	AISolnCatgOther     zero.String `json:"aiSolnCatgOther,omitempty"`
	APIDescPubLocation  zero.String `json:"apiDescPubLocation,omitempty"`
	APIDescPublished    zero.String `json:"apiDescPublished,omitempty"`
	APIFHIRUse          zero.String `json:"apiFHIRUse,omitempty"`
	APIFHIRUseOther     zero.String `json:"apiFHIRUseOther,omitempty"`
	APIHasPortal        zero.Bool   `json:"apiHasPortal,omitempty"`
	ApisAccessibility   zero.String `json:"apisAccessibility,omitempty"`
	ApisDeveloped       zero.String `json:"apisDeveloped,omitempty"`
	DevelopmentStage    zero.String `json:"developmentStage,omitempty"`
	SystemHasAPIGateway zero.Bool   `json:"systemHasApiGateway,omitempty"`
	UsesAiTech          zero.String `json:"usesAiTech,omitempty"`
}