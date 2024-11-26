#!/bin/bash

# Exit on any error
set -e

# Function to show usage
usage() {
  echo "Usage: $0 [-n namespace]"
  echo "  -n  Set the namespace. If not provided, it will be inferred from the current Git branch."
  echo "      Must be a valid Kubernetes namespace name (lowercase alpha characters, numbers, or hyphens)."
  echo "      See https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names"
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

# Function to validate the namespace string
validate_namespace() {
  local namespace=$1

  # Check if the branch name is empty
  if [ -z "$namespace" ]; then
    echo "Error: namespace string is empty"
    usage
  fi

  # Regex for valid namespace strings (modify as needed)
  local valid_namespace_regex='^[a-z0-9-]+$'
  local blacklisted_namespace_regex='^(default|kube-public|kube-system|kube-node-lease)$'

  if ! [[ $namespace =~ $valid_namespace_regex ]] ; then
    echo "Error: Invalid namespace. Per Kubernetes, namespaces must consist of lowercase alpha characters, numbers, or hyphens."
  fi

  if [[ $namespace =~ $blacklisted_namespace_regex ]] ; then
    echo "Error: Invalid namespace. Per Kubernetes, the following namespaces are reserved and cannot be used: default, kube-public, kube-system, kube-node-lease."
  fi

}

# Parse command line options
while getopts ":n:" opt; do
  case ${opt} in
    n )
      NAMESPACE=$OPTARG
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

# Set NAMESPACE from Git if not provided
if [ -z "$NAMESPACE" ]; then
    NAMESPACE=$(git rev-parse --abbrev-ref HEAD | sed -E 's/^(EASI-[0-9]*|NOREF).*/\1/' | tr '[:upper:]' '[:lower:]')
fi

# Run validate_namespace
validate_namespace "$NAMESPACE"

# Delete namespace if it exists
if kubectl get ns "$NAMESPACE" > /dev/null 2>&1; then
    echo "❄️  Clear ${NAMESPACE} namespace ❄️"
    kubectl delete ns "$NAMESPACE" || {
        echo "Failed to delete namespace ${NAMESPACE}"
        exit 1
    }
fi

# Build Docker images
(
    echo "🐋 Building easi-frontend:${NAMESPACE} image 🐋"
    docker build -f ../Dockerfile.frontend_k8s -t easi-frontend:"$NAMESPACE" ../.

    # APPLICATION_VERSION=$(git rev-parse HEAD)
    # APPLICATION_DATETIME="$(date --rfc-3339='seconds' --utc)"
    # APPLICATION_TS="$(date --date="$APPLICATION_DATETIME" '+%s')"
    # echo "APPLICATION_DATETIME=${APPLICATION_DATETIME}"
    # echo "APPLICATION_TS=${APPLICATION_TS}"
    # echo "APPLICATION_VERSION=${APPLICATION_VERSION}"

    echo "🐋 Building easi-backend:${NAMESPACE} image 🐋"
    # docker build -f ../Dockerfile --build-arg APPLICATION_DATETIME="${APPLICATION_DATETIME}" --build-arg APPLICATION_TS="${APPLICATION_TS}" --build-arg APPLICATION_VERSION="${APPLICATION_VERSION}" -t easi-backend:latest ../.
    docker build -f ../Dockerfile.backend_k8s --target build -t easi-backend:"$NAMESPACE" ../.

    echo "🐋 Building db-migrate:${NAMESPACE} image 🐋"
    docker build -f ../Dockerfile.db_migrations --build-arg TAG=9.10-alpine -t db-migrate:"$NAMESPACE" ../.

    echo "🐋 Building cedarproxy:${NAMESPACE} image 🐋"
    docker build -f ../cedarproxy/Dockerfile.cedarproxy -t cedarproxy:"$NAMESPACE" ../cedarproxy/.
)

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
    kustomize edit set namespace "$NAMESPACE"
    kustomize build > manifest.yaml
    sed -i'' -E "s/easi-frontend:latest/easi-frontend:${NAMESPACE}/" manifest.yaml
    sed -i'' -E "s/easi-backend:latest/easi-backend:${NAMESPACE}/" manifest.yaml
    sed -i'' -E "s/cedarproxy:latest/cedarproxy:${NAMESPACE}/" manifest.yaml
    sed -i'' -E "s/db-migrate:latest/db-migrate:${NAMESPACE}/" manifest.yaml
    sed -i'' -E "s/easi-backend.localdev.me/${NAMESPACE}-backend.localdev.me/" manifest.yaml
    sed -i'' -E "s/easi.localdev.me/${NAMESPACE}.localdev.me/" manifest.yaml
    sed -i'' -E "s/email.localdev.me/${NAMESPACE}-email.localdev.me/" manifest.yaml
    sed -i'' -E "s/minio.localdev.me/${NAMESPACE}-minio.localdev.me/" manifest.yaml
    kubectl apply -f manifest.yaml
    trap delete_temp_dir EXIT
)

echo "❄️  EASi: http://${NAMESPACE}.localdev.me ❄️"
echo "❄️  Mailcatcher: http://${NAMESPACE}-email.localdev.me ❄️"
echo "❄️  Minio: http://${NAMESPACE}-minio.localdev.me ❄️"

