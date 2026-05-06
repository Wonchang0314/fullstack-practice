import { useQuery } from "@tanstack/react-query";
import { getProductsStatsOptions } from "../api/@tanstack/react-query.gen";

export const useProductStats = () => useQuery(getProductsStatsOptions());
