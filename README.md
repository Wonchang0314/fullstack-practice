# 상품 관리 대시보드 (Mission)

한 페이지짜리 상품 관리 대시보드. 통계 카드 4개와 페이지네이션이 있는 상품 목록 테이블을 제공한다.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프론트엔드 | Vite, React 18, TypeScript, Tailwind CSS, TanStack Query, axios |
| 백엔드 | Node.js, Express, TypeScript |
| DB / ORM | SQLite + Prisma |

## 폴더 구조

```
mission/
├── client/      # React + TS + Vite (포트 5173)
├── server/      # Express + TS + Prisma (포트 4000)
├── progress.md  # 단계별 진행 체크리스트
└── README.md
```

## 사전 준비

- Node.js 18+ 및 **Yarn (Classic, 1.x)** 사용. 이 프로젝트는 `npm`이 아닌 `yarn`을 사용한다.

## 실행 방법

### 1. 백엔드 (`server/`)

처음 셋업 시 한 번만:

```bash
cd server
yarn install
echo 'DATABASE_URL="file:./dev.db"' > .env   # Prisma CLI가 읽는 datasource URL
yarn generate                                 # prisma generate — Prisma Client 생성
yarn db:push                                  # SQLite 스키마(테이블) 생성
yarn db:seed                                  # 더미 데이터 100건 시드
```

이후부터는 다음만 실행:

```bash
yarn dev    # http://localhost:4000  (Swagger UI: /api-docs)
```

> 참고: Prisma 7 + driverAdapter 구성이라 런타임 클라이언트는 `.env`가 없어도 `file:./dev.db`로 폴백하지만, `prisma db push` 같은 CLI는 `.env`의 `DATABASE_URL`을 직접 읽으므로 위 파일이 반드시 필요하다. `yarn install`만 돌리고 `yarn generate`를 빠뜨리면 `@prisma/client` 모듈을 찾을 수 없다는 에러가 나니 주의.

### 2. 프론트엔드 (`client/`)

```bash
cd client
yarn install
yarn dev    # http://localhost:5173
```

브라우저에서 `http://localhost:5173`에 접속하면 대시보드가 표시된다. 클라이언트 dev 서버는 `/api` 요청을 백엔드(:4000)로 프록시한다.

서버 스키마를 수정한 뒤에는 백엔드가 떠 있는 상태에서 다음을 실행해 클라이언트 SDK/타입을 재생성한다:

```bash
cd client && yarn api:gen   # /api-spec.json → src/api/
```

### 빌드

```bash
# 백엔드
cd server && yarn build && yarn start

# 프론트엔드
cd client && yarn build
```

### 테스트

```bash
# 백엔드 단위 테스트 (Vitest)
cd server && yarn test

# E2E 테스트 (Playwright) — server/client 모두 띄운 상태에서 실행
cd client && yarn test:e2e
```

## 환경 변수

- `server/.env` (필수)
  - `DATABASE_URL` — Prisma CLI(`db push`, `migrate` 등)가 읽는 SQLite 경로. 기본값: `file:./dev.db`
- `client/.env` (선택)
  - `VITE_API_BASE_URL` — 백엔드 베이스 URL. 비워두면 `/api`(개발용 프록시)를 사용.

## 진행 상황

단계별 체크리스트는 [`progress.md`](./progress.md) 참고.
