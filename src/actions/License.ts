import Nehemiah from "nehemiah"

import { readTemplate } from "../templates"
import { Action } from "../types"

const filename = "LICENSE"
const template = readTemplate(filename)

export class License implements Action {

  name() {
    return filename
  }

  async applies(n: Nehemiah) {
    return n.exists(filename).then(exists => !exists)
  }

  async execute(n: Nehemiah) {
    await n.write(filename).asText(template)
  }

}
