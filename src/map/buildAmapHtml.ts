/** 高德 JSAPI 2.0 WebView 页面（Key 由运行时注入） */
export function buildAmapHtml(amapKey: string, securityJsCode: string): string {
  const sec = securityJsCode
    ? `window._AMapSecurityConfig={securityJsCode:${JSON.stringify(securityJsCode)}};`
    : "";
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <style>html,body,#map{margin:0;padding:0;height:100%;width:100%;background:#0f172a}</style>
  ${sec ? `<script>${sec}</script>` : ""}
  <script src="https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(
    amapKey
  )}"></script>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = null;
    var markers = [];
    var selfMarker = null;

    function clearMarkers() {
      if (!map) return;
      markers.forEach(function (m) { map.remove(m); });
      markers = [];
    }

    function applyEncoded(enc) {
      try {
        var payload = JSON.parse(decodeURIComponent(enc));
        var self = payload.self;
        var drivers = payload.drivers || [];
        if (!map) {
          map = new AMap.Map('map', {
            zoom: 14,
            center: [self.lng, self.lat],
            viewMode: '2D'
          });
        } else {
          map.setCenter([self.lng, self.lat]);
        }
        if (selfMarker) map.remove(selfMarker);
        selfMarker = new AMap.Marker({
          position: [self.lng, self.lat],
          content: '<div style="background:#2563eb;color:#fff;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700;border:2px solid #93c5fd">我</div>',
          offset: new AMap.Pixel(-18, -18)
        });
        map.add(selfMarker);
        clearMarkers();
        drivers.forEach(function (d) {
          var m = new AMap.Marker({
            position: [d.lng, d.lat],
            content: '<div style="font-size:26px;line-height:1;text-shadow:0 1px 2px #000">🚗</div>',
            offset: new AMap.Pixel(-13, -26)
          });
          m.on('click', function () {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: d.id }));
            }
          });
          map.add(m);
          markers.push(m);
        });
      } catch (e) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: String(e) }));
        }
      }
    }
  </script>
</body>
</html>`;
}
