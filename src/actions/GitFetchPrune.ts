import Nehemiah from "nehemiah"

import { Action } from "../types"

const command = "git fetch --prune"

export class GitFetchPrune implements Action {

  name() {
    return "Git fetch & prune"
  }

  async applies(n: Nehemiah) {
    return true
  }

  async execute(n: Nehemiah) {
    await n.run(command)
  }

}
