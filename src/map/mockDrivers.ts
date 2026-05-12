import type { DriverPresence } from "../types";

const NAMES = ["阿杰", "小林", "老魏", "橙子", "DK", "大熊"];
const CARS = ["宝马 M2", "奥迪 S4", "领克 03+", "Model 3P", "A45", "伊兰特 N"];

/** 在武汉附近生成若干「车友」点位，并带轻微漂移模拟实时移动 */
export function createMockDriversNear(
  centerLat: number,
  centerLng: number,
  count = 5
): DriverPresence[] {
  return Array.from({ length: count }, (_, i) => {
    const lat = centerLat + (Math.random() - 0.5) * 0.04;
    const lng = centerLng + (Math.random() - 0.5) * 0.04;
    return {
      id: `near-${i}`,
      displayName: NAMES[i % NAMES.length] ?? `车友${i + 1}`,
      carLabel: CARS[i % CARS.length] ?? "性能车",
      lat,
      lng,
      contactHint: `demo_wuhan_${i + 1}`,
    };
  });
}

export function jitterDrivers(prev: DriverPresence[]): DriverPresence[] {
  return prev.map((d) => ({
    ...d,
    lat: d.lat + (Math.random() - 0.5) * 0.0004,
    lng: d.lng + (Math.random() - 0.5) * 0.0004,
  }));
}
