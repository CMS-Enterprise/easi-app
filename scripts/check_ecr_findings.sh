#!/usr/bin/env bash

# Exit on any error
set -eu -o pipefail

# Set the repository name and image tag
repository_name="$1"
image_tag="$2"

# Start the image scan
aws ecr start-image-scan --repository-name "$repository_name" --image-id imageTag="$image_tag"

# Wait for the scan to complete
echo "Waiting for scan to complete..."
while true; do
    scanStatus=$(aws ecr describe-image-scan-findings --repository-name "$repository_name" --image-id imageTag="$image_tag" | jq -r '.imageScanStatus.status')
    
    if [[ "$scanStatus" == "COMPLETE" ]]; then
        echo "Scan complete"
        break
    elif [[ "$scanStatus" == "FAILED" ]]; then
        echo "Scan failed"
        exit 1
    else
        echo "Scan in progress..."
        sleep 10
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
