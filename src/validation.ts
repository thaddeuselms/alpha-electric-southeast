import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{7,24}$/, "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
  serviceType: z.string().min(1, "Please choose a service."),
  projectDetails: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters about your project.")
    .max(4000),
  preferredContact: z.enum(["Phone", "Email", "Text"]),
  consent: z.literal(true, { error: "Please agree to be contacted." }),
  website: z.string().max(0).optional(),
});

export type QuotePayload = Omit<z.input<typeof quoteSchema>, "consent"> & {
  consent: boolean;
  photo?: { name: string; type: string; data: string };
};

export function createQuotePayload(form: HTMLFormElement): QuotePayload {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    serviceType: String(data.get("serviceType") || ""),
    projectDetails: String(data.get("projectDetails") || "").trim(),
    preferredContact: String(
      data.get("preferredContact") || "Phone",
    ) as QuotePayload["preferredContact"],
    consent: data.get("consent") === "on",
    website: String(data.get("website") || ""),
  };
}
