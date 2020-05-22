package appvalidation

import (
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// checkUniqLifecycleCosts checks if there's any duplicates
func checkUniqLifecycleCosts(costs models.EstimatedLifecycleCosts) (string, string) {
	costMap := map[string]bool{}

	for _, cost := range costs {
		attribute := string(cost.Solution) + string(cost.Year) + string(cost.Phase)
		if costMap[attribute] {
			return "LifecycleCostPhase", "cannot have multiple costs for the same phase, solution, and year"
		}
		costMap[attribute] = true
	}
	return "", ""
}

// check the system intake status is submitted
func checkSystemIntakeSubmitted(intake *models.SystemIntake) (string, string) {
	if intake.Status != models.SystemIntakeStatusSUBMITTED {
		return "SystemIntake", "must have already been submitted"
	}
	return "", ""
}

// BusinessCaseForCreation checks if it's a valid business case to create
func BusinessCaseForCreation(businessCase *models.BusinessCase, intake *models.SystemIntake) error {
	// We return an empty id in this error because the business case hasn't been created
	expectedErr := apperrors.ValidationError{
		Err:         errors.New("business case failed validations"),
		Model:       businessCase,
		ModelID:     "",
		Validations: apperrors.Validations{},
	}
	k, v := checkUniqLifecycleCosts(businessCase.LifecycleCostLines)
	if k != "" {
		expectedErr.WithValidation(k, v)
	}

	k, v = checkSystemIntakeSubmitted(intake)
	if k != "" {
		expectedErr.WithValidation(k, v)
	}

	if len(expectedErr.Validations) > 0 {
		return &expectedErr
	}
	return nil
}

// BusinessCaseForUpdate checks if it's a valid business case to update
func BusinessCaseForUpdate(businessCase *models.BusinessCase) error {
	// We return an empty id in this error because the business case hasn't been created
	expectedErr := apperrors.ValidationError{
		Err:         errors.New("business case failed validations"),
		Model:       businessCase,
		ModelID:     "",
		Validations: apperrors.Validations{},
	}

	k, v := checkUniqLifecycleCosts(businessCase.LifecycleCostLines)
	if k != "" {
		expectedErr.WithValidation(k, v)
	}

	if len(expectedErr.Validations) > 0 {
		return &expectedErr
	}
	return nil
}
