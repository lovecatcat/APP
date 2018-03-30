/**
 * 剪切板设置值或取值, 兼容[安卓]{@link ClipbordAND}和[IOS]{@link ClipbordIOS}
 * @param text {?String} 为空时从剪切板取值，反之复制文本到剪切板
 * @returns {String} 从剪切板取得的值
 */
function Clipbord(text) {
    if (!window.plus) return;
    if (mui.os.android) {
        ClipbordAND(text)
        return ClipbordAND()
    } else {
        ClipbordIOS(text)
        return ClipbordIOS()
    }
}

/**
 * 安卓平台 剪切板设置值或取值
 * @see Clipbord
 */
function ClipbordAND(text) {
    var Context = plus.android.importClass("android.content.Context");
    var main = plus.android.runtimeMainActivity();
    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
    if (text) {
        plus.android.invoke(clip, "setText", text);
    } else {
//      plus.nativeUI.toast("已复制到剪切板");
        return plus.android.invoke(clip, "getText");
    }
}

/**
 * IOS平台 剪切板设置值或取值
 * @see Clipbord
 */
function ClipbordIOS(text) {
    var UIPasteboard = plus.ios.importClass("UIPasteboard");
    var generalPasteboard = UIPasteboard.generalPasteboard();
    // 设置/获取文本内容:
    if (text) {
        generalPasteboard.setValueforPasteboardType(text, "public.utf8-plain-text");
    } else {
//      plus.nativeUI.toast("已复制到剪切板");
        return generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
    }
}
