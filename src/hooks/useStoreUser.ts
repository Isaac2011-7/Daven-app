import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";

export type StoreUserStatus = "waiting" | "saved" | "error";

/** Saves the signed-in user in the Convex users table after login. */
export function useStoreUser() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName ?? undefined;
  const [status, setStatus] = useState<StoreUserStatus>("waiting");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    storeUser({ email, name })
      .then(() => setStatus("saved"))
      .catch((err: unknown) => {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Could not save user.");
      });
  }, [isAuthenticated, user, email, name, storeUser]);

  return { status, errorMessage, convexLoading: isLoading, convexAuthenticated: isAuthenticated };
}
