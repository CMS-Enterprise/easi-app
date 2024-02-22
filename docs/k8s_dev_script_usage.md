# k8s_dev.sh - Script for easy EASi Deployment to a local Kubernetes Cluster for easy local development 😉

`k8s_dev.sh` is used to deploy the EASi application to a Kubernetes cluster.

## Prerequisites

#### `kubectl`

You will need to have `kubectl` installed somewhere in your PATH directories in order to interact with a Kubernetes cluster.  
See https://kubernetes.io/docs/tasks/tools/ for installation instructions.

#### Kubernetes Cluster

You will obviously need a cluster to deploy to. This cluster needs to be configured as your current `kubectl` context, as the current functionality of this script does not let you define contexts during runtime.

#### Kustomize

`kustomize` is a Kubernetes configuration transformation tool that enables you to customize base YAML manifests, leaving the original files untouched.
`kustomize` will need to be installed somewhere in your PATH directories.  
See https://kubectl.docs.kubernetes.io/installation/kustomize/ for installation instructions.

## What does it do?

1. Prerequisite check: looking for `kubectl` and `kustomize`
1. Clears given branch namespace to remove any previous deployment
1. Builds `easi-client`, `easi-backend`, and `db-migrate` images and tags with branch/namespace name
1. Using `kustomize`, deploys EASi into given branch namespace
1. Prints output for EASi and MailCatcher URLs for easy (😉) access

## Usage

`./k8s_dev.sh [OPTIONS]`

By default, this script will create a new namespace with the branch name.  
For example: I have checked out a git branch named `EASI-3486/create-local-development-k8s-manifests`. The script will strip the relevant `easi-3486` and use this as the namespace throughout runtime.

#### Options

| OPTION 	|              ACTION              	|
|--------	|:--------------------------------:	|
|   -n   	| Create a custom namespace 	|

## Examples

### Default Namespace (checked out EASI-3483/create-local-development-k8s-manifests)
```bash
./scripts/k8s_dev.sh
❄️  Clear easi-3483 namespace ❄️
Warning: Immediate deletion does not wait for confirmation that the running resource has been terminated. The resource may continue to run on the cluster indefinitely.
namespace "easi-3483" force deleted
🐋 Building easi-client:easi-3483 image 🐋
[+] Building 2.1s (14/14) FINISHED
::: DOCKER BUILD OUTPUT :::
🐋 Building easi-backend:easi-3483 image 🐋
[+] Building 5.1s (14/14) FINISHED
::: DOCKER BUILD OUTPUT :::
🐋 Building db-migrate:easi-3483 image 🐋
[+] Building 2.1s (7/7) FINISHED
::: DOCKER BUILD OUTPUT :::
❄️  Deploying EASi via Kustomize  ❄️
namespace/easi-3483 created
configmap/db-configmap created
configmap/easi-backend-configmap created
configmap/easi-client-configmap created
service/db created
service/easi-backend created
service/easi-client created
service/email created
deployment.apps/db created
deployment.apps/easi-backend created
deployment.apps/easi-client created
deployment.apps/email created
job.batch/db-migrate created
ingress.networking.k8s.io/easi-backend-ingress created
ingress.networking.k8s.io/easi-client-ingress created
ingress.networking.k8s.io/email-ingress created
❄️  EASi: http://easi-3483.localdev.me ❄️
❄️  Mailcatcher: http://easi-3483-email.localdev.me ❄️
```

### Custom Branch Namespace
```bash
./scripts/k8s_dev.sh -n easi

❄️  Clear easi namespace ❄️
Warning: Immediate deletion does not wait for confirmation that the running resource has been terminated. The resource may continue to run on the cluster indefinitely.
namespace "easi" force deleted
🐋 Building easi-client:easi image 🐋
[+] Building 72.8s (15/15) FINISHED
::: DOCKER BUILD OUTPUT :::
🐋 Building easi-backend:easi image 🐋
[+] Building 20.6s (15/15) FINISHED
::: DOCKER BUILD OUTPUT :::
🐋 Building db-migrate:easi image 🐋
[+] Building 2.2s (8/8) FINISHED
::: DOCKER BUILD OUTPUT :::
❄️  Deploying EASi via Kustomize  ❄️
namespace/easi created
configmap/db-configmap created
configmap/easi-backend-configmap created
configmap/easi-client-configmap created
service/db created
service/easi-backend created
service/easi-client created
service/email created
deployment.apps/db created
deployment.apps/easi-backend created
deployment.apps/easi-client created
deployment.apps/email created
job.batch/db-migrate created
ingress.networking.k8s.io/easi-backend-ingress created
ingress.networking.k8s.io/easi-client-ingress created
ingress.networking.k8s.io/email-ingress created
❄️  EASi: http://easi.localdev.me ❄️
❄️  Mailcatcher: http://easi-email.localdev.me ❄️
```
