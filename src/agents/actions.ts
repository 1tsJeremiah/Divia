import { z } from "zod";
import { Agent, tool } from "@openai/agents";

export const diviaArgs = z.object({
  question: z.string().min(1),
  spread: z.enum(["single","pair","celtic_cross"]).default("single"),
});

export const callDivia = tool({
  name: "divia_reading",
  description: "Call Divia REST API to read a tarot spread.",
  parameters: diviaArgs,
  execute: async ({ question, spread }) => {
    const url = process.env.DIVIA_API_URL ?? "https://divia.example/api/readTarot";
    const key = process.env.DIVIA_API_KEY ?? "";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": key },
      body: JSON.stringify({ question, spread }),
    });
    if (!res.ok) throw new Error(`Divia API ${res.status}`);
    return await res.json();
  },
});

export const ActionsAgent = new Agent({
  name: "Actions",
  instructions: "Use the divia_reading tool for tarot operations.",
  tools: [callDivia],
});
