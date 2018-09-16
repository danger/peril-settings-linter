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
