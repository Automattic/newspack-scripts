"use strict";

const spawn = require("cross-spawn");
const path = require("path");
const utils = require("./utils/index.js");

const semanticRelease = require("semantic-release");

const { files, npmPackageName, ...otherArgs } = require("yargs/yargs")(
  process.argv.slice(2)
).parse();

const filesList = files.split(",");

utils.log(`Releasing ${process.env.CIRCLE_PROJECT_REPONAME}…`);

const shouldPublishOnNPM = npmPackageName && process.env.NPM_TOKEN;

if (npmPackageName) {
  if (process.env.NPM_TOKEN) {
    utils.log(`Will publish on npm as ${npmPackageName}`);
  } else {
    utils.log(
      `npm package name specified, but no NPM_TOKEN environment variable set – npm package will not be released.`,
      "warning"
    );
  }
}

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
      prerelease: "alpha",
    },
    // `hotfix/*` branches – for releases outside of the release schedule.
    {
      name: "hotfix/*",
      prerelease: "hotfix",
    },
  ],
  prepare: [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      // Increment the version in additional files, and the create the release archive.
      "semantic-release-version-bump",
      {
        files: filesList,
        callback: "npm run release:archive",
      },
    ],
    {
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
    },
  ],
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

const run = async () => {
  try {
    const result = await semanticRelease(config);

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

// run();
