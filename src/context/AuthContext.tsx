import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "../types";

const STORAGE_KEY = "@wuhanperf/authSession";

/** 演示环境固定验证码，接入真实短信后删除 */
export const DEMO_SMS_CODE = "123456";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (
    phone: string,
    displayName: string,
    smsCode: string
  ) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizePhone(raw: string): string {
  return raw.replace(/\s/g, "");
}

function validatePhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive || !raw) return;
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.id && parsed?.phone && parsed?.displayName) {
          setUser(parsed);
        }
      } catch {
        /* ignore */
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback(
    async (phoneRaw: string, displayNameRaw: string, smsCode: string) => {
      const phone = normalizePhone(phoneRaw);
      const displayName = displayNameRaw.trim();
      if (!validatePhone(phone)) {
        return { ok: false, message: "请输入 11 位中国大陆手机号" };
      }
      if (displayName.length < 2 || displayName.length > 24) {
        return { ok: false, message: "昵称请填写 2～24 个字" };
      }
      if (smsCode.trim() !== DEMO_SMS_CODE) {
        return {
          ok: false,
          message: `演示验证码为 ${DEMO_SMS_CODE}（未接真实短信服务）`,
        };
      }
      const next: AuthUser = {
        id: `usr_${phone}`,
        phone,
        displayName,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setUser(next);
      return { ok: true };
    },
    []
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut }),
    [user, ready, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
