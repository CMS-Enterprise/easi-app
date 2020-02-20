// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	strfmt "github.com/go-openapi/strfmt"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// SystemidGETResponse systemid g e t response
// swagger:model systemid_GET_response
type SystemidGETResponse struct {

	// system detail
	// Required: true
	SystemDetail *SystemDetail `json:"SystemDetail"`
}

// Validate validates this systemid g e t response
func (m *SystemidGETResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateSystemDetail(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SystemidGETResponse) validateSystemDetail(formats strfmt.Registry) error {

	if err := validate.Required("SystemDetail", "body", m.SystemDetail); err != nil {
		return err
	}

	if m.SystemDetail != nil {
		if err := m.SystemDetail.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("SystemDetail")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *SystemidGETResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *SystemidGETResponse) UnmarshalBinary(b []byte) error {
	var res SystemidGETResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
