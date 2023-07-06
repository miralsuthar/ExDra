import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const { version } = packageJson;

const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name:
    env.mode === "staging"
      ? "[INTERNAL] CRXJS Power Tools"
      : "CRXJS Power Tools",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  permissions: ["tabs", "storage", "activeTab", "scripting", "background"],
  host_permissions: ["https://excalidraw.com/*"],
  action: {
    default_popup: "index.html",
  },
}));
