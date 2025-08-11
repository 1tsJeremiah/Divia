# Divia project agents

This repo ships a multi-agent orchestrator using the OpenAI Agents SDK. It routes requests to
specialized workers with built-in tools:

- **WebAgent** – web search via `web_search`.
- **RagAgent** – file search over your vector store (`file_search`).
- **ActionsAgent** – calls the Divia REST API.
- **Scribe** – final response synthesis.

## Environment & setup

```bash
cp .env.example .env
# fill in OPENAI_API_KEY etc.
direnv allow   # optional, auto-loads .env
pnpm install
```

Build or update the vector store (optional):

```bash
pnpm ingest
```

Run the CLI:

```bash
pnpm agent:chat "Celtic cross about focus"
```

Run the HTTP service:

```bash
pnpm dev
# POST localhost:8787/agent {"prompt":"what does Divia do?"}
```

## GitHub connector

In ChatGPT, enable the GitHub connector and search
`repo:1tsJeremiah/divia import` if the repo hasn't been indexed yet. This
forces a manual indexing pass.

## File search uploads

Use `pnpm ingest` to upload docs and code to an OpenAI vector store for the built-in
`file_search` tool. The resulting `OPENAI_VECTOR_STORE_ID` is stored in your environment.

## Notes

The project uses the **Responses API** and the newer **Agents SDK**. The older Assistants API is
being deprecated—plan migrations accordingly.
