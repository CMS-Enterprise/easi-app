#!/usr/bin/env bash

# Exit on any error
set -eu -o pipefail

# Set the repository name and image tag
repository_name="$1"
image_tag="$2"

# Wait for the scan to complete
echo "Waiting for scan to complete..."
while true; do
    # Temporarily disable exit on error
    set +e
    # Capture both stdout and stderr, redirecting stderr to stdout
    scanFindings=$(aws ecr describe-image-scan-findings --repository-name "$repository_name" --image-id imageTag="$image_tag" 2>&1)
    scanExitCode=$?
    # Re-enable exit on error
    set -e

    # Check for RepositoryNotFoundException
    if echo "$scanFindings" | grep -q "RepositoryNotFoundException"; then
        echo "Error: Repository not found."
        exit 1
    fi

    if [[ "$scanExitCode" -eq 254 ]]; then
        echo "Scan not available yet, retrying..."
        sleep 10
        continue # Use continue to retry only for code 254
    elif [[ "$scanExitCode" -ne 0 ]]; then
        echo "An error occurred with exit code $scanExitCode."
        echo "Error details: $scanFindings"
        exit $scanExitCode
    fi

    # If we get here, it means exit code was 0, and we can check the scan status
    scanStatus=$(echo "$scanFindings" | jq -r '.imageScanStatus.status')

    if [[ "$scanStatus" == "PENDING" ]]; then
        echo "Scan in progress..."
        sleep 10  # Wait before retrying, indicating the scan is still pending
    elif [[ "$scanStatus" == "ACTIVE" ]]; then
        echo "Scan complete"
        break  # Exit the loop, indicating the scan has completed successfully
    else
        echo "Unexpected scan status: $scanStatus"
        exit 1  # Exit the script due to an unexpected scan status
    fi
done

# Retrieve the scan findings and parse the total findings
totalFindings=$(aws ecr describe-image-scan-findings --repository-name "$repository_name" --image-id imageTag="$image_tag" | jq '.imageScanFindings.findingSeverityCounts | add')

# Check if totalFindings is not null and greater than 0
if [[ "$totalFindings" != "null" && "$totalFindings" -gt 0 ]]; then
  echo "Scan found $totalFindings findings!"
  exit 1
else
  echo "Scan found no findings"
fi
