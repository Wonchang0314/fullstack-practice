# CLAUDE.md

## 작업 현황 파악

새 대화를 시작하거나 컨텍스트가 없을 때는 반드시 `progress.md`를 먼저 읽어 현재 단계와 완료된 항목을 파악한다.

```
Read: /home/wchang101/projects/mission/progress.md
```

- 체크된 항목(`[x]`)은 완료, 미체크(`[ ]`)는 미완료
- 현재 진행 중인 Step은 미완료 항목이 남아 있는 가장 앞 Step
- 세부 코드 예시는 `~/.claude/plans/c-users-wchang101-downloads-2-statics-vi-generic-candy.md` 참고

## 진행 원칙

- 단계별로 실행 → 보고 → 사용자 승인 → 다음 Step 순서를 지킨다
- 각 Step 완료 시 `progress.md`의 해당 체크박스를 `[x]`로 업데이트한다
- 의사결정 분기(기술 선택, 구조 변경 등)는 임의로 결정하지 않고 사용자에게 질문한다

## 프로젝트 구조

```
mission/
├── progress.md       # 단계별 작업 체크리스트 (항상 최신 상태 유지)
├── README.md
├── server/           # Express + Prisma + TypeScript (포트 4000)
└── client/           # Vite + React + TypeScript + TailwindCSS
```
