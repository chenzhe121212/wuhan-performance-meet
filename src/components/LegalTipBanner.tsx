import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MOD_DRINK_NOTICE } from "../constants";

export function LegalTipBanner() {
  return (
    <View style={styles.wrap} accessibilityRole="text">
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>{MOD_DRINK_NOTICE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#422006",
    borderWidth: 1,
    borderColor: "#a16207",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  icon: { fontSize: 16, marginTop: 1, marginRight: 8 },
  text: {
    flex: 1,
    color: "#fde68a",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
});
