jest.mock("../utils", () => ({ fileContents: jest.fn }))
import lint, { allFileReferencesForSettings, references } from "../"
import { fileContents } from "../utils"
import { fixturedSettingsJSON, jsonSchema } from "./fixtures"

describe("file refs", () => {
  it("gets allfile refs for json", () => {
    const settings = {
      $schema: "https://raw.githubusercontent.com/danger/peril/master/peril-settings-json.schema",

      settings: {
        ignored_repos: ["artsy/looker", "artsy/clouds", "artsy/design", "artsy/hokusai"],
      },
      rules: {
        "create (ref_type == tag)": "org/newRelease.ts",
        "pull_request": "org/allPRs.ts",
        "pull_request.closed": "org/closedPRs.ts",
        "issues.opened": "danger/newRFC.ts",
        "issue_comment": "org/markAsMergeOnGreen.ts",
        "status.success": "org/mergeOnGreen.ts",
      },
      repos: {
        "artsy/reaction": {
          pull_request: "danger/pr.ts",
        },
        "artsy/force": {
          pull_request: "dangerfile.ts",
        },
        "artsy/positron": {
          pull_request: "dangerfile.ts",
        },
        "artsy/exchange": {
          pull_request: "dangerfile.ts",
        },
        "artsy/volt": {
          pull_request: "dangerfile.ts",
        },
      },
      tasks: {
        "slack-dev-channel": "tasks/slackDevChannel.ts",
        "daily-license-check": "tasks/dailyLicenseCheck.ts",
        "rfc-summary": "tasks/weeklyRFCSummary.ts",
      },
      scheduler: {
        "daily": "daily-license-check",
        "monday-morning-est": "rfc-summary",
      },
    }

    expect(references("artsy/peril-settings", settings.rules)).toEqual([
      "artsy/peril-settings@org/newRelease.ts",
      "artsy/peril-settings@org/allPRs.ts",
      "artsy/peril-settings@org/closedPRs.ts",
      "artsy/peril-settings@danger/newRFC.ts",
      "artsy/peril-settings@org/markAsMergeOnGreen.ts",
      "artsy/peril-settings@org/mergeOnGreen.ts",
    ])

    expect(allFileReferencesForSettings("artsy/peril-settings", settings)).toEqual([
      "artsy/peril-settings@org/newRelease.ts",
      "artsy/peril-settings@org/allPRs.ts",
      "artsy/peril-settings@org/closedPRs.ts",
      "artsy/peril-settings@danger/newRFC.ts",
      "artsy/peril-settings@org/markAsMergeOnGreen.ts",
      "artsy/peril-settings@org/mergeOnGreen.ts",
      "artsy/reaction@danger/pr.ts",
      "artsy/force@dangerfile.ts",
      "artsy/positron@dangerfile.ts",
      "artsy/exchange@dangerfile.ts",
      "artsy/volt@dangerfile.ts",
    ])
  })
})

it.skip("lints", async () => {
  const mockContent: jest.Mock<string> = fileContents as any
  mockContent.mockReturnValueOnce(Promise.resolve(jsonSchema))

  const results = await lint("artsy/peril-settings@settings.json", {} as any)
  expect(results).toEqual({})
})
