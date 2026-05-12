import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { PILOT_CITY, CATEGORY_LABEL } from "../constants";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { useEvents } from "../context/EventsContext";
import type { DriveEvent } from "../types";

export function EventsScreen() {
  const { events } = useEvents();
  const navigation = useNavigation();
  const root = navigation.getParent<NavigationProp<RootStackParamList>>();

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
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.dateLabel}</Text>
      <Text style={styles.metaMuted} numberOfLines={2}>
        {item.location}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.listHead}>
            <View style={styles.header}>
              <Text style={styles.city}>{PILOT_CITY}试点</Text>
              <Text style={styles.sub}>性能车车友活动 · 守法出行</Text>
            </View>
            <LegalTipBanner />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>暂无活动，去「发布」创建一个吧</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  listHead: { marginBottom: 8 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  city: { color: "#f97316", fontSize: 22, fontWeight: "700" },
  sub: { color: "#94a3b8", fontSize: 13, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardPressed: { opacity: 0.92 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    color: "#fdba74",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#431407",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  spots: { color: "#94a3b8", fontSize: 13 },
  title: { color: "#f8fafc", fontSize: 17, fontWeight: "700", marginBottom: 6 },
  meta: { color: "#cbd5e1", fontSize: 14, marginBottom: 4 },
  metaMuted: { color: "#64748b", fontSize: 13, lineHeight: 18 },
  empty: { color: "#64748b", textAlign: "center", marginTop: 40, fontSize: 15 },
});
