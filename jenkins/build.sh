#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# $1: build number

export git_sha=$(git rev-parse --short HEAD)
export branch=$(git symbolic-ref --short HEAD)

mvn --settings $HOME/.m2/settings-simply.xml clean install -Dbuild_no=$1 -Dgit_sha=$git_sha -Dgit_branch=$branch
