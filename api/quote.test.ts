import { describe, expect, it, vi } from "vitest";
import type { HttpRequest, InvocationContext } from "@azure/functions";
import { createQuoteHandler } from "./quote";

const valid = {
  name: "Taylor Smith",
  phone: "910-555-1234",
  email: "taylor@example.com",
  serviceType: "New construction",
  projectDetails: "Electrical plan for a new coastal home.",
  preferredContact: "Email",
  consent: true,
  website: "",
};
function request(body: unknown, ip = Math.random().toString()) {
  return {
    json: async () => body,
    headers: new Headers({ "x-forwarded-for": ip }),
  } as HttpRequest;
}
const context = {
  log: vi.fn(),
  error: vi.fn(),
} as unknown as InvocationContext;
describe("POST /api/quote", () => {
  it("persists and notifies for a valid request", async () => {
    const save = vi.fn().mockResolvedValue(undefined),
      notify = vi.fn().mockResolvedValue(undefined);
    const res = await createQuoteHandler({ save, notify })(
      request(valid),
      context,
    );
    expect(res.status).toBe(201);
    expect(save).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledOnce();
  });
  it("returns 400 for invalid payloads", async () => {
    const res = await createQuoteHandler({ save: vi.fn(), notify: vi.fn() })(
      request({ ...valid, email: "bad" }),
      context,
    );
    expect(res.status).toBe(400);
  });
  it("returns a safe error when storage fails", async () => {
    const res = await createQuoteHandler({
      save: vi.fn().mockRejectedValue(new Error("down")),
      notify: vi.fn(),
    })(request(valid), context);
    expect(res.status).toBe(500);
    expect(res.jsonBody).toEqual({
      error: "Your request could not be sent right now.",
    });
  });
  it("rate limits repeated clients", async () => {
    const handler = createQuoteHandler({ save: vi.fn(), notify: vi.fn() });
    let res;
    for (let i = 0; i < 6; i++)
      res = await handler(request(valid, "same-client"), context);
    expect(res!.status).toBe(429);
  });
});
