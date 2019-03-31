import { NewRepoOptions } from "./generator"

export const createReadme = (options: NewRepoOptions) => {
  const ext = options.useTypeScript ? ".ts" : ".js"
  return `
## ${options.repo.owner.login} Peril Settings

### What is this project?

This is the configuration repo for Peril on the Artsy org. There is a [settings file](settings.json) and org-wide
dangerfiles which are inside the [org folder](org/).

Here's some links to the key concepts:

- [Peril](https://github.com/danger/peril)
- [Danger JS](http://danger.systems/js/)
- [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)
- [Introducing Peril to the Artsy org](http://artsy.github.io/blog/2017/09/04/Introducing-Peril/)
- [Peril's Dashboard 🔐](https://staging-dashboard.peril.systems/)

### TL:DR on this Repo?

Peril is Danger running on a web-server, this repo is the configuration for that. The dangerfiles for our org live
in [\`org\`](org)

### To Develop

\`\`\`sh
git clone https://github.com/${options.repo.owner.login}/${options.repo.name}.git
cd ${options.repo.name}
yarn install${options.useTypeScript ? "\nyarn jest\n" : ""}
code .
\`\`\`

You will need node and yarn installed beforehand. You can get them both by running \`brew install yarn\`. This will give
you auto-completion and types for Danger/Peril when working on your rules.

#### Adding a rule

Create a new rule by making a new Dangerfile:


\`\`\`ts
// org/myRuleName${ext}
export default async () => {
  // [...]
})
\`\`\`

${
    !options.setupTests
      ? ""
      : `
#### Testing a rule

We use Jest to test our Dangerfiles. It uses the same techniques as testing a
[danger plugin](http://danger.systems/js/usage/extending-danger.html) where the global imports from danger are faked.

1.  Create a file for your rule: \`org/_tests/[x].test.${ext}\`.
2.  Add a \`before\` and \`after\` setting up and resetting mocks:

    \`\`\`ts
    jest.mock("danger", () => jest.fn())
    import * as danger from "danger"
    const dm = danger as any

    beforeEach(() => {
      dm.danger = {}
      dm.fail = jest.fn() // as necessary
    })

    afterEach(() => {
      dm.fail = undefined
    })
    \`\`\`

3.  Set up your danger object and run the function exported in \`all-prs.ts\`:

    \`\`\`ts
    import rfcN from "../org/all-prs"

    it("warns when there's there's no assignee and no WIP in the title", async () => {
      dm.danger.github = { pr: { title: "Changes to the setup script", assignee: null } }
      await rfcN()

      expect(something).toHappen()
        // [...]
      })
    })
    \`\`\`

4.  Validate that the \`fail\`/\`warn\`/\`message\`/\`markdown\` functions are called.

`
  }
`
}
