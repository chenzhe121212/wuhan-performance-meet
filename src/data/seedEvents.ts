import type { DriveEvent } from "../types";

export const SEED_EVENTS: DriveEvent[] = [
  {
    id: "seed-1",
    title: "东湖绿道周末咖啡车聚",
    category: "meet",
    dateLabel: "5月17日 周六 09:30",
    location: "武汉市武昌区 · 近东湖听涛景区停车场",
    maxSpots: 25,
    joined: 12,
    description:
      "静态聚会，交流改装与保养心得。无费用、无竞速，欢迎带家属。集合后步行至咖啡馆。",
    organizer: "阿凯 · 宝马 M2",
  },
  {
    id: "seed-2",
    title: "江夏环山风景结伴出行",
    category: "drive",
    dateLabel: "5月18日 周日 08:00",
    location: "武汉市江夏区 · 集合点报名后通知",
    maxSpots: 15,
    joined: 8,
    description:
      "以风景与编队安全行驶为主，保持车距，禁止超车竞速。路线成熟、节奏舒缓，适合想跑山但重视安全的车友。",
    organizer: "老周 · 奥迪 S4",
  },
  {
    id: "seed-3",
    title: "刹车与轮胎小型技术沙龙",
    category: "tech",
    dateLabel: "5月24日 周六 14:00",
    location: "武汉市洪山区 · 某改装店（确认后更新）",
    maxSpots: 20,
    joined: 6,
    description:
      "店家技师分享刹车片选型、轮胎磨损判断与四轮定位基础。室内活动，可停车展示。",
    organizer: "改装店合作 · 店员主持",
  },
];
