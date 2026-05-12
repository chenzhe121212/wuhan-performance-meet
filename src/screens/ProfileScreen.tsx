import React, { useMemo } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { PILOT_CITY, CATEGORY_LABEL, SAFETY_NOTICE } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import { useVerification } from "../context/VerificationContext";
import type {
  DriveEvent,
  VerificationBundle,
  VerificationKind,
} from "../types";

function shortV(bundle: VerificationBundle, k: VerificationKind): string {
  const s = bundle[k].status;
  if (s === "verified") return "✓";
  if (s === "pending") return "…";
  return "—";
}

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  const { events, isJoined } = useEvents();
  const { bundle, allVerified } = useVerification();
  const navigation = useNavigation();
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const sections = useMemo(() => {
    const createdList = events.filter((e) => e.ownerUserId === user.id);
    const joinedList = events.filter(
      (e) => isJoined(e.id) && !createdList.some((c) => c.id === e.id)
    );
    return [
      { title: "我创建的活动", data: createdList },
      { title: "我报名的活动", data: joinedList },
    ];
  }, [events, user.id, isJoined]);

  const openDetail = (id: string) => {
    root?.navigate("EventDetail", { eventId: id });
  };

  const renderItem = ({ item }: { item: DriveEvent }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => openDetail(item.id)}
    >
      <View style={styles.cardTop}>
        <Text style={styles.badge}>{CATEGORY_LABEL[item.category]}</Text>
        <Text style={styles.spots}>
          {item.joined}/{item.maxSpots} 人
        </Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.meta}>{item.dateLabel}</Text>
    </Pressable>
  );

  const listHeader = (
    <>
      <Text style={styles.screenTitle}>我的</Text>
      <Pressable
        style={styles.verifyCard}
        onPress={() => root?.navigate("VerificationCenter")}
      >
        <View style={styles.verifyTop}>
          <Text style={styles.verifyTitle}>实名与车辆认证</Text>
          <Text style={styles.verifyLink}>进入 ›</Text>
        </View>
        <Text style={styles.verifyLine}>
          驾驶证 {shortV(bundle, "driver_license")} · 行驶证{" "}
          {shortV(bundle, "vehicle_license")} · 身份证{" "}
          {shortV(bundle, "id_card")}
        </Text>
        <Text style={styles.verifyHint}>
          {allVerified
            ? "三项均通过（演示），上线后需对接真实审核。"
            : "完成三项认证可提高约溜车信任度（演示流程）。"}
        </Text>
      </Pressable>
      <View style={styles.userCard}>
        <Text style={styles.nickname}>{user.displayName}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
        <Pressable style={styles.outBtn} onPress={() => void signOut()}>
          <Text style={styles.outBtnText}>退出登录</Text>
        </Pressable>
      </View>
    </>
  );

  const listFooter = (
    <View style={styles.footer}>
      <LegalTipBanner />
      <Text style={styles.cardTitleMuted}>试点城市</Text>
      <Text style={styles.highlight}>{PILOT_CITY}</Text>
      <Text style={styles.cardTitleMuted}>安全提示</Text>
      <Text style={styles.noticeSmall}>{SAFETY_NOTICE}</Text>
    </View>
  );

  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title, data } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{data.length} 场</Text>
        </View>
      )}
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? (
          <Text style={styles.sectionEmpty}>
            {section.title === "我创建的活动"
              ? "你还没有发布过活动。"
              : "暂无活动报名，去「活动」看看？"}
          </Text>
        ) : null
      }
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: "#0f172a" },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  screenTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 12,
  },
  verifyCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  verifyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  verifyTitle: { color: "#f8fafc", fontSize: 16, fontWeight: "700" },
  verifyLink: { color: "#fb923c", fontSize: 14, fontWeight: "700" },
  verifyLine: { color: "#cbd5e1", fontSize: 14, marginBottom: 6 },
  verifyHint: { color: "#64748b", fontSize: 12, lineHeight: 17 },
  userCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  nickname: { color: "#f8fafc", fontSize: 18, fontWeight: "700" },
  phone: { color: "#94a3b8", fontSize: 14, marginTop: 4 },
  outBtn: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#475569",
  },
  outBtnText: { color: "#cbd5e1", fontSize: 14, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 4,
    marginBottom: 10,
  },
  sectionTitle: { color: "#f8fafc", fontSize: 16, fontWeight: "700" },
  sectionCount: { color: "#64748b", fontSize: 13 },
  sectionEmpty: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 14,
    marginTop: -4,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardPressed: { opacity: 0.92 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    color: "#fdba74",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#431407",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  spots: { color: "#94a3b8", fontSize: 12 },
  cardTitle: { color: "#f8fafc", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  meta: { color: "#64748b", fontSize: 13 },
  footer: { marginTop: 8, paddingBottom: 8 },
  cardTitleMuted: { color: "#94a3b8", fontSize: 13, marginTop: 16, marginBottom: 6 },
  highlight: { color: "#f97316", fontSize: 17, fontWeight: "700", marginBottom: 8 },
  noticeSmall: { color: "#64748b", fontSize: 12, lineHeight: 18 },
});
