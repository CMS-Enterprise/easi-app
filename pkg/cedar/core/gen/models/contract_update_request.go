// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// ContractUpdateRequest contract update request
//
// swagger:model ContractUpdateRequest
type ContractUpdateRequest struct {

	// contracts
	// Required: true
	Contracts []*Contract `json:"Contracts"`
}

// Validate validates this contract update request
func (m *ContractUpdateRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateContracts(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ContractUpdateRequest) validateContracts(formats strfmt.Registry) error {

	if err := validate.Required("Contracts", "body", m.Contracts); err != nil {
		return err
	}

	for i := 0; i < len(m.Contracts); i++ {
		if swag.IsZero(m.Contracts[i]) { // not required
			continue
		}

		if m.Contracts[i] != nil {
			if err := m.Contracts[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Contracts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this contract update request based on the context it is used
func (m *ContractUpdateRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateContracts(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ContractUpdateRequest) contextValidateContracts(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Contracts); i++ {

		if m.Contracts[i] != nil {
			if err := m.Contracts[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Contracts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *ContractUpdateRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ContractUpdateRequest) UnmarshalBinary(b []byte) error {
	var res ContractUpdateRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
