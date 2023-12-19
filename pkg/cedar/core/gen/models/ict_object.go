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

// IctObject ict object
//
// swagger:model IctObject
type IctObject struct {

	// systems
	Systems []*IctObjectSystemsItems0 `json:"Systems"`

	// ICT Object ID for a given system
	// Example: 408-3-0
	// Required: true
	IctObjectID *string `json:"ictObjectId"`
}

// Validate validates this ict object
func (m *IctObject) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateSystems(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateIctObjectID(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *IctObject) validateSystems(formats strfmt.Registry) error {
	if swag.IsZero(m.Systems) { // not required
		return nil
	}

	for i := 0; i < len(m.Systems); i++ {
		if swag.IsZero(m.Systems[i]) { // not required
			continue
		}

		if m.Systems[i] != nil {
			if err := m.Systems[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Systems" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *IctObject) validateIctObjectID(formats strfmt.Registry) error {

	if err := validate.Required("ictObjectId", "body", m.IctObjectID); err != nil {
		return err
	}

	return nil
}

// ContextValidate validate this ict object based on the context it is used
func (m *IctObject) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateSystems(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *IctObject) contextValidateSystems(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Systems); i++ {

		if m.Systems[i] != nil {
			if err := m.Systems[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Systems" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *IctObject) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *IctObject) UnmarshalBinary(b []byte) error {
	var res IctObject
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// IctObjectSystemsItems0 ict object systems items0
//
// swagger:model IctObjectSystemsItems0
type IctObjectSystemsItems0 struct {

	// system Id
	SystemID string `json:"systemId,omitempty"`

	// version
	Version string `json:"version,omitempty"`
}

// Validate validates this ict object systems items0
func (m *IctObjectSystemsItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this ict object systems items0 based on context it is used
func (m *IctObjectSystemsItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *IctObjectSystemsItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *IctObjectSystemsItems0) UnmarshalBinary(b []byte) error {
	var res IctObjectSystemsItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
