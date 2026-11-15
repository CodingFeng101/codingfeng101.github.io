import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

test("does not expose a resume download or ship PDF files", () => {
  const source = readFileSync(new URL("./App.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /下载 PDF|DownloadSimple|feng-guodong-resume\.pdf/);
  const publicFiles = readdirSync(new URL("../public/", import.meta.url), { recursive: true });
  assert.equal(publicFiles.some((file) => file.toLowerCase().endsWith(".pdf")), false);
});
