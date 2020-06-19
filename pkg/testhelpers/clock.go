package testhelpers

import (
	"time"

	"github.com/facebookgo/clock"
)

// NewMockClock returns a mock clock that returns the given time for Now()
func NewMockClock(now time.Time) *clock.Mock {
	newClock := clock.NewMock()
	for !newClock.Now().Equal(now) {
		newClock.Add(now.Sub(newClock.Now()))
	}
	return newClock
}
