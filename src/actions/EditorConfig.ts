import Nehemiah from "nehemiah"

import { Action } from "../Action"
import { templates } from "../templates"

export class EditorConfig implements Action {

  public async applies(n: Nehemiah): Promise<boolean> {
    return true
  }

  public async execute(n: Nehemiah): Promise<void> {
    const filename = ".editorconfig"
    const template = await templates.read(filename).asText()
    await n.write(filename).asText(template)
  }

}
