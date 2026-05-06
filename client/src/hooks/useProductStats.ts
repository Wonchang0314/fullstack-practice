import { useQuery } from '@tanstack/react-query';
import { getProductsStatsOptions } from '../client/@tanstack/react-query.gen';

export const useProductStats = () =>
  useQuery(getProductsStatsOptions());
