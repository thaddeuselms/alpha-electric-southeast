import { describe, expect, it } from "vitest";
import { createQuotePayload, quoteSchema } from "./validation";

describe("quote validation", () => {
  it("accepts a complete quote", () => {
    expect(
      quoteSchema.safeParse({
        name: "Alex Morgan",
        phone: "910-555-1212",
        email: "alex@example.com",
        serviceType: "Panel upgrade",
        projectDetails: "Replace an aging 100 amp panel.",
        preferredContact: "Phone",
        consent: true,
        website: "",
      }).success,
    ).toBe(true);
  });
  it("rejects invalid contact details and short project descriptions", () => {
    const result = quoteSchema.safeParse({
      name: "A",
      phone: "12",
      email: "nope",
      serviceType: "",
      projectDetails: "short",
      preferredContact: "Phone",
      consent: false,
    });
    expect(result.success).toBe(false);
  });
  it("creates a normalized payload from form fields", () => {
    document.body.innerHTML =
      '<form><input name="name" value="  Jamie Doe  "><input name="phone" value="910.555.0101"><input name="email" value="jamie@example.com"><input name="serviceType" value="Lighting"><textarea name="projectDetails">  Add porch lighting please.  </textarea><input name="preferredContact" value="Text" checked><input name="consent" type="checkbox" checked></form>';
    const payload = createQuotePayload(document.querySelector("form")!);
    expect(payload).toMatchObject({
      name: "Jamie Doe",
      projectDetails: "Add porch lighting please.",
      preferredContact: "Text",
      consent: true,
    });
  });
});
