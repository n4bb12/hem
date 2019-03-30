import chalk from "chalk"
import Nehemiah from "nehemiah"
import path from "path"

import { Clean } from "../actions/Clean"
import { EditorConfig } from "../actions/EditorConfig"
import { GitFetchPrune } from "../actions/GitFetchPrune"
import { License } from "../actions/License"
import { PackageConfig } from "../actions/Package"
import { Readme } from "../actions/Readme"
import { ReleaseIt } from "../actions/ReleaseIt"
import { TSConfig } from "../actions/TSConfig"
import { TSLintConfig } from "../actions/TSLint"
import { Action } from "../types"

const actions: Action[] = [
  new Clean(),
  new EditorConfig(),
  new GitFetchPrune(),
  new License(),
  new PackageConfig(),
  new Readme(),
  new ReleaseIt(),
  new TSConfig(),
  new TSLintConfig(),
]

function log(...args: any[]) {
  console.log("[hem sync]", ...args)
}

function announceProject(project: Nehemiah) {
  log(chalk.bgBlack.blue("Project: ".padStart(10) + path.basename(project.cwd)))
  return project
}

function announceAction(action: Action) {
  log(chalk.bgBlack.yellow("Action: ".padStart(10) + action.name()))
  return action
}

export async function sync(rootDir: string) {
  if (!rootDir) {
    rootDir = path.resolve(__dirname, "../../..")
    // throw new Error("Please specify the root directory as first argument")
  }

  const n = new Nehemiah(rootDir)
  const options = { onlyDirectories: true, deep: 1 }
  const dirs = await n.find("**/.git", options)
  const projects = dirs
    .map(dir => path.dirname(dir))
    .map(dir => path.join(rootDir, dir))
    .map(dir => new Nehemiah(dir))

  for (const project of projects) {
    announceProject(project)

    const promises = actions.map(action => {
      return action.applies(project).then(applies => {
        if (applies) {
          announceAction(action)
          return action.execute(project)
        }
      })
    })

    await Promise.all(promises)
  }
}
