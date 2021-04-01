#!/usr/bin/env bash

# Release the latest version on wordpress.org plugin repository.
# To be run as part of CI workflow.
# Assumptions:
# - repository name matches the wordpress.org plugin name,
# - there is a `release` directory with the folder containing the files and named as the plugin in it
# Partially adapted from https://carlalexander.ca/continuous-deployment-wordpress-directory-circleci/

SVN_PLUGINS_URL="https://plugins.svn.wordpress.org"
SVN_REPO_LOCAL_PATH="release/svn"

LATEST_GIT_TAG=$(git describe --tags `git rev-list --tags --max-count=1`)
# Remove the "v" at the beginning of the git tag
LATEST_SVN_TAG=${LATEST_GIT_TAG:1}

mkdir -p $SVN_REPO_LOCAL_PATH && cd $SVN_REPO_LOCAL_PATH
sudo apt-get update
sudo apt-get install subversion

# Check if the latest SVN tag exists already
TAG=$(svn ls "$SVN_PLUGINS_URL/$CIRCLE_PROJECT_REPONAME/tags/$LATEST_SVN_TAG")
error=$?
if [ $error == 0 ]; then
  # Tag exists, don't deploy
  echo "Latest tag ($LATEST_SVN_TAG) already exists on the WordPress directory. No deployment needed!"
  exit 0
fi

svn checkout -q "$SVN_PLUGINS_URL/$CIRCLE_PROJECT_REPONAME" .
rm -rf trunk

cp -r "../$CIRCLE_PROJECT_REPONAME" ./trunk
cp -r ./trunk "./tags/$LATEST_SVN_TAG"

# Add new files to SVN
svn stat | grep '^?' | awk '{print $2}' | xargs -I x svn add x@

# Remove deleted files from SVN
svn stat | grep '^!' | awk '{print $2}' | xargs -I x svn rm --force x@

# Commit to SVN
svn ci --no-auth-cache --username $WP_ORG_USERNAME --password $WP_ORG_PASSWORD -m "Deploy version $LATEST_SVN_TAG"
