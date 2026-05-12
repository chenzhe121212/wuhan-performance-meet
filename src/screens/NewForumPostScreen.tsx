import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { useForum } from "../context/ForumContext";

type Props = NativeStackScreenProps<RootStackParamList, "NewForumPost">;

export function NewForumPostScreen({ navigation }: Props) {
  const { addPost } = useForum();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: "发帖" });
  }, [navigation]);

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("请填写", "标题与正文不能为空。");
      return;
    }
    addPost(title, body);
    Alert.alert("已发布", "帖子已出现在论坛列表。", [
      { text: "好的", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <LegalTipBanner />
      <Text style={styles.label}>标题</Text>
      <TextInput
        style={styles.input}
        placeholder="一句话说明主题"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>正文</Text>
      <TextInput
        style={[styles.input, styles.tall]}
        placeholder="交流改装、路况、约车等（请遵守法律法规）"
        placeholderTextColor="#64748b"
        value={body}
        onChangeText={setBody}
        multiline
      />
      <Pressable style={styles.cta} onPress={submit}>
        <Text style={styles.ctaText}>发布</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  body: { padding: 20, paddingBottom: 40 },
  label: { color: "#94a3b8", fontSize: 13, marginBottom: 8, marginTop: 8 },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f8fafc",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  tall: { minHeight: 160, textAlignVertical: "top" },
  cta: {
    marginTop: 24,
    backgroundColor: "#ea580c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
