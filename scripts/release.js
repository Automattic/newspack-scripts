"use strict";

const spawn = require("cross-spawn");
const path = require("path");
const utils = require("./utils/index.js");

const semanticRelease = require("semantic-release");

const { files, ...otherArgs } = require("yargs/yargs")(
  process.argv.slice(2)
).parse();

const filesList = files.split(",");

utils.log(`Releasing ${process.env.CIRCLE_PROJECT_REPONAME}…`);

const shouldPublishOnNPM = Boolean(process.env.NPM_TOKEN);

if (shouldPublishOnNPM) {
  utils.log(`Will publish on npm`);
}

const getConfig = ({ gitBranchName }) => {
  const config = {
    dryRun: otherArgs.dryRun,
    ci: otherArgs.ci,
    debug: otherArgs.debug,

    branches: [
      // `release` branch is published on the main distribution channel (a new version on GH).
      "release",
      // `alpha` branch – for regular pre-releases.
      {
        name: "alpha",
        prerelease: true,
      },
      // `hotfix/*` branches – for releases outside of the release schedule.
      {
        name: "hotfix/*",
        // With `prerelease: true`, the `name` would be used for the pre-release tag. A name with a `/`
        // is not valid, though. See https://semver.org/#spec-item-9.
        prerelease: '${name.replace(/\\//g, "-")}',
      },
    ],
    prepare: ["@semantic-release/changelog", "@semantic-release/npm"],
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      [
        // Whether to publish on npm.
        "@semantic-release/npm",
        {
          npmPublish: shouldPublishOnNPM,
        },
      ],
      "semantic-release-version-bump",
      // Add the built ZIP archive to GH release.
      [
        "@semantic-release/github",
        {
          assets: [
            {
              path: `./release/${process.env.CIRCLE_PROJECT_REPONAME}.zip`,
              label: `${process.env.CIRCLE_PROJECT_REPONAME}.zip`,
            },
          ],
        },
      ],
    ],
  };

  // Unless on a hotfix branch, add a commit that updates the files.
  if (gitBranchName.indexOf("hotfix/") !== 0) {
    utils.log(`Plugin files and the changelog will be updated.`);
    config.prepare.push([
      // Increment the version in additional files, and the create the release archive.
      "semantic-release-version-bump",
      {
        files: filesList,
        callback: "npm run release:archive",
      },
    ]);
    config.prepare.push({
      path: "@semantic-release/git",
      // These assets should be added to source control after a release.
      assets: [
        ...filesList,
        "package.json",
        "package-lock.json",
        "CHANGELOG.md",
      ],
      message:
        "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
    });
  } else {
    utils.log(
      `This is a hotfix branch, plugin files and the changelog will *not* be updated.`
    );
  }

  return config;
};

const run = async () => {
  try {
    const gitBranch = await utils.getGitBranch();

    const result = await semanticRelease(
      getConfig({ gitBranchName: gitBranch })
    );

    if (result) {
      const { lastRelease, commits, nextRelease, releases } = result;

      utils.log(
        `Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`
      );

      if (lastRelease.version) {
        utils.log(`The last release was "${lastRelease.version}".`);
      }

      for (const release of releases) {
        utils.log(
          `The release was published with plugin "${release.pluginName}".`
        );
      }
    } else {
      utils.log("No release published.");
    }
  } catch (err) {
    console.error("The automated release failed with %O", err);
  }
};

run();
