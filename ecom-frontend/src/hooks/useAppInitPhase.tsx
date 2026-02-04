import { useAppStore } from "@/store/appStore";
import { useInitUser } from "./useInitUser";

export function useAppInitPhase() {
  const { initPhase, phaseMessage } = useAppStore();
  const { initUser } = useInitUser();
  return { initPhase, phaseMessage, initUser };
}
