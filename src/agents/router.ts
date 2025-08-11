import { Agent } from "@openai/agents";
import { z } from "zod";

export const Plan = z.object({
  intent: z.enum(["divia.reading","divia.info","search","rag"]).default("search"),
  steps: z.array(z.object({
    role: z.enum(["web","rag","actions","scribe"]),
    input: z.string().min(1),
  })).min(1)
});
export type Plan = z.infer<typeof Plan>;

export const Router = Agent.create({
  name: "Router",
  instructions:
    "Classify the user request and output a minimal plan with steps. Prefer RAG for repo-specific questions; prefer Actions for Divia API.",
  outputType: Plan,
});
