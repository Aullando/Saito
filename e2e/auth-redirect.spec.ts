import { test, expect } from "@playwright/test";

// Smoke: anonymous navigation should redirect any protected RGCC route to /login.
// This validates the auth boundary without needing real credentials.
const PROTECTED = [
  "/dashboard",
  "/rgcc/clases",
  "/rgcc/mi-dia",
  "/rgcc/biblioteca",
  "/rgcc/entrenamiento-personal",
];

for (const path of PROTECTED) {
  test(`anonymous visit to ${path} → /login`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login(\?|$)/);
  });
}

test("login page renders core form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel(/email|correo/i)).toBeVisible();
  await expect(page.getByLabel(/password|contraseña/i)).toBeVisible();
});
