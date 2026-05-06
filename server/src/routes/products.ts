import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { registry } from '../lib/openapi';
import {
  ProductSchema,
  ProductsQuerySchema,
  ProductsResponseSchema,
  ProductStatsResponseSchema,
} from '../schemas/product.schema';

const router = Router();

registry.registerPath({
  method: 'get',
  path: '/products/stats',
  summary: '상품 상태별 통계',
  tags: ['Products'],
  responses: {
    200: {
      description: '상태별 상품 수',
      content: { 'application/json': { schema: ProductStatsResponseSchema } },
    },
  },
});

router.get('/stats', async (_req: Request, res: Response) => {
  const groups = await prisma.product.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  const countOf = (status: string) =>
    groups.find((g) => g.status === status)?._count.status ?? 0;

  res.json({
    total: groups.reduce((sum, g) => sum + g._count.status, 0),
    selling: countOf('SELLING'),
    outOfStock: countOf('OUT_OF_STOCK'),
    discontinued: countOf('DISCONTINUED'),
  });
});

registry.registerPath({
  method: 'get',
  path: '/products',
  summary: '상품 목록 (페이지네이션)',
  tags: ['Products'],
  request: {
    query: ProductsQuerySchema,
  },
  responses: {
    200: {
      description: '상품 목록',
      content: { 'application/json': { schema: ProductsResponseSchema } },
    },
    400: {
      description: '잘못된 쿼리 파라미터',
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }).openapi('ErrorResponse'),
        },
      },
    },
  },
});

router.get('/', async (req: Request, res: Response) => {
  // 기존 수동 parseInt + if문 검증을 Zod safeParse로 대체.
  // 스키마에 coerce + min/max가 선언되어 있어 검증 로직 중복을 제거한다.
  const result = ProductsQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({ error: 'page는 1 이상, pageSize는 1~100 사이여야 합니다.' });
    return;
  }

  const { page, pageSize } = result.data;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'asc' },
    }),
    prisma.product.count(),
  ]);

  res.json({ items, total, page, pageSize });
});

export default router;
