#!/usr/bin/env sh

FILENAME=at-ooe-`date +"%Y-%m-%dT%H:%M:%S%z"`.json
FOLDER=repo/data/`date +%Y/%m/%d/`
rm -rf repo
git clone git@github.com:internetztube/jaukerl-ooe-archive.git repo
curl https://jaukerl-ooe-api.m8.at/ > $FILENAME
mkdir -p $FOLDER
mv $FILENAME $FOLDER$FILENAME
git add .
git commit -m "Add $FILENAME"
