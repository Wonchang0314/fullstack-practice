import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductsStatsOptions } from "../api/@tanstack/react-query.gen";

export const useProductStats = () => useSuspenseQuery(getProductsStatsOptions());
