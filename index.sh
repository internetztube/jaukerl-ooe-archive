#!/usr/bin/env sh

# 2020-06-15T20:50:26+0200.json
FILENAME=`date +"%Y-%m-%dT%H:%M:%S%z"`.json

# 2020/06/15
FOLDER=repo/data/`date +%Y/%m/%d/`

# Cleanup
rm -rf repo

# Fetch Repo from remote.
git clone git@github.com:internetztube/jaukerl-ooe-archive.git repo

# Fetch new data entry.
curl https://jaukerl-ooe-api.m8.at/ > $FILENAME

# Ensure the result folder is present.
mkdir -p $FOLDER

# Move file into final folder.
mv $FILENAME $FOLDER$FILENAME

# Only commit files in repo/data.
cd repo/data

# Add files to git.
git add .

# Commit!
git commit -m "Add $FILENAME"

# And finally push!
git push -u origin master

# Last step. Cleanup, again.
cd ../.. && rm -rf repo

