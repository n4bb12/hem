import Nehemiah from "nehemiah"

import { readTemplate } from "../templates"
import { Action } from "../types"

const filename = "LICENSE"
const template = readTemplate(filename)
const tempalteName = template.split(/[\r\n]+/)[0]
const yearPlaceholder = "__YEAR__"

export class License implements Action {

  name() {
    return "License"
  }

  async applies(n: Nehemiah) {
    return true
  }

  async execute(n: Nehemiah) {
    const caseSensitive = false
    const licenses = await n.find("license*", {
      case: caseSensitive,
    })

    // ambiguous
    if (licenses.length > 1) {
      return n.warn(n.name, "appears to have multiple licences:", licenses)
    }

    // no licence exists, create one
    if (licenses.length === 0) {
      const year = `${new Date().getFullYear()}`
      const text = template.replace(yearPlaceholder, year)

      return n.write(filename).asText(text)
    }

    // licence exists
    const currentText = await n.read(licenses[0]).asText()
    const name = currentText!.split(/[\r\n]/)[0]

    // different license -- ignore it
    if (name !== tempalteName) {
      return n.warn(n.name, "non-default license needs manual update:", name)
    }

    // update copyright year
    const years = currentText!
      .split(/[\r\n]/)[2]
      .replace(/.*?([\d-]+).*/i, "$1")
    const from = +years.replace(/(\d+).*/, "$1")
    const to = new Date().getFullYear()

    if (from > to) {
      return n.warn(n.name, "invalid years:", [from, to])
    }

    const newYear = from === to
      ? `${from}`
      : `${from}-${to}`
    const newText = template.replace(yearPlaceholder, newYear)

    return n.write(filename).asText(newText)
  }

}
