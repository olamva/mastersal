import { describe, expect, it } from "vitest";
import { isCronAuthorized } from "@/lib/cron";
import { createOAuthFlow, validateOAuthState } from "@/lib/oauth-flow";

describe("route security", () => {
  it("requires the exact cron bearer secret", () => {
    expect(isCronAuthorized("Bearer correct", "correct")).toBe(true);
    expect(isCronAuthorized("Bearer wrong", "correct")).toBe(false);
    expect(isCronAuthorized(null, "correct")).toBe(false);
  });

  it("validates OAuth state and its lifetime", () => {
    const flow = createOAuthFlow(1_000);
    expect(validateOAuthState(flow, flow.state, 2_000)).toBe(true);
    expect(validateOAuthState(flow, `${flow.state}x`, 2_000)).toBe(false);
    expect(validateOAuthState(flow, flow.state, 1_000 + 10 * 60 * 1000)).toBe(false);
  });
});
