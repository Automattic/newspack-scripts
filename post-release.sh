#!/usr/bin/env bash

git config user.name "$GIT_COMMITTER_NAME"
git config user.email "$GITHUB_COMMITER_EMAIL"

# Reset the tip of alpha branch to the release branch.
# The alpha brach is single-serving, just for alpha releases. After a release,
# we don't care about any alpha changes.
git pull origin release
git checkout alpha
git reset --hard release --
git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git" --force

# Cherry-pick the latest commit from the release branch onto the master branch.
# This way the version numbers and the changelog on master are up to date.
#
# Note that this will fail if there is no CHANGELOG.md on master - in such case the cherry-pick will
# result in a conflict.
git checkout master
git cherry-pick $(git rev-parse release) --strategy-option theirs
git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git"
