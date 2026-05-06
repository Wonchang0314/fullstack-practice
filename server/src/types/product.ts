export type ProductStatus = 'SELLING' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductStatsResponse {
  total: number;
  selling: number;
  outOfStock: number;
  discontinued: number;
}
