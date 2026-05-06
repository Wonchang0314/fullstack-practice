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

## 실행 방법

### 1. 백엔드 (`server/`)

```bash
cd server
npm install
npx prisma db push    # SQLite 스키마 생성
npm run db:seed       # 더미 데이터 100건 시드
npm run dev           # http://localhost:4000
```

### 2. 프론트엔드 (`client/`)

```bash
cd client
npm install
npm run dev           # http://localhost:5173
```

브라우저에서 `http://localhost:5173`에 접속하면 대시보드가 표시된다. 클라이언트 dev 서버는 `/api` 요청을 백엔드(:4000)로 프록시한다.

### 빌드

```bash
# 백엔드
cd server && npm run build && npm start

# 프론트엔드
cd client && npm run build
```

## 환경 변수

- `client/.env` (선택)
  - `VITE_API_BASE_URL` — 백엔드 베이스 URL. 비워두면 `/api`(개발용 프록시)를 사용.
- `server/.env`
  - `DATABASE_URL` — 기본 `file:./dev.db` (SQLite).

## 진행 상황

단계별 체크리스트는 [`progress.md`](./progress.md) 참고.
