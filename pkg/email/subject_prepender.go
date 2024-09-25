package email

import (
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
)

// AddNonProdEnvToSubject takes a subject and an environment and returns a new subject with the environment prepended if (and only if) the environment is non-production
// Otherwise, it returns the original subject
func AddNonProdEnvToSubject(subject string, env appconfig.Environment) string {
	// if the environment is production OR we can't determine what it is (invalid)
	// just return the original subject
	if env.Prod() || env.String() == "" {
		return subject
	}
	return fmt.Sprintf("[%s] %s", env.String(), subject)
}
