import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Vercel rejects individual files over 100 MB. */
const MAX_BYTES = 100 * 1024 * 1024;

const sourceRoot = fileURLToPath(new URL("../../Assets/", import.meta.url));
const destRoot = fileURLToPath(new URL("../public/assets/", import.meta.url));

async function copyTree(srcDir, destDir) {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  let copied = 0;
  let skipped = 0;

  for (const entry of entries) {
    const from = path.join(srcDir, entry.name);
    const to = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await copyTree(from, to);
      copied += nested.copied;
      skipped += nested.skipped;
      continue;
    }

    const info = await stat(from);
    if (info.size >= MAX_BYTES) {
      console.warn(
        `Skipping oversized asset (${(info.size / (1024 * 1024)).toFixed(1)} MB): ${path.relative(sourceRoot, from)}`,
      );
      skipped += 1;
      continue;
    }

    await cp(from, to, { force: true });
    copied += 1;
  }

  return { copied, skipped };
}

const result = await copyTree(sourceRoot, destRoot);
console.log(
  `Portfolio media copied to public/assets (${result.copied} files, ${result.skipped} skipped for size).`,
);
