REM https://superuser.com/questions/527812/how-can-i-make-my-bat-file-continue-after-an-error
mvn --settings %USERPROFILE%/.m2/settings-simply.xml clean install -Dbuild_no=42 -Dgit_sha=42 -Dgit_branch=42 -Dangular_profile=production & git checkout src/assets/config/postbuildconfig.json
