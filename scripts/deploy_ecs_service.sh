#!/bin/bash

# Expected environment variables
# TASK_FAMILY
# ECS_CLUSTER
# SERVICE_NAME
# TASK_REVISION

# fail on any error
set -Eexuo pipefail

# Update the service with the new revision
aws ecs update-service --cluster "${ECS_CLUSTER}" \
                       --service "${SERVICE_NAME}" \
                       --task-definition "${TASK_FAMILY}:${TASK_REVISION}" \
                       --no-cli-pager

aws ecs wait services-stable --cluster "${ECS_CLUSTER}" --service "${SERVICE_NAME}"
