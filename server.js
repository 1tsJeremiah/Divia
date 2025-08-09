import express from "express";
import cors from "cors";
import { buildDeck, drawCelticCross, analyze, toChat } from "./src/tarot-core.js";

const app = express();
app.use(cors());
app.use(express.json());

let __last = null;

app.post("/tarot/read", (req, res)=>{
  const seed = req.body?.seed ?? null;
  const allowReversals = req.body?.allowReversals ?? true;
  const spread = drawCelticCross({ seed, allowReversals });
  const analysis = analyze(spread);
  const chat = toChat(spread, analysis);
  __last = { spread, analysis };
  res.json({ spread, analysis, chat });
});

app.get("/tarot/last", (req,res)=>{
  res.json(__last || {});
});

app.get("/", (req,res)=>{
  res.type("text/plain").send("Tarot Action API is up.");
});

const port = process.env.PORT || 8787;
app.listen(port, ()=> console.log(`Tarot Action API listening on :${port}`));
