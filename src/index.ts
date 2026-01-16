import { intro, select, outro, cancel } from "@clack/prompts"
import degit from "degit"
import { execa } from "execa"
import { templates } from "./templates"
import path from "path"

const appName = process.argv[2]

if (!appName) {
    cancel("Missing project name")
    process.exit(1)
}

intro("Select a starter")

const templateId = await select({
    message: "Choose a template:",
    options: templates.map((t) => ({
        label: t.label,
        value: t.id,
    })),
})

if (typeof templateId !== "string") {
    cancel("Aborted")
    process.exit(0)
}

const template = templates.find((t) => t.id === templateId)!

const targetDir = path.resolve(appName)

const emitter = degit(template.repo, {
    cache: false,
    force: true,
})

await emitter.clone(targetDir)

await execa("npm", ["install"], {
    cwd: targetDir,
    stdio: "inherit",
})

outro("Done 🎉")
