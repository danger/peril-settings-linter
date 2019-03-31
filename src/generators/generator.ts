import * as octokit from "@octokit/rest"
import * as JSON5 from "json5"
import { dedent, fileContents } from "../utils"
import { createReadme } from "./readme"

export interface NewRepoOptions {
  useTypeScript: boolean
  setupTests: boolean
  isPublic: boolean
  /// Metadata about the current repo
  repo: {
    owner: {
      login: string,
    }
    name: string,
  }
}

export const prBody = (options: NewRepoOptions) => `## Welcome to Peril

This PR sets up the repo for your Peril settings, once this is merged then you can go back
`

const jestSetup = (options: NewRepoOptions) => {
  const fileMap = {}
  const fileName = `org / _tests / _checkForPRBody.test.${options.useTypeScript ? "ts" : "js"}`
  fileMap[fileName] = `
jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import checkForPRBody from "../checkForPRBody"

beforeEach(() => {
      dm.fail = jest.fn()
    })

it("fails the build when there is no PR body", () => {
      dm.danger = { github: { pr: { body: "" } } }
      checkForPRBody()
      expect(dm.fail).toHaveBeenCalledWith("Please add a description to your PR.")
    })

it("passes when there's a PR body", () => {
      dm.danger = { github: { pr: { body: "Hello world" } } }
      checkForPRBody()
      expect(dm.fail).not.toHaveBeenCalled()
    })
  `
}

const js = () => {
  return {
    "org/checkForPRBody.js": dedent`
export default () => {
        const pr = danger.github.pr
        if (pr.body === null || pr.body.length === 0) {
          fail("Please add a description to your PR.")
        }
      }
`,
  }
}

const ts = () => {
  return {
    "org/checkForPRBody.ts": dedent`
export default () => {
        const pr = danger.github.pr
        if (pr.body === null || pr.body.length === 0) {
          fail("Please add a description to your PR.")
        }
      }
`,
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "es2017",
          module: "commonjs",
          resolveJsonModule: true,
          allowSyntheticDefaultImports: true,
          lib: ["es2017"],
          strict: true,
        },
      },
      null,
      "  ",
    ),
  }
}

const generatePackage = async (api: octokit, options: NewRepoOptions) => {
  const packageFile = {
    scripts: {},
  } as any

  // Order matters here somewhat
  if (options.isPublic) {
    packageFile.license = "MIT"
  }

  const currentDeps = await fileContents(api, "runner/package.json", "danger/peril")
  const deps = JSON5.parse(currentDeps)

  packageFile.dependencies = deps.dependencies
  packageFile.devDependencies = deps.devDependencies

  if (options.useTypeScript) {
    packageFile.scripts["type-check"] = "tsc --no-emit"
    packageFile.devDependencies.typescript = "*"
  }

  if (options.setupTests) {
    packageFile.scripts.test = "jest"
    packageFile.devDependencies.jest = "*"
  }

  return packageFile
}

const defaultRepoMetadata = async (api: octokit, options: NewRepoOptions) => {
  const ext = options.useTypeScript ? "ts" : "js"
  const packageFile = await generatePackage(api, options)
  const perilSettings = {
    $schema: "https://raw.githubusercontent.com/danger/peril/master/peril-settings-json.schema",
    rules: {
      pull_request: `org/checkForPRBody.${ext}`,
    },
  }
  const fileMap: any = {
    "package.json": JSON.stringify(packageFile, null, "  "),
    "README.md": createReadme(options),
    "peril.settings.json": JSON.stringify(perilSettings, null, "  "),
    ".gitignore": `
logs
* .log
npm - debug.log *
yarn - debug.log *

# Dependency directories
node_modules
jspm_packages

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history
`,
  }

  if (options.isPublic) {
    // It's a bit presumptuous, but I think it's reasonable to assume MIT to start with
    fileMap.LICENSE = `The MIT License (MIT)

Copyright (c) ${options.repo.owner.login}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do { so, subject } to the following conditions:

    The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `
  }

  return fileMap
}

export const fileMapForPerilSettingsRepo = async (api: octokit, options: NewRepoOptions) => {
  return {
    ...(options.setupTests ? jestSetup : undefined),
    ...(options.useTypeScript ? ts() : js()),
    ...(await defaultRepoMetadata(api, options)),
  }
}
