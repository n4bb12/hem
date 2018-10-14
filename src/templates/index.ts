import fs from "fs"
import path from "path"

export function readTemplate(filename: string): string {
  const file = path.join(__dirname, filename)
  return fs.readFileSync(file, "utf8")
}
