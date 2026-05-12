import type { CruiseRoute } from "../types";

export const SEED_ROUTES: CruiseRoute[] = [
  {
    id: "route-seed-1",
    title: "东湖绿道清晨舒缓溜车",
    routeMeta: "约 18 km · 编队慢行",
    dateLabel: "5月20日 周日 06:30",
    meetingPoint: "武汉市武昌区 · 东湖听涛景区附近集合点",
    maxSpots: 12,
    joined: 5,
    description:
      "以绿道观光节奏为主，禁止穿插竞速。适合想吹风、拍照的车友。请提前检查轮胎与刹车。",
    organizer: "东湖小队 · 阿尔法罗密欧 Giulia",
  },
  {
    id: "route-seed-2",
    title: "江夏环山风景结伴线路",
    routeMeta: "约 42 km · 风景路段",
    dateLabel: "5月21日 周一 07:00（调休可改期群内通知）",
    meetingPoint: "武汉市江夏区 · 集合点报名后私信",
    maxSpots: 10,
    joined: 4,
    description:
      "山路多弯，请控制车速与车距。拒绝非法改装排气扰民。活动免费，自愿参加，风险自负。",
    organizer: "老周 · 奥迪 S4",
  },
];
