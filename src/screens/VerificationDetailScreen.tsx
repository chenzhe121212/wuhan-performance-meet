import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { VERIFICATION_COPY } from "../constants";
import { useVerification } from "../context/VerificationContext";

type Props = NativeStackScreenProps<RootStackParamList, "VerificationDetail">;

export function VerificationDetailScreen({ route, navigation }: Props) {
  const { kind } = route.params;
  const { bundle, submitDemo } = useVerification();
  const entry = bundle[kind];
  const copy = VERIFICATION_COPY[kind];
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: copy.title });
  }, [navigation, copy.title]);

  const onSubmit = () => {
    if (entry.status === "verified") {
      Alert.alert("已完成", "该项已通过认证（演示）。");
      return;
    }
    if (entry.status === "pending") {
      Alert.alert("审核中", "请稍候，演示环境约 2 秒内自动通过。");
      return;
    }
    if (!agree) {
      Alert.alert("请勾选", "需确认信息真实、合法后方可提交。");
      return;
    }
    submitDemo(kind);
    Alert.alert("已提交", "演示审核中，请稍候返回上一页查看状态。");
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <Text style={styles.blurb}>{copy.blurb}</Text>
      <LegalTipBanner />
      <View style={styles.mock}>
        <Text style={styles.mockTitle}>演示上传</Text>
        <Text style={styles.mockBody}>
          正式版将调用相机/相册并加密上传至阿里云 OSS，经服务端 OCR
          与实人比对后更新状态。此处不采集真实证件图像。
        </Text>
        <Pressable
          style={styles.mockBtn}
          onPress={() =>
            Alert.alert("演示", "已模拟选择证件照片（未实际上传）。")
          }
        >
          <Text style={styles.mockBtnText}>模拟选择证件照片</Text>
        </Pressable>
      </View>
      <Pressable style={styles.checkRow} onPress={() => setAgree((v) => !v)}>
        <View style={[styles.box, agree && styles.boxOn]} />
        <Text style={styles.checkText}>
          本人承诺所提交信息真实、合法，车辆不存在非法改装用于上道路行驶等情形；不存在酒后驾车等违法行为。
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.cta,
          (entry.status === "verified" || entry.status === "pending") &&
            styles.ctaDisabled,
        ]}
        onPress={onSubmit}
        disabled={entry.status === "verified" || entry.status === "pending"}
      >
        <Text style={styles.ctaText}>
          {entry.status === "verified"
            ? "已通过"
            : entry.status === "pending"
              ? "审核中…"
              : "提交认证（演示）"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  body: { padding: 20, paddingBottom: 40 },
  blurb: { color: "#cbd5e1", fontSize: 15, lineHeight: 22, marginBottom: 14 },
  mock: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  mockTitle: { color: "#f8fafc", fontWeight: "700", marginBottom: 8 },
  mockBody: { color: "#94a3b8", fontSize: 13, lineHeight: 19, marginBottom: 12 },
  mockBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#334155",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  mockBtnText: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  checkRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#64748b",
    marginRight: 12,
    marginTop: 2,
  },
  boxOn: { backgroundColor: "#ea580c", borderColor: "#ea580c" },
  checkText: { flex: 1, color: "#94a3b8", fontSize: 13, lineHeight: 20 },
  cta: {
    backgroundColor: "#ea580c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#475569" },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
