// tests/e2e/login.spec.js
const { test, expect } = require('@playwright/test');

test('admin login flow', async ({ page }) => {
  // Cambia la URL por la de tu entorno si es diferente
  await page.goto('http://localhost:3000/login');

  // Rellena el formulario de login
  await page.fill('input[name="email"]', 'admin@warranty.com'); // Cambia por el email real de tu admin
  await page.fill('input[name="password"]', '123456'); // Cambia por la contraseña real

  // Envía el formulario
  await page.click('button[type="submit"]');

  // Espera a que la URL cambie al dashboard
  await expect(page).toHaveURL(/.*\/admin\/dashboard/);

  // Opcional: verifica que aparece algún texto del dashboard
  await expect(page.locator('h1')).toContainText('Dashboard');
});
