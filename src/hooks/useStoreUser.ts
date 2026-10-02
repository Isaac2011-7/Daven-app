import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";

export type StoreUserStatus = "waiting" | "saved" | "error";

type StoreUserState = {
  identityKey: string | null;
  status: StoreUserStatus;
  errorMessage: string;
};

/** Saves the signed-in user in the Convex users table after login. */
export function useStoreUser() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const { user } = useUser();
  const userId = user?.id;
  const name = user?.fullName ?? undefined;
  const identityKey = isAuthenticated && userId ? userId : null;
  const [storeState, setStoreState] = useState<StoreUserState>({
    identityKey,
    status: "waiting",
    errorMessage: "",
  });

  if (storeState.identityKey !== identityKey) {
    setStoreState({ identityKey, status: "waiting", errorMessage: "" });
  }

  useEffect(() => {
    if (!identityKey || !userId) {
      return;
    }
    let cancelled = false;
    storeUser({ name })
      .then(() => {
        if (!cancelled) {
          setStoreState((current) =>
            current.identityKey === identityKey
              ? { ...current, status: "saved", errorMessage: "" }
              : current,
          );
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setStoreState((current) =>
            current.identityKey === identityKey
              ? {
                  ...current,
                  status: "error",
                  errorMessage: err instanceof Error ? err.message : "Could not save user.",
                }
              : current,
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [identityKey, userId, name, storeUser]);

  const status = storeState.identityKey === identityKey ? storeState.status : "waiting";
  const errorMessage = storeState.identityKey === identityKey ? storeState.errorMessage : "";

  return { status, errorMessage, convexLoading: isLoading, convexAuthenticated: isAuthenticated };
}
