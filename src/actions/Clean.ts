import Nehemiah from "nehemiah"

import { Action } from "../types"

export class Clean implements Action {
  name() {
    return "Cleanup"
  }

  async applies(n: Nehemiah) {
    return true
  }

  async execute(n: Nehemiah) {
    await n.delete("yarn-error.log")
  }
}
