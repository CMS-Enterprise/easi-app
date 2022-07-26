package cedarcore

import (
	"context"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/exchange"
	"github.com/cmsgov/easi-app/pkg/models"
)

// ExchangeDirection is an enumeration of possible values for the direction parameter in the /exchange API
type ExchangeDirection string

const (
	// ExchangeDirectionSender requests only exchanges where the system is the sender
	ExchangeDirectionSender ExchangeDirection = "sender"
	// ExchangeDirectionReceiver requests only exchanges where the system is the receiver
	ExchangeDirectionReceiver = "receiver"
	// ExchangeDirectionBoth requests both exchanges where the system is either the sender or the receiver
	ExchangeDirectionBoth = "both"
)

// GetExchangesBySystemAndDirection gets a list of exchanges from the CEDAR API by system and direction
func (c *Client) GetExchangesBySystemAndDirection(ctx context.Context, cedarSystemID string, direction ExchangeDirection) ([]*models.CedarExchange, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarExchange{}, nil
	}

	// Construct the parameters
	params := exchange.NewExchangeFindListParams()
	params.SetSystemID(cedarSystemID)
	params.SetDirection(string(direction))
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

		retVal = append(retVal, &models.CedarExchange{
			ConnectionFrequency:        exch.ConnectionFrequency,
			ContainsBankingData:        exch.ContainsBankingData,
			ContainsBeneficiaryAddress: exch.ContainsBeneficiaryAddress,
			ContainsPhi:                exch.ContainsPhi,
			ContainsPii:                exch.ContainsPii,
			DataExchangeAgreement:      exch.DataExchangeAgreement,
			DataFormat:                 exch.DataFormat,
			DataFormatOther:            exch.DataFormatOther,
			ExchangeDescription:        exch.ExchangeDescription,
			ExchangeEndDate:            zero.TimeFrom(time.Time(exch.ExchangeEndDate)),
			ExchangeID:                 exch.ExchangeID,
			ExchangeName:               exch.ExchangeName,
			ExchangeRetiredDate:        zero.TimeFrom(time.Time(exch.ExchangeRetiredDate)),
			ExchangeStartDate:          zero.TimeFrom(time.Time(exch.ExchangeStartDate)),
			ExchangeState:              exch.ExchangeState,
			ExchangeVersion:            exch.ExchangeVersion,
			FromOwnerID:                exch.FromOwnerID,
			FromOwnerName:              exch.FromOwnerName,
			FromOwnerType:              exch.FromOwnerType,
			IsBeneficiaryMailingFile:   exch.IsBeneficiaryMailingFile,
			NumOfRecords:               exch.NumOfRecords,
			SharedViaAPI:               exch.SharedViaAPI,
			ToOwnerID:                  exch.ToOwnerID,
			ToOwnerName:                exch.ToOwnerName,
			ToOwnerType:                exch.ToOwnerType,
			TypeOfData:                 typeOfData,
		})
	}
	return retVal, nil
}
