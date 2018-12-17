import Nehemiah from "nehemiah"

import { readTemplate } from "../templates"
import { Action, PackageJson } from "../types"

const filename = ".release-it.json"
const template = readTemplate(filename)
const pkgConfigFile = "package.json"

export class ReleaseIt implements Action {
  name() {
    return filename
  }

  async applies(n: Nehemiah) {
    const pkg: PackageJson = (await n.read(pkgConfigFile).asJson()) || {}
    return !pkg.private
  }

  async execute(n: Nehemiah) {
    await n.write(filename).asText(template)
  }
}
