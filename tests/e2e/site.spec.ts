import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/quote", async (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
});
test("home loads, links are correct, and has no overflow or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Powering the places/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Call 910.619.9999/ }).first(),
  ).toHaveAttribute("href", "tel:+19106199999");
  await expect(page.locator("body")).toHaveJSProperty(
    "scrollWidth",
    await page.locator("body").evaluate((e) => e.clientWidth),
  );
  expect(errors).toEqual([]);
  const images = await page.locator("img").evaluateAll((nodes) =>
    nodes.map((node) => ({
      complete: node.complete,
      width: node.naturalWidth,
      alt: node.alt,
    })),
  );
  expect(
    images.every(
      (image) => image.complete && image.width > 0 && image.alt.length > 0,
    ),
  ).toBe(true);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
test("uses the authoritative logo and every required image loads", async ({
  page,
}) => {
  const brokenImages: string[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "image" && !response.ok())
      brokenImages.push(response.url());
  });
  await page.goto("/");
  const logos = page.locator('img[src="/logo-alpha-electric.svg"]');
  await expect(logos).toHaveCount(2);
  await expect(logos.first()).toHaveAttribute(
    "alt",
    "Alpha Electric Southeast",
  );
  const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(favicon).toBe("/logo-alpha-electric.svg");
  const hero = page.locator("img.hero-media");
  await expect(hero).toBeVisible();
  await expect(hero).not.toHaveAttribute("alt", "");
  await expect(hero).toHaveJSProperty("naturalWidth", 2200);
  await page.goto("/our-work");
  const workImages = page.locator(".project-grid img");
  await expect(workImages).toHaveCount(7);
  const dimensions = await workImages.evaluateAll((images) =>
    images.map((image) => ({
      width: image.naturalWidth,
      height: image.naturalHeight,
      alt: image.alt,
    })),
  );
  expect(
    dimensions.every(
      (image) => image.width > 0 && image.height > 0 && image.alt.length > 0,
    ),
  ).toBe(true);
  expect(brokenImages).toEqual([]);
});
test("header name, matching logo, and accessible footer icons", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("header .logo-name")).toHaveText(
    "Alpha Electric Southeast LLC",
  );
  await expect(page.locator("header .logo-name")).toHaveCSS(
    "white-space",
    "nowrap",
  );
  const headerLogo = page.locator("header .logo-image");
  const footerLogo = page.locator("footer .logo-image");
  await expect(headerLogo).toHaveAttribute("src", "/logo-alpha-electric.svg");
  await expect(footerLogo).toHaveAttribute("src", "/logo-alpha-electric.svg");
  await expect(footerLogo).toHaveCSS("filter", "none");
  const socialLinks = [
    ["Visit Alpha Electric Southeast on Facebook", "facebook.com"],
    ["View Alpha Electric Southeast on Google Maps", "google.com/maps"],
    ["Read Alpha Electric Southeast reviews", "google.com/search"],
  ] as const;
  for (const [name, urlPart] of socialLinks) {
    const link = page.getByRole("link", { name });
    await expect(link).toHaveAttribute("href", new RegExp(urlPart));
    await expect(link.locator("svg")).toBeVisible();
    await expect(link).toHaveAttribute("title", /.+/);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});
test("Applications hero and Our Work metadata render accurately", async ({
  page,
}) => {
  await page.goto("/applications");
  const applicationsImage = page.locator(".applications-hero img");
  await expect(applicationsImage).toBeVisible();
  await expect(applicationsImage).toHaveAttribute(
    "src",
    "/images/facebook-work/wine-room-cabinet-lighting.jpeg",
  );
  await expect(applicationsImage).not.toHaveAttribute("alt", "");
  expect(
    await applicationsImage.evaluate((image) => image.naturalWidth),
  ).toBeGreaterThan(0);
  await expect(page.locator(".services article > span")).toHaveCount(0);
  await page.goto("/our-work");
  const figures = page.locator(".project-grid figure");
  await expect(figures).toHaveCount(7);
  for (const figure of await figures.all()) {
    await expect(figure.locator("figcaption span")).not.toHaveText("");
    await expect(figure.locator("h3")).not.toHaveText("");
    await expect(figure.locator("figcaption p")).not.toHaveText("");
    const image = figure.locator("img");
    await expect(image).not.toHaveAttribute("alt", "");
    const src = await image.getAttribute("src");
    expect(src).toContain("/images/facebook-work/");
    expect(src).not.toMatch(/placeholder|project-/i);
  }
  const editedImage = page.locator(
    'img[src$="wine-room-cabinet-lighting.jpeg"]',
  );
  await expect(editedImage).toBeVisible();
  expect(
    await editedImage.evaluate((image) => [
      image.naturalWidth,
      image.naturalHeight,
    ]),
  ).toEqual([1369, 918]);
});
for (const width of [390, 768, 1440])
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/applications", "/our-work", "/contact"]) {
      await page.goto(route);
      const dimensions = await page.locator("html").evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    }
  });
test("desktop navigation renders every route", async ({ page }) => {
  await page.goto("/");
  for (const [name, path, heading] of [
    ["Applications", "/applications", "Expert power"],
    ["Our Work", "/our-work", "Details matter"],
    ["Contact", "/contact", "Let’s make"],
  ] as const) {
    await page.getByRole("link", { name, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(
      page.getByRole("heading", { name: new RegExp(heading, "i") }),
    ).toBeVisible();
  }
});
test("all routes have no console errors or serious accessibility violations", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  for (const route of ["/", "/applications", "/our-work", "/contact"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact || ""),
      ),
    ).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
});
test("mobile menu opens, navigates, and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator("#menu-toggle");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "Applications", exact: true }).click();
  await expect(page).toHaveURL(/applications$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});
test("quote form validates and submits successfully", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /Request my free estimate/i }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await page.getByLabel("Name").fill("Morgan Lee");
  await page.getByRole("textbox", { name: /Phone/ }).fill("910-555-0123");
  await page.getByRole("textbox", { name: /Email/ }).fill("morgan@example.com");
  await page
    .getByLabel("Service type")
    .selectOption({ label: "Panel upgrade" });
  await page
    .getByLabel("Project details")
    .fill("We need to replace our older electrical panel.");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: /Request my free estimate/i }).click();
  await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
});
test("failed submission shows useful recovery guidance", async ({ page }) => {
  await page.unroute("**/api/quote");
  await page.route("**/api/quote", (r) =>
    r.fulfill({
      status: 500,
      contentType: "application/json",
      body: '{"error":"Service is temporarily unavailable."}',
    }),
  );
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Morgan Lee");
  await page.getByRole("textbox", { name: /Phone/ }).fill("910-555-0123");
  await page.getByRole("textbox", { name: /Email/ }).fill("morgan@example.com");
  await page
    .getByLabel("Service type")
    .selectOption({ label: "Panel upgrade" });
  await page
    .getByLabel("Project details")
    .fill("We need to replace our older electrical panel.");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: /Request my free estimate/i }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Please try again or call",
  );
});
test("contact emergency action and photo type validation work", async ({
  page,
}) => {
  await page.goto("/contact");
  const emergency = page.getByRole("link", { name: /Emergency Request/ });
  await expect(emergency).toBeVisible();
  await expect(emergency).toHaveAttribute("href", "tel:+19106199999");
  await page.getByLabel("Name").fill("Morgan Lee");
  await page.getByRole("textbox", { name: /Phone/ }).fill("910-555-0123");
  await page.getByRole("textbox", { name: /Email/ }).fill("morgan@example.com");
  await page
    .getByLabel("Service type")
    .selectOption({ label: "Panel upgrade" });
  await page
    .getByLabel("Project details")
    .fill("We need help reviewing our electrical service equipment.");
  await page.getByLabel(/I agree/).check();
  await page.getByLabel(/Optional project photo/).setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await page.getByRole("button", { name: /Request my free estimate/i }).click();
  await expect(page.getByRole("alert")).toContainText("JPG, PNG, or WebP");
});
for (const size of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
])
  test(`screenshot ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.screenshot({
      path: `test-results/home-${size.width}.png`,
      fullPage: true,
    });
  });

for (const [route, name] of [
  ["/applications", "applications"],
  ["/our-work", "our-work"],
  ["/contact", "contact"],
] as const)
  for (const size of [
    { label: "mobile", width: 390, height: 844 },
    { label: "desktop", width: 1440, height: 1000 },
  ])
    test(`${name} ${size.label} screenshot`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(route);
      await page.screenshot({
        path: `test-results/${name}-${size.label}.png`,
        fullPage: true,
      });
    });
