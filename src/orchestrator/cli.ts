import "./bootstrap";
#!/usr/bin/env node
import "dotenv/config";
import { orchestrate } from "./run.js";

const input = process.argv.slice(2).join(" ") || "Celtic cross about focus.";
const out = await orchestrate(input);
console.log(JSON.stringify(out.final, null, 2));
