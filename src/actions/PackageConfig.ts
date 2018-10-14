import Nehemiah from "nehemiah"
import sortPackageJson from "sort-package-json"

import { Action } from "../Action"

const filename = "package.json"
const github = "https://github.com/n4bb12"

export class PackageConfig implements Action {

  public name() {
    return filename
  }

  public async applies(n: Nehemiah) {
    return n.exists(filename)
  }

  public async execute(n: Nehemiah) {
    await n.modify(filename).asJson(async config => {
      const slug = config.name.replace(/@.*?\//, "")

      config.$schema = "http://json.schemastore.org/package"
      config.author = "Abraham Schilling"
      config.bugs = `${github}/${slug}/issues`
      config.homepage = `${github}/${slug}/blob/master/README.md`
      config.keywords = (config.keywords || []).sort()
      config.license = config.license || "ISC"
      config.repository = `github:n4bb12/${slug}`

      if (config.keywords.length < 5) {
        n.warn(`Package ${config.name} only has ${config.keywords.length}/5 keywords`)
      }

      return sortPackageJson(config)
    })
  }

}
