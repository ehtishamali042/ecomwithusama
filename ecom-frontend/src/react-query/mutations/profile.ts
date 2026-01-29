import { updateProfile } from "@/api/profileApi";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProfileMutation() {
  return useMutation({ mutationFn: updateProfile });
}
