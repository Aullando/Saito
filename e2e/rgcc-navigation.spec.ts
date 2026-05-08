// Authenticated RGCC flow. Requires E2E_EMAIL / E2E_PASSWORD env vars and a
// user whose organization slug is "rgcc". Skipped if creds are missing so CI
// stays green out-of-the-box.
import { test, expect } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;
const hasCreds = Boolean(EMAIL && PASSWORD);

test.describe("RGCC navigation (authenticated)", () => {
  test.skip(!hasCreds, "Set E2E_EMAIL / E2E_PASSWORD to run");

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email|correo/i).fill(EMAIL!);
    await page.getByLabel(/password|contraseña/i).fill(PASSWORD!);
    await page.getByRole("button", { name: /sign in|entrar|login|iniciar/i }).click();
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("club switcher exposes RGCC and switches active club", async ({ page }) => {
    await page.getByLabel(/switch club/i).click();
    await page.getByRole("button", { name: /covadonga|rgcc/i }).first().click();
    await expect(page.getByText(/RGCC|Covadonga/i).first()).toBeVisible();
  });

  test("can navigate to Clases and Mi Día once on RGCC", async ({ page }) => {
    await page.getByLabel(/switch club/i).click();
    await page.getByRole("button", { name: /covadonga|rgcc/i }).first().click();

    await page.getByRole("link", { name: /^Clases$/ }).click();
    await expect(page).toHaveURL(/\/rgcc\/clases/);

    // Mi Día solo es visible para coach/admin: si está, navegamos.
    const miDia = page.getByRole("link", { name: /Mi Día/ });
    if (await miDia.count()) {
      await miDia.first().click();
      await expect(page).toHaveURL(/\/rgcc\/mi-dia/);
    }
  });
});
