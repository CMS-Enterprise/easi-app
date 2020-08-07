package authn

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestPrincipal(t *testing.T) {
	// Arrange

	// using current time for a bit of fuzzing
	now := time.Now().Unix()
	okEASi := (now%2 == 0)
	okGRT := (now%3 == 0)
	id := fmt.Sprintf("%X", now)
	real := &EUAPrincipal{
		EUAID:       id,
		JobCodeEASi: okEASi,
		JobCodeGRT:  okGRT,
	}
	testCases := map[string]struct {
		p          Principal
		expectID   string
		expectEASi bool
		expectGRT  bool
	}{
		"anonymous is unauthorized": {
			p:          ANON,
			expectID:   anonID,
			expectEASi: false,
			expectGRT:  false,
		},
		"regular eua user": {
			p:          real,
			expectID:   id,
			expectEASi: okEASi,
			expectGRT:  okGRT,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			// Act - not needed

			//Assert
			assert.NotEmpty(t, tc.p.String(), "fmt.Stringer")
			assert.NotEmpty(t, tc.p.ID(), "ID()")
			assert.Equal(t, tc.expectID, tc.p.ID())
			assert.Equal(t, tc.expectEASi, tc.p.AllowEASi())
			assert.Equal(t, tc.expectGRT, tc.p.AllowGRT())
		})
	}
}
