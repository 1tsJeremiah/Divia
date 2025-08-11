import { Agent } from "@openai/agents";

export const WebAgent = new Agent({
  name: "Web",
  instructions: "Answer with citations. Use web_search when needed.",
  tools: [{ type: "web_search" }],
});
