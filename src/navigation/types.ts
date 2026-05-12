import { NavigatorScreenParams } from "@react-navigation/native";
import type { VerificationKind } from "../types";

export type TabParamList = {
  地图: undefined;
  线路: undefined;
  活动: undefined;
  论坛: undefined;
  发布: undefined;
  我的: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  EventDetail: { eventId: string };
  ForumDetail: { postId: string };
  NewForumPost: undefined;
  RouteDetail: { routeId: string };
  PublishRoute: undefined;
  VerificationCenter: undefined;
  VerificationDetail: {
    kind: VerificationKind;
  };
};
