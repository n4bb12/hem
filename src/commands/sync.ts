import chalk from "chalk"
import Nehemiah from "nehemiah"
import path from "path"

import { EditorConfig } from "../actions/EditorConfig"
import { GitFetchPrune } from "../actions/GitFetchPrune"
import { License } from "../actions/License"
import { PackageConfig } from "../actions/PackageConfig"
import { Readme } from "../actions/Readme"
import { TSConfig } from "../actions/TSConfig"
import { TSLintConfig } from "../actions/TSLintConfig"
import { Action } from "../types"

const actions: Action[] = [
  new EditorConfig(),
  new GitFetchPrune(),
  new License(),
  new PackageConfig(),
  new Readme(),
  new TSConfig(),
  new TSLintConfig(),
]

async function performAction(action: Action, projects: Nehemiah[]) {
  console.log(chalk.bgYellow.black(action.name()))

  await Promise.all(projects.map(async project => {
    if (await action.applies(project)) {
      await action.execute(project)
      console.log("  " + path.basename(project.cwd))
    }
  }))
}

export async function sync(rootDir: string) {
  if (!rootDir) {
    rootDir = path.resolve(__dirname, "../../..")
    // fail("Please specify the root directory as first argument")
  }

  const n = new Nehemiah(rootDir)
  const options = { onlyDirectories: true, deep: 1 }
  const dirs = await n.find("**/.git", options)
  const projects = dirs
    .map(dir => path.dirname(dir))
    .map(dir => path.join(rootDir, dir))
    .map(dir => new Nehemiah(dir))

  for (const action of actions) {
    await performAction(action, projects)
  }
}
