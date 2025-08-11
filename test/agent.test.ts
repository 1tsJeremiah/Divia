import { describe, it, expect } from "vitest";
import { Plan } from "../src/agents/router.js";
import { diviaArgs } from "../src/agents/actions.js";

describe("Plan schema", () => {
  it("parses a basic plan", () => {
    const plan = Plan.parse({ intent: "search", steps: [{ role: "web", input: "hi" }] });
    expect(plan.steps[0].role).toBe("web");
  });
});

describe("divia_reading tool", () => {
  it("validates args with zod", () => {
    expect(() => diviaArgs.parse({ question: "", spread: "single" })).toThrow();
    const args = diviaArgs.parse({ question: "Q", spread: "single" });
    expect(args.question).toBe("Q");
  });
});
