package models

import "github.com/guregu/null/zero"

// CedarExchangeTypeOfDataItem is one item of the TypeofData slice in a CedarExchange
type CedarExchangeTypeOfDataItem struct {
	ID   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

// CedarExchange contains information about how data is exchanged between a CEDAR system and another system
type CedarExchange struct {
	ConnectionFrequency        []string                       `json:"connectionFrequency"`
	ContainsBankingData        bool                           `json:"containsBankingData,omitempty"`
	ContainsBeneficiaryAddress bool                           `json:"containsBeneficiaryAddress,omitempty"`
	ContainsPhi                bool                           `json:"containsPhi,omitempty"`
	ContainsPii                bool                           `json:"containsPii,omitempty"`
	DataExchangeAgreement      string                         `json:"dataExchangeAgreement,omitempty"`
	DataFormat                 string                         `json:"dataFormat,omitempty"`
	DataFormatOther            string                         `json:"dataFormatOther,omitempty"`
	ExchangeDescription        string                         `json:"exchangeDescription,omitempty"`
	ExchangeEndDate            zero.Time                      `json:"exchangeEndDate,omitempty"`
	ExchangeID                 string                         `json:"exchangeId,omitempty"`
	ExchangeName               string                         `json:"exchangeName,omitempty"`
	ExchangeRetiredDate        zero.Time                      `json:"exchangeRetiredDate,omitempty"`
	ExchangeStartDate          zero.Time                      `json:"exchangeStartDate,omitempty"`
	ExchangeState              string                         `json:"exchangeState,omitempty"`
	ExchangeVersion            string                         `json:"exchangeVersion,omitempty"`
	FromOwnerID                string                         `json:"fromOwnerId,omitempty"`
	FromOwnerName              string                         `json:"fromOwnerName,omitempty"`
	FromOwnerType              string                         `json:"fromOwnerType,omitempty"`
	IsBeneficiaryMailingFile   bool                           `json:"isBeneficiaryMailingFile,omitempty"`
	NumOfRecords               string                         `json:"numOfRecords,omitempty"`
	SharedViaAPI               bool                           `json:"sharedViaApi,omitempty"`
	ToOwnerID                  string                         `json:"toOwnerId,omitempty"`
	ToOwnerName                string                         `json:"toOwnerName,omitempty"`
	ToOwnerType                string                         `json:"toOwnerType,omitempty"`
	TypeOfData                 []*CedarExchangeTypeOfDataItem `json:"typeOfData"`
}
