#!/usr/bin/env bash
#

set -eu -o pipefail

case "$APP_ENV" in
  "test")
    EASI_URL="http://easi:8080"
    export REACT_APP_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    export REACT_APP_OKTA_REDIRECT_URI="http://localhost:3000/implicit/callback"
    export REACT_APP_LOCAL_AUTH_ENABLED=true
    ;;
  "dev")
    EASI_URL="https://dev.easi.cms.gov"
    export VITE_OKTA_DOMAIN="https://test.idp.idm.cms.gov"
    ;;
  "impl")
    EASI_URL="https://impl.easi.cms.gov"
    export VITE_OKTA_DOMAIN="https://impl.idp.idm.cms.gov"
    ;;
  "prod")
    EASI_URL="https://easi.cms.gov"
    export VITE_OKTA_DOMAIN="https://idm.cms.gov"
    ;;
  *)
    echo "APP_ENV value not recognized: ${APP_ENV:-unset}"
    echo "Allowed values: 'test','dev','impl','prod'"
    exit 1
    ;;
esac

export VITE_OKTA_CLIENT_ID="$OKTA_CLIENT_ID"
export VITE_OKTA_SERVER_ID="$OKTA_SERVER_ID"
export VITE_LD_CLIENT_ID="$LD_CLIENT_ID"
export VITE_APP_ENV="$APP_ENV"
export VITE_OKTA_ISSUER="${VITE_OKTA_DOMAIN}/oauth2/${VITE_OKTA_SERVER_ID}"
export VITE_OKTA_REDIRECT_URI="${EASI_URL}/implicit/callback"
export VITE_API_ADDRESS="${EASI_URL}/api/v1"
export VITE_GRAPHQL_ADDRESS="${EASI_URL}/api/graph/query"

# Only set REACT_APP_OKTA_REDIRECT_URI if APP_ENV is not "test"
if [ "$APP_ENV" != "test" ]; then
    export REACT_APP_OKTA_REDIRECT_URI="${EASI_URL}/implicit/callback"
fi

# Build the application
( 
  set -x -u ;
  yarn install --frozen-lockfile
  yarn run build || exit
)


