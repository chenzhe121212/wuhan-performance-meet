import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { VERIFICATION_COPY } from "../constants";
import type { VerificationKind, VerificationStatus } from "../types";
import { useVerification } from "../context/VerificationContext";

const ORDER: VerificationKind[] = [
  "driver_license",
  "vehicle_license",
  "id_card",
];

function statusLabel(s: VerificationStatus): string {
  switch (s) {
    case "verified":
      return "已通过";
    case "pending":
      return "审核中";
    case "rejected":
      return "未通过";
    default:
      return "未认证";
  }
}

function statusColor(s: VerificationStatus): string {
  switch (s) {
    case "verified":
      return "#4ade80";
    case "pending":
      return "#fbbf24";
    case "rejected":
      return "#f87171";
    default:
      return "#94a3b8";
  }
}

export function VerificationCenterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bundle, allVerified } = useVerification();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <Text style={styles.title}>认证中心</Text>
      <Text style={styles.sub}>
        演示流程：提交后约 2 秒自动通过。正式环境请对接阿里云实人 / OCR 与合规存证。
      </Text>
      <LegalTipBanner />
      {allVerified ? (
        <View style={styles.done}>
          <Text style={styles.doneText}>三项认证均已完成（演示）</Text>
        </View>
      ) : null}
      {ORDER.map((kind) => {
        const copy = VERIFICATION_COPY[kind];
        const st = bundle[kind].status;
        return (
          <Pressable
            key={kind}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() =>
              navigation.navigate("VerificationDetail", { kind })
            }
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{copy.title}</Text>
              <Text style={[styles.status, { color: statusColor(st) }]}>
                {statusLabel(st)}
              </Text>
            </View>
            <Text style={styles.blurb} numberOfLines={2}>
              {copy.blurb}
            </Text>
            <Text style={styles.tap}>查看 / 提交 ›</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  body: { padding: 20, paddingBottom: 40 },
  title: { color: "#f8fafc", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  sub: { color: "#64748b", fontSize: 14, lineHeight: 20, marginBottom: 12 },
  done: {
    backgroundColor: "#14532d",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#166534",
  },
  doneText: { color: "#bbf7d0", fontSize: 14, fontWeight: "600" },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardPressed: { opacity: 0.94 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { color: "#f8fafc", fontSize: 17, fontWeight: "700", flex: 1 },
  status: { fontSize: 13, fontWeight: "700" },
  blurb: { color: "#94a3b8", fontSize: 13, lineHeight: 18 },
  tap: { color: "#fb923c", fontSize: 13, marginTop: 10, fontWeight: "600" },
});
