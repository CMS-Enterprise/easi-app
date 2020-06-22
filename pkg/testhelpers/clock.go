package testhelpers

import (
	"time"

	"github.com/facebookgo/clock"
)

// SettableClock is a mock clock that can be set
type SettableClock struct {
	*clock.Mock
}

// Set sets the clock's Now() to the given time
func (c *SettableClock) Set(now time.Time) {
	for !c.Now().Equal(now) {
		c.Add(now.Sub(c.Now()))
	}
}
