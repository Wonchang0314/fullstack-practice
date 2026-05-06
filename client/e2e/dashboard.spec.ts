import { test, expect } from '@playwright/test';

test.describe('대시보드 통합 검증', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('통계 카드 4개가 렌더되고 합계가 100이다', async ({ page }) => {
    const statsSection = page.getByLabel('통계 카드');
    await expect(statsSection.getByText('전체 상품')).toBeVisible();
    await expect(statsSection.getByText('판매중')).toBeVisible();
    await expect(statsSection.getByText('품절')).toBeVisible();
    await expect(statsSection.getByText('단종')).toBeVisible();
    await expect(statsSection.getByText('100', { exact: true })).toBeVisible();
    await expect(statsSection.getByText('62', { exact: true })).toBeVisible();
    await expect(statsSection.getByText('28', { exact: true })).toBeVisible();
    await expect(statsSection.getByText('10', { exact: true })).toBeVisible();
  });

  test('테이블에 10개 행이 표시된다', async ({ page }) => {
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(10);
  });

  test('페이지네이션 범위 텍스트가 표시된다', async ({ page }) => {
    await expect(page.getByText('1–10 / 100건')).toBeVisible();
  });

  test('페이지 2 클릭 시 데이터가 갱신된다', async ({ page }) => {
    const firstRowPage1 = await page.locator('tbody tr:first-child td:first-child').textContent();

    await page.getByRole('button', { name: '2' }).click();
    await expect(page.getByText('11–20 / 100건')).toBeVisible();

    const firstRowPage2 = await page.locator('tbody tr:first-child td:first-child').textContent();
    expect(firstRowPage1).not.toBe(firstRowPage2);
  });

  test('판매중 뱃지가 초록색 클래스를 가진다', async ({ page }) => {
    const badge = page.locator('.bg-emerald-100').first();
    await expect(badge).toBeVisible();
  });

  test('가격이 ₩ 형식으로 표시된다', async ({ page }) => {
    const priceCell = page.locator('tbody tr:first-child td').nth(3);
    await expect(priceCell).toContainText('₩');
  });
});
