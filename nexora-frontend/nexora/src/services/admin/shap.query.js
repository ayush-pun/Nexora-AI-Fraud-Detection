import { useQuery } from "@tanstack/react-query";
import { getGlobalShap } from "./shap.service";

export const useGlobalShap = () => {
  return useQuery({
    queryKey: ["shap-global"],
    queryFn: getGlobalShap,
    retry: false,
  });
};