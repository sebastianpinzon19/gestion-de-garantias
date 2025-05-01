# Test info

- Name: admin login flow
- Location: C:\Users\sebas\Desktop\react\gestion-de-garantias\tests\e2e\login.spec.js:4:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

    at C:\Users\sebas\Desktop\react\gestion-de-garantias\tests\e2e\login.spec.js:6:14
```

# Test source

```ts
   1 | // tests/e2e/login.spec.js
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | test('admin login flow', async ({ page }) => {
   5 |   // Cambia la URL por la de tu entorno si es diferente
>  6 |   await page.goto('http://localhost:3000/login');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
   7 |
   8 |   // Rellena el formulario de login
   9 |   await page.fill('input[name="email"]', 'admin@example.com'); // Cambia por el email real de tu admin
  10 |   await page.fill('input[name="password"]', 'tu_contraseña'); // Cambia por la contraseña real
  11 |
  12 |   // Envía el formulario
  13 |   await page.click('button[type="submit"]');
  14 |
  15 |   // Espera a que la URL cambie al dashboard
  16 |   await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  17 |
  18 |   // Opcional: verifica que aparece algún texto del dashboard
  19 |   await expect(page.locator('h1')).toContainText('Dashboard');
  20 | });
  21 |
```