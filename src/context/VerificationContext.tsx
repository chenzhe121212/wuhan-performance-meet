import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { VerificationBundle, VerificationKind } from "../types";
import { verificationStorageKey } from "../storage/verificationState";
import { useAuth } from "./AuthContext";

const DEFAULT_BUNDLE: VerificationBundle = {
  driver_license: { status: "none" },
  vehicle_license: { status: "none" },
  id_card: { status: "none" },
};

function mergeBundle(raw: unknown): VerificationBundle {
  const b = { ...DEFAULT_BUNDLE };
  if (!raw || typeof raw !== "object") return b;
  const o = raw as Record<string, VerificationEntryLike>;
  (["driver_license", "vehicle_license", "id_card"] as const).forEach((k) => {
    const e = o[k];
    if (e && typeof e === "object" && typeof e.status === "string") {
      b[k] = { status: e.status as VerificationBundle[typeof k]["status"], updatedAt: e.updatedAt };
    }
  });
  return b;
}

type VerificationEntryLike = { status: string; updatedAt?: string };

type VerificationContextValue = {
  bundle: VerificationBundle;
  submitDemo: (kind: VerificationKind) => void;
  allVerified: boolean;
};

const VerificationContext =
  React.createContext<VerificationContextValue | null>(null);

const pendingTimers = new Map<VerificationKind, ReturnType<typeof setTimeout>>();

export function VerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userId = user!.id;
  const [bundle, setBundle] = useState<VerificationBundle>(DEFAULT_BUNDLE);
  const bundleRef = useRef(bundle);
  useEffect(() => {
    bundleRef.current = bundle;
  }, [bundle]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(verificationStorageKey(userId));
        if (!alive || !raw) return;
        setBundle(mergeBundle(JSON.parse(raw)));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  const persist = useCallback(
    async (next: VerificationBundle) => {
      await AsyncStorage.setItem(
        verificationStorageKey(userId),
        JSON.stringify(next)
      );
    },
    [userId]
  );

  const submitDemo = useCallback(
    (kind: VerificationKind) => {
      const cur = bundleRef.current[kind];
      if (cur.status === "verified" || cur.status === "pending") return;

      const tPrev = pendingTimers.get(kind);
      if (tPrev) clearTimeout(tPrev);

      const now = new Date().toISOString();
      setBundle((prev) => {
        const next = {
          ...prev,
          [kind]: { status: "pending" as const, updatedAt: now },
        };
        void persist(next);
        return next;
      });

      const t = setTimeout(() => {
        setBundle((prev) => {
          const next = {
            ...prev,
            [kind]: {
              status: "verified" as const,
              updatedAt: new Date().toISOString(),
            },
          };
          void persist(next);
          return next;
        });
        pendingTimers.delete(kind);
      }, 1800);
      pendingTimers.set(kind, t);
    },
    [persist]
  );

  const allVerified = useMemo(
    () =>
      bundle.driver_license.status === "verified" &&
      bundle.vehicle_license.status === "verified" &&
      bundle.id_card.status === "verified",
    [bundle]
  );

  const value = useMemo(
    () => ({ bundle, submitDemo, allVerified }),
    [bundle, submitDemo, allVerified]
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification(): VerificationContextValue {
  const ctx = useContext(VerificationContext);
  if (!ctx)
    throw new Error("useVerification must be used within VerificationProvider");
  return ctx;
}
