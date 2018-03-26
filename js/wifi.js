var u = navigator.userAgent;  
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端  
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 

// 两者共用
var getMac;

// iso相关
var _BARCODE; // 插件名称
var B;
var hmplugin;
var fillMac;
if (isiOS) {
	_BARCODE = 'hmplugin'; // 插件名称
    B = window.plus.bridge;

    hmplugin = {
        callNative: function (fname, args, successCallback) {
            var callbackId = this.getCallbackId(successCallback, this.errorCallback);
            if (args != null) {
                args.unshift(callbackId);
            } else {
                args = [callbackId];
            }
            return B.execSync(_BARCODE, fname, args);
        },
        getCallbackId: function (successCallback) {
            var success = typeof successCallback !== 'function' ? null : function (args) {
                successCallback(args);
            };
            callbackId = B.callbackId(success, this.errorCallback);
            return callbackId;
        },
        errorCallback: function (errorMsg) {
            console.log("Javascript callback error: " + errorMsg);
        },
        getWifiMac: function () {
            return this.callNative("getWifiMac", null);
        }
    };

    window.plus.hmplugin = hmplugin;
    
    fillMac = function (mac) {
    	return mac.split(':').map(function(item) {
	        item = item.toLocaleLowerCase();
	        return item.length > 1 ? item : '0' + item;
	    }).join(':')
    }
    
    getMac = function (data, connected) {
    	var mac = plus.hmplugin.getWifiMac()
	    mac = fillMac(mac)
	    if (connected) {
	        return mac || ''
	    }
	    if (data && data[mac]) {
	        return {
	            ssid: data[mac],
	            bssid: mac
	        }
	    }
	    return null
    }
}

// android相关
var getWifiInfo;

if (isAndroid) {
	getMac = function (data, connected) { // 获取WiFi列表
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
	
	getWifiInfo = function(data) {
		var macs = getMac()
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
}
//function loadWifiInfo(connected) { // 获取WiFi列表
//  var wifiMacs = []
//  if (plus.networkinfo.CONNECTION_WIFI !== plus.networkinfo.getCurrentType()) {
//      console.log('当前不是WiFi环境')
//      return wifiMacs
//  }
//
//  plus.android.importClass("java.util.List");
//  plus.android.importClass("java.util.ArrayList");
//  plus.android.importClass("android.net.wifi.WifiManager")
//  plus.android.importClass("android.net.wifi.ScanResult");
//  plus.android.importClass("android.net.wifi.WifiInfo");
//
//  var Context = plus.android.importClass("android.content.Context");
//  var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
//
//  var wifiInfo = wifiManager.getConnectionInfo();
////		var wifiConnected = wifiInfo.getMacAddress() // 本机MAC
//  var wifiConnected = wifiInfo.getBSSID() // 路由器MAC
//  if (connected) { // 只获取已连接WiFiMAC
//      return wifiConnected || ''
//  }
//  if (wifiConnected) { // 已连接WiFi
//      return [wifiConnected]
//  }
//
//  // 获取WiFi列表
//  var wifis = wifiManager.getScanResults();
//  var len = wifis.size()
//  for (var i = 0; i < len; i++) {
//      wifiMacs.push(wifis.get(i).plusGetAttribute('BSSID'))
//  }
//  return wifiMacs
//}
//
//function getMac(data) { // 获取匹配的 wifiName & MAC
//  var macs = loadWifiInfo()
//  var len = macs.length
//  
//  console.log('当前周围WiFi数量：' + len)
//  if (len < 1 || !data || data.length < 1) return null
//
//  for (var i = 0; i < len; i++) {
//      if (data[macs[i]]) {
//          console.log('匹配MAC：' + macs[i])
//          return {
//              ssid: data[macs[i]],
//              bssid: macs[i],
//          }
//      }
//  }
//  return null
//}