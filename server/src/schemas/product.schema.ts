import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// zod-to-openapi가 z.string().openapi() 같은 메서드를 인식하려면
// 앱 전체에서 단 한 번 이 확장 호출이 선행되어야 한다.
// 다른 파일보다 먼저 import 되는 진입점 역할이므로 스키마 파일 최상단에 둔다.
extendZodWithOpenApi(z);

export const ProductStatusSchema = z
  .enum(['SELLING', 'OUT_OF_STOCK', 'DISCONTINUED'])
  .openapi({ example: 'SELLING' });

export const ProductSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: '무선 이어폰' }),
    category: z.string().openapi({ example: '전자기기' }),
    price: z.number().int().openapi({ example: 45000 }),
    stock: z.number().int().openapi({ example: 150 }),
    status: ProductStatusSchema,
    createdAt: z.string().datetime().openapi({ example: '2025-03-15T10:30:00.000Z' }),
  })
  .openapi('Product');

export const ProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).openapi({ example: 10 }),
});

export const ProductsResponseSchema = z
  .object({
    items: z.array(ProductSchema),
    total: z.number().int().openapi({ example: 100 }),
    page: z.number().int().openapi({ example: 1 }),
    pageSize: z.number().int().openapi({ example: 10 }),
  })
  .openapi('ProductsResponse');

export const ProductStatsResponseSchema = z
  .object({
    total: z.number().int().openapi({ example: 100 }),
    selling: z.number().int().openapi({ example: 62 }),
    outOfStock: z.number().int().openapi({ example: 28 }),
    discontinued: z.number().int().openapi({ example: 10 }),
  })
  .openapi('ProductStatsResponse');

// 기존 types/product.ts의 수동 interface 정의를 대체한다.
// 스키마와 타입을 한 곳에서 관리해 스펙-코드 간 drift를 방지한다.
export type ProductStatus = z.infer<typeof ProductStatusSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductsQuery = z.infer<typeof ProductsQuerySchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
export type ProductStatsResponse = z.infer<typeof ProductStatsResponseSchema>;
