#!/bin/bash

# Exit on any error
set -e

# Parent path magic to always set the correct relative paths when running this script
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )
cd "$parent_path" || exit

# Parse command line options
while getopts ":n:v" opt; do
  case ${opt} in
    n )
      NAMESPACE=$OPTARG
      ;;
    v )
        VERBOSE=true
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

# Function to validate the namespace string
validate_namespace() {
  local namespace=$1

  # Check if the branch name is empty
  if [ -z "$namespace" ]; then
    echo "Error: namespace string is empty"
  fi

  # Regex for valid namespace strings (modify as needed)
  local valid_namespace_regex='^[a-z0-9-]+$'
  local blacklisted_namespace_regex='^(default|kube-public|kube-system|kube-node-lease)$'

  if ! [[ $namespace =~ $valid_namespace_regex ]] ; then
    echo "Error: Invalid namespace. Per Kubernetes, namespaces must consist of lowercase alpha characters, numbers, or hyphens."
    exit 1
  fi

  if [[ $namespace =~ $blacklisted_namespace_regex ]] ; then
    echo "Error: Invalid namespace. Per Kubernetes, the following namespaces are reserved and cannot be used: default, kube-public, kube-system, kube-node-lease."
    exit 1
  fi

}
# Set NAMESPACE from Git if not provided
if [ -z "$NAMESPACE" ]; then
    NAMESPACE=$(git rev-parse --abbrev-ref HEAD | sed -E 's/^(EASI-[0-9]*|NOREF).*/\1/' | tr '[:upper:]' '[:lower:]')
fi
validate_namespace "$NAMESPACE"
echo "Namespace is set to: $NAMESPACE"

# Delete namespace if it exists
if kubectl get ns "$NAMESPACE" > /dev/null 2>&1; then
    echo "❄️  Deleting ${NAMESPACE} namespace ❄️"
    kubectl delete ns "$NAMESPACE" --force || {
        echo "Failed to delete namespace ${NAMESPACE}"
        exit 1
    }
fi

# Create Namespace!
(
    echo "❄️  Creating Namespace via Kubectl  ❄️"
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
)


# Generate and deploy ingress resources
(
    echo "❄️  Creating Ingress resources via Kustomize  ❄️"
    TEMPDIR=$(mktemp -d ../tmp.ingress.XXXXX)
    cd "$TEMPDIR" || exit
    kustomize create --resources ../deploy/overlays/pr/ingress
    kustomize edit set namespace "$NAMESPACE"
    kustomize build > manifest-ingress.yaml

    # if verbose, print out the kustomization.yaml and manifest-ingress.yaml
    if [ "$VERBOSE" = true ]; then
        echo "❄️  kustomization.yaml  ❄️"
        cat kustomization.yaml

        echo "❄️  manifest-ingress.yaml  ❄️"
        cat manifest-ingress.yaml
    fi

    echo "❄️  Deploying Ingress Objects via Kubectl  ❄️"
    kubectl apply -n $NAMESPACE -f manifest-ingress.yaml

    rm -rf "$TEMPDIR"
)

# TODO: Fine tune this sleep time, or engineer around it.
# Try sleep 30 seconds for the load balancer to be created?
sleep 30

EASI_BACKEND_INGRESS=$(kubectl get ingress -n $NAMESPACE easi-backend-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
EASI_FRONTEND_INGRESS=$(kubectl get ingress -n $NAMESPACE easi-frontend-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
MINIO_CONSOLE_INGRESS=$(kubectl get ingress -n $NAMESPACE minio-console-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
EMAIL_INGRESS=$(kubectl get ingress -n $NAMESPACE email-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Generate and deploy EASI resources
(
    echo "❄️  Creating EASi resources via Kustomize  ❄️"
    TEMPDIR=$(mktemp -d ../tmp.easi.XXXXX)
    cd "$TEMPDIR" || exit
    kustomize create --resources ../deploy/overlays/pr/easi
    kustomize edit set namespace "$NAMESPACE"
    kustomize edit set image easi-backend=840301899071.dkr.ecr.us-west-2.amazonaws.com/easi-backend:"$GIT_HASH"
    kustomize edit set image easi-frontend=840301899071.dkr.ecr.us-west-2.amazonaws.com/easi-frontend:"$GIT_HASH"
    kustomize edit set image db-migrate=840301899071.dkr.ecr.us-west-2.amazonaws.com/easi-db-migrate:"$GIT_HASH"
    kustomize build | envsubst > manifest-easi.yaml

    # if verbose, print out the kustomization.yaml and manifest-easi.yaml
    if [ "$VERBOSE" = true ]; then
        echo "❄️  kustomization.yaml  ❄️"
        cat kustomization.yaml

        echo "❄️  manifest-easi.yaml  ❄️"
        cat manifest-easi.yaml
    fi

    echo "❄️  Deploying Ingress Objects via Kubectl  ❄️"
    kubectl apply -n $NAMESPACE -f manifest-easi.yaml

    # rm -rf "$TEMPDIR"
)


echo "EASI-BACKEND-INGRESS: $EASI_BACKEND_INGRESS"
echo "EASI-FRONTEND-INGRESS: $EASI_FRONTEND_INGRESS"
echo "MINIO-CONSOLE-INGRESS: $MINIO_CONSOLE_INGRESS"
echo "EMAIL-INGRESS: $EMAIL_INGRESS"
