import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/dashboardApi";

export function useDashboardStatsQuery() {
  return useQuery({ queryKey: ["dashboardStats"], queryFn: getDashboardStats });
}
