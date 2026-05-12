import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AmapPresenceWebMap } from "../components/AmapPresenceWebMap";
import { LegalTipBanner } from "../components/LegalTipBanner";
import { NativePresenceMap } from "../components/NativePresenceMap";
import {
  getAliyunRealtimeWsUrl,
  getAmapSecurityJsCode,
  getAmapWebKey,
} from "../config/env";
import { buildAmapHtml } from "../map/buildAmapHtml";
import { createMockDriversNear, jitterDrivers } from "../map/mockDrivers";
import { subscribePresenceChannel } from "../services/aliyunRealtime";
import type { DriverPresence } from "../types";

const WUHAN_DEFAULT = { lat: 30.5931, lng: 114.3054 };

export function MapScreen() {
  const amapKey = getAmapWebKey();
  const amapSec = getAmapSecurityJsCode();
  const amapHtml = useMemo(
    () => (amapKey ? buildAmapHtml(amapKey, amapSec) : ""),
    [amapKey, amapSec]
  );

  const [self, setSelf] = useState<{ lat: number; lng: number } | null>(null);
  const [locReady, setLocReady] = useState(false);
  const [drivers, setDrivers] = useState<DriverPresence[]>([]);
  const [selected, setSelected] = useState<DriverPresence | null>(null);
  const [rtStatus, setRtStatus] = useState<string | null>(null);
  const [wsOverride, setWsOverride] = useState(false);

  useEffect(() => {
    let sub: { disconnect: () => void } | null = null;
    const url = getAliyunRealtimeWsUrl();
    if (url) {
      sub = subscribePresenceChannel(
        url,
        (d) => {
          if (d.length > 0) {
            setWsOverride(true);
            setDrivers(d);
          }
        },
        (m) => {
          setRtStatus(m);
          if (m.includes("断开")) setWsOverride(false);
        }
      );
    }
    return () => {
      sub?.disconnect();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let sub: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!alive) return;
      if (status !== Location.PermissionStatus.GRANTED) {
        setSelf(WUHAN_DEFAULT);
        setLocReady(true);
        return;
      }
      const first = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!alive) return;
      setSelf({
        lat: first.coords.latitude,
        lng: first.coords.longitude,
      });
      setLocReady(true);
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 8000,
          distanceInterval: 40,
        },
        (loc) => {
          setSelf({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
        }
      );
    })();
    return () => {
      alive = false;
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    if (!self) return;
    if (wsOverride) return;
    setDrivers(createMockDriversNear(self.lat, self.lng, 6));
  }, [self?.lat, self?.lng, wsOverride]);

  useEffect(() => {
    if (!self || wsOverride) return;
    const t = setInterval(() => {
      setDrivers((prev) => (prev.length ? jitterDrivers(prev) : prev));
    }, 3500);
    return () => clearInterval(t);
  }, [self?.lat, self?.lng, wsOverride]);

  const onSelectDriver = (id: string) => {
    const d = drivers.find((x) => x.id === id);
    if (d) setSelected(d);
  };

  const copyHint = async () => {
    if (!selected) return;
    await Clipboard.setStringAsync(selected.contactHint);
    Alert.alert("已复制", "演示交流号已复制到剪贴板。正式版可对接阿里云 IM / 隐私号。");
  };

  if (!locReady || !self) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.muted}>正在获取位置…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {!amapKey ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            未配置高德 Web Key，已使用系统地图降级。请在 app.json 的 extra.amapWebKey
            或环境变量 EXPO_PUBLIC_AMAP_WEB_KEY 中填写（阿里云生态常用高德）。
          </Text>
        </View>
      ) : null}
      {rtStatus ? (
        <View style={styles.rt}>
          <Text style={styles.rtText}>实时通道：{rtStatus}</Text>
        </View>
      ) : null}
      {amapKey ? (
        <AmapPresenceWebMap
          html={amapHtml}
          self={self}
          drivers={drivers}
          onSelectDriver={onSelectDriver}
        />
      ) : (
        <NativePresenceMap
          self={self}
          drivers={drivers}
          onSelectDriver={onSelectDriver}
        />
      )}
      <View style={styles.legend}>
        <LegalTipBanner />
        <Text style={[styles.legendText, { marginTop: 10 }]}>
          🚗 为附近车友（演示位置微动）。点小车可联系 / 匹配。
        </Text>
      </View>

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.modalBg} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>联系车友</Text>
            {selected ? (
              <>
                <Text style={styles.sheetName}>{selected.displayName}</Text>
                <Text style={styles.sheetCar}>{selected.carLabel}</Text>
                <Text style={styles.sheetHint}>
                  演示交流号：<Text style={styles.mono}>{selected.contactHint}</Text>
                </Text>
                <Pressable style={styles.primary} onPress={copyHint}>
                  <Text style={styles.primaryText}>复制交流号</Text>
                </Pressable>
                <Pressable
                  style={styles.secondary}
                  onPress={() => {
                    Alert.alert(
                      "匹配 / 交流",
                      "正式环境可接入：阿里云短信 / 号码隐私保护、消息服务 MNS、ApsaraVideo 音视频等。当前为占位提示。"
                    );
                  }}
                >
                  <Text style={styles.secondaryText}>发起匹配 / 交流（演示）</Text>
                </Pressable>
                <Pressable style={styles.close} onPress={() => setSelected(null)}>
                  <Text style={styles.closeText}>关闭</Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f172a" },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  muted: { color: "#94a3b8", fontSize: 14 },
  banner: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  bannerText: { color: "#94a3b8", fontSize: 12, lineHeight: 17 },
  rt: { backgroundColor: "#14532d", paddingVertical: 6, paddingHorizontal: 12 },
  rtText: { color: "#bbf7d0", fontSize: 12 },
  legend: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(15,23,42,0.88)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  legendText: { color: "#cbd5e1", fontSize: 12, lineHeight: 17 },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sheetTitle: { color: "#94a3b8", fontSize: 13, marginBottom: 8 },
  sheetName: { color: "#f8fafc", fontSize: 20, fontWeight: "800" },
  sheetCar: { color: "#fdba74", fontSize: 15, marginTop: 4, marginBottom: 12 },
  sheetHint: { color: "#94a3b8", fontSize: 14, marginBottom: 16 },
  mono: { color: "#e2e8f0", fontFamily: "monospace" },
  primary: {
    backgroundColor: "#ea580c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondary: {
    borderWidth: 1,
    borderColor: "#475569",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryText: { color: "#e2e8f0", fontSize: 15, fontWeight: "600" },
  close: { alignItems: "center", paddingVertical: 8 },
  closeText: { color: "#64748b", fontSize: 14 },
});
