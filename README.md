# @peril/utils

Maybe this will turn into a mono-repo with a lot of smaller packages, but for now - this is fine.

### Generating a Peril Settings Repo

```typescript
export const fileMapForPerilSettingsRepo = async (api: octokit, options: NewRepoOptions)
```

Which returns a [fileMap](https://github.com/orta/memfs-or-file-map-to-github-branch) for an example Peril settings
repo. There are a few options.

Usage:

```ts
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
```

### Linting

Mainly one function:

```typescript
export function lint(
  settingsReference: string,
  api: octokit,
  currentSettings?: FileRelatedPartOfJSON
): Promise<ErrorReport>
```

You pass in the dangerfile reference URL for the settings repo, an already set-up OctoKit `api` object (so you
handle auth basically) and you can optionally pass in the `currentSettings` - if you don't this lib will grab the
version in the `settingsReference`.

Usage:

```typescript
import { lint } from "peril-settings-linter"

const runLinter = async () => {
  const results = await lint("artsy/peril-settings@settings.json", api)
  if (results.networkErrors.length) {
    console.error(`Could not find files at: ${results.networkErrors.join(",")}`)
  }

  if (results.schemaErrors.length) {
    console.error(`Settings file did not pass schema validation: ${results.schemaHumanReadableErrors}`)
    console.error(`Settings file did not pass schema validation: ${results.schemaErrors}`)
  }
}
```

## How do I work on this?

```sh
git clone https://github.com/orta/peril-settings-linter.git
cd peril-settings-linter
yarn install

# Open VS Code with `code .`
code .

# Run tests
yarn jest
yarn type-check
```

## How do I deploy this?

```sh
yarn release
```
