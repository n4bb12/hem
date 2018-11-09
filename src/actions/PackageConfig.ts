import cleanDeep from "clean-deep"
import Nehemiah from "nehemiah"
import sortPackageJson from "sort-package-json"

import { Action } from "../Action"
import { PackageJson } from "../types"

const configFile = "package.json"
const github = "https://github.com/n4bb12"

export class PackageConfig implements Action {
  name() {
    return configFile
  }

  async applies(n: Nehemiah) {
    return n.exists(configFile)
  }

  async execute(n: Nehemiah) {
    await n.modify(configFile).asJson<PackageJson>(async config => {
      if (!config.name) {
        n.warn(n.name, `does not have a name`)
        config.name = ""
      }

      const slug = config.name.replace(/@.*?\//, "")
      const readme = await n.findOneOrWarning("README.md")

      config = cleanDeep(config)
      config.$schema = "http://json.schemastore.org/package"
      config.author = "Abraham Schilling"
      config.bugs = `${github}/${slug}/issues`
      config.homepage = `${github}/${slug}/blob/master/${readme}`
      config.keywords = (config.keywords || []).sort()
      config.license = config.license || "ISC"
      config.repository = `github:n4bb12/${slug}`

      if (config.keywords.length < 5) {
        n.warn(n.name, `only has ${config.keywords.length}/5 keywords`)
      }

      return sortPackageJson(config)
    })
  }
}
