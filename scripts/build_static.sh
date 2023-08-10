#!/usr/bin/env bash
#

set -eu -o pipefail

case "$APP_ENV" in
  "dev")
    EASI_URL="https://dev.easi.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    ;;
  "impl")
    EASI_URL="https://impl.easi.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://impl.idp.idm.cms.gov"
    ;;
  "prod")
    EASI_URL="https://easi.cms.gov"
    export REACT_APP_OKTA_DOMAIN="https://idm.cms.gov"
    ;;
  *)
    echo "APP_ENV value not recognized: ${APP_ENV:-unset}"
    echo "Allowed values: 'dev', 'impl', 'prod'"
    exit 1
    ;;
esac

export REACT_APP_OKTA_CLIENT_ID="$OKTA_CLIENT_ID"
export REACT_APP_OKTA_SERVER_ID="$OKTA_SERVER_ID"
export REACT_APP_LD_CLIENT_ID="$LD_CLIENT_ID"
export REACT_APP_APP_ENV="$APP_ENV"
export REACT_APP_OKTA_ISSUER="${REACT_APP_OKTA_DOMAIN}/oauth2/${REACT_APP_OKTA_SERVER_ID}"
export REACT_APP_OKTA_REDIRECT_URI="${EASI_URL}/implicit/callback"
export REACT_APP_API_ADDRESS="${EASI_URL}/api/v1"
export REACT_APP_GRAPHQL_ADDRESS="${EASI_URL}/api/graph/query"

# Build the application
( 
  set -x -u ;
  yarn install --frozen-lockfile
  yarn run build || exit
)


