import type { DriverPresence } from "../types";

export type PresenceListener = (drivers: DriverPresence[]) => void;

export type RealtimeSubscription = {
  disconnect: () => void;
};

/**
 * 阿里云侧常见接法（二选一或组合）：
 * - 微消息队列 MQTT 版：车机/手机上报 topic `presence/{city}/loc`，订阅同 topic 聚合后由函数计算下发；
 * - API 网关 + WebSocket：后端订阅 MQTT 后通过 WS 推给 App（本客户端预留 `getAliyunRealtimeWsUrl()`）。
 *
 * 当前仓库未包含服务端：此处为「本地模拟 + 可选 WebSocket」骨架。
 */
export function subscribePresenceChannel(
  wsUrl: string,
  onDrivers: PresenceListener,
  onStatus?: (msg: string) => void
): RealtimeSubscription {
  if (!wsUrl) {
    return { disconnect: () => {} };
  }

  let ws: WebSocket | null = null;
  let closed = false;

  try {
    ws = new WebSocket(wsUrl);
  } catch {
    onStatus?.("无法创建 WebSocket，请检查 URL");
    return { disconnect: () => {} };
  }

  ws.onopen = () => onStatus?.("已连接实时通道");
  ws.onclose = () => {
    if (!closed) onStatus?.("实时通道已断开");
  };
  ws.onerror = () => onStatus?.("实时通道错误");
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(String(ev.data)) as {
        drivers?: DriverPresence[];
      };
      if (Array.isArray(data.drivers)) onDrivers(data.drivers);
    } catch {
      /* ignore */
    }
  };

  return {
    disconnect: () => {
      closed = true;
      try {
        ws?.close();
      } catch {
        /* ignore */
      }
      ws = null;
    },
  };
}
