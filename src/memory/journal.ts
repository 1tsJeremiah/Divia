import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "memory");
const file = path.join(dir, "divia.state.jsonl");

export async function appendLog(entry: unknown) {
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.appendFile(file, JSON.stringify({ t: Date.now(), ...entry }) + "\n");
}
