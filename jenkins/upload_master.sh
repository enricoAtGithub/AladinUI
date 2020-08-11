#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

source settings.properties
if [ -n "$1" ]; then
  source settings-$1.properties
fi


# creates the folder
# curl -X MKCOL "https://owncloud.simply4it.de/remote.php/webdav/Build/FE_Lagerverwaltung_master" -k -u jenkins:VMtest00

curl -X PUT -u jenkins:VMtest00 --cookie "XDEBUG_SESSION=MROW4A;path=/;" --data-binary @"target/${APP_NAME}-ui-${VERSION}.war" "https://owncloud.simply4it.de/remote.php/webdav/Build/${APP_NAME}/releases/${APP_NAME}-ui-$VERSION.war"