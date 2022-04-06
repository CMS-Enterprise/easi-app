#!/usr/bin/env bash
#
# Example:
# scripts/find-ecr-image.sh easi-backend some-tag

if [[ $# -lt 2 ]]; then
    echo "Usage: $( basename "$0" ) <repository-name> <image-tag>"
    exit 1
fi

if [[ "$( aws ecr describe-images --repository-name="$1" --image-ids=imageTag="$2" 2> /dev/null )" ]]; then
    echo 1 # Image exists
else
    echo 0 # Image does not exist
fi