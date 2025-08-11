import "./bootstrap";
import "dotenv/config";
import http from "node:http";
import { orchestrate } from "./run.js";

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/agent") { res.statusCode = 404; return res.end(); }
  const body = await new Promise<string>(r => { let d=""; req.on("data", c=>d+=c); req.on("end",()=>r(d||"{}")); });
  const { prompt } = JSON.parse(body);
  const result = await orchestrate(prompt);
  res.setHeader("Content-Type","application/json");
  res.end(JSON.stringify({ ok:true, result }));
});
server.listen(8787, () => console.log("Divia agent on :8787"));
