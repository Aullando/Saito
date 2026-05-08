// Smoke: anonymous navigation should redirect any protected RGCC route to /login.
import { test, expect } from "@playwright/test";

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

test("login page renders demo role selector", async ({ page }) => {
  await page.goto("/login");
  // El login demo expone un selector de rol, no email/password.
  await expect(page.getByText(/Selecciona un rol/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Entrar/i })).toBeVisible();
});
