export const fixturedSettingsJSON = `
{
  "$schema": "https://raw.githubusercontent.com/danger/peril/master/peril-settings-json.schema",

  "settings": {
    "ignored_repos": ["artsy/looker", "artsy/clouds", "artsy/design", "artsy/hokusai"]
  },
  "rules": {
    "create (ref_type == tag)": "org/newRelease.ts",
    //  "pull_request": ["org/all-prs.ts", "org/jira/pr.ts"],
    "pull_request": "org/allPRs.ts",
    "pull_request.closed": "org/closedPRs.ts",
    "issues.opened": "danger/newRFC.ts",
    "issue_comment": "org/markAsMergeOnGreen.ts",
    "status.success": "org/mergeOnGreen.ts"
  },
  "repos": {
    "artsy/reaction": {
      "pull_request": "danger/pr.ts"
    },
    "artsy/force": {
      "pull_request": "dangerfile.ts"
    },
    "artsy/positron": {
      "pull_request": "dangerfile.ts"
    },
    "artsy/exchange": {
      "pull_request": "dangerfile.ts"
    },
    "artsy/volt": {
      "pull_request": "dangerfile.ts"
    }
  },
  "tasks": {
    "slack-dev-channel": "tasks/slackDevChannel.ts",
    "daily-license-check": "tasks/dailyLicenseCheck.ts",
    "rfc-summary": "tasks/weeklyRFCSummary.ts"
  },
  "scheduler": {
    "daily": "daily-license-check",
    "monday-morning-est": "rfc-summary"
  }
}
`

export const jsonSchema = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
      "GitHubInstallationSettings": {
          "properties": {
              "env_vars": {
                  "description": "An array of allowed ENV vars which are passed into Dangerfiles.",
                  "items": {
                      "type": "string"
                  },
                  "type": "array"
              },
              "ignored_repos": {
                  "description": "An array of repos that should org, and just make the occasional edge case.",
                  "items": {
                      "type": "string"
                  },
                  "type": "array"
              },
              "modules": {
                  "description": "An array of modules for Peril t the deploy, and available for Dangerfiles.",
                  "items": {
                      "type": "string"
                  },
                  "type": "array"
              }
          },
          "type": "object"
      },
      "RunnerRuleset": {
          "additionalProperties": {
              "anyOf": [
                  {
                      "items": {
                          "type": "string"
                      },
                      "type": "array"
                  },
                  {
                      "type": "string"
                  }
              ]
          },
          "type": "object"
      },
      "TaskObject": {
          "properties": {
              "daily": {
                  "type": "string"
              },
              "friday-morning-est": {
                  "type": "string"
              },
              "hourly": {
                  "type": "string"
              },
              "monday-morning-est": {
                  "type": "string"
              },
              "thursday-morning-est": {
                  "type": "string"
              },
              "tuesday-morning-est": {
                  "type": "string"
              },
              "wednesday-morning-est": {
                  "type": "string"
              },
              "weekly": {
                  "type": "string"
              }
          },
          "type": "object"
      },
      "UniqueRepoRuleset": {
          "additionalProperties": {
              "$ref": "#/definitions/RunnerRuleset"
          },
          "type": "object"
      }
  },
  "properties": {
      "repos": {
          "$ref": "#/definitions/UniqueRepoRuleset",
          "description": "A set of repos  }"
      },
      "rules": {
          "$ref": "#/definitions/RunnerRuleset",
          "description": "Having rules in here would mean that it would happen on _any_ event, anothern the DB"
      },
      "scheduler": {
          "$ref": "#/definitions/TaskObject",
          "description": " "
      },
      "settings": {
          "$ref": "#/definitions/GitHubInstallationSettings",
          "description": "In our DB this is represented as a JSON type, so you should anticipate have ."
      },
      "tasks": {
          "$ref": "#/definitions/RunnerRuleset",
          "description": "Individual tasks which a Peril can schedule, either via the Dangerfile API "
      }
  },
  "type": "object"
}
`

export const fixturedPerilRunnerDeps = `
{
    "_": "These are ones that we want to add to make life easier for people using the runtime",
    "devDependencies": {
      "@graphql-inspector/core": "0.13.2",
      "@babel/core": "7.3.3",
      "@babel/plugin-proposal-class-properties": "7.3.3",
      "@babel/plugin-proposal-object-rest-spread": "7.3.2",
      "@babel/plugin-transform-flow-strip-types": "7.2.3",
      "@babel/plugin-transform-regenerator": "7.0.0",
      "@babel/preset-env": "7.3.1",
      "@babel/preset-typescript": "7.3.3",
      "@types/lodash": "^4.14.116",
      "@types/node": "^9.1.2",
      "@types/node-fetch": "^2.1.2",
      "danger-plugin-spellcheck": "^1.2.3",
      "danger-plugin-yarn": "^1.2.1",
      "googleapis": "^36.0.0",
      "graphql-relay-tools": "0.1.1",
      "graphql-schema-utils": "0.6.6",
      "jira-client": "6.4.1",
      "semver-sort": "0.0.4"
    },
    "__": "These are auto-generated by the script generate-runner-deps.ts",
    "dependencies": {
      "@octokit/rest": "16.15.0",
      "@sentry/node": "4.1.1",
      "@slack/client": "4.8.0",
      "agenda": "1.0.3",
      "apollo-server-express": "1.4.0",
      "async-exit-hook": "2.0.1",
      "aws-sdk": "2.374.0",
      "babel-polyfill": "7.0.0-alpha.19",
      "body-parser": "1.18.3",
      "chalk": "2.4.2",
      "cookie": "0.3.1",
      "cookie-parser": "1.4.3",
      "cors": "2.8.4",
      "danger": "7.0.13",
      "debug": "4.1.1",
      "dotenv": "5.0.1",
      "express": "4.16.4",
      "express-x-hub": "1.0.4",
      "github-webhook-event-types": "1.2.1",
      "graphql": "0.13.2",
      "graphql-playground-middleware-express": "1.7.5",
      "graphql-relay": "0.5.5",
      "graphql-resolvers": "0.2.2",
      "graphql-tools": "3.1.1",
      "graphql-tools-types": "1.1.26",
      "json5": "2.1.0",
      "jsonwebtoken": "8.4.0",
      "lodash": "4.17.11",
      "mongoose": "5.3.4",
      "node-fetch": "2.3.0",
      "node-mocks-http": "1.7.3",
      "override-require": "1.1.1",
      "primus": "7.2.3",
      "require-from-string": "2.0.2",
      "url": "0.10.3",
      "uuid": "3.3.2",
      "winston": "3.2.1",
      "winston-papertrail": "1.0.5"
    }
  }
`
