import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { DriverPresence } from "../types";

type Props = {
  self: { lat: number; lng: number };
  drivers: DriverPresence[];
  onSelectDriver: (id: string) => void;
};

export function NativePresenceMap({ self, drivers, onSelectDriver }: Props) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: self.lat,
        longitude: self.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
      showsMyLocationButton={false}
    >
      <Marker
        coordinate={{ latitude: self.lat, longitude: self.lng }}
        title="我"
        description="你的位置"
        tracksViewChanges={false}
      >
        <View style={styles.mePin}>
          <Text style={styles.mePinText}>我</Text>
        </View>
      </Marker>
      {drivers.map((d) => (
        <Marker
          key={d.id}
          coordinate={{ latitude: d.lat, longitude: d.lng }}
          onPress={() => onSelectDriver(d.id)}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
        >
          <View style={styles.carPin}>
            <Text style={styles.carEmoji}>🚗</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  mePin: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#93c5fd",
  },
  mePinText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  carPin: {
    alignItems: "center",
    justifyContent: "center",
  },
  carEmoji: {
    fontSize: 28,
    textShadowColor: "#000",
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
  },
});
