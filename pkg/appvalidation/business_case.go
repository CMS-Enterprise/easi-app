package appvalidation

import (
	"errors"
	"strings"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/validate"
)

// checkUniqLifecycleCosts checks if there's any duplicates
func checkUniqLifecycleCosts(costs models.EstimatedLifecycleCosts) (string, string) {
	costMap := map[string]bool{}

	for _, cost := range costs {
		if cost.Phase != nil {
			attribute := string(cost.Solution) + string(cost.Year) + string(*cost.Phase)
			if costMap[attribute] {
				return "LifecycleCostPhase", "cannot have multiple costs for the same phase, solution, and year"
			}
			costMap[attribute] = true
		}
	}
	return "", ""
}

// check the system intake status is submitted
func checkSystemIntakeSubmitted(intake *models.SystemIntake) (string, string) {
	if intake.Step != models.SystemIntakeStepINITIALFORM {
		return "", ""
	}
	return "SystemIntake", "must have already been submitted"
}

// BusinessCaseForCreation checks if it's a valid Business Case to create
func BusinessCaseForCreation(businessCase *models.BusinessCaseWithCosts, intake *models.SystemIntake) error {
	// We return an empty id in this error because the Business Case hasn't been created
	expectedErr := apperrors.ValidationError{
		Err:         errors.New("business case failed validations"),
		Model:       businessCase,
		ModelID:     "",
		Validations: apperrors.Validations{},
	}

	// Uncomment below when UI has changed for unique lifecycle costs
	//k, v := checkUniqLifecycleCosts(businessCase.LifecycleCostLines)
	//if k != "" {
	//	expectedErr.WithValidation(k, v)
	//}

	k, v := checkSystemIntakeSubmitted(intake)
	if k != "" {
		expectedErr.WithValidation(k, v)
	}

	if len(expectedErr.Validations) > 0 {
		return &expectedErr
	}
	return nil
}

// BusinessCaseForUpdate checks if it's a valid Business Case to update
func BusinessCaseForUpdate(businessCase *models.BusinessCaseWithCosts) error {
	// We return an empty id in this error because the Business Case hasn't been created
	expectedErr := apperrors.NewValidationError(
		errors.New("business case failed validations"),
		businessCase,
		businessCase.ID.String(),
	)

	k, v := checkUniqLifecycleCosts(businessCase.LifecycleCostLines)
	if k != "" {
		expectedErr.WithValidation(k, v)
	}

	if len(expectedErr.Validations) > 0 {
		return &expectedErr
	}
	return nil
}

func alternativeARequired(businessCase *models.BusinessCaseWithCosts) bool {
	return businessCase.AlternativeATitle.Valid ||
		businessCase.AlternativeASummary.Valid ||
		businessCase.AlternativeAAcquisitionApproach.Valid ||
		businessCase.AlternativeAPros.Valid ||
		businessCase.AlternativeACons.Valid ||
		businessCase.AlternativeACostSavings.Valid
}
func alternativeBRequired(businessCase *models.BusinessCaseWithCosts) bool {
	return businessCase.AlternativeBTitle.Valid ||
		businessCase.AlternativeBSummary.Valid ||
		businessCase.AlternativeBAcquisitionApproach.Valid ||
		businessCase.AlternativeBPros.Valid ||
		businessCase.AlternativeBCons.Valid ||
		businessCase.AlternativeBCostSavings.Valid
}

type solutionCostLines map[string]map[string]int64

func validateRequiredCost(lines solutionCostLines) string {
	years := []string{}
	if len(lines["1"]) == 0 {
		years = append(years, "1")
	}
	if len(lines["2"]) == 0 {
		years = append(years, "2")
	}
	if len(lines["3"]) == 0 {
		years = append(years, "3")
	}
	if len(lines["4"]) == 0 {
		years = append(years, "4")
	}
	if len(lines["5"]) == 0 {
		years = append(years, "5")
	}
	noun := "year "
	verb := " is "
	if len(years) > 1 {
		verb = " are "
		noun = "years "
	}
	if len(years) > 0 {
		return noun + strings.Join(years, ", ") + verb + "required"
	}
	return ""
}

func validateAllRequiredLifecycleCosts(businessCase *models.BusinessCaseWithCosts) map[string]string {
	validations := map[string]string{}
	preferredCosts := solutionCostLines{}
	aCosts := solutionCostLines{}
	bCosts := solutionCostLines{}

	for _, cost := range businessCase.LifecycleCostLines {
		valid := true
		if validate.RequireCostPhase(cost.Phase) {
			solutionYear := string(cost.Solution) + string(cost.Year)
			validations[solutionYear] = "requires a phase"
			valid = false
		}

		if validate.RequireInt64(cost.Cost) {
			solutionYearPhase := string(cost.Solution) + string(cost.Year) + string(*cost.Phase)
			validations[solutionYearPhase] = "requires a cost"
			valid = false
		}

		if valid {
			value := map[string]int64{
				string(*cost.Phase): *cost.Cost,
			}
			switch cost.Solution {
			case models.LifecycleCostSolutionPREFERRED:
				preferredCosts[string(cost.Year)] = value
			case models.LifecycleCostSolutionA:
				aCosts[string(cost.Year)] = value
			case models.LifecycleCostSolutionB:
				bCosts[string(cost.Year)] = value
			}
		}
	}
	if v := validateRequiredCost(preferredCosts); v != "" {
		validations["preferredSolution"] = v
	}
	if alternativeARequired(businessCase) {
		if v := validateRequiredCost(aCosts); v != "" {
			validations["alternativeASolution"] = v
		}
	} else {
		if len(aCosts) != 0 {
			validations["alternativeASolution"] = "is required to be empty"
		}
	}
	if alternativeBRequired(businessCase) {
		if v := validateRequiredCost(bCosts); v != "" {
			validations["alternativeBSolution"] = v
		}
	} else {
		if len(bCosts) != 0 {
			validations["alternativeBSolution"] = "is required to be empty"
		}
	}
	return validations
}

// BusinessCaseForSubmit checks if it's a valid Business Case to update
func BusinessCaseForSubmit(businessCase *models.BusinessCaseWithCosts) error {
	// We return an empty id in this error because the Business Case hasn't been created
	expectedErr := apperrors.NewValidationError(
		errors.New("business case failed validations"),
		businessCase,
		businessCase.ID.String(),
	)

	if businessCase.Status != models.BusinessCaseStatusOPEN {
		expectedErr.WithValidation("Status", "must be OPEN")
	}

	if validate.RequireUUID(businessCase.ID) {
		expectedErr.WithValidation("ID", "is required")
	}
	if validate.RequireString(businessCase.EUAUserID) {
		expectedErr.WithValidation("EUAUserID", "is required")
	}
	if validate.RequireUUID(businessCase.SystemIntakeID) {
		expectedErr.WithValidation("SystemIntakeID", "is required")
	}
	if validate.RequireNullString(businessCase.ProjectName) {
		expectedErr.WithValidation("ProjectName", "is required")
	}
	if validate.RequireNullString(businessCase.Requester) {
		expectedErr.WithValidation("Requester", "is required")
	}
	if validate.RequireNullString(businessCase.RequesterPhoneNumber) {
		expectedErr.WithValidation("RequesterPhoneNumber", "is required")
	}
	if validate.RequireNullString(businessCase.BusinessOwner) {
		expectedErr.WithValidation("BusinessOwner", "is required")
	}
	if validate.RequireNullString(businessCase.BusinessNeed) {
		expectedErr.WithValidation("BusinessNeed", "is required")
	}
	if validate.RequireNullString(businessCase.CurrentSolutionSummary) {
		expectedErr.WithValidation("CurrentSolutionSummary", "is required")
	}
	if validate.RequireNullString(businessCase.CMSBenefit) {
		expectedErr.WithValidation("CMSBenefit", "is required")
	}
	if validate.RequireNullString(businessCase.PriorityAlignment) {
		expectedErr.WithValidation("PriorityAlignment", "is required")
	}
	if validate.RequireNullString(businessCase.SuccessIndicators) {
		expectedErr.WithValidation("SuccessIndicators", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredTitle) {
		expectedErr.WithValidation("PreferredTitle", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredSummary) {
		expectedErr.WithValidation("PreferredSummary", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredAcquisitionApproach) {
		expectedErr.WithValidation("PreferredAcquisitionApproach", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredHostingType) {
		expectedErr.WithValidation("PreferredHostingType", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredHasUI) {
		expectedErr.WithValidation("PreferredHasUI", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredPros) {
		expectedErr.WithValidation("PreferredPros", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredCons) {
		expectedErr.WithValidation("PreferredCons", "is required")
	}
	if validate.RequireNullString(businessCase.PreferredCostSavings) {
		expectedErr.WithValidation("PreferredCostSavings", "is required")
	}
	if alternativeARequired(businessCase) {
		if validate.RequireNullString(businessCase.AlternativeATitle) {
			expectedErr.WithValidation("AlternativeATitle", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeASummary) {
			expectedErr.WithValidation("AlternativeASummary", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeAAcquisitionApproach) {
			expectedErr.WithValidation("AlternativeAAcquisitionApproach", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeAHostingType) {
			expectedErr.WithValidation("AlternativeAHostingType", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeAHasUI) {
			expectedErr.WithValidation("AlternativeAHasUI", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeAPros) {
			expectedErr.WithValidation("AlternativeAPros", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeACons) {
			expectedErr.WithValidation("AlternativeACons", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeACostSavings) {
			expectedErr.WithValidation("AlternativeACostSavings", "is required")
		}
	}
	if alternativeBRequired(businessCase) {
		if validate.RequireNullString(businessCase.AlternativeBTitle) {
			expectedErr.WithValidation("AlternativeBTitle", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBSummary) {
			expectedErr.WithValidation("AlternativeBSummary", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBAcquisitionApproach) {
			expectedErr.WithValidation("AlternativeBAcquisitionApproach", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBHostingType) {
			expectedErr.WithValidation("AlternativeBHostingType", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBHasUI) {
			expectedErr.WithValidation("AlternativeBHasUI", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBPros) {
			expectedErr.WithValidation("AlternativeBPros", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBCons) {
			expectedErr.WithValidation("AlternativeBCons", "is required")
		}
		if validate.RequireNullString(businessCase.AlternativeBCostSavings) {
			expectedErr.WithValidation("AlternativeBCostSavings", "is required")
		}
	}
	if k, v := checkUniqLifecycleCosts(businessCase.LifecycleCostLines); k != "" {
		expectedErr.WithValidation(k, v)
	}
	if lifecycleValidations := validateAllRequiredLifecycleCosts(businessCase); len(lifecycleValidations) != 0 {
		for k, v := range lifecycleValidations {
			expectedErr.WithValidation(k, v)
		}
	}

	if len(expectedErr.Validations) > 0 {
		return &expectedErr
	}
	return nil
}
