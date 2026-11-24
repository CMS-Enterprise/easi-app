#!/bin/bash

# Expected environment variables
# ECR_REGISTRY
# ECR_REPOSITORY
# NEW_IMAGE_TAG
# TASK_FAMILY

# fail on any error
set -Eexuo pipefail

# Construct full ECR Image path
ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPOSITORY}:${NEW_IMAGE_TAG}"

# Get existing task definition
TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY")

# The app container is named after the task family (e.g. easi-app-db-migrate-dev). Look it up
# by name rather than position: task definitions with the CrowdStrike Falcon sensor
# also have a crowdstrike-falcon-init-container, and its image must not be replaced.
if ! echo "$TASK_DEFINITION" | jq -e --arg NAME "$TASK_FAMILY" '[.taskDefinition.containerDefinitions[] | select(.name == $NAME)] | length == 1' > /dev/null; then
  echo "Expected exactly one container named ${TASK_FAMILY} in task definition ${TASK_FAMILY}" >&2
  exit 1
fi

# Transform existing task definition by performing the following actions:
# 1. Update the app container's image to the new image we want to deploy
# 2. Remove fields from the task definition that are not compatibile with `register-task-definition`'s --cli-input-json
# Please https://github.com/aws/aws-cli/issues/3064#issuecomment-514214738
NEW_TASK_DEFINTIION=$(echo "$TASK_DEFINITION" | jq --arg IMAGE "$ECR_IMAGE" --arg NAME "$TASK_FAMILY" '.taskDefinition | .containerDefinitions |= map(if .name == $NAME then .image = $IMAGE else . end) | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')

# Register the new task, capture the output as JSON
NEW_TASK_INFO=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINTIION")

# Grab the new revision from the output
NEW_REVISION=$(echo "$NEW_TASK_INFO" | jq '.taskDefinition.revision')

# Output the new revision to stdout
echo "${NEW_REVISION}"