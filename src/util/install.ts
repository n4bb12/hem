import Nehemiah from "nehemiah"
import { resolve } from "path"

import { PackageJson } from "../types"

const yarnMutex = resolve(__dirname, ".hem.yarn-mutex")

export type DependencyKey =
  | "dependencies"
  | "devDependencies"
  | "optionalDependencies"
  | "peerDependencies"

export async function install(n: Nehemiah, args: string) {
  const cmd = [
    "yarn add",
    "--silent",
    "--no-progress",
    `--mutex 'file:${yarnMutex}'`,
    args,
  ].join(" ")

  return n.run(cmd)
}

export function getPackageDependencyKey(flags: string) {
  if (flags.includes("--dev") || flags.includes("-D")) {
    return "devDependencies"
  }
  if (flags.includes("--peer") || flags.includes("-P")) {
    return "peerDependencies"
  }
  if (flags.includes("--optional") || flags.includes("-O")) {
    return "optionalDependencies"
  }
  return "dependencies"
}

export async function ensureIsInstalledAsDevDependency(
  n: Nehemiah, flags: string, packages: string[],
) {
  const pkg = await n.read("package.json").asJson<PackageJson>()
  if (!pkg) {
    return
  }

  const key = getPackageDependencyKey(flags)

  const uninstalled = packages.filter(name => {
    return !pkg[key] || !pkg[key]![name]
  })

  if (!uninstalled.length) {
    return
  }

  const args = [flags, ...uninstalled].filter(Boolean).join(" ")

  return install(n, args)
}
