import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TableClient } from "@azure/data-tables";
import { BlobServiceClient } from "@azure/storage-blob";
import { EmailClient } from "@azure/communication-email";
import { randomUUID } from "node:crypto";
import { quoteSchema, type QuotePayload } from "../src/validation";

type Services = {
  save: (id: string, data: QuotePayload) => Promise<void>;
  notify: (id: string, data: QuotePayload) => Promise<void>;
};
const attempts = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 5;
}
function clean(value: string) {
  return value.replace(/[<>]/g, "");
}

export function createQuoteHandler(services: Services) {
  return async (
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (limited(ip))
      return {
        status: 429,
        jsonBody: {
          error: "Too many requests. Please wait a minute and try again.",
        },
      };
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid request body." } };
    }
    const parsed = quoteSchema.safeParse(body);
    if (!parsed.success)
      return {
        status: 400,
        jsonBody: {
          error: "Please check the required fields.",
          issues: parsed.error.flatten().fieldErrors,
        },
      };
    const raw = body as QuotePayload;
    if (raw.website) return { status: 202, jsonBody: { ok: true } };
    if (
      raw.photo &&
      (!["image/jpeg", "image/png", "image/webp"].includes(raw.photo.type) ||
        raw.photo.data.length > 7_000_000)
    )
      return {
        status: 400,
        jsonBody: { error: "Photo must be a JPG, PNG, or WebP under 5 MB." },
      };
    const data = {
      ...parsed.data,
      name: clean(parsed.data.name),
      projectDetails: clean(parsed.data.projectDetails),
      photo: raw.photo,
    };
    const id = randomUUID();
    try {
      await services.save(id, data);
      await services.notify(id, data);
      context.log(`Quote ${id} accepted`);
      return { status: 201, jsonBody: { ok: true, id } };
    } catch (error) {
      context.error("Quote submission failed", error);
      return {
        status: 500,
        jsonBody: { error: "Your request could not be sent right now." },
      };
    }
  };
}

function productionServices(): Services {
  const storage = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const comms = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
  return {
    save: async (id, data) => {
      if (!storage) throw new Error("Storage is not configured");
      const table = TableClient.fromConnectionString(
        storage,
        process.env.QUOTE_TABLE_NAME || "QuoteRequests",
      );
      await table.createTable().catch(() => undefined);
      let photoUrl = "";
      if (data.photo) {
        const container = BlobServiceClient.fromConnectionString(
          storage,
        ).getContainerClient(
          process.env.QUOTE_PHOTO_CONTAINER || "quote-photos",
        );
        await container.createIfNotExists();
        const blob = container.getBlockBlobClient(
          `${id}/${data.photo.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`,
        );
        await blob.uploadData(Buffer.from(data.photo.data, "base64"), {
          blobHTTPHeaders: { blobContentType: data.photo.type },
        });
        photoUrl = blob.url;
      }
      await table.createEntity({
        partitionKey: "quote",
        rowKey: id,
        createdAt: new Date().toISOString(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        serviceType: data.serviceType,
        projectDetails: data.projectDetails,
        preferredContact: data.preferredContact,
        photoUrl,
      });
    },
    notify: async (id, data) => {
      if (!comms) throw new Error("Email is not configured");
      const client = new EmailClient(comms);
      await client.beginSend({
        senderAddress: process.env.EMAIL_SENDER!,
        recipients: { to: [{ address: process.env.EMAIL_RECIPIENT! }] },
        content: {
          subject: `New estimate request: ${data.serviceType}`,
          plainText: `Quote ${id}\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nPreferred: ${data.preferredContact}\nService: ${data.serviceType}\n\n${data.projectDetails}`,
        },
      });
    },
  };
}

export const quoteHandler = createQuoteHandler(productionServices());
app.http("quote", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "quote",
  handler: quoteHandler,
});
