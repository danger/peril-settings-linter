import * as octokit from "@octokit/rest"
import * as ajv from "ajv"
import * as JSON5 from "json5"

import { dangerRepresentationForPath, fileContents } from "./utils"

export interface ErrorObject {
  keyword: string
  dataPath: string
  schemaPath: string
  params: any
  // Added to validation errors of propertyNames keyword schema
  propertyName?: string
  // Excluded if messages set to false.
  message?: string
  // These are added with the `verbose` option.
  schema?: any
  parentSchema?: object
  data?: any
}

export interface ErrorReport {
  schemaErrors: ErrorObject[]
  schemaHumanReadableErrors: string
  networkErrors: string[]
}

export type DangerfileReferenceString = string

interface FileRelatedPartOfJSON {
  rules?: RunnerRuleset
  repos?: UniqueRepoRuleset
}

export interface UniqueRepoRuleset {
  [name: string]: RunnerRuleset
}

export interface RunnerRuleset {
  [name: string]: DangerfileReferenceString | DangerfileReferenceString[]
}

export default async function lint(
  settingsReference: string,
  api: octokit,
  currentSettings?: FileRelatedPartOfJSON,
): Promise<ErrorReport> {
  // Grab the settings JSON
  const rep = dangerRepresentationForPath(settingsReference)
  if (!rep.repoSlug) {
    throw new Error("The dangerfile reference did not have a repo")
  }

  let json = currentSettings

  // In danger instead of peril for example
  if (!json) {
    const settingsContents = await fileContents(api, rep.dangerfilePath, rep.repoSlug, rep.branch)
    if (settingsContents === "") {
      throw new Error(`Could not find a file at ${settingsReference}`)
    }

    try {
      json = JSON5.parse(settingsContents)
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(`Could not parse the file at ${settingsReference}`)
      throw error
    }
  }

  // Grab the official schema, the run it through ajv
  const schemaContent = await fileContents(api, "peril-settings-json.schema", "danger/peril", "master")
  const validator = new ajv()
  const valid = validator.validate(JSON.parse(schemaContent), json)

  const networkErrors = [] as string[]
  const allSettingsRefs = allFileReferencesForSettings(rep.repoSlug, json!)
  for (const defs of allSettingsRefs) {
    const localRef = dangerRepresentationForPath(defs)
    const fileExists = await fileContents(api, localRef.dangerfilePath, localRef.repoSlug!, localRef.branch)

    if (!fileExists || fileExists === "") {
      networkErrors.push(defs)
    }
  }

  return {
    schemaErrors: !valid ? validator.errors! : [],
    schemaHumanReadableErrors: !valid ? validator.errorsText(validator.errors!) : "",
    networkErrors,
  }
}

/**
 * Gets all the dangerfile reference from a full JSON
 */
export const allFileReferencesForSettings = (settingsRepo: string, settings: FileRelatedPartOfJSON) => {
  const refs: DangerfileReferenceString[] = []
  if (settings.rules) {
    const globalRefs = references(settingsRepo, settings.rules)
    globalRefs.forEach(r => refs.push(r))
  }
  if (settings.repos) {
    const repos = Object.keys(settings.repos)
    repos.forEach(repo => {
      const repoRefs = references(repo, settings.repos![repo])
      repoRefs.forEach(r => refs.push(r))
    })
  }
  return refs
}

/**
 * Gets all the dangerfile reference from a settings rule subset
 */
export const references = (repo: string, settings: RunnerRuleset): DangerfileReferenceString[] => {
  const files = Object.keys(settings).map(s => settings[s])
  const refs: DangerfileReferenceString[] = []
  files.forEach(file => {
    const alwaysFileArray = typeof file === "string" ? [file] : file
    alwaysFileArray.forEach(ref => {
      if (ref.indexOf("@") === -1) {
        refs.push(repo + "@" + ref)
      } else {
        refs.push(ref)
      }
    })
  })
  return refs
}
