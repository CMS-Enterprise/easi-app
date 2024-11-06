package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func GetSoftwareProducts() *models.CedarSoftwareProducts {
	return &models.CedarSoftwareProducts{
		AiSolnCatg: []zero.String{},
		APIDataArea: []zero.String{
			zero.StringFrom("Supporting Resource"),
			zero.StringFrom("Healthcare Quality"),
		},
		AISolnCatgOther:     zero.StringFromPtr(nil),
		APIDescPubLocation:  zero.StringFromPtr(nil),
		APIDescPublished:    zero.StringFrom("No. not published"),
		APIFHIRUse:          zero.StringFrom("No"),
		APIFHIRUseOther:     zero.StringFromPtr(nil),
		APIHasPortal:        false,
		ApisAccessibility:   zero.StringFrom("Both"),
		ApisDeveloped:       zero.StringFrom("Yes"),
		DevelopmentStage:    zero.StringFromPtr(nil),
		SystemHasAPIGateway: true,
		UsesAiTech:          zero.StringFrom("No"),
		SoftwareProducts: []*models.SoftwareProductItem{
			{
				SoftwareName:                   zero.StringFrom("Elastic Compute Cloud (Amazon EC2)"),
				TechnopediaCategory:            zero.StringFrom("IT Management"),
				TechnopediaID:                  zero.StringFrom("12340001"),
				VendorName:                     zero.StringFrom("Amazon"),
				APIGatewayUse:                  false,
				ElaPurchase:                    zero.StringFromPtr(nil),
				ElaVendorID:                    zero.StringFromPtr(nil),
				ProvidesAiCapability:           false,
				Refstr:                         zero.StringFromPtr(nil),
				SoftwareCatagoryConnectionGUID: zero.StringFrom("{1CAT234D-A12B-12a3-1234A45B000A}"),
				SoftwareVendorConnectionGUID:   zero.StringFrom("{1VEN234D-A12B-12a3-1234A45B000A}"),
				SoftwareCost:                   zero.StringFromPtr(nil),
				SoftwareElaOrganization:        zero.StringFromPtr(nil),
				SystemSoftwareConnectionGUID:   zero.StringFrom("{1SOF234D-A12B-12a3-1234A45B000A}"),
			},
			{
				SoftwareName:                   zero.StringFrom("AWS Certificate Manager"),
				TechnopediaCategory:            zero.StringFrom("IT Management"),
				TechnopediaID:                  zero.StringFrom("12340002"),
				VendorName:                     zero.StringFrom("Amazon"),
				APIGatewayUse:                  false,
				ElaPurchase:                    zero.StringFromPtr(nil),
				ElaVendorID:                    zero.StringFromPtr(nil),
				ProvidesAiCapability:           false,
				Refstr:                         zero.StringFromPtr(nil),
				SoftwareCatagoryConnectionGUID: zero.StringFrom("{1CAT234D-A12B-12a3-1234A45B000B}"),
				SoftwareVendorConnectionGUID:   zero.StringFrom("{1VEN234D-A12B-12a3-1234A45B000B}"),
				SoftwareCost:                   zero.StringFromPtr(nil),
				SoftwareElaOrganization:        zero.StringFromPtr(nil),
				SystemSoftwareConnectionGUID:   zero.StringFrom("{1SOF234D-A12B-12a3-1234A45B000B}"),
			},
			{
				SoftwareName:                   zero.StringFrom("DynamoDB"),
				TechnopediaCategory:            zero.StringFrom("IT Management"),
				TechnopediaID:                  zero.StringFrom("12340003"),
				VendorName:                     zero.StringFrom("Amazon"),
				APIGatewayUse:                  false,
				ElaPurchase:                    zero.StringFromPtr(nil),
				ElaVendorID:                    zero.StringFromPtr(nil),
				ProvidesAiCapability:           false,
				Refstr:                         zero.StringFromPtr(nil),
				SoftwareCatagoryConnectionGUID: zero.StringFrom("{1CAT234D-A12B-12a3-1234A45B000C}"),
				SoftwareVendorConnectionGUID:   zero.StringFrom("{1VEN234D-A12B-12a3-1234A45B000C}"),
				SoftwareCost:                   zero.StringFromPtr(nil),
				SoftwareElaOrganization:        zero.StringFromPtr(nil),
				SystemSoftwareConnectionGUID:   zero.StringFrom("{1SOF234D-A12B-12a3-1234A45B000C}"),
			},
			{
				SoftwareName:                   zero.StringFrom("Shamrock Antivirus (ShamAV)"),
				TechnopediaCategory:            zero.StringFrom("Security"),
				TechnopediaID:                  zero.StringFrom("12340004"),
				VendorName:                     zero.StringFrom("MacCloud"),
				APIGatewayUse:                  false,
				ElaPurchase:                    zero.StringFromPtr(nil),
				ElaVendorID:                    zero.StringFromPtr(nil),
				ProvidesAiCapability:           false,
				Refstr:                         zero.StringFromPtr(nil),
				SoftwareCatagoryConnectionGUID: zero.StringFrom("{1CAT234D-A12B-12a3-1234A45B000D}"),
				SoftwareVendorConnectionGUID:   zero.StringFrom("{1VEN234D-A12B-12a3-1234A45B000D}"),
				SoftwareCost:                   zero.StringFromPtr(nil),
				SoftwareElaOrganization:        zero.StringFromPtr(nil),
				SystemSoftwareConnectionGUID:   zero.StringFrom("{1SOF234D-A12B-12a3-1234A45B000D}"),
			},
		},
	}
}
