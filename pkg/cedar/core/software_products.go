package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	software_products "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/software_products"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetSoftwareProductsBySystem queries CEDAR for software product/tooling information associated with a particular system, taking the version-independent ID of a system
func (c *Client) GetSoftwareProductsBySystem(ctx context.Context, cedarSystemID string) (*models.CedarSoftwareProducts, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetSoftwareProducts(), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}
	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := software_products.NewSoftwareProductsFindListParams()
	params.SetID(cedarSystem.VersionID.String)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.SoftwareProducts.SoftwareProductsFindList(params, c.auth)
	if err != nil {
		return nil, err
	}

	if resp.Payload == nil {
		return nil, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct

	// Start by converting child SoftwareProduct object array
	softwareProductItems := make([]*models.SoftwareProductItem, 0, len(resp.Payload.SoftwareProducts))

	for _, softwareProduct := range resp.Payload.SoftwareProducts {
		softwareProductItems = append(softwareProductItems, &models.SoftwareProductItem{
			APIGatewayUse:                  softwareProduct.APIGatewayUse,
			ElaPurchase:                    zero.StringFrom(softwareProduct.ElaPurchase),
			ElaVendorID:                    zero.StringFrom(softwareProduct.ElaVendorID),
			ProvidesAiCapability:           softwareProduct.ProvidesAiCapability,
			Refstr:                         zero.StringFrom(softwareProduct.Refstr),
			SoftwareCatagoryConnectionGUID: zero.StringFrom(softwareProduct.SoftwareCatagoryConnectionGUID),
			SoftwareVendorConnectionGUID:   zero.StringFrom(softwareProduct.SoftwareVendorConnectionGUID),
			SoftwareCost:                   zero.StringFrom(softwareProduct.SoftwareCost),
			SoftwareElaOrganization:        zero.StringFrom(softwareProduct.SoftwareElaOrganization),
			SoftwareName:                   zero.StringFrom(softwareProduct.SoftwareName),
			SystemSoftwareConnectionGUID:   zero.StringFrom(softwareProduct.SystemSoftwareConnectionGUID),
			TechnopediaCategory:            zero.StringFrom(softwareProduct.TechnopediaCategory),
			TechnopediaID:                  zero.StringFrom(softwareProduct.TechnopediaID),
			VendorName:                     zero.StringFrom(softwareProduct.VendorName),
		})
	}

	// Convert the rest of the parent SoftwareProducts object
	retVal := &models.CedarSoftwareProducts{
		AiSolnCatg:       models.ZeroStringsFrom(resp.Payload.AiSolnCatg),
		APIDataArea:      models.ZeroStringsFrom(resp.Payload.APIDataArea),
		SoftwareProducts: softwareProductItems,

		AISolnCatgOther:     zero.StringFrom(resp.Payload.AiSolnCatgOther),
		APIDescPubLocation:  zero.StringFrom(resp.Payload.APIDescPubLocation),
		APIDescPublished:    zero.StringFrom(resp.Payload.APIDescPublished),
		APIFHIRUse:          zero.StringFrom(resp.Payload.APIFHIRUse),
		APIFHIRUseOther:     zero.StringFrom(resp.Payload.APIFHIRUseOther),
		APIHasPortal:        resp.Payload.APIHasPortal,
		ApisAccessibility:   zero.StringFrom(resp.Payload.ApisAccessibility),
		ApisDeveloped:       zero.StringFrom(resp.Payload.ApisDeveloped),
		DevelopmentStage:    zero.StringFrom(resp.Payload.DevelopmentStage),
		SystemHasAPIGateway: resp.Payload.SystemHasAPIGateway,
		UsesAiTech:          zero.StringFrom(resp.Payload.UsesAiTech),
	}

	return retVal, nil
}
