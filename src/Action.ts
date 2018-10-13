import Nehemiah from "nehemiah"

export interface Action {

  /**
   * Determines whether the action applies to a repository.
   */
  applies(n: Nehemiah): Promise<boolean>

  /**
   * Returns a promise that performs the action.
   */
  execute(n: Nehemiah): Promise<void>

}
