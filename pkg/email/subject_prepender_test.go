package email

import (
	"testing"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
)

func TestAddNonProdEnvToSubject(t *testing.T) {
	localEnv, _ := appconfig.NewEnvironment("local")
	devEnv, _ := appconfig.NewEnvironment("dev")
	testEnv, _ := appconfig.NewEnvironment("test")
	implEnv, _ := appconfig.NewEnvironment("impl")
	prodEnv, _ := appconfig.NewEnvironment("prod")

	// these final two cases really only exist to test what would happen if
	// we ignored the error returned by NewEnvironment, which both of these cases will hit
	invalidEnv, _ := appconfig.NewEnvironment("something weird!")
	emptyEnv, _ := appconfig.NewEnvironment("")

	tests := []struct {
		name     string
		subject  string
		env      appconfig.Environment
		expected string
	}{
		{
			name:     "add localEnv to subject",
			env:      localEnv,
			subject:  "subject",
			expected: "[local] subject",
		},
		{
			name:     "add devEnv to subject",
			env:      devEnv,
			subject:  "subject",
			expected: "[dev] subject",
		},
		{
			name:     "add testEnv to subject",
			env:      testEnv,
			subject:  "subject",
			expected: "[test] subject",
		},
		{
			name:     "add implEnv to subject",
			env:      implEnv,
			subject:  "subject",
			expected: "[impl] subject",
		},
		{
			name:     "prodEnv should not add anything to subject",
			env:      prodEnv,
			subject:  "subject",
			expected: "subject", // no change!
		},
		{
			name:     "invalidEnv should not add anything to subject",
			env:      invalidEnv,
			subject:  "subject",
			expected: "subject",
		},
		{
			name:     "emptyEnv should not add anything to subject",
			env:      emptyEnv,
			subject:  "subject",
			expected: "subject",
		},
		{
			name:     "add implEnv to empty subject",
			env:      implEnv,
			subject:  "",
			expected: "[impl] ", // note the space at the end -- this is a weird / unexpected case, but it's predictable!
		},
		{
			name:     "prodEnv should not add anything to empty subject",
			env:      prodEnv,
			subject:  "",
			expected: "", // no change!
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := AddNonProdEnvToSubject(tt.subject, tt.env)
			if actual != tt.expected {
				t.Errorf("expected %s; got %s", tt.expected, actual)
			}
		})
	}
}
