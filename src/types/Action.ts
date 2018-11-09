import Nehemiah from "nehemiah"

export interface Action {

  /**
   * Used for console output.
   */
  name(): string

  /**
   * Determines whether the action applies to a repository.
   */
  applies(n: Nehemiah): Promise<string | number | boolean>

  /**
   * Returns a promise that performs the action.
   */
  execute(n: Nehemiah): Promise<void>

}
