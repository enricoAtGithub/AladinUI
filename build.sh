#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# $1: settings profile
# $2: build number

source settings.properties
if [ -n "$1" ]; then
  source settings-$1.properties
fi

build_no=local
if [ -n "$2" ]; then
  build_no=$2
fi

export git_sha=$(git rev-parse --short HEAD)
export branch=$(git symbolic-ref --short HEAD)

export NODE_OPTIONS="--max-old-space-size=8192"

echo APP_NAME=$APP_NAME
echo VERSION=$VERSION
echo branch=$branch
echo build=$build_no

mvn versions:set -DnewVersion=$VERSION
mvn clean install \
   -Dbuild_no=$build_no \
   -Dgit_sha=$git_sha \
   -Dgit_branch=$branch \
   -Dangular_profile=$ANGULAR_PROFILE

#######################################


