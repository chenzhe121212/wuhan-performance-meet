import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import type { DriverPresence } from "../types";

type Props = {
  html: string;
  self: { lat: number; lng: number };
  drivers: DriverPresence[];
  onSelectDriver: (id: string) => void;
};

export function AmapPresenceWebMap({
  html,
  self,
  drivers,
  onSelectDriver,
}: Props) {
  const ref = useRef<WebView>(null);
  const [loaded, setLoaded] = useState(false);
  const lastEnc = useRef("");

  const pushPayload = useCallback(() => {
    if (!loaded || !ref.current) return;
    const enc = encodeURIComponent(
      JSON.stringify({
        self,
        drivers,
      })
    );
    if (enc === lastEnc.current) return;
    lastEnc.current = enc;
    ref.current.injectJavaScript(
      `try{applyEncoded(${JSON.stringify(enc)});}catch(e){};true;`
    );
  }, [loaded, self, drivers]);

  useEffect(() => {
    pushPayload();
  }, [pushPayload]);

  return (
    <WebView
      ref={ref}
      style={styles.web}
      originWhitelist={["*"]}
      mixedContentMode="always"
      javaScriptEnabled
      domStorageEnabled
      source={{ html }}
      onLoadEnd={() => setLoaded(true)}
      onMessage={(e) => {
        try {
          const msg = JSON.parse(e.nativeEvent.data) as {
            type?: string;
            id?: string;
          };
          if (msg.type === "select" && msg.id) onSelectDriver(msg.id);
        } catch {
          /* ignore */
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: "#0f172a" },
});
