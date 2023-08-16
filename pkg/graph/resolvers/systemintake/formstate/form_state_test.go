package formstate

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

func TestSetInProgress(t *testing.T) {

	// Not Started --> In Progress
	retState := SetInProgress(models.SIRFSNotStarted)
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// In Progress --> In Progress
	retState = SetInProgress(models.SIRFSInProgress)
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// Submitted --> In Progress
	retState = SetInProgress(models.SIRFSSubmitted)
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// Any Unknown state --> In Progress
	retState = SetInProgress("")
	assert.EqualValues(t, models.SIRFSInProgress, retState)

	// Edits Requested --> Edits Requested
	retState = SetInProgress(models.SIRFSEditsRequested)
	assert.EqualValues(t, models.SIRFSEditsRequested, retState)
}
