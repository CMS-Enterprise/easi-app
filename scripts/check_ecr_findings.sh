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
    scanFindings=$(aws ecr describe-image-scan-findings --repository-name "$repository_name" --image-id imageTag="$image_tag")
    scanExitCode=$?
    # Re-enable exit on error
    set -e

    if [[ "$scanExitCode" -eq 254 ]]; then
        echo "Scan not available yet, retrying..."
        sleep 10
        continue # Using continue to retry
    elif [[ "$scanExitCode" -ne 0 ]]; then
        echo "An error occurred with exit code $scanExitCode."
        exit $scanExitCode
    fi

    # At this point, scanExitCode is 0, so we can proceed to analyze the scan findings
    scanStatus=$(echo "$scanFindings" | jq -r '.imageScanStatus.status')

    if [[ "$scanStatus" == "COMPLETE" ]]; then
        echo "Scan complete"
        break
    elif [[ "$scanStatus" == "IN_PROGRESS" ]]; then
        echo "Scan in progress..."
        sleep 10
    elif [[ "$scanStatus" == "FAILED" ]]; then
        echo "Scan failed"
        exit 1
    else
        echo "Unexpected scan status: $scanStatus"
        exit 1
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
