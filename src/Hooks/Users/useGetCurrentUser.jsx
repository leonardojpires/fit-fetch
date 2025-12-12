// Deprecated: use `src/hooks/useCurrentUser` instead
import useCurrentUser from "../useCurrentUser";

export default function useGetCurrentUser() {
  const { user, loading } = useCurrentUser();
  return { user, loadingUser: loading };
}