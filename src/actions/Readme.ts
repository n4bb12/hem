import { html as beautifyHtml } from "js-beautify"
import { identity } from "lodash"
import Nehemiah from "nehemiah"

import { Action } from "../Action"
import { PackageJson } from "../types"

const configFile = "readme.json"
const pkgConfigFile = "package.json"
const filename = "README.md"

const htmlOptions = {
  end_with_newline: true,
  indent_size: 2,
  max_preserve_newlines: 0,
  wrap_line_length: 120,
}

interface Badge {
  name: string
  link: string
  image: string
}

interface ReadmeConfig {
  logo?: string
  name?: string
  description?: string | string[]
  badges?: Badge[]
}

export class Readme implements Action {
  name() {
    return filename
  }

  async applies(n: Nehemiah) {
    return n.exists(configFile)
  }

  async execute(n: Nehemiah) {
    const config: ReadmeConfig = (await n.read(configFile).asJson()) || {}
    const pkg: PackageJson = (await n.read(pkgConfigFile).asJson()) || {}
    const parts = [
      formatTitle(config, pkg),
      formatDescription(config, pkg),
      formatBadges(config, pkg),
    ]
    const md = parts.map(part => part.trim()).join("\n\n")

    await n.write("README.md").asText(md)
  }
}

function html(ugly: string): string {
  const withBreaks = ugly.replace(/</g, "\n<").replace(/>/g, ">\n")
  return beautifyHtml(withBreaks, htmlOptions)
}

function formatTitle(config: ReadmeConfig, pkg: PackageJson) {
  // TODO use <img> tag if logo is a URL
  const parts = [config.logo, config.name || pkg.name]
  const title = parts.filter(identity).join(" ")

  return html(`<h1 align="center">${title}</h1>`)
}

function formatDescription(config: ReadmeConfig, pkg: PackageJson) {
  const configDescr = Array.isArray(config.description)
    ? config.description.join(" ")
    : config.description
  const description = configDescr || pkg.description || ""

  return html(`<p align="center">${description}</p>`)
}

function formatBadge(b: Badge) {
  return `
  <a href="${b.link}">
    <img alt="${b.name}" src="${b.image}">
  </a>`
}

function formatBadges(config: ReadmeConfig, pkg: PackageJson) {
  const badgeConfig = config.badges || []
  const badges = badgeConfig.map(formatBadge).join("")

  return html(`<p align="center">${badges}</p>`)
}
