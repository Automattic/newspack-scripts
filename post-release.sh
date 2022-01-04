#!/usr/bin/env bash

git config user.name "$GIT_COMMITTER_NAME"
git config user.email "$GITHUB_COMMITER_EMAIL"

# The last commit message at this point is the automated release commit. The second-to-last
# commit message should contain data about the merge.
SECOND_TO_LAST_COMMIT_MSG=$(git log -n 1 --skip 1 --pretty=format:"%s")

LATEST_VERSION_TAG=$(git describe --tags --abbrev=0)

# If the merge was from alpha branch, alpha branch should be reset.
if [[ $(echo $SECOND_TO_LAST_COMMIT_MSG | grep '^Merge pull request.*alpha') ]]; then
  echo '[newspack-scripts] Release was created from the alpha branch. Alpha branch will now be reset.'

  # Reset the tip of alpha branch to the release branch.
  # The alpha brach is single-serving, just for alpha releases. After a release,
  # we don't care about any alpha changes.
  git pull origin release
  git checkout alpha
  git reset --hard release --
  # Force-push the alpha branch.
  git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git" --force
fi

# Update master branch with latest changes from the release branch, so they are in sync.
echo '[newspack-scripts] Merging the release branch into master'
git checkout master
git merge --squash release
git commit --message "chore(release): merge in release $LATEST_VERSION_TAG [skip ci]"
# Push updated master upstream.
git push "https://$GITHUB_TOKEN@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git"
