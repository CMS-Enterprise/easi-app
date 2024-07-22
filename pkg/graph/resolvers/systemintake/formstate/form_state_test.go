package formstate

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TestGetNewStateForUpdatedForm(t *testing.T) {

	// Not Started --> In Progress
	retState := GetNewStateForUpdatedForm(models.SIRFSNotStarted)
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// In Progress --> In Progress
	retState = GetNewStateForUpdatedForm(models.SIRFSInProgress)
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// Submitted --> In Progress
	retState = GetNewStateForUpdatedForm(models.SIRFSSubmitted)
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// Any Unknown state --> In Progress
	retState = GetNewStateForUpdatedForm("")
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// Edits Requested --> Edits Requested
	retState = GetNewStateForUpdatedForm(models.SIRFSEditsRequested)
	assert.EqualValues(t, models.SIRFSEditsRequested, retState)
}
