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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { PILOT_CITY, SAFETY_NOTICE } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useRoutes } from "../context/RoutesContext";

export function PublishRouteScreen() {
  const { user } = useAuth();
  const { publishRoute } = useRoutes();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState("");
  const [routeMeta, setRouteMeta] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [maxSpots, setMaxSpots] = useState("12");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState(user.displayName);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: "发布溜车线路" });
  }, [navigation]);

  const submit = () => {
    if (!title.trim() || !dateLabel.trim() || !meetingPoint.trim()) {
      Alert.alert("请完善信息", "标题、时间与集合点为必填。");
      return;
    }
    const n = parseInt(maxSpots, 10);
    if (!Number.isFinite(n) || n < 2 || n > 200) {
      Alert.alert("人数无效", "人数上限请输入 2～200 之间的数字。");
      return;
    }
    if (!agree) {
      Alert.alert("请勾选确认", "需确认安全与合规提示后方可发布。");
      return;
    }
    const loc = meetingPoint.includes(PILOT_CITY)
      ? meetingPoint.trim()
      : `${PILOT_CITY} · ${meetingPoint.trim()}`;
    const organizerFinal = organizer.trim() || user.displayName;
    publishRoute({
      ownerUserId: user.id,
      title: title.trim(),
      routeMeta: routeMeta.trim() || undefined,
      dateLabel: dateLabel.trim(),
      meetingPoint: loc,
      maxSpots: n,
      description: description.trim() || "（暂无详细说明）",
      organizer: organizerFinal,
    });
    Alert.alert("发布成功", "线路已出现在「溜车线路」列表。", [
      {
        text: "好的",
        onPress: () => {
          navigation.navigate("Tabs", { screen: "线路" });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <LegalTipBanner />
      <Text style={styles.hint}>与「活动」区分：线路强调固定路程与集合编队，仍不收取报名费。</Text>
      <Text style={styles.label}>线路标题</Text>
      <TextInput
        style={styles.input}
        placeholder="例如：东湖绿道清晨舒缓溜车"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>路程说明（选填）</Text>
      <TextInput
        style={styles.input}
        placeholder="例如：约 35 km · 舒缓编队"
        placeholderTextColor="#64748b"
        value={routeMeta}
        onChangeText={setRouteMeta}
      />
      <Text style={styles.label}>出发时间（展示文案）</Text>
      <TextInput
        style={styles.input}
        placeholder="例如：6月2日 周日 07:00"
        placeholderTextColor="#64748b"
        value={dateLabel}
        onChangeText={setDateLabel}
      />
      <Text style={styles.label}>集合点</Text>
      <TextInput
        style={[styles.input, styles.tall]}
        placeholder="区、地标或停车场"
        placeholderTextColor="#64748b"
        value={meetingPoint}
        onChangeText={setMeetingPoint}
        multiline
      />
      <Text style={styles.label}>人数上限</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={maxSpots}
        onChangeText={setMaxSpots}
      />
      <Text style={styles.label}>线路说明</Text>
      <TextInput
        style={[styles.input, styles.tall]}
        placeholder="节奏、对讲/手台、是否可带副驾等"
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>发起人展示名</Text>
      <TextInput
        style={styles.input}
        placeholder={`默认「${user.displayName}」`}
        placeholderTextColor="#64748b"
        value={organizer}
        onChangeText={setOrganizer}
      />
      <Pressable style={styles.checkRow} onPress={() => setAgree((v) => !v)}>
        <View style={[styles.box, agree && styles.boxOn]} />
        <Text style={styles.checkText}>
          {SAFETY_NOTICE} 本人承诺无非法改装上路、无酒驾毒驾。
        </Text>
      </Pressable>
      <Pressable style={styles.cta} onPress={submit}>
        <Text style={styles.ctaText}>发布线路（免费）</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  body: { padding: 20, paddingBottom: 40 },
  hint: { color: "#64748b", fontSize: 13, marginBottom: 14, lineHeight: 18 },
  label: { color: "#94a3b8", fontSize: 13, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f8fafc",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 8,
  },
  tall: { minHeight: 72, textAlignVertical: "top" },
  checkRow: { flexDirection: "row", marginTop: 16, alignItems: "flex-start" },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#64748b",
    marginRight: 12,
    marginTop: 2,
  },
  boxOn: { backgroundColor: "#4f46e5", borderColor: "#6366f1" },
  checkText: { flex: 1, color: "#64748b", fontSize: 13, lineHeight: 20 },
  cta: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
