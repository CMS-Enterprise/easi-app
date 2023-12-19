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

// BudgetFindResponse budget find response
//
// swagger:model BudgetFindResponse
type BudgetFindResponse struct {

	// budgets
	Budgets []*Budget `json:"Budgets"`

	// count
	// Required: true
	Count *int32 `json:"count"`
}

// Validate validates this budget find response
func (m *BudgetFindResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateBudgets(formats); err != nil {
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

func (m *BudgetFindResponse) validateBudgets(formats strfmt.Registry) error {
	if swag.IsZero(m.Budgets) { // not required
		return nil
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

func (m *BudgetFindResponse) validateCount(formats strfmt.Registry) error {

	if err := validate.Required("count", "body", m.Count); err != nil {
		return err
	}

	return nil
}

// ContextValidate validate this budget find response based on the context it is used
func (m *BudgetFindResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateBudgets(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *BudgetFindResponse) contextValidateBudgets(ctx context.Context, formats strfmt.Registry) error {

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
func (m *BudgetFindResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *BudgetFindResponse) UnmarshalBinary(b []byte) error {
	var res BudgetFindResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
