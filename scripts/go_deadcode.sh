#!/bin/bash

# Make sure deadcode is installed at the latest version
go install golang.org/x/tools/cmd/deadcode@latest > /dev/null 2>&1

# Capture all arguments passed to the script
# This is mainly useful for passing extra flags to deadcode (-test being a common one)
args=("$@")

# Define the output from the command
output=$(deadcode "${args[@]}" -generated ./cmd/... ./pkg/...)

# Define an array of exclusions (RegEx is supported here!)
exclusions=(
	# Generated Code
	"pkg/graph/generated/generated.go" # gqlgen files
	"/gen/" # Anything in a /gen/ directory (cedar core and cedar intake, namely)

    # Anything in the ./cmd/ directory generally shouldn't be considered dead code, it's usually
    # just scripts or one-off commands
    # NOTE: We need to keep the ./cmd/ directory in the deadcode check, as it's where the main entrypoint is for the rest of the code in ./pkg/
    "^cmd/.*"

	# Other Exclusions
	"pkg/models/gql_scalars.go" # GQL Scalars are called by reflection, and don't get detected properly
	"pkg/testhelpers/" # Anything in the testhelpers directory is likely to only be used by tests, and can be ignored
)

# Function to build the grep pattern
build_grep_pattern() {
    local pattern=""
    for exclusion in "${exclusions[@]}"; do
        if [ -z "$pattern" ]; then
            pattern="$exclusion"
        else
            pattern="$pattern|$exclusion"
        fi
    done
    echo "$pattern"
}

# Build the grep pattern
pattern=$(build_grep_pattern)

# Exclude lines containing any of the exclusions
if [ -n "$pattern" ]; then
    echo "$output" | grep -Ev "$pattern"
else
    echo "$output"
fi
