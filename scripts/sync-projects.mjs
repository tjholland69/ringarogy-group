#!/usr/bin/env node
// Pulls the project list from the Obsidian vault into app/projects.json.
//
//   npm run sync          write app/projects.json
//   npm run sync -- --dry show what would change, write nothing
//
// A note is a project when its frontmatter has `type: project` and a `domain`.
// Optional frontmatter: `site_name` (display name), `site_order` (sort position),
// `site: false` (leave it off the site).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const vault = process.env.OBSIDIAN_VAULT ?? join(homedir(), "Documents", "Obsidian Vault");
const projectsDir = join(vault, "Projects");
const outFile = join(dirname(fileURLToPath(import.meta.url)), "..", "app", "projects.json");
const dry = process.argv.includes("--dry");

// Reads `key: value` pairs, with one level of nesting stored as "parent.key".
function frontmatter(text) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const data = {};
  let parent = null;
  for (const line of block[1].split(/\r?\n/)) {
    const match = line.match(/^(\s*)([\w-]+):\s*(.*)$/);
    if (!match) continue;
    const [, indent, key, raw] = match;
    const value = raw.trim().replace(/^["']|["']$/g, "");
    if (indent) {
      if (parent) data[`${parent}.${key}`] = value;
    } else {
      data[key] = value;
      parent = value ? null : key;
    }
  }
  return data;
}

function noteFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".md")) return [path];
    // One level down: Projects/<Name>/<Name>.md
    if (entry.isDirectory() && dir === projectsDir) return noteFiles(path);
    return [];
  });
}

if (!existsSync(projectsDir)) {
  console.error(`No Projects folder at ${projectsDir}`);
  console.error("Set OBSIDIAN_VAULT to the vault path and try again.");
  process.exit(1);
}

const found = [];
const skipped = [];
for (const file of noteFiles(projectsDir)) {
  const data = frontmatter(readFileSync(file, "utf8"));
  if (data?.type !== "project" || data.site === "false") continue;
  const name = data.site_name || data.project;
  const domain = (data.domain || data["domains.production"] || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  if (!name || !domain) {
    skipped.push(file.slice(vault.length + 1));
    continue;
  }
  const order = data.site_order ? Number(data.site_order) : Infinity;
  found.push({ name, href: `https://${domain}`, order });
}

found.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
const projects = found.map(({ name, href }) => ({ name, href }));

const before = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : [];
const label = (project) => `${project.name} (${project.href})`;
const changes = [
  ...projects.filter((p) => !before.some((b) => b.href === p.href)).map((p) => `+ ${label(p)}`),
  ...before.filter((b) => !projects.some((p) => p.href === b.href)).map((b) => `- ${label(b)}`),
  ...projects.flatMap((p) => {
    const old = before.find((b) => b.href === p.href);
    return old && old.name !== p.name ? [`~ ${old.name} -> ${p.name}`] : [];
  }),
];
const reordered = !changes.length && JSON.stringify(before) !== JSON.stringify(projects);

for (const file of skipped) console.warn(`Skipped ${file}: needs a project name and a domain`);

if (!changes.length && !reordered) {
  console.log(`Already in sync: ${projects.length} projects.`);
} else {
  for (const change of changes) console.log(change);
  if (reordered) console.log("Order changed.");
  if (dry) {
    console.log("Dry run: nothing written.");
  } else {
    writeFileSync(outFile, JSON.stringify(projects, null, 2) + "\n");
    console.log(`Wrote ${projects.length} projects to app/projects.json.`);
  }
}
