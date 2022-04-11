#!/usr/bin/env bash

# This script should be ran on CI after a new regular (not pre-release) version is released.

git config user.name "$GIT_COMMITTER_NAME"
git config user.email "$GITHUB_COMMITER_EMAIL"

# The last commit message at this point is the automated release commit. The second-to-last
# commit message should contain data about the merge.
SECOND_TO_LAST_COMMIT_MSG=$(git log -n 1 --skip 1 --pretty=format:"%s")

LATEST_VERSION_TAG=$(git describe --tags --abbrev=0)

# If the merge was from alpha branch (the basic flow), alpha branch should be reset.
if [[ $(echo $SECOND_TO_LAST_COMMIT_MSG | grep '^Merge .*alpha') ]]; then
  echo '[newspack-scripts] Release was created from the alpha branch. Alpha branch will now be reset.'

  # Reset the tip of alpha branch to the release branch.
  # The alpha brach is single-serving, just for alpha releases. After a release,
  # we don't care about any alpha changes.
  git pull origin release
  git checkout alpha
  git reset --hard release --
  # Force-push the alpha branch.
  git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git" --force
else
  echo '[newspack-scripts] Release was created from a different branch than the alpha branch (e.g. a hotfix branch).'
  echo '[newspack-scripts] Alpha branch will now be updated with the lastest changes from release.'
  git checkout alpha
  git merge release --strategy-option=theirs --message="Merge release into alpha"
  git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git"
fi

# Update master branch with latest changes from the release branch, so they are in sync.
echo '[newspack-scripts] Merging the release branch into master'
git checkout master
# Merge release branch into master branch, prefering the changes from release branch if conflicts arise.
git merge --no-ff release --strategy-option=theirs -m "chore(release): merge in release $LATEST_VERSION_TAG"
# Push updated master upstream.
git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git"