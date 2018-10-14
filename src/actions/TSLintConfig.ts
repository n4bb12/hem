import template from "@n4bb12/config-tslint"
import cleanDeep from "clean-deep"
import { isEqual, uniq } from "lodash"
import Nehemiah from "nehemiah"

import { Action } from "../Action"

const projectFile = "tsconfig.json"
const configFile = "tslint.json"
const preset = "@n4bb12/config-tslint"

export class TSLintConfig implements Action {

  public name() {
    return configFile
  }

  public async applies(n: Nehemiah) {
    return Promise.all([
      n.exists(configFile),
      n.exists(projectFile),
    ]).then(files => files.some(file => !!file))
  }

  public async execute(n: Nehemiah) {
    const config = await n.read(configFile).asJson() || {}

    config.$schema = "http://json.schemastore.org/tslint"
    config.extends = uniq([...config.extends || [], preset])

    if (config.rules) {
      Object.keys(config.rules).forEach(key => {
        if (isEqual(template.rules[key], config.rules[key])) {
          delete config.rules[key]
        }
      })
      config.rules = cleanDeep(config.rules)
    }

    await Promise.all([
      n.run("yarn add --dev @n4bb12/config-tslint"),
      n.write(configFile).asJson(cleanDeep(config)),
    ])
  }

}
