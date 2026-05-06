import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductsOptions } from "../api/@tanstack/react-query.gen";

export const useProducts = (page: number, pageSize: number) =>
  useSuspenseQuery(getProductsOptions({ query: { page, pageSize } }));
