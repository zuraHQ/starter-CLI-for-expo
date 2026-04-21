#!/usr/bin/env node

// src/index.ts
import { intro, select, outro, cancel, text, spinner } from "@clack/prompts";
import degit from "degit";
import { execa } from "execa";

// src/templates.ts
var templates = [
  {
    id: "expo-base",
    label: "Expo (base) \u2014 payments, onboarding, Tailwind, HeroUI components",
    repo: "zuraHQ/Modern-expo-boilerplate/expo-plate-basic"
  },
  {
    id: "expo-convex-clerk",
    label: "Expo + Convex + Clerk \u2014 payments, onboarding, Tailwind, HeroUI components, authentication, database",
    repo: "zuraHQ/Modern-expo-boilerplate/expo-convex-clerk"
  }
];

// src/index.ts
import path from "path";
intro("Create Expo Plate");
var appName = process.argv[2];
if (!appName) {
  const answer = await text({
    message: "Project name:",
    placeholder: "my-app",
    defaultValue: "my-app",
    validate(value) {
      if (!value.trim()) return "Project name is required";
    }
  });
  if (typeof answer !== "string") {
    cancel("Aborted");
    process.exit(0);
  }
  appName = answer;
}
var templateId = await select({
  message: "Choose a template:",
  options: templates.map((t) => ({
    label: t.label,
    value: t.id
  }))
});
if (typeof templateId !== "string") {
  cancel("Aborted");
  process.exit(0);
}
var template = templates.find((t) => t.id === templateId);
var targetDir = path.resolve(appName);
var emitter = degit(template.repo, {
  cache: false,
  force: true
});
var s = spinner();
s.start(`Cloning template into ./${appName}`);
await emitter.clone(targetDir);
s.stop(`Template cloned`);
s.start("Installing dependencies");
await execa("npm", ["install"], {
  cwd: targetDir,
  stdio: "inherit"
});
s.stop("Dependencies installed");
outro(`Done! Run: cd ${appName} && npx expo run:ios`);
