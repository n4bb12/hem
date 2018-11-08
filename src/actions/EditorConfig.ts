import Nehemiah from "nehemiah"

import { Action } from "../Action"
import { readTemplate } from "../templates"

const filename = ".editorconfig"
const template = readTemplate(filename)

export class EditorConfig implements Action {

  name() {
    return filename
  }

  async applies(n: Nehemiah) {
    return true
  }

  async execute(n: Nehemiah) {
    await n.write(filename).asText(template)
  }

}
