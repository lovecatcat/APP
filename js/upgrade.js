var store = {
    getItem: function (Key) {
        return JSON.parse(localStorage.getItem(Key) || "{}");
    },
    setItem: function (Key, data) {
        localStorage.setItem(Key, JSON.stringify(data));
    },
    removeItem: function (Key) {
        localStorage.removeItem(Key)
    }
}
var methods = '';

function checkUpdate(version, method) {
    var checkUrl = "https://www.ehuimeng.com/Public/Uploads/app/checklev.json";
    mui.getJSON(checkUrl + '?_=' + new Date().toString(), function (data) {
    	var os = mui.os.android ? 'Android' : 'iOS';
      	if(method == "auto" && data.update.auto == "true"){
	        if (os === 'Android') {
	            checkInstall(version, data)
	        } else if (os === 'iOS') {
	            checkUpdateWgt(version, data.wgt.iOS)
	        }
        }else if(method == "hand" && data.update.hand == "true"){
        	methods = 'hand';
        	if (os === 'Android') {
	            checkInstall(version, data)
	        } else if (os === 'iOS') {
	            checkUpdateWgt(version, data.wgt.iOS)
	        }
        }
    })
}

function checkInstall(version, data) {
	console.log('检测完整更新')
    var wgtAndroid = data.wgt.Android
    var Android = data.Android

    //获取本地存储的跳过版本号
    var vabort = store.getItem('$skip_version').keyAbort;

    // 判断是否存在忽略版本号
    if (vabort !== Android.version) {
        if (compareVersion(version, Android.version)) {
        	//提示用户是否升级
	        plus.nativeUI.confirm(Android.note, function (e) {
	            if (0 === e.index) {
	                plus.nativeUI.toast('请下载后手动安装！');
	                plus.runtime.openURL(Android.url);
	            } else if (1 === e.index) {
	                store.setItem('$skip_version', {
	                    keyAbort: version
	                })
	            }
	            if (e.index !== 0) {
	                checkUpdateWgt(version, wgtAndroid)
	            }
	        }, Android.title, ["立即更新", "跳过此版本", "取消"]);
	    } else {
	    	checkUpdateWgt(version, wgtAndroid)
	    }
    }


}


/**
 * 增量式更新
 * @param wgtVer {String} 版本号
 */
function checkUpdateWgt(wgtVer, data) {
	console.log('检测增量更新')
    if (compareVersion(wgtVer, data.version)) {
        downWgt(data.url, data.version)
    } else{
    	if(methods == 'hand'){
		    document.getElementById('Js-updateSystem').classList.remove('mui-active');
		    mui.toast('当前已是最新版本！', {duration: 'short', type: 'div'});
		}
    }
}

/**
 * 比较版本大小
 * @param oldVer {String} 旧版本
 * @param newVer {String} 新版本
 * @returns {Boolean} 如果新版本大于旧版本则返回true，否则返回false
 */
function compareVersion(oldVer, newVer) {
	console.log(oldVer + ' | '+ newVer)
    if (!oldVer || !newVer) {
        return false
    }
    var oldArr = oldVer.split('.')
    var newArr = newVer.split('.')
    var len = Math.max(oldArr.length, newArr.length)
    for (var i = 0; i < len; i++) {
        var oldVal = parseInt(oldArr[i] || 0)
        var newVal = parseInt(newArr[i] || 0)
        if (oldVal < newVal) {
            return true
        } else if (oldVal > newVal) {
            return false
        }
    };
    return false
}


/**
 * 下载wgt文件
 * @param {Url} wgtUrl 文件下载地址
 * @param {String} ver 版本号
 */
function downWgt(wgtUrl, ver) {
    console.log("下载wgt文件");
    
    if(methods == 'hand'){
		document.getElementById('Js-updateSystem').classList.remove('mui-active');
	};
	
    plus.nativeUI.showWaiting('正在更新资源', {
        style: 'white',
        width: '90px'
    })
    
    var dtask = plus.downloader.createDownload(wgtUrl, {filename: "_doc/" + ver + '.wgt'}, function (d, status) {
        if (status == 200) {
            console.log("下载成功：" + d.filename);
            //安装wgt包
            installWgt(d.filename);
        } else {
            plus.nativeUI.toast('下载失败')
            console.log("下载wgt失败" + d.filename);
            delFile(d.filename)
        }
    }).start();
    
    document.addEventListener("netchange", function(){
    	var nt = plus.networkinfo.getCurrentType();
		switch (nt){
			case plus.networkinfo.CONNECTION_CELL3G:
			case plus.networkinfo.CONNECTION_CELL2G:
			plus.nativeUI.toast('当前网络不佳，已取消下载');
			dtask.abort(); 
			break; 
			default:
			plus.nativeUI.toast('当前网络不佳，已取消下载');
			dtask.abort(); 
			break;
		}
    }, false);
//  dtask.addEventListener('statechanged', function(task, status){
//  	var a = task.downloadedSize / task.totalSize * 100;
//  	console.log(a);
//  }, false);
//  dtask.start();
}

/**
 * 删除文件
 * @param url {Url} 文件资源地址
 */
function delFile(url) {
    plus.io.resolveLocalFileSystemURL(url, function (e) {
        e.remove(function () {
            console.log('删除成功')
        }, function () {
            console.log('删除失败')
        })
    }, function () {
        console.log('读取失败')
    })
}

/**
 * 安装wgt包
 * @param {String} path 文件资源地址
 */
function installWgt(path) { 
    plus.runtime.install(path, {}, function () {
        console.log("安装wgt文件成功！");
        plus.nativeUI.closeWaiting();
        delFile(path);
	    plus.nativeUI.alert( "系统更新成功，请手动退出App重新打开!", function(){
			//console.log( "User pressed!" );
		}, "更新提示", "确定" );
//      plus.nativeUI.confirm("更新成功，请退出app重新",
//          function (e) {
//              if (e.index === 1) {
//                  plus.runtime.restart();
//              }
//          },
//          "", ['取消', '确定']
//      );
    }, function (e) {
        plus.nativeUI.toast('安装失败');
        plus.nativeUI.closeWaiting();
        delFile(path);
        console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
    });
}