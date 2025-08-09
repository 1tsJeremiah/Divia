# Tarot Action API

An HTTP API that deals a Celtic Cross tarot spread and returns a chat-ready reading. Designed to be called by a custom GPT Action (e.g., **Diviaster Tarot**).

## Quick start (Docker)
```bash
docker compose up --build -d
curl -s http://localhost:8787/tarot/read | jq .
```

Endpoints

POST /tarot/read → body: { "seed": "optional-string", "allowReversals": true }

GET /tarot/last → returns the last dealt spread/analysis

GET / → health text

## Wire into a GPT (Actions)
Deploy this API and note the public HTTPS base URL.

In GPT Builder → Actions → “Add Action” → point to your hosted openapi.yaml.

Tool-use instruction suggestion:

When the user asks for a reading, call readTarot with any given seed and reversals preference. Show the chat string to the user and keep the JSON for follow-ups.

Name your GPT tool “Diviaster Tarot”.

## Local dev
```bash
npm i
npm start
```

## Environment
No secrets required by default.

Put behind a reverse proxy for TLS in production.

## License
MIT
