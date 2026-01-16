#!/usr/bin/env node

// src/index.ts
import { intro, select, outro, cancel } from "@clack/prompts";
import degit from "degit";
import { execa } from "execa";

// src/templates.ts
var templates = [
  {
    id: "expo-base",
    label: "Expo (base)",
    repo: "zuraHQ/expo-plate-starter/expo-plate-basic"
  },
  {
    id: "expo-convex-clerk",
    label: "Expo + Convex + Clerk Auth",
    repo: "zuraHQ/expo-plate-starter/expo-convex-clerk"
  }
];

// src/index.ts
import path from "path";
var appName = process.argv[2];
if (!appName) {
  cancel("Missing project name");
  process.exit(1);
}
intro("Select a starter");
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
await emitter.clone(targetDir);
await execa("npm", ["install"], {
  cwd: targetDir,
  stdio: "inherit"
});
outro("Done \u{1F389}");
