#!/bin/bash

VERSION=$1
PRODUCT=jmeleon

# creates the folder
# curl -X MKCOL "https://owncloud.simply4it.de/remote.php/webdav/Build/FE_Lagerverwaltung_master" -k -u jenkins:VMtest00

curl -X PUT -u jenkins:VMtest00 --cookie "XDEBUG_SESSION=MROW4A;path=/;" --data-binary @"target/$PRODUCT-ui-${VERSION}.war" "https://owncloud.simply4it.de/remote.php/webdav/Build/$PRODUCT/FE/$PRODUCT-ui-$VERSION.war"