import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CruiseRoute } from "../types";
import { SEED_ROUTES } from "../data/seedRoutes";
import { useAuth } from "./AuthContext";
import { joinedRoutesStorageKey } from "../storage/joinedRoutes";

type RoutesContextValue = {
  routes: CruiseRoute[];
  getById: (id: string) => CruiseRoute | undefined;
  publishRoute: (
    input: Omit<CruiseRoute, "id" | "joined" | "ownerUserId"> & {
      ownerUserId: string;
    }
  ) => void;
  joinRoute: (id: string) => boolean;
  leaveRoute: (id: string) => void;
  isJoinedRoute: (id: string) => boolean;
};

const RoutesContext = React.createContext<RoutesContextValue | null>(null);

function makeId(): string {
  return `route-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function RoutesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user!.id;

  const [routes, setRoutes] = useState<CruiseRoute[]>(() => [...SEED_ROUTES]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [hydratedJoined, setHydratedJoined] = useState(false);
  const joinedRef = useRef<string[]>([]);

  useEffect(() => {
    joinedRef.current = joinedIds;
  }, [joinedIds]);

  useEffect(() => {
    let cancelled = false;
    setHydratedJoined(false);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(joinedRoutesStorageKey(userId));
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed)) {
            const next = parsed.filter((x) => typeof x === "string");
            joinedRef.current = next;
            setJoinedIds(next);
          } else {
            joinedRef.current = [];
            setJoinedIds([]);
          }
        } else {
          joinedRef.current = [];
          setJoinedIds([]);
        }
      } catch {
        if (!cancelled) {
          joinedRef.current = [];
          setJoinedIds([]);
        }
      } finally {
        if (!cancelled) setHydratedJoined(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!hydratedJoined) return;
    AsyncStorage.setItem(
      joinedRoutesStorageKey(userId),
      JSON.stringify(joinedIds)
    ).catch(() => {});
  }, [userId, joinedIds, hydratedJoined]);

  const getById = useCallback(
    (id: string) => routes.find((r) => r.id === id),
    [routes]
  );

  const publishRoute = useCallback(
    (
      input: Omit<CruiseRoute, "id" | "joined" | "ownerUserId"> & {
        ownerUserId: string;
      }
    ) => {
      const { ownerUserId, ...rest } = input;
      const next: CruiseRoute = {
        ...rest,
        id: makeId(),
        joined: 0,
        ownerUserId,
      };
      setRoutes((prev) => [next, ...prev]);
    },
    []
  );

  const joinRoute = useCallback((id: string): boolean => {
    if (joinedRef.current.includes(id)) return false;
    let ok = false;
    setRoutes((prev) => {
      const t = prev.find((e) => e.id === id);
      if (!t || t.joined >= t.maxSpots) return prev;
      ok = true;
      return prev.map((e) =>
        e.id === id ? { ...e, joined: e.joined + 1 } : e
      );
    });
    if (ok) {
      setJoinedIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        joinedRef.current = next;
        return next;
      });
    }
    return ok;
  }, []);

  const leaveRoute = useCallback((id: string) => {
    if (!joinedRef.current.includes(id)) return;
    setRoutes((prev) =>
      prev.map((e) => {
        if (e.id !== id || e.joined <= 0) return e;
        return { ...e, joined: e.joined - 1 };
      })
    );
    setJoinedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      joinedRef.current = next;
      return next;
    });
  }, []);

  const isJoinedRoute = useCallback(
    (id: string) => joinedIds.includes(id),
    [joinedIds]
  );

  const value = useMemo(
    () => ({
      routes,
      getById,
      publishRoute,
      joinRoute,
      leaveRoute,
      isJoinedRoute,
    }),
    [routes, getById, publishRoute, joinRoute, leaveRoute, isJoinedRoute]
  );

  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  );
}

export function useRoutes(): RoutesContextValue {
  const ctx = useContext(RoutesContext);
  if (!ctx) throw new Error("useRoutes must be used within RoutesProvider");
  return ctx;
}
