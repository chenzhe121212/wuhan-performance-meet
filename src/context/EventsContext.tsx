import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DriveEvent } from "../types";
import { SEED_EVENTS } from "../data/seedEvents";
import { useAuth } from "./AuthContext";
import { joinedEventsStorageKey } from "../storage/joinedEvents";

type EventsContextValue = {
  events: DriveEvent[];
  getById: (id: string) => DriveEvent | undefined;
  publishEvent: (
    input: Omit<DriveEvent, "id" | "joined" | "ownerUserId"> & {
      ownerUserId: string;
    }
  ) => void;
  joinEvent: (id: string) => boolean;
  leaveEvent: (id: string) => void;
  isJoined: (id: string) => boolean;
};

const EventsContext = React.createContext<EventsContextValue | null>(null);

function makeId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user!.id;

  const [events, setEvents] = useState<DriveEvent[]>(() => [...SEED_EVENTS]);
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
        const raw = await AsyncStorage.getItem(joinedEventsStorageKey(userId));
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
      joinedEventsStorageKey(userId),
      JSON.stringify(joinedIds)
    ).catch(() => {});
  }, [userId, joinedIds, hydratedJoined]);

  const getById = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events]
  );

  const publishEvent = useCallback(
    (
      input: Omit<DriveEvent, "id" | "joined" | "ownerUserId"> & {
        ownerUserId: string;
      }
    ) => {
      const { ownerUserId, ...rest } = input;
      const next: DriveEvent = {
        ...rest,
        id: makeId(),
        joined: 0,
        ownerUserId,
      };
      setEvents((prev) => [next, ...prev]);
    },
    []
  );

  const joinEvent = useCallback((id: string): boolean => {
    if (joinedRef.current.includes(id)) return false;
    let ok = false;
    setEvents((prev) => {
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

  const leaveEvent = useCallback((id: string) => {
    if (!joinedRef.current.includes(id)) return;
    setEvents((prev) =>
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

  const isJoined = useCallback(
    (id: string) => joinedIds.includes(id),
    [joinedIds]
  );

  const value = useMemo(
    () => ({
      events,
      getById,
      publishEvent,
      joinEvent,
      leaveEvent,
      isJoined,
    }),
    [events, getById, publishEvent, joinEvent, leaveEvent, isJoined]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents(): EventsContextValue {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
