import { useQuery } from "@tanstack/react-query";
import { getModelMetrics } from "./modelMetrics.service";

export const useModelMetrics = () => {
  return useQuery({
    queryKey: ["model-metrics"],
    queryFn: getModelMetrics,
    retry: false,
  });
};