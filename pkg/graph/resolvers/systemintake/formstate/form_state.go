package formstate

import "github.com/cmsgov/easi-app/pkg/models"

// SetInProgress checks if it is valid to set a form as in Progress, or if it is in EDITS_REQUESTED, it leaves it as EDITS_REQUESTED
func SetInProgress(currentState models.SystemIntakeFormState) models.SystemIntakeFormState {
	if currentState == models.SIRFSEditsRequested {
		return models.SIRFSEditsRequested
		// If the form is in request edits, it should stay that way until submitted.
		// If submitted and edited again, it should change to in progress.
	}
	return models.SIRFSInProgress
}
