"use strict";

const spawn = require("cross-spawn");
const path = require("path");

const semanticRelease = require("semantic-release");

const { files, ...semanticReleaseArgs } = require("yargs/yargs")(
  process.argv.slice(2)
).parse();

const filesList = files.split(",");

console.log(`Releasing ${process.env.CIRCLE_PROJECT_REPONAME}…`);

const config = {
  dryRun: semanticReleaseArgs.dryRun,
  ci: semanticReleaseArgs.ci,
  debug: semanticReleaseArgs.debug,

  branches: [
    "release",
    {
      name: "alpha",
      prerelease: "alpha",
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
      // Do not publish on npm.
      "@semantic-release/npm",
      {
        npmPublish: false,
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

      console.log(
        `Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`
      );

      if (lastRelease.version) {
        console.log(`The last release was "${lastRelease.version}".`);
      }

      for (const release of releases) {
        console.log(
          `The release was published with plugin "${release.pluginName}".`
        );
      }
    } else {
      console.log("No release published.");
    }
  } catch (err) {
    console.error("The automated release failed with %O", err);
  }
};

run();
