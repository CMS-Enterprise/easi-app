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

// BudgetAddRequest budget add request
//
// swagger:model BudgetAddRequest
type BudgetAddRequest struct {

	// budgets
	// Required: true
	Budgets []*Budget `json:"Budgets"`
}

// Validate validates this budget add request
func (m *BudgetAddRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateBudgets(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *BudgetAddRequest) validateBudgets(formats strfmt.Registry) error {

	if err := validate.Required("Budgets", "body", m.Budgets); err != nil {
		return err
	}

	for i := 0; i < len(m.Budgets); i++ {
		if swag.IsZero(m.Budgets[i]) { // not required
			continue
		}

		if m.Budgets[i] != nil {
			if err := m.Budgets[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Budgets" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this budget add request based on the context it is used
func (m *BudgetAddRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateBudgets(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *BudgetAddRequest) contextValidateBudgets(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Budgets); i++ {

		if m.Budgets[i] != nil {
			if err := m.Budgets[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("Budgets" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *BudgetAddRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *BudgetAddRequest) UnmarshalBinary(b []byte) error {
	var res BudgetAddRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
