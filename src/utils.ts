import * as octokit from "@octokit/rest"

/**
 * Should look like one of the following:
 * - "dangerfile.js"
 * - "/path/to/dangerfile.ts"
 * - "repo/slug@to/dangerfile.ts"
 */
export type DangerfileReferenceString = string

export interface RepresentationForURL {
  /** The path the the file aka folder/file.ts  */
  dangerfilePath: string
  /** The branch to find the dangerfile on  */
  branch: string
  /** An optional repo */
  repoSlug: string | undefined
  /** The original full string, with repo etc  */
  referenceString: DangerfileReferenceString
}

/** Takes a DangerfileReferenceString and lets you know where to find it globally */
export const dangerRepresentationForPath = (value: DangerfileReferenceString): RepresentationForURL => {
  const afterAt = value.includes("@") ? value.split("@")[1] : value
  return {
    branch: value.includes("#") ? value.split("#")[1] : "master",
    dangerfilePath: afterAt.split("#")[0],
    repoSlug: value.includes("@") ? value.split("@")[0] : undefined,
    referenceString: value,
  }
}

/** Gets the contest of a file via the GH API */
export const fileContents = async (api: octokit, path: string, repoSlug: string, ref?: string) => {
  if (!repoSlug) {
    throw new Error("fileContents must include a repo in an event")
  }

  const [owner, repo] = repoSlug.split("/")
  try {
    const response = await api.repos.getContent({ repo, owner, path, ref })
    if (response && response.data && response.data.type === "file") {
      const buffer = Buffer.from(response.data.content, response.data.encoding)
      return buffer.toString()
    } else {
      return ""
    }
  } catch {
    return ""
  }
}
