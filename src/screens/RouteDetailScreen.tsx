import React, { useEffect } from "react";
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
import { SAFETY_NOTICE } from "../constants";
import { useRoutes } from "../context/RoutesContext";

type Props = NativeStackScreenProps<RootStackParamList, "RouteDetail">;

export function RouteDetailScreen({ route, navigation }: Props) {
  const { routeId } = route.params;
  const { getById, joinRoute, leaveRoute, isJoinedRoute } = useRoutes();
  const r = getById(routeId);
  const joined = r ? isJoinedRoute(r.id) : false;

  useEffect(() => {
    navigation.setOptions({ title: "线路详情" });
  }, [navigation]);

  if (!r) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>线路不存在</Text>
      </View>
    );
  }

  const full = r.joined >= r.maxSpots;

  const onJoin = () => {
    if (joined) {
      leaveRoute(r.id);
      return;
    }
    const ok = joinRoute(r.id);
    if (!ok) Alert.alert("名额已满", "报名人数已达上限。");
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <Text style={styles.badge}>溜车线路</Text>
      <Text style={styles.title}>{r.title}</Text>
      {r.routeMeta ? <Text style={styles.meta}>{r.routeMeta}</Text> : null}
      <Text style={styles.meta}>{r.dateLabel}</Text>
      <Text style={styles.loc}>{r.meetingPoint}</Text>
      <View style={styles.row}>
        <Text style={styles.muted}>发起人</Text>
        <Text style={styles.val}>{r.organizer}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.muted}>报名</Text>
        <Text style={styles.val}>
          {r.joined}/{r.maxSpots} 人
        </Text>
      </View>
      <Text style={styles.section}>线路说明</Text>
      <Text style={styles.desc}>{r.description}</Text>
      <LegalTipBanner />
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>提示</Text>
        <Text style={styles.noticeBody}>{SAFETY_NOTICE}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.cta,
          full && !joined && styles.ctaOff,
          pressed && styles.ctaPressed,
        ]}
        onPress={onJoin}
        disabled={full && !joined}
      >
        <Text style={styles.ctaText}>
          {joined ? "取消报名" : full ? "名额已满" : "报名一起溜车（免费）"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  body: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    alignSelf: "flex-start",
    color: "#a5b4fc",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#312e81",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  meta: { color: "#cbd5e1", fontSize: 15, marginBottom: 6 },
  loc: { color: "#94a3b8", fontSize: 14, lineHeight: 20, marginBottom: 14 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  muted: { color: "#64748b", fontSize: 14 },
  val: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  section: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
  },
  desc: { color: "#cbd5e1", fontSize: 15, lineHeight: 22 },
  notice: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  noticeTitle: { color: "#94a3b8", fontSize: 12, marginBottom: 6 },
  noticeBody: { color: "#64748b", fontSize: 13, lineHeight: 19 },
  cta: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaOff: { backgroundColor: "#475569" },
  ctaPressed: { opacity: 0.92 },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
