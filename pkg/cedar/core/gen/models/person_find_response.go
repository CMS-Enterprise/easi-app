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

// PersonFindResponse person find response
//
// swagger:model PersonFindResponse
type PersonFindResponse struct {

	// persons
	Persons []*Person `json:"Persons"`

	// count
	// Required: true
	Count *int32 `json:"count"`
}

// Validate validates this person find response
func (m *PersonFindResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validatePersons(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateCount(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PersonFindResponse) validatePersons(formats strfmt.Registry) error {
	if swag.IsZero(m.Persons) { // not required
		return nil
	}

	for i := 0; i < len(m.Persons); i++ {
		if swag.IsZero(m.Persons[i]) { // not required
			continue
		}

		if m.Persons[i] != nil {
			if err := m.Persons[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Persons" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *PersonFindResponse) validateCount(formats strfmt.Registry) error {

	if err := validate.Required("count", "body", m.Count); err != nil {
		return err
	}

	return nil
}

// ContextValidate validate this person find response based on the context it is used
func (m *PersonFindResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidatePersons(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PersonFindResponse) contextValidatePersons(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Persons); i++ {

		if m.Persons[i] != nil {
			if err := m.Persons[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Persons" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *PersonFindResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *PersonFindResponse) UnmarshalBinary(b []byte) error {
	var res PersonFindResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
