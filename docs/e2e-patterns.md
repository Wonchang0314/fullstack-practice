# E2E 테스트 패턴 가이드

이 프로젝트의 Playwright E2E 테스트 작성 시 따를 패턴과 주의사항.

---

## 설정 구조

**`client/playwright.config.ts`**

```ts
webServer: [
  { command: 'yarn dev', cwd: '../server', port: 4000, reuseExistingServer: true },
  { command: 'yarn dev', cwd: '.',         port: 5173, reuseExistingServer: true },
]
```

- `webServer` 배열로 server(4000) + client(5173) 동시 기동
- `reuseExistingServer: true` — 이미 떠 있는 서버를 재사용 (로컬 개발 중 테스트 반복 시 빠름)
- 실행: `yarn test:e2e` (client 디렉토리에서)

---

## 로케이터 전략

CSS 클래스나 DOM 인덱스 대신 **의미론적 식별자**를 사용한다.

| 나쁜 예 | 좋은 예 | 이유 |
|---|---|---|
| `.grid.grid-cols-4` | `getByRole('region', { name: '통계 카드' })` | 스타일 변경에 무관 |
| `tbody tr` | `getByRole('table', { name: '상품 목록' }).getByRole('row')` | 테이블 의미 명시 |
| `locator('.bg-emerald-100')` | `table.getByText('판매중')` | 색상 클래스 변경에 무관 |
| `td:nth(3)` | 헤더 텍스트로 인덱스 동적 계산 (아래 참고) | 컬럼 추가/순서 변경에 무관 |

### 컴포넌트별 aria 속성 현황

```
StatsCards   → <div role="region" aria-label="통계 카드">
ProductTable → <table aria-label="상품 목록">
Pagination   → <nav aria-label="페이지네이션">
```

- `<div>`에 `aria-label`만 붙이면 스크린리더가 무시 → `role="region"` 필수
- `<table>`, `<nav>` 등 semantic 태그는 role 내장 → `aria-label`만으로 충분

---

## 비동기 렌더링 주의사항

이 앱은 **Suspense + React Query** 구조라 `goto('/')` 직후 fallback("로딩 중...")만 있고 테이블은 DOM에 없다.

### 자동 대기가 있는 메서드 vs 없는 메서드

| 구분 | 메서드 | 동작 |
|---|---|---|
| **자동 대기 (auto-retry)** | `expect(...).toBeVisible()` `expect(...).toHaveCount()` `click()` `fill()` | 조건이 충족될 때까지 재시도 |
| **즉시 평가 (no wait)** | `allTextContents()` `textContent()` `count()` `getAttribute()` | 현재 DOM 상태를 즉시 스냅샷 |

**즉시 평가 메서드를 쓰기 전에는 반드시 auto-retry 메서드로 먼저 대기해야 한다.**

### 권장 패턴: `toHaveCount` 선행

```ts
const headers = table.getByRole('columnheader');

// ✅ toHaveCount는 auto-retry — 테이블이 늦게 떠도 기다리고, 구조 변경도 감지
await expect(headers).toHaveCount(COLUMN_COUNT);

// 이후 allTextContents()는 DOM이 준비된 상태에서 실행됨
const headerTexts = await headers.allTextContents();
const priceIndex = headerTexts.map((t) => t.trim()).indexOf('가격');
```

`waitFor()` 대신 `toHaveCount`를 쓰는 이유:
1. 대기 + 검증을 한 번에 처리 (컬럼 수 변경 시 즉시 실패로 구조 변경 감지)
2. 실패 메시지가 더 명확 ("expected 7, got 0" vs 막연한 timeout)

### 실패 사례 (이 프로젝트 트러블슈팅 기록)

```
Suspense fallback 상태에서 allTextContents() 호출
  → 빈 배열 반환
  → indexOf('가격') = -1
  → nth(-1) = Playwright에서 .last()와 동일
  → 마지막 컬럼(등록일)을 잡아 테스트 실패
```

---

## 컬럼 인덱스 동적 계산 패턴

컬럼 위치를 하드코딩하지 않고 헤더 텍스트로 찾는다.

```ts
const COLUMN_COUNT = 7; // 상단에 상수로 선언 — 컬럼 추가 시 여기만 수정

const headers = table.getByRole('columnheader');
await expect(headers).toHaveCount(COLUMN_COUNT);     // 구조 검증 + 대기
const headerTexts = await headers.allTextContents();
const priceIndex = headerTexts.map((t) => t.trim()).indexOf('가격');
expect(priceIndex, '"가격" 컬럼을 찾지 못함').toBeGreaterThanOrEqual(0); // 방어 검증

const firstDataRow = table.getByRole('row').nth(1);
await expect(firstDataRow.getByRole('cell').nth(priceIndex)).toContainText('₩');
```
