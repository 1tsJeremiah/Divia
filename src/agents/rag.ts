import { Agent } from "@openai/agents";

const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;

export const RagAgent = new Agent({
  name: "RAG",
  instructions: "Use file_search over Divia docs and code; cite filenames/lines.",
  tools: [
    { type: "file_search", vector_store_ids: vectorStoreId ? [vectorStoreId] : undefined }
  ],
});
