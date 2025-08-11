import { Agent } from "@openai/agents";

export const Scribe = new Agent({
  name: "Scribe",
  instructions: "Summarize results into a crisp final answer for the user.",
});
