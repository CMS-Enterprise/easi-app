package cedarcore

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"

	software_products "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/software_products"
)

// GetBudgetBySystem queries CEDAR for budget information (NJD EXPAND ON THIS?) associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetSoftwareProductsBySystem(ctx context.Context, cedarSystemID string) (*models.CedarSoftwareProducts, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil, nil
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := software_products.NewSoftwareProductsFindListParams()
	params.SetID(cedarSystem.VersionID)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.SoftwareProducts.SoftwareProductsFindList(params, c.auth)
	if err != nil {
		return nil, err
	}

	if resp.Payload == nil {
		return nil, fmt.Errorf("no body received") // NJD - this ok here?
	}

	// Convert the auto-generated struct to our own pkg/models struct

	// Start by converting child SoftwareProduct object array
	softwareProductItems := make([]*models.SoftwareProductItem, 0, len(resp.Payload.SoftwareProducts))

	for _, softwareProduct := range resp.Payload.SoftwareProducts {
		softwareProductItems = append(softwareProductItems, &models.SoftwareProductItem{
			APIGatewayUse:                  softwareProduct.APIGatewayUse,
			ElaPurchase:                    softwareProduct.ElaPurchase,
			ElaVendorID:                    softwareProduct.ElaVendorID,
			ProvidesAiCapability:           softwareProduct.ProvidesAiCapability,
			Refstr:                         softwareProduct.Refstr,
			SoftwareCatagoryConnectionGUID: softwareProduct.SoftwareCatagoryConnectionGUID,
			SoftwareVendorConnectionGUID:   softwareProduct.SoftwareVendorConnectionGUID,
			SoftwareCost:                   softwareProduct.SoftwareCost,
			SoftwareElaOrganization:        softwareProduct.SoftwareElaOrganization,
			SoftwareName:                   softwareProduct.SoftwareName,
			SystemSoftwareConnectionGUID:   softwareProduct.SystemSoftwareConnectionGUID,
			TechnopediaCategory:            softwareProduct.TechnopediaCategory,
			TechnopediaID:                  softwareProduct.TechnopediaID,
		})
	}

	// Convert the rest of the parent SoftwareProducts object
	retVal := &models.CedarSoftwareProducts{
		AiSolnCatg:       resp.Payload.AiSolnCatg,
		ApiDataArea:      resp.Payload.APIDataArea,
		SoftwareProducts: softwareProductItems,

		AISolnCatgOther:     resp.Payload.AiSolnCatgOther,
		ApiDescPubLocation:  resp.Payload.APIDescPubLocation,
		ApiDescPublished:    resp.Payload.APIDescPublished,
		ApiFHIRUse:          resp.Payload.APIFHIRUse,
		ApiFHIRUseOther:     resp.Payload.APIFHIRUseOther,
		ApiHasPortal:        resp.Payload.APIHasPortal,
		ApisAccessibility:   resp.Payload.ApisAccessibility,
		ApisDeveloped:       resp.Payload.ApisDeveloped,
		DevelopmentStage:    resp.Payload.DevelopmentStage,
		SystemHasApiGateway: resp.Payload.SystemHasAPIGateway,
		UsesAiTech:          resp.Payload.UsesAiTech,
	}

	return retVal, nil
}
