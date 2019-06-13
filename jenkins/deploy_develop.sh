
sudo systemctl stop tomcat

rm /opt/tomcat/latest/webapps/jmeleon-ui.war
cp target/jmeleon*.war /opt/tomcat/latest/webapps/jmeleon-ui.war

sudo systemctl start tomcat

