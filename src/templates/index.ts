import Nehemiah from "nehemiah"
import path from "path"

export const templateDir = path.join(__dirname, "../templates")
export const templates = new Nehemiah(templateDir)
