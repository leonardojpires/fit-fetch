import { useUser } from "../contexts/UserContext.jsx";

export default function useCurrentUser() {
  return useUser();
}
