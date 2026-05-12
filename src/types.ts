export type EventCategory = "meet" | "drive" | "tech";

export interface DriveEvent {
  id: string;
  title: string;
  category: EventCategory;
  /** 展示用，如「5月17日 周六 09:00」 */
  dateLabel: string;
  location: string;
  maxSpots: number;
  joined: number;
  description: string;
  organizer: string;
  /** 发布者用户 id，用于「我创建的」 */
  ownerUserId?: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  displayName: string;
}

/** 地图上附近车友的实时点位（演示 / 阿里云通道下发） */
export interface DriverPresence {
  id: string;
  displayName: string;
  carLabel: string;
  lat: number;
  lng: number;
  /** 演示：可复制；正式环境建议走阿里云 IM / 号码隐私保护 */
  contactHint: string;
}

/** 溜车线路：可报名结伴同行 */
export interface CruiseRoute {
  id: string;
  title: string;
  /** 如「约 35 km · 舒缓编队」 */
  routeMeta?: string;
  dateLabel: string;
  meetingPoint: string;
  description: string;
  maxSpots: number;
  joined: number;
  organizer: string;
  ownerUserId?: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  /** 展示用日期文案 */
  createdLabel: string;
}

export type VerificationKind =
  | "driver_license"
  | "vehicle_license"
  | "id_card";

export type VerificationStatus =
  | "none"
  | "pending"
  | "verified"
  | "rejected";

export interface VerificationEntry {
  status: VerificationStatus;
  updatedAt?: string;
}

export type VerificationBundle = Record<VerificationKind, VerificationEntry>;
