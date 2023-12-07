#!/bin/bash

# Function to show usage
usage() {
  echo "Usage: $0 [-b branch_name]"
  echo "  -b  Set the branch name. If not provided, it will be inferred from Git."
  exit 1
}

# Parent path magic to always set the correct relative paths when running this script
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )
cd "$parent_path" || exit

# PREREQ CHECKS!
# Check if kustomize is installed
if ! command -v kustomize &> /dev/null; then
  echo "kustomize is not installed in user PATH directories. Please install kustomize and try again."
  echo "See https://kubectl.docs.kubernetes.io/installation/kustomize/ for installation instructions."
  exit 1
fi
# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
  echo "kubectl is not installed in user PATH directories. Please install kubectl and try again."
  echo "See https://kubernetes.io/docs/tasks/tools/ for installation instructions."
  exit 1
fi

BRANCH_NAME=""

# Parse command line options
while getopts ":b:" opt; do
  case ${opt} in
    b )
      BRANCH_NAME=$OPTARG
      ;;
    \? )
      echo "Invalid Option: -$OPTARG" 1>&2
      usage
      ;;
    : )
      echo "Invalid Option: -$OPTARG requires an argument" 1>&2
      usage
      ;;
  esac
done

# Set BRANCH_NAME from Git if not provided
if [ -z "$BRANCH_NAME" ]; then
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD | sed 's/\(EASI-[0-9]*\).*/\1/' | tr '[:upper:]' '[:lower:]')
fi

echo "❄️  Clear ${BRANCH_NAME} namespace ❄️"
kubectl delete ns "$BRANCH_NAME" --force

echo "🐋 Building easi-client:${BRANCH_NAME} image 🐋"
docker build -f ../Dockerfile.client_k8s -t easi-client:$BRANCH_NAME ../.

# APPLICATION_VERSION=$(git rev-parse HEAD)
# APPLICATION_DATETIME="$(date --rfc-3339='seconds' --utc)"
# APPLICATION_TS="$(date --date="$APPLICATION_DATETIME" '+%s')"
# echo "APPLICATION_DATETIME=${APPLICATION_DATETIME}"
# echo "APPLICATION_TS=${APPLICATION_TS}"
# echo "APPLICATION_VERSION=${APPLICATION_VERSION}"

echo "🐋 Building easi-backend:${BRANCH_NAME} image 🐋"
# docker build -f ../Dockerfile --build-arg APPLICATION_DATETIME="${APPLICATION_DATETIME}" --build-arg APPLICATION_TS="${APPLICATION_TS}" --build-arg APPLICATION_VERSION="${APPLICATION_VERSION}" -t easi-backend:latest ../.
docker build -f ../Dockerfile.backend_k8s --target build -t easi-backend:$BRANCH_NAME ../.

echo "🐋 Building db-migrate:${BRANCH_NAME} image 🐋"
docker build -f ../Dockerfile.db_migrations --build-arg TAG=9.10-alpine -t db-migrate:$BRANCH_NAME ../.

echo "❄️  Deploying EASi via Kustomize  ❄️"
TEMPDIR=$(mktemp -d ../tmp.k8s.XXXXX)
delete_temp_dir() {
    if [ -d "$TEMPDIR" ]; then
        rm -r "$TEMPDIR"
    fi
}
(
    cd "$TEMPDIR" || exit
    kustomize create --resources ../deploy/base
    kustomize edit set namespace "$BRANCH_NAME"
    kustomize build > manifest.yaml
    sed -i "s/easi-client:latest/easi-client:${BRANCH_NAME}/" manifest.yaml
    sed -i "s/easi-backend:latest/easi-backend:${BRANCH_NAME}/" manifest.yaml
    sed -i "s/db-migrate:latest/db-migrate:${BRANCH_NAME}/" manifest.yaml
    sed -i "s/easi-backend.localdev.me/${BRANCH_NAME}-backend.localdev.me/" manifest.yaml
    sed -i "s/easi.localdev.me/${BRANCH_NAME}.localdev.me/" manifest.yaml
    sed -i "s/email.localdev.me/${BRANCH_NAME}-email.localdev.me/" manifest.yaml
    kubectl apply -f manifest.yaml
    trap delete_temp_dir EXIT
)

echo "❄️  EASi: http://${BRANCH_NAME}.localdev.me ❄️"
echo "❄️  Mailcatcher: http://${BRANCH_NAME}-email.localdev.me ❄️"

