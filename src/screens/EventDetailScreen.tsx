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
import { CATEGORY_LABEL, SAFETY_NOTICE } from "../constants";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { useEvents } from "../context/EventsContext";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetail">;

export function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const { getById, joinEvent, leaveEvent, isJoined } = useEvents();
  const event = getById(eventId);
  const iJoined = event ? isJoined(event.id) : false;

  useEffect(() => {
    navigation.setOptions({ title: "活动详情" });
  }, [navigation]);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>活动不存在或已删除</Text>
      </View>
    );
  }

  const full = event.joined >= event.maxSpots;

  const onJoinPress = () => {
    if (iJoined) {
      leaveEvent(event.id);
      return;
    }
    const ok = joinEvent(event.id);
    if (!ok) {
      Alert.alert("名额已满", "报名人数已达上限。");
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <Text style={styles.badge}>{CATEGORY_LABEL[event.category]}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>{event.dateLabel}</Text>
      <Text style={styles.location}>{event.location}</Text>
      <View style={styles.row}>
        <Text style={styles.muted}>发起人</Text>
        <Text style={styles.value}>{event.organizer}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.muted}>报名</Text>
        <Text style={styles.value}>
          {event.joined}/{event.maxSpots} 人
        </Text>
      </View>
      <Text style={styles.section}>活动说明</Text>
      <Text style={styles.desc}>{event.description}</Text>
      <LegalTipBanner />
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>提示</Text>
        <Text style={styles.noticeBody}>{SAFETY_NOTICE}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.cta,
          full && !iJoined && styles.ctaDisabled,
          pressed && styles.ctaPressed,
        ]}
        onPress={onJoinPress}
        disabled={full && !iJoined}
      >
        <Text style={styles.ctaText}>
          {iJoined ? "取消报名" : full ? "名额已满" : "报名（免费）"}
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
    color: "#fdba74",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#431407",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  meta: { color: "#cbd5e1", fontSize: 15, marginBottom: 6 },
  location: { color: "#94a3b8", fontSize: 14, lineHeight: 20, marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  muted: { color: "#64748b", fontSize: 14 },
  value: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  section: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  desc: { color: "#cbd5e1", fontSize: 15, lineHeight: 22 },
  notice: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  noticeTitle: { color: "#94a3b8", fontSize: 12, marginBottom: 6 },
  noticeBody: { color: "#64748b", fontSize: 13, lineHeight: 19 },
  cta: {
    marginTop: 24,
    backgroundColor: "#ea580c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#475569" },
  ctaPressed: { opacity: 0.9 },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
