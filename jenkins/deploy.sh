#!/bin/bash
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

TOMCAT_SERVICE=$1
TOMCAT_PORT=$2
TOMCAT_PATH=$3
APP_NAME=$4

echo "Deploying $APP_NAME on $TOMCAT_SERVICE (Path: $TOMCAT_PATH, Port: $TOMCAT_PORT)"

sudo systemctl stop $TOMCAT_SERVICE

rm $TOMCAT_PATH/webapps/${APP_NAME}.war
cp target/${APP_NAME}*.war $TOMCAT_PATH/webapps/${APP_NAME}.war

sudo systemctl start $TOMCAT_SERVICE

#wait for tomcat
python scripts/waitForServerUp.py "http://localhost:${TOMCAT_PORT}/${APP_NAME}" 60

# this might be useless due to set -e?
if [ $? -ne 0 ]; then
  exit 1
fi
