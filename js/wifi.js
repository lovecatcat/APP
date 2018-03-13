function loadWifiInfo(connected) { // 获取WiFi列表
    var wifiMacs = []
    if (plus.networkinfo.CONNECTION_WIFI !== plus.networkinfo.getCurrentType()) {
        console.log('当前不是WiFi环境')
        return wifiMacs
    }

    plus.android.importClass("java.util.List");
    plus.android.importClass("java.util.ArrayList");
    plus.android.importClass("android.net.wifi.WifiManager")
    plus.android.importClass("android.net.wifi.ScanResult");
    plus.android.importClass("android.net.wifi.WifiInfo");

    var Context = plus.android.importClass("android.content.Context");
    var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);

    var wifiInfo = wifiManager.getConnectionInfo();
//		var wifiConnected = wifiInfo.getMacAddress() // 本机MAC
    var wifiConnected = wifiInfo.getBSSID() // 路由器MAC
    if (connected) { // 只获取已连接WiFiMAC
        return wifiConnected || ''
    }
    if (wifiConnected) { // 已连接WiFi
        return [wifiConnected]
    }

    // 获取WiFi列表
    var wifis = wifiManager.getScanResults();
    var len = wifis.size()
    for (var i = 0; i < len; i++) {
        wifiMacs.push(wifis.get(i).plusGetAttribute('BSSID'))
    }
    return wifiMacs
}

function getMac(data) { // 获取匹配的 wifiName & MAC
    var macs = loadWifiInfo()
    var len = macs.length

    console.log('当前周围WiFi数量：' + len)
    if (len < 1 || !data || data.length < 1) return null

    for (var i = 0; i < len; i++) {
        if (data[macs[i]]) {
            console.log('匹配MAC：' + macs[i])
            return {
                ssid: data[macs[i]],
                bssid: macs[i],
            }
        }
    }
    return null
}