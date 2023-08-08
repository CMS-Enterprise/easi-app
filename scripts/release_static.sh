#!/usr/bin/env bash
#

set -eu -o pipefail

# Check if we have any access to the s3 bucket
# Since `s3 ls` returns zero even if the command failed, we assume failure if this command prints anything to stderr
s3_err="$(aws s3 ls "$STATIC_S3_BUCKET" 1>/dev/null 2>&1)"
if [[ -z "$s3_err" ]] ; then
  ( set -x -u ;
    aws s3 sync --no-progress --delete build/ s3://"$STATIC_S3_BUCKET"/
  )
else
  echo "+ aws s3 ls $STATIC_S3_BUCKET"
  echo "$s3_err"
  echo "--"
  echo "Error reading the S3 bucket. Are you authenticated?" 1>&2
  exit 1
fi

