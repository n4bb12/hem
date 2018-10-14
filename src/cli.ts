#!/usr/bin/env node
import chalk from "chalk"
import minimist from "minimist"
import Nehemiah from "nehemiah"
import path from "path"

import { Action } from "./Action"
import { EditorConfig } from "./actions/EditorConfig"
import { GitFetchPrune } from "./actions/GitFetchPrune"
import { License } from "./actions/License"
import { PackageConfig } from "./actions/PackageConfig"
import { TSLintConfig } from "./actions/TSLintConfig"

function fail(message: string) {
  console.error(chalk.red(message))
  process.exit(1)
}

function parseArgs() {
  return minimist(process.argv.slice(2))
}

async function performAction(action: Action, projects: Nehemiah[]) {
  console.log(chalk.bgYellow.black(action.name()))

  await Promise.all(projects.map(async project => {
    if (await action.applies(project)) {
      await action.execute(project)
      console.log("  " + path.basename(project.cwd))
    }
  }))
}

async function sync(root: string) {
  if (!root) {
    root = path.resolve(__dirname, "../..")
    // fail("Please specify the root directory as first argument")
  }

  const n = new Nehemiah(root)
  const options = { onlyDirectories: true, deep: 1 }
  const dirs = await n.find("**/.git", options)
  const projects = dirs
    .map(dir => path.dirname(dir))
    .map(dir => path.join(root, dir))
    .map(dir => new Nehemiah(dir))

  const actions: Action[] = [
    new EditorConfig(),
    new GitFetchPrune(),
    new License(),
    new PackageConfig(),
    new TSLintConfig(),
  ]

  for (const action of actions) {
    await performAction(action, projects)
  }
}

async function main() {
  const args = parseArgs()
  const command = args._[0]

  switch (command) {
    case "sync":
      await sync(args._[1])
      break
    default:
      fail("Please specify a command")
  }
}

main().catch(console.error)
