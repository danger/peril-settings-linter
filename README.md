peril-settings-linter

A node module for linting the settings json for Peril.

Mainly one function:

```typescript
export default function lint(
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
import lint from "peril-settings-linter"

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

# Run tests
yarn jest
```

## How do I deploy this?

```sh
yarn release
```
