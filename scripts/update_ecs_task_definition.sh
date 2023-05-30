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

# Transform existing task definition by performing the following actions:
# 1. Update the `containerDefinitions[0].image` to the new image we want to deploy
# 2. Remove fields from the task definition that are not compatibile with `register-task-definition`'s --cli-input-json
# Please https://github.com/aws/aws-cli/issues/3064#issuecomment-514214738
NEW_TASK_DEFINTIION=$(echo "$TASK_DEFINITION" | jq --arg IMAGE "$ECR_IMAGE" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')

# Register the new task, capture the output as JSON
NEW_TASK_INFO=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINTIION")

# Grab the new revision from the output
NEW_REVISION=$(echo "$NEW_TASK_INFO" | jq '.taskDefinition.revision')

# Output the new revision to stdout
echo "${NEW_REVISION}"