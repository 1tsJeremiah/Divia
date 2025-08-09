import express from "express";
import cors from "cors";
import { buildDeck, drawCelticCross, analyze, toChat } from "./src/tarot-core.js";

const app = express();
app.use(cors());
app.use(express.json());
app.set("json spaces", 2);

// basic structured logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration
      })
    );
  });
  next();
});

let __last = null;

app.post("/tarot/read", (req, res) => {
  const seed = req.body?.seed ?? null;
  const allowReversals = req.body?.allowReversals ?? true;
  const spread = drawCelticCross({ seed, allowReversals });
  const analysis = analyze(spread);
  const chat = toChat(spread, analysis);
  const reading = { spread, analysis, chat };
  __last = reading;
  res.json(reading);
});

app.get("/tarot/last", (req, res) => {
  if (!__last) {
    return res.status(204).end();
  }
  res.json(__last);
});

app.get("/", (req, res) => {
  res.type("text/plain").send("ok");
});

const port = process.env.PORT || 8787;
app.listen(port, "0.0.0.0", () =>
  console.log(`Tarot Action API listening on :${port}`)
);
