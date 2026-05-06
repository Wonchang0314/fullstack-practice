# CLAUDE.md

## 작업 현황 파악

새 대화를 시작하거나 컨텍스트가 없을 때는 반드시 `progress.md`를 먼저 읽어 현재 단계와 완료된 항목을 파악한다.

```
Read: /home/wchang101/projects/mission/progress.md
```

- 체크된 항목(`[x]`)은 완료, 미체크(`[ ]`)는 미완료
- 현재 진행 중인 Step은 미완료 항목이 남아 있는 가장 앞 Step
- 세부 코드 예시는 `~/.claude/plans/c-users-wchang101-downloads-2-statics-vi-generic-candy.md` 참고

## 패키지 관리자

- **server**: `yarn` 사용 (`yarn add`, `yarn add -D`, `yarn test` 등)
- **client**: `yarn` 사용 (`yarn add`, `yarn add -D`, `yarn dev` 등)
- `npm` 명령어 사용 금지

## 진행 원칙

- 단계별로 실행 → 보고 → 사용자 승인 → 다음 Step 순서를 지킨다
- 각 Step 완료 시 `progress.md`의 해당 체크박스를 `[x]`로 업데이트한다
- 의사결정 분기(기술 선택, 구조 변경 등)는 임의로 결정하지 않고 사용자에게 질문한다

## 프로젝트 구조

```
mission/
├── progress.md
├── server/                         # Express + Prisma + TypeScript (포트 4000)
│   └── src/
│       ├── index.ts                # 진입점, /api-docs (Swagger UI), /api-spec.json (raw JSON)
│       ├── routes/products.ts      # GET /api/products, GET /api/products/stats
│       ├── schemas/product.schema.ts  # Zod 스키마 (타입 + OpenAPI 등록 일원화)
│       ├── lib/openapi.ts          # Registry 싱글톤 + 스펙 생성
│       └── lib/prisma.ts
└── client/                         # Vite + React + TypeScript + TailwindCSS
    ├── openapi-ts.config.ts        # hey-api 설정 (input: /api-spec.json → output: src/api)
    └── src/
        ├── api/                    # hey-api 자동 생성 (yarn api:gen으로 재생성)
        │   ├── types.gen.ts        # Product, ProductsResponse 등 타입
        │   ├── sdk.gen.ts          # getProducts(), getProductsStats() API 함수
        │   └── @tanstack/react-query.gen.ts  # getProductsOptions() 등 query options
        ├── hooks/
        │   ├── useProducts.ts      # useQuery(getProductsOptions(...))
        │   └── useProductStats.ts  # useQuery(getProductsStatsOptions())
        └── lib/queryClient.ts      # QueryClient 기본 설정
```

## API 작업 시 참고

- **서버 스키마 변경** → `server/src/schemas/product.schema.ts` 수정 후 서버 재시작
- **클라이언트 타입 동기화** → 서버 실행 중 `cd client && yarn api:gen` 실행 (`src/api/` 재생성)
- **새 API 엔드포인트 추가** 시: ① Zod 스키마 정의 → ② `registry.registerPath()` 등록 → ③ `yarn api:gen`
