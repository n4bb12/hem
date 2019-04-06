import preset from "@n4bb12/config-tslint"
import cleanDeep from "clean-deep"
import { isEqual, uniq } from "lodash"
import Nehemiah from "nehemiah"
import sortKeys from "sort-keys"

import { Action } from "../types"
import { ensureIsInstalledAsDevDependency as ensureInstalled } from "../util"

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

  name() {
    return "TSLint config"
  }

  async applies(n: Nehemiah) {
    return Promise.all([
      n.exists(configFile),
      n.exists(projectFile),
    ]).then(files => files.some(file => !!file))
  }

  async execute(n: Nehemiah) {
    const config = await n.read(configFile).asJson() || {}

    config.$schema = "http://json.schemastore.org/tslint"
    config.extends = Array.isArray(config.extends)
      ? config.extends
      : [config.extends].filter(Boolean)
    config.extends = uniq([...config.extends, presetName])

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
      ensureInstalled(n, "--dev", [
        "typescript",
        "tslint",
        "@n4bb12/config-tslint",
      ]),
      n.write(configFile).asJson(cleaned),
    ])
  }

}
