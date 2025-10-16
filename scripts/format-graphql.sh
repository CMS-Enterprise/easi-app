#!/bin/sh

# Filter only .graphql files from arguments
graphql_files=""
for file in "$@"; do
  case "$file" in
    *.graphql) graphql_files="$graphql_files \"$file\"" ;;
  esac
done

# If no graphql files, exit cleanly
if [ -z "$graphql_files" ]; then
  echo "No GraphQL files to format."
  exit 0
fi


# Run prettier check on these files
changed=$(eval yarn prettier --check "$graphql_files" 2>&1 )
echo "$changed" | awk '/^\[warn\] .*\.graphql$/ { sub(/^\[warn\] /, ""); print }'
changed_files_output=$(echo "$changed" | awk '/^\[warn\] .*\.graphql$/ { sub(/^\[warn\] /, ""); print }' | grep '.graphql')
if [ -n "$changed_files_output" ]; then
  echo "$changed_files_output"
  # format files and squash the output
  eval yarn prettier --write "$graphql_files" --log-level silent > /dev/null 2>&1

fi