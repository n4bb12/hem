import Nehemiah from "nehemiah"

import { readTemplate } from "../templates"
import { Action } from "../types"

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
