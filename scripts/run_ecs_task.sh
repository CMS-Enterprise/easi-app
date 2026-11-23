#!/bin/bash

# Expected environment variables
# ECS_CLUSTER
# TASK_FAMILY
# TASK_REVISION
# SECURITY_GROUP_NAME

# fail on any error
set -Eexuo pipefail

# VPC_ID=$(aws ec2 describe-vpcs | jq -r '.Vpcs[0].VpcId')
SG_IDS=$(aws ec2 describe-security-groups --filters="Name=group-name,Values=${SECURITY_GROUP_NAME}" --query "SecurityGroups[*].GroupId" | jq -r tostring)
SUBNET_IDS=$(aws ec2 describe-subnets --filters="Name=tag:use,Values=private" --query "Subnets[*].SubnetId" | jq -r tostring)

NETWORK_CONFIG="{\"awsvpcConfiguration\":{\"assignPublicIp\":\"DISABLED\",\"securityGroups\":${SG_IDS},\"subnets\":${SUBNET_IDS}}}"
RUN_RESULT=$(aws ecs run-task --cluster "${ECS_CLUSTER}" \
                              --task-definition "${TASK_FAMILY}:${TASK_REVISION}" \
                              --launch-type="FARGATE" \
                              --network-configuration "${NETWORK_CONFIG}" \
                              --no-cli-pager)
TASK_ARN=$(echo "${RUN_RESULT}" | jq -r '.tasks[0].taskArn')

aws ecs wait tasks-stopped --cluster "${ECS_CLUSTER}" --tasks "${TASK_ARN}"

# Read the app container's exit code by name (it's named after the task family).
# containers[] isn't in a fixed order, and with the CrowdStrike Falcon sensor the
# task also has an init container that always exits 0, so containers[0] could hide
# a failed migration.
TASK_EXIT_CODE=$(aws ecs describe-tasks \
                --cluster "${ECS_CLUSTER}" \
                --tasks "${TASK_ARN}" \
                --query "tasks[0].containers[?name=='${TASK_FAMILY}'] | [0].exitCode" \
                --output text)

# No exit code (e.g. the container never started) is a failure, not success.
if ! [[ "${TASK_EXIT_CODE}" =~ ^[0-9]+$ ]]; then
  echo "No exit code for container ${TASK_FAMILY} (got '${TASK_EXIT_CODE}'); treating as failure" >&2
  exit 1
fi

exit "${TASK_EXIT_CODE}"