import React, { useLayoutEffect } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { PILOT_CITY } from "../constants";
import { useRoutes } from "../context/RoutesContext";
import type { CruiseRoute } from "../types";

export function RoutesListScreen() {
  const { routes } = useRoutes();
  const navigation = useNavigation();
  const stackNav =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.headerBtn}
          onPress={() => stackNav?.navigate("PublishRoute")}
        >
          <Text style={styles.headerBtnText}>发布线路</Text>
        </Pressable>
      ),
    });
  }, [navigation, stackNav]);

  const openDetail = (id: string) => {
    stackNav?.navigate("RouteDetail", { routeId: id });
  };

  const renderItem = ({ item }: { item: CruiseRoute }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => openDetail(item.id)}
    >
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>溜车线路</Text>
        <Text style={styles.spots}>
          {item.joined}/{item.maxSpots} 人
        </Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      {item.routeMeta ? (
        <Text style={styles.meta}>{item.routeMeta}</Text>
      ) : null}
      <Text style={styles.meta}>{item.dateLabel}</Text>
      <Text style={styles.muted} numberOfLines={2}>
        {item.meetingPoint}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.head}>
            <Text style={styles.city}>{PILOT_CITY} · 结伴溜车</Text>
            <Text style={styles.sub}>报名同行 · 请守法驾驶</Text>
            <LegalTipBanner />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>暂无线路，点击右上角发布</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  head: { marginBottom: 8, paddingHorizontal: 4, paddingTop: 4 },
  city: { color: "#f97316", fontSize: 18, fontWeight: "700" },
  sub: { color: "#94a3b8", fontSize: 13, marginTop: 4, marginBottom: 10 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardPressed: { opacity: 0.92 },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    color: "#a5b4fc",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#312e81",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  spots: { color: "#94a3b8", fontSize: 13 },
  title: { color: "#f8fafc", fontSize: 17, fontWeight: "700", marginBottom: 6 },
  meta: { color: "#cbd5e1", fontSize: 14, marginBottom: 4 },
  muted: { color: "#64748b", fontSize: 13, lineHeight: 18 },
  empty: { color: "#64748b", textAlign: "center", marginTop: 40 },
  headerBtn: { marginRight: 4, paddingVertical: 6, paddingHorizontal: 8 },
  headerBtnText: { color: "#fb923c", fontSize: 14, fontWeight: "700" },
});
