#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# $1: settings profile

source settings.properties
if [ -n "$1" ]; then
  source settings-$1.properties
fi

echo "Deploying $APP_NAME on $TOMCAT_SERVICE (Path: $TOMCAT_PATH, Port: $TOMCAT_PORT)"

sudo systemctl stop $TOMCAT_SERVICE

rm $TOMCAT_PATH/webapps/${APP_NAME}.war
cp target/${APP_NAME}*.war $TOMCAT_PATH/webapps/${APP_NAME}.war

sudo systemctl start $TOMCAT_SERVICE

