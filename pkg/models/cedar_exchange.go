package models

import (
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
)

// ExchangeDirection indicates the direction of data flow in a CEDAR exchange
type ExchangeDirection string

const (
	// ExchangeDirectionSender indicates that the system is the sender of data in the data exchange
	ExchangeDirectionSender ExchangeDirection = "sender"
	// ExchangeDirectionReceiver indicates that the system is the receiver of data in the data exchange
	ExchangeDirectionReceiver = "receiver"
)

// CedarExchangeTypeOfDataItem is one item of the TypeofData slice in a CedarExchange
type CedarExchangeTypeOfDataItem struct {
	ID   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

// CedarExchange contains information about how data is exchanged between a CEDAR system and another system
type CedarExchange struct {
	ConnectionFrequency        []string                       `json:"connectionFrequency"`
	ContainsBankingData        null.Bool                      `json:"containsBankingData,omitempty"`
	ContainsBeneficiaryAddress null.Bool                      `json:"containsBeneficiaryAddress,omitempty"`
	ContainsPhi                null.Bool                      `json:"containsPhi,omitempty"`
	ContainsPii                null.Bool                      `json:"containsPii,omitempty"`
	DataExchangeAgreement      zero.String                    `json:"dataExchangeAgreement,omitempty"`
	DataFormat                 zero.String                    `json:"dataFormat,omitempty"`
	DataFormatOther            zero.String                    `json:"dataFormatOther,omitempty"`
	ExchangeDescription        zero.String                    `json:"exchangeDescription,omitempty"`
	ExchangeEndDate            zero.Time                      `json:"exchangeEndDate,omitempty"`
	ExchangeID                 zero.String                    `json:"exchangeId,omitempty"`
	ExchangeName               zero.String                    `json:"exchangeName,omitempty"`
	ExchangeRetiredDate        zero.Time                      `json:"exchangeRetiredDate,omitempty"`
	ExchangeStartDate          zero.Time                      `json:"exchangeStartDate,omitempty"`
	ExchangeState              zero.String                    `json:"exchangeState,omitempty"`
	ExchangeVersion            zero.String                    `json:"exchangeVersion,omitempty"`
	ExchangeDirection          ExchangeDirection              `json:"exchangeDirection,omitempty"`
	FromOwnerID                zero.String                    `json:"fromOwnerId,omitempty"`
	FromOwnerName              zero.String                    `json:"fromOwnerName,omitempty"`
	FromOwnerType              zero.String                    `json:"fromOwnerType,omitempty"`
	IsBeneficiaryMailingFile   null.Bool                      `json:"isBeneficiaryMailingFile,omitempty"`
	NumOfRecords               zero.String                    `json:"numOfRecords,omitempty"`
	SharedViaAPI               null.Bool                      `json:"sharedViaApi,omitempty"`
	ToOwnerID                  zero.String                    `json:"toOwnerId,omitempty"`
	ToOwnerName                zero.String                    `json:"toOwnerName,omitempty"`
	ToOwnerType                zero.String                    `json:"toOwnerType,omitempty"`
	TypeOfData                 []*CedarExchangeTypeOfDataItem `json:"typeOfData"`
}
