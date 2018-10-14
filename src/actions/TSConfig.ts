import Nehemiah from "nehemiah"
import sortKeys from "sort-keys"

import { Action } from "../Action"

const configFile = "tsconfig.json"

export class TSConfig implements Action {

  public name() {
    return configFile
  }

  public async applies(n: Nehemiah) {
    return n.exists(configFile)
  }

  public async execute(n: Nehemiah) {
    const config = await n.read(configFile).asJson() || {}

    config.$schema = "http://json.schemastore.org/tsconfig"

    const cleaned = sortKeys(config, { deep: true })

    await n.write(configFile).asJson(cleaned)
  }

}
