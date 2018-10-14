import template from "@n4bb12/config-tslint"
import { isEqual, uniq } from "lodash"
import Nehemiah from "nehemiah"

import { Action } from "../Action"

const filename = "tslint.json"
const preset = "@n4bb12/config-tslint"

export class TSLintConfig implements Action {

  public name() {
    return configFile
  }

  public async applies(n: Nehemiah) {
    return Promise.all([
      n.exists(filename),
      n.exists("tsconfig.json"),
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
    }

    await n.write(filename).asJson(config)
  }

}
