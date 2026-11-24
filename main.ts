import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDir, "entry.txt");

let entry;
try {
  entry = readFileSync(sourcePath, "utf8");
} catch {
  fail(`cannot read ${sourcePath}`);
}

if (entry.includes("\n") || entry.includes("\r")) {
  fail("entry.txt must contain exactly one line");
}

if (entry.includes("\t")) {
  fail("entry.txt must not contain tab characters");
}

if (entry.length < 1 || entry.length > 140) {
  fail(`entry.txt must be 1 to 140 characters long, got ${entry.length}`);
}

if (entry !== entry.trim()) {
  fail("entry.txt must not start or end with whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  fail(`cannot write entry to ${outDir}: ${detail}`);
}
