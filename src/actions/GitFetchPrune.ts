import Nehemiah from "nehemiah"

import { Action } from "../Action"

const command = "git fetch --prune"

export class GitFetchPrune implements Action {

  public name() {
    return command
  }

  public async applies(n: Nehemiah) {
    return true
  }

  public async execute(n: Nehemiah) {
    await n.run(command)
  }

}
