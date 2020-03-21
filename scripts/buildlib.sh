#!/usr/bin/env bash
# shellcheck disable=SC2034
#
# objects common to the docker build scripts
#

ecr_repo="${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com"
ecr_backend="${ecr_repo}/easi-backend"
ecr_db_migrate="${ecr_repo}/easi-db-migrate"
ecr_db_clean="${ecr_repo}/easi-db-clean"

APPLICATION_VERSION="${CIRCLE_SHA1:-"$(git rev-parse HEAD)"}"
APPLICATION_DATETIME="$(date --rfc-3339='seconds' --utc)"
APPLICATION_TS="$(date --date="$APPLICATION_DATETIME" '+%s')"

builddir="$(git rev-parse --show-toplevel)"

_tag_and_push() {
  # tag an image and push it up to the target repo
  declare image="$1"
  declare tag="$2:$3"

  if ( set -x ; docker tag "$image" "$tag" ) ; then
    ( set -x ; docker push "$tag" )
  else
    return
  fi
}
