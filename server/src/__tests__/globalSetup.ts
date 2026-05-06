import { execSync } from 'child_process';
import { unlinkSync, existsSync } from 'fs';

const TEST_DB = './prisma/test.db';
const ENV = { ...process.env, DATABASE_URL: `file:${TEST_DB}` };

export async function setup() {
  // 기존 test.db 삭제 후 새로 생성 — --force-reset 없이도 신규 파일엔 push 가능
  if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  execSync('npx prisma db push', { env: ENV, stdio: 'pipe' });
  execSync('npx tsx prisma/seed.ts', { env: ENV, stdio: 'pipe' });
}

export async function teardown() {
  if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
}
