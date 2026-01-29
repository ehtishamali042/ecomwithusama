import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/authApi";

export function useGetMeQuery() {
  return useQuery({ queryKey: ["me"], queryFn: getMe });
}
