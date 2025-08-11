import { run } from "@openai/agents";
import pRetry from "p-retry";
import PQueue from "p-queue";
import { Router } from "../agents/router.js";
import { WebAgent } from "../agents/web.js";
import { RagAgent } from "../agents/rag.js";
import { ActionsAgent } from "../agents/actions.js";
import { Scribe } from "../agents/scribe.js";
import { appendLog } from "../memory/journal.js";

const registry = { web: WebAgent, rag: RagAgent, actions: ActionsAgent, scribe: Scribe } as const;

export async function orchestrate(prompt: string) {
  const planRes = await run(Router, prompt);
  const plan = planRes.finalOutput;

  const q = new PQueue({ concurrency: 2 });
  const results: any[] = [];

  for (const step of plan.steps) {
    const agent = registry[step.role as keyof typeof registry];
    if (!agent) continue;
    const work = () =>
      run(agent, step.input, { maxTurns: 8 })
        .then(r => ({ role: step.role, output: r.finalOutput, trace: r.trace }));
    const res = await q.add(() => pRetry(work, { retries: 2, factor: 2 }));
    results.push(res);
    await appendLog({ prompt, step, res });
  }

  const finalRes = await run(Scribe, `Synthesize this for the user:\n${JSON.stringify(results)}`);
  return { plan, results, final: finalRes.finalOutput };
}
