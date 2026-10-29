import { cp, rm } from "node:fs/promises";

await rm(new URL("../build/", import.meta.url), { recursive: true, force: true });
await cp(new URL("../.next/", import.meta.url), new URL("../build/", import.meta.url), {
  recursive: true,
  force: true,
});
console.log("Copied .next to build/");
