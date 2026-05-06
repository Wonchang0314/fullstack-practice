import { useQuery } from '@tanstack/react-query';
import { getProductsOptions } from '../client/@tanstack/react-query.gen';

export const useProducts = (page: number, pageSize: number) =>
  useQuery(getProductsOptions({ query: { page, pageSize } }));
