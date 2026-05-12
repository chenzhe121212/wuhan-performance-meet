import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DEMO_SMS_CODE, useAuth } from "../context/AuthContext";
import { PILOT_CITY } from "../constants";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await signIn(phone, displayName, smsCode);
      if (!res.ok) setError(res.message ?? "登录失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.brand}>劲速武汉</Text>
        <Text style={styles.tagline}>{PILOT_CITY}试点 · 车友活动</Text>
        <Text style={styles.label}>手机号</Text>
        <TextInput
          style={styles.input}
          placeholder="11 位手机号"
          placeholderTextColor="#64748b"
          keyboardType="phone-pad"
          maxLength={11}
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.input}
          placeholder="在活动中展示的名字"
          placeholderTextColor="#64748b"
          value={displayName}
          onChangeText={setDisplayName}
          maxLength={24}
        />
        <Text style={styles.label}>验证码（演示）</Text>
        <TextInput
          style={styles.input}
          placeholder={`固定为 ${DEMO_SMS_CODE}`}
          placeholderTextColor="#64748b"
          keyboardType="number-pad"
          maxLength={6}
          value={smsCode}
          onChangeText={setSmsCode}
        />
        <Text style={styles.hint}>
          当前为本地演示登录，未接短信网关。接入后端后替换为真实验证码流程。
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={({ pressed }) => [
            styles.cta,
            (busy || pressed) && styles.ctaDim,
          ]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>登录 / 注册</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#0f172a" },
  scroll: { paddingHorizontal: 24, paddingTop: 72, paddingBottom: 40 },
  brand: { color: "#f97316", fontSize: 32, fontWeight: "800" },
  tagline: { color: "#94a3b8", fontSize: 15, marginTop: 8, marginBottom: 32 },
  label: { color: "#94a3b8", fontSize: 13, marginBottom: 8 },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#f8fafc",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  hint: { color: "#64748b", fontSize: 12, lineHeight: 18, marginBottom: 8 },
  error: { color: "#f87171", fontSize: 14, marginBottom: 12 },
  cta: {
    marginTop: 12,
    backgroundColor: "#ea580c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDim: { opacity: 0.85 },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
