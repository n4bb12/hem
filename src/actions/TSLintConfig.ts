import preset from "@n4bb12/config-tslint"
import cleanDeep from "clean-deep"
import { isEqual, uniq } from "lodash"
import Nehemiah from "nehemiah"
import sortKeys from "sort-keys"

import { Action } from "../Action"

const projectFile = "tsconfig.json"
const configFile = "tslint.json"
const presetName = "@n4bb12/config-tslint"
const template = {
  $schema: "http://json.schemastore.org/tslint",
  extends: [
    "@n4bb12/config-tslint",
  ],
}

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
    config.extends = uniq([...config.extends || [], presetName])

    if (config.rules) {
      Object.keys(config.rules).forEach(key => {
        if (isEqual(preset.rules[key], config.rules[key])) {
          delete config.rules[key]
        }
      })
      config.rules = cleanDeep(config.rules)
    }

    const cleaned = sortKeys(cleanDeep(config), { deep: true })

    if (!isEqual(cleaned, template)) {
      n.warn(n.name, "has custom TSLint settings")
    }

    await Promise.all([
      n.run([
        "yarn add",
        "--dev",
        "--silent",
        "--no-progress",
        "tslint",
        "@n4bb12/config-tslint",
      ].join(" ")),
      n.write(configFile).asJson(cleaned),
    ])
  }

}
