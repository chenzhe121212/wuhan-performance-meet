import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ForumPost } from "../types";
import { SEED_FORUM } from "../data/seedForum";
import { FORUM_POSTS_STORAGE_KEY } from "../storage/forumPosts";
import { useAuth } from "./AuthContext";

type ForumContextValue = {
  posts: ForumPost[];
  getPostById: (id: string) => ForumPost | undefined;
  addPost: (title: string, body: string) => void;
};

const ForumContext = React.createContext<ForumContextValue | null>(null);

function makePostId(): string {
  return `fp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(SEED_FORUM);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FORUM_POSTS_STORAGE_KEY);
        if (!alive) return;
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.filter(
              (p): p is ForumPost =>
                p &&
                typeof p === "object" &&
                typeof (p as ForumPost).id === "string" &&
                typeof (p as ForumPost).title === "string"
            );
            if (cleaned.length) setPosts(cleaned);
          }
        }
      } catch {
        /* keep seed */
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback(async (next: ForumPost[]) => {
    await AsyncStorage.setItem(
      FORUM_POSTS_STORAGE_KEY,
      JSON.stringify(next)
    );
  }, []);

  const getPostById = useCallback(
    (id: string) => posts.find((p) => p.id === id),
    [posts]
  );

  const addPost = useCallback(
    (title: string, body: string) => {
      const t = title.trim();
      const b = body.trim();
      if (!t || !b) return;
      const nextPost: ForumPost = {
        id: makePostId(),
        authorId: user.id,
        authorName: user.displayName,
        title: t,
        body: b,
        createdLabel: "刚刚",
      };
      setPosts((prev) => [nextPost, ...prev]);
    },
    [user.displayName, user.id]
  );

  useEffect(() => {
    if (!ready) return;
    void persist(posts);
  }, [posts, persist, ready]);

  const value = useMemo(
    () => ({ posts, getPostById, addPost }),
    [posts, getPostById, addPost]
  );

  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
}

export function useForum(): ForumContextValue {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error("useForum must be used within ForumProvider");
  return ctx;
}
