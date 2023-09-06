// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"encoding/json"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// Exchange exchange
//
// swagger:model Exchange
type Exchange struct {

	// api ownership
	APIOwnership string `json:"apiOwnership,omitempty"`

	// business purpose of address
	BusinessPurposeOfAddress []string `json:"businessPurposeOfAddress"`

	// connection frequency
	ConnectionFrequency []string `json:"connectionFrequency"`

	// contains banking data
	ContainsBankingData bool `json:"containsBankingData,omitempty"`

	// contains beneficiary address
	ContainsBeneficiaryAddress bool `json:"containsBeneficiaryAddress,omitempty"`

	// contains health disparity data
	ContainsHealthDisparityData bool `json:"containsHealthDisparityData,omitempty"`

	// contains phi
	ContainsPhi bool `json:"containsPhi,omitempty"`

	// contains pii
	ContainsPii bool `json:"containsPii,omitempty"`

	// data exchange agreement
	DataExchangeAgreement string `json:"dataExchangeAgreement,omitempty"`

	// data format
	DataFormat string `json:"dataFormat,omitempty"`

	// data format other
	DataFormatOther string `json:"dataFormatOther,omitempty"`

	// exchange description
	// Example: Reference data on vendors acting on behalf of insurance issuers
	ExchangeDescription string `json:"exchangeDescription,omitempty"`

	// exchange end date
	// Format: date
	ExchangeEndDate strfmt.Date `json:"exchangeEndDate,omitempty"`

	// exchange Id
	// Example: 139-1178-0
	ExchangeID string `json:"exchangeId,omitempty"`

	// exchange name
	// Example: Acumen Web Portals 1.0 \u003e\u003e Drug Data Processing System 1.0
	ExchangeName string `json:"exchangeName,omitempty"`

	// exchange retired date
	// Format: date
	ExchangeRetiredDate strfmt.Date `json:"exchangeRetiredDate,omitempty"`

	// exchange start date
	// Format: date
	ExchangeStartDate strfmt.Date `json:"exchangeStartDate,omitempty"`

	// exchange state
	// Example: Active
	ExchangeState string `json:"exchangeState,omitempty"`

	// exchange version
	// Example: 1
	ExchangeVersion string `json:"exchangeVersion,omitempty"`

	// from owner Id
	// Example: 326-762-0
	FromOwnerID string `json:"fromOwnerId,omitempty"`

	// from owner name
	// Example: Account Management
	FromOwnerName string `json:"fromOwnerName,omitempty"`

	// from owner type
	// Enum: [application organization]
	FromOwnerType string `json:"fromOwnerType,omitempty"`

	// is address editable
	IsAddressEditable bool `json:"isAddressEditable,omitempty"`

	// is beneficiary mailing file
	IsBeneficiaryMailingFile bool `json:"isBeneficiaryMailingFile,omitempty"`

	// num of records
	// Example: 100,000 – 1 Million
	NumOfRecords string `json:"numOfRecords,omitempty"`

	// shared via Api
	SharedViaAPI bool `json:"sharedViaApi,omitempty"`

	// to owner Id
	// Example: 326-762-0
	ToOwnerID string `json:"toOwnerId,omitempty"`

	// to owner name
	// Example: Account Management
	ToOwnerName string `json:"toOwnerName,omitempty"`

	// to owner type
	// Enum: [application organization]
	ToOwnerType string `json:"toOwnerType,omitempty"`

	// type of data
	TypeOfData []*ExchangeTypeOfDataItems0 `json:"typeOfData"`
}

// Validate validates this exchange
func (m *Exchange) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateExchangeEndDate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateExchangeRetiredDate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateExchangeStartDate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateFromOwnerType(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateToOwnerType(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTypeOfData(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Exchange) validateExchangeEndDate(formats strfmt.Registry) error {
	if swag.IsZero(m.ExchangeEndDate) { // not required
		return nil
	}

	if err := validate.FormatOf("exchangeEndDate", "body", "date", m.ExchangeEndDate.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *Exchange) validateExchangeRetiredDate(formats strfmt.Registry) error {
	if swag.IsZero(m.ExchangeRetiredDate) { // not required
		return nil
	}

	if err := validate.FormatOf("exchangeRetiredDate", "body", "date", m.ExchangeRetiredDate.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *Exchange) validateExchangeStartDate(formats strfmt.Registry) error {
	if swag.IsZero(m.ExchangeStartDate) { // not required
		return nil
	}

	if err := validate.FormatOf("exchangeStartDate", "body", "date", m.ExchangeStartDate.String(), formats); err != nil {
		return err
	}

	return nil
}

var exchangeTypeFromOwnerTypePropEnum []interface{}

func init() {
	var res []string
	if err := json.Unmarshal([]byte(`["application","organization"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		exchangeTypeFromOwnerTypePropEnum = append(exchangeTypeFromOwnerTypePropEnum, v)
	}
}

const (

	// ExchangeFromOwnerTypeApplication captures enum value "application"
	ExchangeFromOwnerTypeApplication string = "application"

	// ExchangeFromOwnerTypeOrganization captures enum value "organization"
	ExchangeFromOwnerTypeOrganization string = "organization"
)

// prop value enum
func (m *Exchange) validateFromOwnerTypeEnum(path, location string, value string) error {
	if err := validate.EnumCase(path, location, value, exchangeTypeFromOwnerTypePropEnum, true); err != nil {
		return err
	}
	return nil
}

func (m *Exchange) validateFromOwnerType(formats strfmt.Registry) error {
	if swag.IsZero(m.FromOwnerType) { // not required
		return nil
	}

	// value enum
	if err := m.validateFromOwnerTypeEnum("fromOwnerType", "body", m.FromOwnerType); err != nil {
		return err
	}

	return nil
}

var exchangeTypeToOwnerTypePropEnum []interface{}

func init() {
	var res []string
	if err := json.Unmarshal([]byte(`["application","organization"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		exchangeTypeToOwnerTypePropEnum = append(exchangeTypeToOwnerTypePropEnum, v)
	}
}

const (

	// ExchangeToOwnerTypeApplication captures enum value "application"
	ExchangeToOwnerTypeApplication string = "application"

	// ExchangeToOwnerTypeOrganization captures enum value "organization"
	ExchangeToOwnerTypeOrganization string = "organization"
)

// prop value enum
func (m *Exchange) validateToOwnerTypeEnum(path, location string, value string) error {
	if err := validate.EnumCase(path, location, value, exchangeTypeToOwnerTypePropEnum, true); err != nil {
		return err
	}
	return nil
}

func (m *Exchange) validateToOwnerType(formats strfmt.Registry) error {
	if swag.IsZero(m.ToOwnerType) { // not required
		return nil
	}

	// value enum
	if err := m.validateToOwnerTypeEnum("toOwnerType", "body", m.ToOwnerType); err != nil {
		return err
	}

	return nil
}

func (m *Exchange) validateTypeOfData(formats strfmt.Registry) error {
	if swag.IsZero(m.TypeOfData) { // not required
		return nil
	}

	for i := 0; i < len(m.TypeOfData); i++ {
		if swag.IsZero(m.TypeOfData[i]) { // not required
			continue
		}

		if m.TypeOfData[i] != nil {
			if err := m.TypeOfData[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("typeOfData" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("typeOfData" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this exchange based on the context it is used
func (m *Exchange) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateTypeOfData(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Exchange) contextValidateTypeOfData(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.TypeOfData); i++ {

		if m.TypeOfData[i] != nil {

			if swag.IsZero(m.TypeOfData[i]) { // not required
				return nil
			}

			if err := m.TypeOfData[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("typeOfData" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("typeOfData" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *Exchange) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *Exchange) UnmarshalBinary(b []byte) error {
	var res Exchange
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// ExchangeTypeOfDataItems0 exchange type of data items0
//
// swagger:model ExchangeTypeOfDataItems0
type ExchangeTypeOfDataItems0 struct {

	// id
	ID string `json:"id,omitempty"`

	// name
	Name string `json:"name,omitempty"`
}

// Validate validates this exchange type of data items0
func (m *ExchangeTypeOfDataItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this exchange type of data items0 based on context it is used
func (m *ExchangeTypeOfDataItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *ExchangeTypeOfDataItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ExchangeTypeOfDataItems0) UnmarshalBinary(b []byte) error {
	var res ExchangeTypeOfDataItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
