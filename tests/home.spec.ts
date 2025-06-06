import { test, expect } from '@playwright/test';

test('homepage имеет заголовок приложения', async ({ page }) => {
  // Переходим на главную страницу
  await page.goto('/');
  // Проверяем title страницы (SSR)
  await expect(page).toHaveTitle('Ассистент по охране труда');
});