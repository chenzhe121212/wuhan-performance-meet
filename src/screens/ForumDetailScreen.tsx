import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { useForum } from "../context/ForumContext";

type Props = NativeStackScreenProps<RootStackParamList, "ForumDetail">;

export function ForumDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { getPostById } = useForum();
  const post = getPostById(postId);

  useEffect(() => {
    navigation.setOptions({ title: "帖子" });
  }, [navigation]);

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>帖子不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <Text style={styles.meta}>
        {post.authorName} · {post.createdLabel}
      </Text>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.bodyText}>{post.body}</Text>
      <LegalTipBanner />
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
  muted: { color: "#64748b" },
  meta: { color: "#94a3b8", fontSize: 14, marginBottom: 12 },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
  },
  bodyText: { color: "#e2e8f0", fontSize: 16, lineHeight: 24 },
});
