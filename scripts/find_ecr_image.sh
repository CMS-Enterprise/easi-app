#!/usr/bin/env bash
#
# Example:
# scripts/find-ecr-image.sh easi-backend some-tag

if [[ $# -lt 2 ]]; then
    echo "Usage: $( basename "$0" ) <repository-name> <image-tag>"
    exit 1
fi

if [[ "$( aws ecr describe-images --repository-name="$1" --image-ids=imageTag="$2" 2> /dev/null )" ]]; then
    echo "$1:$2 found"
else
    echo "$1:$2 not found"
    exit 1
fi