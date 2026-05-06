# 진행 현황 (Progress)

상품 관리 대시보드 풀스택 프로젝트의 단계별 체크리스트.
세부 코드/예시는 `~/.claude/plans/c-users-wchang101-downloads-2-statics-vi-generic-candy.md` 참고.

---

## Step 1 — 루트 초기화
- [x] `.gitignore` 작성 (node_modules, dist, .env, *.db 등)
- [x] `README.md` 작성 (개요·실행/시드/빌드 방법)
- [x] (선택) `git init`
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 2 — 서버 셋업 (`server/`)
- [x] `npm init` 및 `package.json` 스크립트 정의
- [x] 런타임/개발 의존성 설치 (express, cors, prisma, typescript, tsx 등)
- [x] `tsconfig.json` 구성
- [x] Prisma 초기화 (SQLite 데이터소스)
- [x] `Product` 모델 스키마 정의
- [x] 시드 스크립트 작성 — 디자인 통계(전체 100/판매중 62/품절 28/단종 10)에 맞춘 더미 100건
- [x] DB 푸시 + 시딩 실행 및 검증
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 3 — 서버 API 구현
- [x] PrismaClient 싱글톤 모듈
- [x] `GET /api/products/stats` — 상태별 카운트
- [x] `GET /api/products?page&pageSize` — 페이지네이션 목록 + 입력 검증
- [x] CORS·미들웨어·서버 진입점 구성 (포트 4000)
- [x] `curl`로 두 엔드포인트 응답 검증
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 3.5 — 서버 OpenAPI 스펙 & Swagger UI

> Step 3의 수동 타입 정의를 Zod 스키마로 교체하고, 스펙을 자동 생성해 Swagger UI로 서빙

- [x] 패키지 설치 (`@asteasolutions/zod-to-openapi`, `zod`, `swagger-ui-express`, `@types/swagger-ui-express`)
- [x] `src/schemas/product.schema.ts` — Zod 스키마 정의 (Product, ProductStatus, 응답 타입)
- [x] `src/lib/openapi.ts` — OpenApiGeneratorV3 + Registry 설정
- [x] 각 라우트에 `registry.registerPath()` 추가
- [x] `GET /api-docs` 엔드포인트 추가 (swagger-ui-express)
- [x] 기존 `src/types/product.ts` 제거 후 Zod 스키마에서 타입 추론으로 대체
- [x] 브라우저에서 `/api-docs` 접속 확인
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 4 — 클라이언트 셋업 (`client/`)
- [x] Vite + React + TypeScript 템플릿으로 스캐폴드
- [x] 런타임/개발 의존성 설치 (TanStack Query, axios, Tailwind, postcss, autoprefixer)
- [x] Tailwind 초기화 및 디렉티브 적용
- [x] Vite 개발 프록시(`/api` → `:4000`) 설정
- [x] `QueryClientProvider`로 앱 래핑
- [x] dev 서버 부팅 확인
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 5 — 클라이언트 데이터 레이어 (hey-api)
- [x] `@hey-api/openapi-ts` + `@hey-api/client-axios` 설치
- [x] `openapi-ts.config.ts` 작성 (input: `/api-spec.json`)
- [x] `package.json`에 `api:gen` 스크립트 추가
- [x] `yarn api:gen` 실행 → `src/client/` 자동 생성 (types, sdk, TanStack Query options)
- [x] `useProducts`, `useProductStats` 훅 구현
- [x] `src/App.tsx` broken imports 제거
- [x] `yarn build` 성공 확인
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 6 — UI 컴포넌트 & 대시보드 페이지
- [x] `StatsCards` — 상태별 색상 매핑 포함
- [x] `StatusBadge` — 판매중/품절/단종 3종
- [x] `ProductTable` — 가격 포맷(₩) 및 날짜 포맷
- [x] `Pagination` — 1·2·3·…·N 형태, 좌우 화살표
- [x] `Dashboard` 페이지에서 위 컴포넌트 조합
- [x] 디자인(`2.statics-view.png`)과 시각적으로 비교
- [x] 결과 보고 후 다음 Step 승인 받기

## Step 7 — 통합 검증 & 마무리
- [x] server/client 동시 구동
- [x] 통계 카드 합계가 100과 일치 (백엔드 단위 테스트 + E2E 검증)
- [x] 페이지네이션 동작 확인 (깜빡임 없는 전환) (E2E 검증)
- [x] 가격/날짜/뱃지 색상이 디자인과 일치 (E2E 검증)
- [x] `client`·`server` 각각 `yarn build` 성공
- [x] 최종 보고

---

## 메모
- 단계별 실행 → 보고 → 승인 → 다음 진행 원칙 유지
- 의사결정 분기는 임의로 결정하지 않고 질문
