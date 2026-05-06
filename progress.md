# 진행 현황 (Progress)

상품 관리 대시보드 풀스택 프로젝트의 단계별 체크리스트.
세부 코드/예시는 `~/.claude/plans/c-users-wchang101-downloads-2-statics-vi-generic-candy.md` 참고.

---

## Step 1 — 루트 초기화
- [ ] `.gitignore` 작성 (node_modules, dist, .env, *.db 등)
- [ ] `README.md` 작성 (개요·실행/시드/빌드 방법)
- [ ] (선택) `git init`
- [ ] 결과 보고 후 다음 Step 승인 받기

## Step 2 — 서버 셋업 (`server/`)
- [ ] `npm init` 및 `package.json` 스크립트 정의
- [ ] 런타임/개발 의존성 설치 (express, cors, prisma, typescript, tsx 등)
- [ ] `tsconfig.json` 구성
- [ ] Prisma 초기화 (SQLite 데이터소스)
- [ ] `Product` 모델 스키마 정의
- [ ] 시드 스크립트 작성 — 디자인 통계(전체 100/판매중 62/품절 28/단종 10)에 맞춘 더미 100건
- [ ] DB 푸시 + 시딩 실행 및 검증
- [ ] 결과 보고 후 다음 Step 승인 받기

## Step 3 — 서버 API 구현
- [ ] PrismaClient 싱글톤 모듈
- [ ] `GET /api/products/stats` — 상태별 카운트
- [ ] `GET /api/products?page&pageSize` — 페이지네이션 목록 + 입력 검증
- [ ] CORS·미들웨어·서버 진입점 구성 (포트 4000)
- [ ] `curl`로 두 엔드포인트 응답 검증
- [ ] 결과 보고 후 다음 Step 승인 받기

## Step 4 — 클라이언트 셋업 (`client/`)
- [ ] Vite + React + TypeScript 템플릿으로 스캐폴드
- [ ] 런타임/개발 의존성 설치 (TanStack Query, axios, Tailwind, postcss, autoprefixer)
- [ ] Tailwind 초기화 및 디렉티브 적용
- [ ] Vite 개발 프록시(`/api` → `:4000`) 설정
- [ ] `QueryClientProvider`로 앱 래핑
- [ ] dev 서버 부팅 확인
- [ ] 결과 보고 후 다음 Step 승인 받기

## Step 5 — 클라이언트 데이터 레이어
- [ ] 공통 타입 정의 (Product, ProductStatus, 응답 타입)
- [ ] `lib/httpClient.ts` — axios 인스턴스 (baseURL은 `VITE_API_BASE_URL` 우선, 없으면 `/api`)
- [ ] `.env.example` 추가
- [ ] `lib/queryClient.ts` — QueryClient 기본 설정
- [ ] `api/products.ts` — 도메인 API 함수
- [ ] `useProducts`, `useProductStats` 훅 구현
- [ ] 결과 보고 후 다음 Step 승인 받기

## Step 6 — UI 컴포넌트 & 대시보드 페이지
- [ ] `StatsCards` — 상태별 색상 매핑 포함
- [ ] `StatusBadge` — 판매중/품절/단종 3종
- [ ] `ProductTable` — 가격 포맷(₩) 및 날짜 포맷
- [ ] `Pagination` — 1·2·3·…·N 형태, 좌우 화살표
- [ ] `Dashboard` 페이지에서 위 컴포넌트 조합
- [ ] 디자인(`2.statics-view.png`)과 시각적으로 비교
- [ ] 결과 보고 후 다음 Step 승인 받기

## Step 7 — 통합 검증 & 마무리
- [ ] server/client 동시 구동
- [ ] 통계 카드 합계가 100과 일치
- [ ] 페이지네이션 동작 확인 (깜빡임 없는 전환)
- [ ] 가격/날짜/뱃지 색상이 디자인과 일치
- [ ] `client`·`server` 각각 `npm run build` 성공
- [ ] 최종 보고

---

## 메모
- 단계별 실행 → 보고 → 승인 → 다음 진행 원칙 유지
- 의사결정 분기는 임의로 결정하지 않고 질문
