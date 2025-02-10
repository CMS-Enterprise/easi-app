// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// SystemSummary system summary
//
// swagger:model SystemSummary
type SystemSummary struct {

	// acronym
	// Example: CMSS
	Acronym string `json:"acronym,omitempty"`

	// ato effective date
	// Example: 2021-10-13T00:00:00.000Z
	// Format: date
	AtoEffectiveDate strfmt.Date `json:"atoEffectiveDate,omitempty"`

	// ato expiration date
	// Example: 2021-10-13T00:00:00.000Z
	// Format: date
	AtoExpirationDate strfmt.Date `json:"atoExpirationDate,omitempty"`

	// belongs to
	// Example: 326-10-0
	BelongsTo string `json:"belongsTo,omitempty"`

	// Business Owner org
	// Example: Center for Medicare Management
	BusinessOwnerOrg string `json:"businessOwnerOrg,omitempty"`

	// Business Owner org comp
	// Example: CM-(FFS)
	BusinessOwnerOrgComp string `json:"businessOwnerOrgComp,omitempty"`

	// description
	// Example: This is a CMS System decription
	Description string `json:"description,omitempty"`

	// ict object Id
	// Example: 326-3-0
	// Required: true
	IctObjectID *string `json:"ictObjectId"`

	// id
	// Example: 326-2-0
	// Required: true
	ID *string `json:"id"`

	// name
	// Example: CMS System
	// Required: true
	Name *string `json:"name"`

	// next version Id
	// Example: 326-1-0
	NextVersionID string `json:"nextVersionId,omitempty"`

	// previous version Id
	// Example: 326-3-0
	PreviousVersionID string `json:"previousVersionId,omitempty"`

	// state
	// Example: Active
	State string `json:"state,omitempty"`

	// status
	// Example: Approved
	Status string `json:"status,omitempty"`

	// system maintainer org
	// Example: OIT
	SystemMaintainerOrg string `json:"systemMaintainerOrg,omitempty"`

	// system maintainer org comp
	// Example: Enterprise Architecture and Data Group
	SystemMaintainerOrgComp string `json:"systemMaintainerOrgComp,omitempty"`

	// uuid
	// Example: 12FFF52E-195B-4E48-9A38-669A8BD71234
	UUID string `json:"uuid,omitempty"`

	// version
	// Example: 1.0
	// Required: true
	Version *string `json:"version"`
}

// Validate validates this system summary
func (m *SystemSummary) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateAtoEffectiveDate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateAtoExpirationDate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateIctObjectID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateName(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateVersion(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SystemSummary) validateAtoEffectiveDate(formats strfmt.Registry) error {
	if swag.IsZero(m.AtoEffectiveDate) { // not required
		return nil
	}

	if err := validate.FormatOf("atoEffectiveDate", "body", "date", m.AtoEffectiveDate.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *SystemSummary) validateAtoExpirationDate(formats strfmt.Registry) error {
	if swag.IsZero(m.AtoExpirationDate) { // not required
		return nil
	}

	if err := validate.FormatOf("atoExpirationDate", "body", "date", m.AtoExpirationDate.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *SystemSummary) validateIctObjectID(formats strfmt.Registry) error {

	if err := validate.Required("ictObjectId", "body", m.IctObjectID); err != nil {
		return err
	}

	return nil
}

func (m *SystemSummary) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	return nil
}

func (m *SystemSummary) validateName(formats strfmt.Registry) error {

	if err := validate.Required("name", "body", m.Name); err != nil {
		return err
	}

	return nil
}

func (m *SystemSummary) validateVersion(formats strfmt.Registry) error {

	if err := validate.Required("version", "body", m.Version); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this system summary based on context it is used
func (m *SystemSummary) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *SystemSummary) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *SystemSummary) UnmarshalBinary(b []byte) error {
	var res SystemSummary
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
