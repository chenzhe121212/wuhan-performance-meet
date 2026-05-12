/** 试点城市：活动与列表默认仅展示武汉 */
export const PILOT_CITY = "武汉";

export const CATEGORY_LABEL: Record<
  import("./types").EventCategory,
  string
> = {
  meet: "车友聚会",
  drive: "结伴出行",
  tech: "技术交流",
};

export const SAFETY_NOTICE =
  "活动由车友自发组织。请严格遵守道路交通安全法规，拒绝危险驾驶。本平台仅提供信息发布，不参与线下活动组织与担保。";

/** 法规与平台倡导（展示于地图、论坛、线路、发布等） */
export const MOD_DRINK_NOTICE =
  "禁止非法改装车辆上道路行驶；禁止酒后驾车、毒驾。请合法合规用车，对自己与他人生命负责。";

export const VERIFICATION_COPY: Record<
  import("./types").VerificationKind,
  { title: string; blurb: string }
> = {
  driver_license: {
    title: "驾驶证认证",
    blurb: "用于确认你具备合法驾驶资格。正式环境建议对接阿里云实人认证 + OCR 识别，仅留存脱敏结果。",
  },
  vehicle_license: {
    title: "机动车行驶证认证",
    blurb: "用于确认车辆登记信息与上路合法性。请勿上传买卖、抵押等敏感用途之外的无关材料。",
  },
  id_card: {
    title: "车主身份证认证",
    blurb: "用于与车辆信息主体一致性校验。演示版不上传真实证件；上线后请使用加密传输与最小必要留存原则。",
  },
};