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

# Create Namespace!
(
    echo "❄️  Creating Namespace via Kubectl  ❄️"
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
)


# Generate and deploy ingress resources
(
    echo "❄️  Creating Ingress resources via Kustomize  ❄️"
    mkdir -p ../tmp.ingress && cd ../tmp.ingress
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
    kubectl apply -n "$NAMESPACE" -f manifest-ingress.yaml
)

# TODO: Fine tune this sleep time, or engineer around it.
# Try sleep 30 seconds for the load balancer to be created?
sleep 30

EASI_INGRESS=$(kubectl get ingress -n "$NAMESPACE" easi-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
MINIO_CONSOLE_INGRESS=$(kubectl get ingress -n "$NAMESPACE" minio-console-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
EMAIL_INGRESS=$(kubectl get ingress -n "$NAMESPACE" email-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

export EASI_INGRESS
export MINIO_CONSOLE_INGRESS
export EMAIL_INGRESS

# Generate and deploy EASI resources
(
    mkdir -p ../tmp.easi && cd ../tmp.easi
    echo "❄️  Deleting old resources in namespace, if they exist  ❄️"
    kubectl delete all --all -n "$NAMESPACE"

    echo "❄️  Creating EASi resources via Kustomize  ❄️"
    kustomize create --resources ../deploy/overlays/pr/easi
    kustomize edit set namespace "$NAMESPACE"
    kustomize edit set image easi-backend=840301899071.dkr.ecr.us-west-2.amazonaws.com/easi-backend:"$GIT_HASH"
    kustomize edit set image easi-frontend=840301899071.dkr.ecr.us-west-2.amazonaws.com/easi-frontend:"$GIT_HASH"
    kustomize edit set image db-migrate=840301899071.dkr.ecr.us-west-2.amazonaws.com/easi-db-migrate:"$GIT_HASH"
    kustomize build | envsubst '$EASI_INGRESS,$MINIO_CONSOLE_INGRESS,$EMAIL_INGRESS' > manifest-easi.yaml

    # if verbose, print out the kustomization.yaml and manifest-easi.yaml
    if [ "$VERBOSE" = true ]; then
        echo "❄️  kustomization.yaml  ❄️"
        cat kustomization.yaml

        echo "❄️  manifest-easi.yaml  ❄️"
        cat manifest-easi.yaml
    fi

    echo "❄️  Deploying EASi Objects via Kubectl  ❄️"
    kubectl apply -n "$NAMESPACE" -f manifest-easi.yaml
)

rm -rf ../tmp.ingress/kustomization.yaml ../tmp.easi/kustomization.yaml

echo "EASI: http://$EASI_INGRESS"
echo "Mailcatcher: http://$EMAIL_INGRESS"
echo "Minio Console: http://$MINIO_CONSOLE_INGRESS"
