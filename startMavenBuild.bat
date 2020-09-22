mvn --settings %USERPROFILE%/.m2/settings-simply.xml clean install -Dbuild_no=42 -Dgit_sha=42 -Dgit_branch=42 -Dangular_profile=production
git checkout src/assets/config/postbuildconfig.json
