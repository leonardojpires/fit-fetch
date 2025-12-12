    // Deprecated: use `src/hooks/useCurrentUser` instead
    import useCurrentUser from "../useCurrentUser";

    export default function useGetUserInformation() {
      const { user } = useCurrentUser();
      return user;
    }