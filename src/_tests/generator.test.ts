import { fileMapForPerilSettingsRepo } from "../"
import * as utils from "../utils"

// @ts-ignore
utils.fileContents = jest.fn()

import { fixturedPerilRunnerDeps } from "./fixtures"

it("creates the right typescript setup", async () => {
  const mockContent: jest.Mock<string> = utils.fileContents as any
  // 1st = peril runner package json
  mockContent.mockReturnValueOnce(Promise.resolve(fixturedPerilRunnerDeps))

  const api = {} as any // NOOP because of the above mock

  const map = await fileMapForPerilSettingsRepo(api, {
    isPublic: true,
    setupTests: true,
    useTypeScript: true,
    repo: {
      name: "Fake Repo",
      owner: {
        login: "User Name",
      },
    },
  })

  expect(map).toMatchSnapshot()
})

it("creates a JS with no tests setup", async () => {
  const mockContent: jest.Mock<string> = utils.fileContents as any
  // 1st = peril runner package json
  mockContent.mockReturnValueOnce(Promise.resolve(fixturedPerilRunnerDeps))

  const api = {} as any // NOOP because of the above mock

  const map = await fileMapForPerilSettingsRepo(api, {
    isPublic: false,
    setupTests: false,
    useTypeScript: false,
    repo: {
      name: "Fake Repo",
      owner: {
        login: "User Name",
      },
    },
  })

  expect(map).toMatchSnapshot()
})
