package cedarcore

import (
	"context"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/exchange"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// GetExchangesBySystem fetches a list of CEDAR exchange records for a given system
func (c *Client) GetExchangesBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarExchange, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetExchange(cedarSystemID), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := exchange.NewExchangeFindListParams()
	params.SetSystemID(cedarSystem.VersionID.String)
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
				ID:   zero.StringFrom(item.ID),
				Name: zero.StringFrom(item.Name),
			})
		}

		var direction models.ExchangeDirection
		if exch.FromOwnerID == cedarSystem.VersionID.String {
			direction = models.ExchangeDirection(models.ExchangeDirectionSender)
		} else if exch.ToOwnerID == cedarSystem.VersionID.String {
			direction = models.ExchangeDirection(models.ExchangeDirectionReceiver)
		}

		connectionFrequency := []zero.String{}
		for _, v := range exch.ConnectionFrequency {
			connectionFrequency = append(connectionFrequency, zero.StringFrom(v))
		}

		retVal = append(retVal, &models.CedarExchange{
			ConnectionFrequency:         connectionFrequency,
			ContainsBankingData:         exch.ContainsBankingData,
			ContainsBeneficiaryAddress:  exch.ContainsBeneficiaryAddress,
			ContainsPhi:                 exch.ContainsPhi,
			ContainsPii:                 exch.ContainsPii,
			ContainsHealthDisparityData: exch.ContainsHealthDisparityData,
			DataExchangeAgreement:       zero.StringFrom(exch.DataExchangeAgreement),
			DataFormat:                  zero.StringFrom(exch.DataFormat),
			DataFormatOther:             zero.StringFrom(exch.DataFormatOther),
			ExchangeDescription:         zero.StringFrom(exch.ExchangeDescription),
			ExchangeEndDate:             zero.TimeFrom(time.Time(exch.ExchangeEndDate)),
			ExchangeID:                  zero.StringFrom(exch.ExchangeID),
			ExchangeName:                zero.StringFrom(exch.ExchangeName),
			ExchangeRetiredDate:         zero.TimeFrom(time.Time(exch.ExchangeRetiredDate)),
			ExchangeStartDate:           zero.TimeFrom(time.Time(exch.ExchangeStartDate)),
			ExchangeState:               zero.StringFrom(exch.ExchangeState),
			ExchangeVersion:             zero.StringFrom(exch.ExchangeVersion),
			ExchangeDirection:           direction,
			FromOwnerID:                 zero.StringFrom(exch.FromOwnerID),
			FromOwnerName:               zero.StringFrom(exch.FromOwnerName),
			FromOwnerType:               zero.StringFrom(exch.FromOwnerType),
			IsBeneficiaryMailingFile:    exch.IsBeneficiaryMailingFile,
			NumOfRecords:                zero.StringFrom(exch.NumOfRecords),
			SharedViaAPI:                exch.SharedViaAPI,
			ToOwnerID:                   zero.StringFrom(exch.ToOwnerID),
			ToOwnerName:                 zero.StringFrom(exch.ToOwnerName),
			ToOwnerType:                 zero.StringFrom(exch.ToOwnerType),
			TypeOfData:                  typeOfData,
		})
	}
	return retVal, nil
}
