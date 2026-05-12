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
import { useForum } from "../context/ForumContext";
import type { ForumPost } from "../types";

export function ForumListScreen() {
  const { posts } = useForum();
  const navigation = useNavigation();
  const stackNav =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.headerBtn}
          onPress={() => stackNav?.navigate("NewForumPost")}
        >
          <Text style={styles.headerBtnText}>发帖</Text>
        </Pressable>
      ),
    });
  }, [navigation, stackNav]);

  const openPost = (id: string) => {
    stackNav?.navigate("ForumDetail", { postId: id });
  };

  const renderItem = ({ item }: { item: ForumPost }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => openPost(item.id)}
    >
      <View style={styles.row}>
        <Text style={styles.author}>{item.authorName}</Text>
        <Text style={styles.time}>{item.createdLabel}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.preview} numberOfLines={2}>
        {item.body}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.listHead}>
            <Text style={styles.tagline}>辅助交流 · 主功能请用「地图」约溜车</Text>
            <LegalTipBanner />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>暂无帖子，点击右上角发帖</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  listHead: { marginBottom: 8, paddingTop: 4 },
  tagline: { color: "#64748b", fontSize: 13, marginBottom: 10 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardPressed: { opacity: 0.92 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  author: { color: "#94a3b8", fontSize: 13 },
  time: { color: "#64748b", fontSize: 12 },
  title: { color: "#f8fafc", fontSize: 16, fontWeight: "700", marginBottom: 6 },
  preview: { color: "#94a3b8", fontSize: 14, lineHeight: 20 },
  empty: { color: "#64748b", textAlign: "center", marginTop: 32 },
  headerBtn: { marginRight: 8, paddingVertical: 6, paddingHorizontal: 10 },
  headerBtnText: { color: "#fb923c", fontSize: 15, fontWeight: "700" },
});
