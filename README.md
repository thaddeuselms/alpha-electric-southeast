# Alpha Electric Southeast

Production-ready website and quote intake for Alpha Electric Southeast, serving New Hanover, Pender, and Brunswick County, North Carolina. The frontend uses React, TypeScript, Vite, and React Router. The serverless API uses Azure Functions, Table Storage, Blob Storage, and Azure Communication Services Email.

## Brand and image assets

- `public/logo-alpha-electric.svg` is a monochrome vector trace made directly from the business-supplied Alpha Electric logo attachment. The trace contains paths rather than substituted fonts, preserving the source circle, lightning bolt, ALPHA lettering, and ELECTRIC lettering. It is used in the header, footer, favicon, and Open Graph metadata. Copyright remains with Alpha Electric Southeast.
- `public/images/hero-electrician.jpg` was generated specifically for this site with OpenAI's built-in image-generation tool on August 28, 2026, then resized and compressed locally to a 2200 × 1238 JPEG. It is not a stock photograph of an identifiable employee. Use of the generated output is governed by the [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/); Alpha Electric should retain this provenance note with the asset.
- `public/images/facebook-work/` contains locally supplied Alpha Electric work-media images. Gallery captions describe only visible content because several legacy filenames do not match their photographs. The business owner must confirm photographer and property-owner publication permission before launch. The floor-only cleanup applied to `wine-room-cabinet-lighting.jpeg` is documented in the directory README.

## Local setup

1. Install Node.js 20+ and Azure Functions Core Tools 4.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` for public `VITE_*` link overrides.
4. Copy `local.settings.example.json` to `local.settings.json` and enter backend secrets.
5. In separate terminals run `func start` and `npm run dev`. Vite proxies `/api` to port 7071.

No backend secret is read by Vite or shipped to the browser. Only variables beginning with `VITE_` are public.

## Configuration

- `VITE_FACEBOOK_URL`: Facebook media page.
- `VITE_GOOGLE_MAPS_URL`: exact Google Maps listing supplied by the owner.
- `VITE_GOOGLE_REVIEWS_URL`: exact Google review link supplied by the owner.
- `AZURE_STORAGE_CONNECTION_STRING`: Storage account for quotes and optional photos.
- `QUOTE_TABLE_NAME`: Table Storage table (default `QuoteRequests`).
- `QUOTE_PHOTO_CONTAINER`: private Blob container (default `quote-photos`).
- `AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING`: ACS Email connection string.
- `EMAIL_SENDER`: verified ACS sender address.
- `EMAIL_RECIPIENT`: business notification inbox.

The committed Google links are safe search fallbacks because exact listing/review URLs were not present in the supplied files. Set the two `VITE_` variables before production deployment.

## Form security

The Function validates every field with a shared Zod schema, strips angle brackets from free text, limits accepted image types and size, uses a honeypot, and applies an IP-based burst limit. Azure Static Web Apps adds security headers. For multi-instance production traffic, place Azure Front Door or API Management in front of the Function and configure a distributed rate-limit policy. Keep the photo container private and use Storage lifecycle rules for retention.

## Test and build

Run `npm run test:all`. Individual commands are `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e`. Playwright writes responsive captures for 390, 768, and 1440 px to `test-results/`.

## Azure deployment

### Static Web Apps (recommended)

Create a Static Web App connected to the repository with app location `/`, API location `api`, and output location `dist`. Add every environment variable above in the Static Web App configuration. The included workflow builds and deploys the app; store the deployment token as `AZURE_STATIC_WEB_APPS_API_TOKEN`.

### Azure Web App

Run `npm ci && npm run build`, deploy `dist/` to the Web App, and deploy the `api/` Function separately. Configure SPA fallback to `index.html` and set `VITE_API_URL` only if the Function is on a different origin (with a restricted CORS allowlist). Static Web Apps avoids that cross-origin configuration.

Before launch, update the canonical domain, sitemap URLs, JSON-LD URL, exact Maps/reviews links, and any licensing copy required by the business.
