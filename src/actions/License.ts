import Nehemiah from "nehemiah"

import { Action } from "../Action"
import { readTemplate } from "../templates"

const filename = "LICENSE"
const template = readTemplate(filename)

export class License implements Action {

  public name() {
    return filename
  }

  public async applies(n: Nehemiah) {
    return n.exists(filename).then(exists => !exists)
  }

  public async execute(n: Nehemiah) {
    await n.write(filename).asText(template)
  }

}
