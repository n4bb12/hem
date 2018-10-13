import Nehemiah from "nehemiah"

import { Action } from "../Action"
import { readTemplate } from "../templates"

const filename = ".editorconfig"
const template = readTemplate(filename)

export class EditorConfig implements Action {

  public async applies(n: Nehemiah): Promise<boolean> {
    return true
  }

  public async execute(n: Nehemiah): Promise<void> {
    await n.write(filename).asText(template)
  }

}
