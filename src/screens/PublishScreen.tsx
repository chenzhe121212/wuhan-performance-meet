import React, { useState } from "react";
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
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/types";
import { PILOT_CITY, SAFETY_NOTICE } from "../constants";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import type { EventCategory } from "../types";

const TYPES: { key: EventCategory; label: string }[] = [
  { key: "meet", label: "车友聚会" },
  { key: "drive", label: "结伴出行" },
  { key: "tech", label: "技术交流" },
];

export function PublishScreen() {
  const { user } = useAuth();
  const { publishEvent } = useEvents();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("meet");
  const [dateLabel, setDateLabel] = useState("");
  const [location, setLocation] = useState("");
  const [maxSpots, setMaxSpots] = useState("20");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState(user.displayName);
  const [agree, setAgree] = useState(false);

  const submit = () => {
    if (!title.trim() || !dateLabel.trim() || !location.trim()) {
      Alert.alert("请完善信息", "标题、时间与地点为必填。");
      return;
    }
    const n = parseInt(maxSpots, 10);
    if (!Number.isFinite(n) || n < 2 || n > 200) {
      Alert.alert("人数无效", "人数上限请输入 2～200 之间的数字。");
      return;
    }
    const organizerFinal = organizer.trim() || user.displayName;
    if (!agree) {
      Alert.alert("请阅读并勾选", "需确认安全提示后方可发布。");
      return;
    }
    const loc = location.includes(PILOT_CITY)
      ? location.trim()
      : `${PILOT_CITY} · ${location.trim()}`;
    publishEvent({
      ownerUserId: user.id,
      title: title.trim(),
      category,
      dateLabel: dateLabel.trim(),
      location: loc,
      maxSpots: n,
      description: description.trim() || "（暂无详细说明）",
      organizer: organizerFinal,
    });
    Alert.alert("发布成功", "活动已出现在「活动」列表，并在「我的」- 我创建的 中可见。", [
      {
        text: "好的",
        onPress: () => {
          setTitle("");
          setDateLabel("");
          setLocation("");
          setDescription("");
          setAgree(false);
          setOrganizer(user.displayName);
          navigation.navigate("活动");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
      <LegalTipBanner />
      <Text style={styles.hint}>试点城市：{PILOT_CITY}（地点会自动带上城市前缀）</Text>
      <Text style={styles.label}>活动标题</Text>
      <TextInput
        style={styles.input}
        placeholder="例如：周末江夏风景结伴出行"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>类型</Text>
      <View style={styles.types}>
        {TYPES.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.typeChip, category === t.key && styles.typeChipOn]}
            onPress={() => setCategory(t.key)}
          >
            <Text
              style={[
                styles.typeChipText,
                category === t.key && styles.typeChipTextOn,
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>时间（展示文案）</Text>
      <TextInput
        style={styles.input}
        placeholder="例如：6月1日 周日 08:00"
        placeholderTextColor="#64748b"
        value={dateLabel}
        onChangeText={setDateLabel}
      />
      <Text style={styles.label}>地点 / 集合说明</Text>
      <TextInput
        style={[styles.input, styles.inputTall]}
        placeholder="区与地标，无需重复写「武汉市」也可"
        placeholderTextColor="#64748b"
        value={location}
        onChangeText={setLocation}
        multiline
      />
      <Text style={styles.label}>人数上限</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={maxSpots}
        onChangeText={setMaxSpots}
      />
      <Text style={styles.label}>活动说明</Text>
      <TextInput
        style={[styles.input, styles.inputTall]}
        placeholder="路线节奏、费用说明（本版不支持报名费）等"
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>发起人展示名</Text>
      <TextInput
        style={styles.input}
        placeholder={`默认「${user.displayName}」，可改为 昵称 · 车型`}
        placeholderTextColor="#64748b"
        value={organizer}
        onChangeText={setOrganizer}
      />
      <Pressable
        style={styles.checkRow}
        onPress={() => setAgree((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agree }}
      >
        <View style={[styles.box, agree && styles.boxOn]} />
        <Text style={styles.checkText}>{SAFETY_NOTICE}</Text>
      </Pressable>
      <Pressable style={styles.cta} onPress={submit}>
        <Text style={styles.ctaText}>发布活动（免费）</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#0f172a" },
  body: { padding: 20, paddingBottom: 40 },
  hint: { color: "#64748b", fontSize: 13, marginBottom: 16, lineHeight: 18 },
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
  inputTall: { minHeight: 80, textAlignVertical: "top" },
  types: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  typeChipOn: { borderColor: "#ea580c", backgroundColor: "#431407" },
  typeChipText: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },
  typeChipTextOn: { color: "#fdba74" },
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
  boxOn: { backgroundColor: "#ea580c", borderColor: "#ea580c" },
  checkText: { flex: 1, color: "#64748b", fontSize: 13, lineHeight: 20 },
  cta: {
    marginTop: 20,
    backgroundColor: "#ea580c",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
