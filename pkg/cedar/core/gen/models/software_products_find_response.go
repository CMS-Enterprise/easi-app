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
)

// SoftwareProductsFindResponse software products find response
//
// swagger:model SoftwareProductsFindResponse
type SoftwareProductsFindResponse struct {

	// ai soln catg
	AiSolnCatg []string `json:"aiSolnCatg"`

	// ai soln catg other
	AiSolnCatgOther string `json:"aiSolnCatgOther,omitempty"`

	// api data area
	APIDataArea []string `json:"apiDataArea"`

	// api desc pub location
	APIDescPubLocation string `json:"apiDescPubLocation,omitempty"`

	// api desc published
	APIDescPublished string `json:"apiDescPublished,omitempty"`

	// api f h i r use
	APIFHIRUse string `json:"apiFHIRUse,omitempty"`

	// api f h i r use other
	APIFHIRUseOther string `json:"apiFHIRUseOther,omitempty"`

	// api has portal
	APIHasPortal bool `json:"apiHasPortal,omitempty"`

	// apis accessibility
	ApisAccessibility string `json:"apisAccessibility,omitempty"`

	// apis developed
	ApisDeveloped string `json:"apisDeveloped,omitempty"`

	// development stage
	DevelopmentStage string `json:"developmentStage,omitempty"`

	// software products
	SoftwareProducts []*SoftwareProductsSearchItem `json:"softwareProducts"`

	// system has Api gateway
	SystemHasAPIGateway bool `json:"systemHasApiGateway,omitempty"`

	// uses ai tech
	UsesAiTech string `json:"usesAiTech,omitempty"`
}

// Validate validates this software products find response
func (m *SoftwareProductsFindResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateSoftwareProducts(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SoftwareProductsFindResponse) validateSoftwareProducts(formats strfmt.Registry) error {
	if swag.IsZero(m.SoftwareProducts) { // not required
		return nil
	}

	for i := 0; i < len(m.SoftwareProducts); i++ {
		if swag.IsZero(m.SoftwareProducts[i]) { // not required
			continue
		}

		if m.SoftwareProducts[i] != nil {
			if err := m.SoftwareProducts[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("softwareProducts" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("softwareProducts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this software products find response based on the context it is used
func (m *SoftwareProductsFindResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateSoftwareProducts(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SoftwareProductsFindResponse) contextValidateSoftwareProducts(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.SoftwareProducts); i++ {

		if m.SoftwareProducts[i] != nil {

			if swag.IsZero(m.SoftwareProducts[i]) { // not required
				return nil
			}

			if err := m.SoftwareProducts[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("softwareProducts" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("softwareProducts" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *SoftwareProductsFindResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *SoftwareProductsFindResponse) UnmarshalBinary(b []byte) error {
	var res SoftwareProductsFindResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
