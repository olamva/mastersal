import { readdir, mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = process.cwd();
const peopleDirectory = join(root, "public", "people");
const outputDirectory = join(root, "src", "generated");
const allowedExtensions = new Set([".webp", ".png", ".jpg", ".jpeg", ".avif", ".svg"]);
await mkdir(peopleDirectory, { recursive: true });
await mkdir(outputDirectory, { recursive: true });
const files = (await readdir(peopleDirectory)).filter((file) => allowedExtensions.has(extname(file).toLowerCase())).sort();
await writeFile(join(outputDirectory, "image-manifest.ts"), `export const imageManifest = ${JSON.stringify(files)} as const;\n`);
