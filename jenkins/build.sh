#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# $1: build number
# $2: version for war file


export git_sha=$(git rev-parse --short HEAD)
export branch=$(git symbolic-ref --short HEAD)

export angular_profile=jenkins

if [ "$branch" = "master" ]; then
  mvn --settings $HOME/.m2/settings-simply.xml versions:set -DnewVersion=$2
  export angular_profile=production
fi

mvn --settings $HOME/.m2/settings-simply.xml clean install -Dbuild_no=$1 -Dgit_sha=$git_sha -Dgit_branch=$branch -Dangular_profile=$angular_profile
