package flags

import (
	"context"
	"crypto/sha256"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
)

func TestPrincipal(t *testing.T) {
	testCases := map[string]struct {
		ctx  context.Context
		anon bool
	}{
		"anonymous": {
			context.Background(),
			true,
		},
		"disempowered": {
			appcontext.WithPrincipal(
				context.Background(),
				&authentication.EUAPrincipal{EUAID: "WEAK"},
			),
			true,
		},
		"submitter": {
			appcontext.WithPrincipal(
				context.Background(),
				&authentication.EUAPrincipal{EUAID: "EASi", JobCodeEASi: true},
			),
			false,
		},
		"reviewer": {
			appcontext.WithPrincipal(
				context.Background(),
				&authentication.EUAPrincipal{EUAID: "BOSS", JobCodeGRT: true},
			),
			false,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			base := appcontext.Principal(tc.ctx)

			lduser := Principal(tc.ctx)

			assert.Equal(t, tc.anon, lduser.GetAnonymous())
			assert.NotEqual(t, base.ID(), lduser.GetKey())
			assert.Equal(t, len(lduser.GetKey()), sha256.Size*2)
			// t.Logf("key: %s\n", lduser.GetKey())
		})
	}
}
