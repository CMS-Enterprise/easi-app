package cedarcore

import (
	"context"
	"time"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/exchange"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetExchangesBySystem fetches a list of CEDAR exchange records for a given system
func (c *Client) GetExchangesBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarExchange, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarExchange{}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := exchange.NewExchangeFindListParams()
	params.SetSystemID(cedarSystem.VersionID)
	params.SetDirection("both")
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Exchange.ExchangeFindList(params, c.auth)
	if err != nil {
		return nil, err
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := make([]*models.CedarExchange, 0, len(resp.Payload.Exchanges))

	for _, exch := range resp.Payload.Exchanges {
		typeOfData := make([]*models.CedarExchangeTypeOfDataItem, 0, len(exch.TypeOfData))
		for _, item := range exch.TypeOfData {
			typeOfData = append(typeOfData, &models.CedarExchangeTypeOfDataItem{
				ID:   item.ID,
				Name: item.Name,
			})
		}

		var direction models.ExchangeDirection
		if exch.FromOwnerID == cedarSystem.VersionID {
			direction = models.ExchangeDirection(models.ExchangeDirectionSender)
		} else if exch.ToOwnerID == cedarSystem.VersionID {
			direction = models.ExchangeDirection(models.ExchangeDirectionReceiver)
		}

		retVal = append(retVal, &models.CedarExchange{
			ConnectionFrequency:        exch.ConnectionFrequency,
			ContainsBankingData:        null.BoolFrom(exch.ContainsBankingData),
			ContainsBeneficiaryAddress: null.BoolFrom(exch.ContainsBeneficiaryAddress),
			ContainsPhi:                null.BoolFrom(exch.ContainsPhi),
			ContainsPii:                null.BoolFrom(exch.ContainsPii),
			DataExchangeAgreement:      zero.StringFrom(exch.DataExchangeAgreement),
			DataFormat:                 zero.StringFrom(exch.DataFormat),
			DataFormatOther:            zero.StringFrom(exch.DataFormatOther),
			ExchangeDescription:        zero.StringFrom(exch.ExchangeDescription),
			ExchangeEndDate:            zero.TimeFrom(time.Time(exch.ExchangeEndDate)),
			ExchangeID:                 zero.StringFrom(exch.ExchangeID),
			ExchangeName:               zero.StringFrom(exch.ExchangeName),
			ExchangeRetiredDate:        zero.TimeFrom(time.Time(exch.ExchangeRetiredDate)),
			ExchangeStartDate:          zero.TimeFrom(time.Time(exch.ExchangeStartDate)),
			ExchangeState:              zero.StringFrom(exch.ExchangeState),
			ExchangeVersion:            zero.StringFrom(exch.ExchangeVersion),
			ExchangeDirection:          direction,
			FromOwnerID:                zero.StringFrom(exch.FromOwnerID),
			FromOwnerName:              zero.StringFrom(exch.FromOwnerName),
			FromOwnerType:              zero.StringFrom(exch.FromOwnerType),
			IsBeneficiaryMailingFile:   null.BoolFrom(exch.IsBeneficiaryMailingFile),
			NumOfRecords:               zero.StringFrom(exch.NumOfRecords),
			SharedViaAPI:               null.BoolFrom(exch.SharedViaAPI),
			ToOwnerID:                  zero.StringFrom(exch.ToOwnerID),
			ToOwnerName:                zero.StringFrom(exch.ToOwnerName),
			ToOwnerType:                zero.StringFrom(exch.ToOwnerType),
			TypeOfData:                 typeOfData,
		})
	}
	return retVal, nil
}
