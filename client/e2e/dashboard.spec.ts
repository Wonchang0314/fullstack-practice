import { test, expect } from '@playwright/test';

test.describe('대시보드 통합 검증', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('통계 카드 4개가 렌더되고 합계가 100이다', async ({ page }) => {
    const statsSection = page.getByRole('region', { name: '통계 카드' });
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
    const table = page.getByRole('table', { name: '상품 목록' });
    const rows = table.getByRole('row').filter({ has: page.locator('td') });
    await expect(rows).toHaveCount(10);
  });

  test('페이지네이션 범위 텍스트가 표시된다', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: '페이지네이션' });
    await expect(nav.getByText('1–10 / 100건')).toBeVisible();
  });

  test('페이지 2 클릭 시 데이터가 갱신된다', async ({ page }) => {
    const table = page.getByRole('table', { name: '상품 목록' });
    const nav = page.getByRole('navigation', { name: '페이지네이션' });

    const firstRowPage1 = await table.getByRole('row').nth(1).getByRole('cell').first().textContent();

    await nav.getByRole('button', { name: '2' }).click();
    await expect(nav.getByText('11–20 / 100건')).toBeVisible();

    const firstRowPage2 = await table.getByRole('row').nth(1).getByRole('cell').first().textContent();
    expect(firstRowPage1).not.toBe(firstRowPage2);
  });

  test('판매중 뱃지가 테이블에 표시된다', async ({ page }) => {
    const table = page.getByRole('table', { name: '상품 목록' });
    await expect(table.getByText('판매중').first()).toBeVisible();
  });

  test('가격이 ₩ 형식으로 표시된다', async ({ page }) => {
    const table = page.getByRole('table', { name: '상품 목록' });

    // 컬럼 순서가 바뀌거나 새 컬럼이 추가돼도 헤더 텍스트로 위치를 찾으므로 nth(고정값) 의존 없음
    // allTextContents()는 waitFor를 하지 않으므로 헤더가 DOM에 나타날 때까지 명시적으로 대기
    await table.locator('thead th').first().waitFor();
    const headerTexts = await table.locator('thead th').allTextContents();
    const priceIndex = headerTexts.map((t) => t.trim()).indexOf('가격');

    const firstDataRow = table.getByRole('row').nth(1);
    await expect(firstDataRow.getByRole('cell').nth(priceIndex)).toContainText('₩');
  });
});
