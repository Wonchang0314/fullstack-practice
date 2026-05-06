import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

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

router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string) || 1;
  const pageSize = parseInt(req.query['pageSize'] as string) || 10;

  if (page < 1 || pageSize < 1 || pageSize > 100) {
    res.status(400).json({ error: 'page는 1 이상, pageSize는 1~100 사이여야 합니다.' });
    return;
  }

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
