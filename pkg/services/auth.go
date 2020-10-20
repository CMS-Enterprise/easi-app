package services

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
)

// NewAuthorizeRequireGRTJobCode returns a function
// that authorizes a user as being a member of the
// GRT (Governance Review Team)
func NewAuthorizeRequireGRTJobCode() func(context.Context) (bool, error) {
	return func(ctx context.Context) (bool, error) {
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		if !principal.AllowGRT() {
			logger.Info("not a member of the GRT")
			return false, nil
		}
		return true, nil
	}
}
