import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { MapScreen } from "./src/screens/MapScreen";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import type { RootStackParamList, TabParamList } from "./src/navigation/types";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { EventsProvider } from "./src/context/EventsContext";
import { RoutesProvider } from "./src/context/RoutesContext";
import { ForumProvider } from "./src/context/ForumContext";
import { VerificationProvider } from "./src/context/VerificationContext";
import { EventsScreen } from "./src/screens/EventsScreen";
import { RoutesListScreen } from "./src/screens/RoutesListScreen";
import { ForumListScreen } from "./src/screens/ForumListScreen";
import { PublishScreen } from "./src/screens/PublishScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { EventDetailScreen } from "./src/screens/EventDetailScreen";
import { ForumDetailScreen } from "./src/screens/ForumDetailScreen";
import { NewForumPostScreen } from "./src/screens/NewForumPostScreen";
import { RouteDetailScreen } from "./src/screens/RouteDetailScreen";
import { PublishRouteScreen } from "./src/screens/PublishRouteScreen";
import { VerificationCenterScreen } from "./src/screens/VerificationCenterScreen";
import { VerificationDetailScreen } from "./src/screens/VerificationDetailScreen";
import { LoginScreen } from "./src/screens/LoginScreen";

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 20 }}>{label}</Text>;
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#ea580c",
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    border: "#334155",
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1e293b" },
        headerTintColor: "#f8fafc",
        headerTitleStyle: { fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: "#1e293b",
          borderTopColor: "#334155",
        },
        tabBarActiveTintColor: "#fb923c",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tab.Screen
        name="地图"
        component={MapScreen}
        options={{
          headerShown: true,
          title: "附近车友",
          tabBarIcon: () => <TabIcon label="🗺️" />,
        }}
      />
      <Tab.Screen
        name="线路"
        component={RoutesListScreen}
        options={{
          headerShown: true,
          title: "溜车线路",
          tabBarIcon: () => <TabIcon label="🛣️" />,
        }}
      />
      <Tab.Screen
        name="活动"
        component={EventsScreen}
        options={{
          headerShown: true,
          title: "活动",
          tabBarIcon: () => <TabIcon label="📅" />,
        }}
      />
      <Tab.Screen
        name="论坛"
        component={ForumListScreen}
        options={{
          headerShown: true,
          title: "车友论坛",
          tabBarIcon: () => <TabIcon label="💬" />,
        }}
      />
      <Tab.Screen
        name="发布"
        component={PublishScreen}
        options={{
          headerShown: true,
          title: "发布活动",
          tabBarIcon: () => <TabIcon label="✏️" />,
        }}
      />
      <Tab.Screen
        name="我的"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <TabIcon label="👤" /> }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <EventsProvider>
      <RoutesProvider>
        <ForumProvider>
          <VerificationProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="light" />
              <Stack.Navigator
                screenOptions={{
                  headerStyle: { backgroundColor: "#1e293b" },
                  headerTintColor: "#f8fafc",
                  headerTitleStyle: { fontWeight: "700" },
                  contentStyle: { backgroundColor: "#0f172a" },
                }}
              >
                <Stack.Screen
                  name="Tabs"
                  component={TabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="EventDetail"
                  component={EventDetailScreen}
                  options={{ title: "活动详情" }}
                />
                <Stack.Screen
                  name="ForumDetail"
                  component={ForumDetailScreen}
                  options={{ title: "帖子" }}
                />
                <Stack.Screen
                  name="NewForumPost"
                  component={NewForumPostScreen}
                  options={{ title: "发帖" }}
                />
                <Stack.Screen
                  name="RouteDetail"
                  component={RouteDetailScreen}
                  options={{ title: "线路详情" }}
                />
                <Stack.Screen
                  name="PublishRoute"
                  component={PublishRouteScreen}
                  options={{ title: "发布线路" }}
                />
                <Stack.Screen
                  name="VerificationCenter"
                  component={VerificationCenterScreen}
                  options={{ title: "认证中心" }}
                />
                <Stack.Screen
                  name="VerificationDetail"
                  component={VerificationDetailScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </VerificationProvider>
        </ForumProvider>
      </RoutesProvider>
    </EventsProvider>
  );
}

function Gate() {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f172a",
        }}
      >
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }
  if (!user) return <LoginScreen />;
  return <MainStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
