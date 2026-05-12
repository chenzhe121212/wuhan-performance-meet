import Constants from "expo-constants";

function readExtra(key: string): string | undefined {
  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  const v = extra?.[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

/** 高德地图 Web(JS) Key，在控制台创建「Web端」应用后填入 app.json extra 或 EXPO_PUBLIC_AMAP_WEB_KEY */
export function getAmapWebKey(): string {
  return (
    readExtra("amapWebKey") ??
    process.env.EXPO_PUBLIC_AMAP_WEB_KEY ??
    ""
  ).trim();
}

/** 可选：高德 JSAPI 安全密钥（控制台若要求配合使用） */
export function getAmapSecurityJsCode(): string {
  return (
    readExtra("amapSecurityJsCode") ??
    process.env.EXPO_PUBLIC_AMAP_SECURITY_JS_CODE ??
    ""
  ).trim();
}

/**
 * 阿里云实时通道（示例：API 网关 WebSocket / 微消息队列 MQTT 转 WS）。
 * 填入 app.json extra.aliyunRealtimeWsUrl 或 EXPO_PUBLIC_ALIYUN_REALTIME_WS_URL
 */
export function getAliyunRealtimeWsUrl(): string {
  return (
    readExtra("aliyunRealtimeWsUrl") ??
    process.env.EXPO_PUBLIC_ALIYUN_REALTIME_WS_URL ??
    ""
  ).trim();
}
