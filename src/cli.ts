#!/usr/bin/env node
import chalk from "chalk"
import minimist from "minimist"

import { sync } from "./commands/sync"

function fail(message: string) {
  console.error(chalk.red(message))
  process.exit(1)
}

function parseArgs() {
  return minimist(process.argv.slice(2))
}

async function main() {
  const args = parseArgs()
  const command = args._[0]
  const rootDir = args._[1]

  switch (command) {
    case "sync":
      await sync(rootDir)
      break
    default:
      fail("Please specify a command")
  }
}

main().catch(console.error)
