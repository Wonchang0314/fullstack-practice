import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { faker } from '@faker-js/faker';

const adapter = new PrismaBetterSqlite3({ url: process.env['DATABASE_URL'] ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const SELLING = 'SELLING';
const OUT_OF_STOCK = 'OUT_OF_STOCK';
const DISCONTINUED = 'DISCONTINUED';

const CATEGORY_POOL: Record<string, { names: string[]; minPrice: number; maxPrice: number }> = {
  전자기기: {
    names: [
      '무선 이어폰', '블루투스 스피커', '스마트워치', '기계식 키보드', '무선 마우스',
      '노이즈캔슬링 헤드폰', '웹캠', 'USB 허브', '외장 SSD', '보조배터리',
      '스마트 전구', '태블릿 거치대', '미니 프로젝터', '스마트 플러그', '전동 칫솔',
      '홈 CCTV', '스마트 체중계', '노트북 쿨링 패드', 'MP3 플레이어', '스마트 도어벨',
    ],
    minPrice: 15000,
    maxPrice: 500000,
  },
  의류: {
    names: [
      '캐시미어 코트', '린넨 셔츠', '데님 재킷', '면 반팔 티셔츠', '러닝화',
      '니트 가디건', '슬랙스', '플리스 집업', '크로스백', '스포츠 레깅스',
      '정장 셔츠', '청바지', '후드 집업', '트렌치코트', '울 코트',
      '레인코트', '샌들', '스키 장갑', '벨벳 블레이저', '와이드 청바지',
    ],
    minPrice: 10000,
    maxPrice: 350000,
  },
  식품: {
    names: [
      '유기농 견과류', '현미 그래놀라', '엑스트라버진 올리브오일', '아몬드 500g', '유기농 녹차 잎',
      '천연 벌꿀 500g', '오트밀 1kg', '프로틴 파우더 1kg', '코코넛 오일 500ml', '퀴노아 500g',
      '치아씨드 300g', '말린 블루베리 200g', '아보카도 오일 250ml', '마카다미아 200g', '그릭 요거트 500ml',
      '유기농 현미 2kg', '저당 잼 250g', '유기농 원두 200g', '탄산수 메이커 캡슐', '천연 꿀 드링크',
    ],
    minPrice: 5000,
    maxPrice: 80000,
  },
  도서: {
    names: [
      '클린 코드', '리팩터링', '파이썬 완벽 가이드', '디자인 패턴', '알고리즘 문제풀이',
      '클린 아키텍처', '자바스크립트 딥다이브', '데이터베이스 설계', '스타트업 바이블', '마케팅 불변의 법칙',
      'UX 라이팅 가이드', '경제학 원론', '철학의 위안', '역사란 무엇인가', '절판 한정판 만화',
      '구버전 기술 교재', 'TypeScript 핸드북', 'Node.js 교과서', 'AWS 입문서', '시스템 설계 면접',
    ],
    minPrice: 10000,
    maxPrice: 60000,
  },
  생활용품: {
    names: [
      'LED 스탠드', '무선 충전기', '스테인레스 텀블러 500ml', '대나무 칫솔 4개입', '욕실 정리함',
      '다용도 클리너 스프레이', '실리콘 주방용품 세트', '친환경 세제 1L', '패브릭 수납 바스켓', '전기 주전자 1.7L',
      '아로마 디퓨저', '캔들 3개 세트', '보온 도시락', '공기청정기 필터', '매트리스 토퍼',
      '수면 안대', '세라믹 냄비 세트', '유리 물병 1L', '천연 비누 세트', '레거시 부품 청소 키트',
    ],
    minPrice: 5000,
    maxPrice: 150000,
  },
};

const CATEGORIES = Object.keys(CATEGORY_POOL);

function generateProduct(status: string) {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const { names, minPrice, maxPrice } = CATEGORY_POOL[category];

  const price = faker.number.int({ min: minPrice, max: maxPrice });
  // 100원 단위로 반올림
  const roundedPrice = Math.round(price / 100) * 100;

  let stock: number;
  if (status === SELLING) {
    stock = faker.number.int({ min: 1, max: 500 });
  } else if (status === OUT_OF_STOCK) {
    stock = 0;
  } else {
    // DISCONTINUED: 잔여 재고가 남아 있을 수 있음
    stock = faker.number.int({ min: 0, max: 50 });
  }

  return {
    name: faker.helpers.arrayElement(names),
    category,
    price: roundedPrice,
    stock,
    status,
    createdAt: faker.date.between({ from: '2023-01-01', to: '2025-03-31' }),
  };
}

async function main() {
  await prisma.product.deleteMany();

  const statusDistribution = [
    ...Array.from({ length: 62 }, () => generateProduct(SELLING)),
    ...Array.from({ length: 28 }, () => generateProduct(OUT_OF_STOCK)),
    ...Array.from({ length: 10 }, () => generateProduct(DISCONTINUED)),
  ];

  await prisma.product.createMany({ data: statusDistribution });

  const total        = await prisma.product.count();
  const selling      = await prisma.product.count({ where: { status: SELLING } });
  const outOfStock   = await prisma.product.count({ where: { status: OUT_OF_STOCK } });
  const discontinued = await prisma.product.count({ where: { status: DISCONTINUED } });

  console.log(`시드 완료: 전체 ${total} / 판매중 ${selling} / 품절 ${outOfStock} / 단종 ${discontinued}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
