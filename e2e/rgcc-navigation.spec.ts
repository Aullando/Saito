// Authenticated RGCC flow usando el login demo (Zustand persist en localStorage).
// No requiere email/password ni Supabase.
import { test, expect } from "@playwright/test";

// Inyecta currentUserId + override de club RGCC antes de cargar la app, para
// que el ClubProvider y el AuthProvider se inicialicen ya autenticados como
// el usuario demo correspondiente y con el club rgcc activo.
async function loginAs(page: import("@playwright/test").Page, userId: string) {
  await page.addInitScript(
    ({ uid }) => {
      try {
        localStorage.setItem(
          "saito-auth",
          JSON.stringify({
            state: { currentUserId: uid, avatars: {}, sidebarCollapsed: false },
            version: 0,
          }),
        );
        localStorage.setItem(
          "saito-active-club",
          JSON.stringify({ state: { overrideClubId: "rgcc" }, version: 0 }),
        );
      } catch {
        /* ignore */
      }
    },
    { uid: userId },
  );
}

test.describe("RGCC navigation (login demo)", () => {
  test("u-tec ve Mis clases / Mi Día / Mis sesiones EP", async ({ page }) => {
    await loginAs(page, "u-tec");

    await page.goto("/rgcc/clases");
    await expect(page).toHaveURL(/\/rgcc\/clases/);
    await expect(page.getByText(/Mis clases/i).first()).toBeVisible();

    await page.goto("/rgcc/mi-dia");
    await expect(page).toHaveURL(/\/rgcc\/mi-dia/);
    await expect(page.getByText(/Mi Día/i).first()).toBeVisible();

    await page.goto("/rgcc/entrenamiento-personal");
    await expect(page).toHaveURL(/\/rgcc\/entrenamiento-personal/);
    await expect(page.getByText(/Mis sesiones EP/i).first()).toBeVisible();
  });

  test("u-med ve Marta Fernández / RGCC-04212", async ({ page }) => {
    await loginAs(page, "u-med");
    await page.goto("/rgcc/mi-dia");
    await expect(page.getByText(/Marta Fernández/).first()).toBeVisible();
    await expect(page.getByText(/RGCC-04212/).first()).toBeVisible();
  });

  test("u-med ve “Fuerza glúteo” y NO ve “Cardio + core express”", async ({ page }) => {
    await loginAs(page, "u-med");
    await page.goto("/rgcc/entrenamiento-personal");
    await expect(page.getByText(/Fuerza glúteo/).first()).toBeVisible();
    await expect(page.getByText(/Cardio \+ core express/)).toHaveCount(0);
  });
});
