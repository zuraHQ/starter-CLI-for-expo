import { intro, select, outro, cancel, text, spinner } from "@clack/prompts"
import degit from "degit"
import { execa } from "execa"
import { templates } from "./templates"
import path from "path"

intro("Create Expo Plate")

let appName = process.argv[2]

if (!appName) {
    const answer = await text({
        message: "Project name:",
        placeholder: "my-app",
        defaultValue: "my-app",
        validate(value) {
            if (!value.trim()) return "Project name is required"
        },
    })

    if (typeof answer !== "string") {
        cancel("Aborted")
        process.exit(0)
    }

    appName = answer
}

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

const s = spinner()

s.start(`Cloning template into ./${appName}`)
await emitter.clone(targetDir)
s.stop(`Template cloned`)

s.start("Installing dependencies")
await execa("npm", ["install"], {
    cwd: targetDir,
    stdio: "inherit",
})
s.stop("Dependencies installed")

outro(`Done! Run: cd ${appName} && npx expo run:ios`)
