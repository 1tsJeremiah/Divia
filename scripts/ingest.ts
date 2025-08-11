import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const exts = new Set([".md", ".mdx", ".txt", ".ts", ".tsx"]);

async function walk(dir: string, out: string[] = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (exts.has(path.extname(e.name))) out.push(p);
  }
  return out;
}

async function main() {
  const files = [
    ...await walk("docs"),
    ...await walk("src"),
  ];

  const uploads: string[] = [];
  for (const file of files) {
    const data = await fs.readFile(file);
    const upload = await client.files.create({
      file: data,
      purpose: "assistants",
      filename: path.basename(file),
    } as any);
    uploads.push(upload.id);
  }

  let vsId = process.env.OPENAI_VECTOR_STORE_ID;
  if (!vsId) {
    const store = await client.beta.vectorStores.create({ name: process.env.PROJECT_NAME || "divia" });
    vsId = store.id;
    console.log("Created vector store", vsId);
  }

  await client.beta.vectorStores.fileBatches.uploadAndPoll(vsId!, { file_ids: uploads });
  console.log(`Uploaded ${uploads.length} files to ${vsId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
