var config = {
    baseUrl: 'http://ts-www.luckyins.com/api/api/invoke',  //团队管理服务器路径
    moduleURL: 'http://ts-www.luckyins.com/api/api/'
};

/**
 * 根据不同手机的屏幕Dpi，计算并重置屏幕缩放比例
 */
var sizeObj = (function(win) {
	var _width = parseInt(win.screen.width);
	var _screen = _width * win.devicePixelRatio;
	var scale = _width / _screen;
	document.write('<meta name="viewport" content="width= ' + _screen + ', minimum-scale = ' + scale + ', maximum-scale = ' + scale + ', user-scalable=no, target-densitydpi=device-dpi">');
	return {
		dpl: win.devicePixelRatio
	}
})(window);


/**
 * 重新封装mui-Ajax
 */
var luckyAjax = function(options){
	if(!options.closeWaiting){ // 默认打开加载中...
		plus.nativeUI.showWaiting();	
	}
	var defaults = {
		url:config.baseUrl,
		data:{
			device: 'mobile'
		},
		dataType: 'json',//服务器返回json格式数据
		type: 'post',//HTTP请求类型
		timeout: 10000,//超时时间设置为10秒；
		headers: {'Content-Type': 'application/json'}
	};
	var opt = mui.extend(true, defaults, options);
	console.log(opt);
	
	mui.ajax(opt.url, {
		data:opt.data,
		dataType:opt.dataType,
		type:opt.type,
		timeout:opt.timeout,
		success:function(data){
			if(!options.closeWaiting){
				plus.nativeUI.closeWaiting();
			}
			opt.success(data);
		},
		error:function(xhr, type, errorThrown){
			//opt.error(xhr, type, errorThrown);
			plus.nativeUI.closeWaiting();
		    mui.toast(errorThrown, {duration: 'short', type: 'div'});
		    return false
		}
	})
}


/**
 * 配置所有打开/关闭新窗口(page),切换窗口动画(tab),详情页窗口动画(detal)
 */
var animateObj = (function() {
	return {
		aniPage: {
			aniShow: 'zoom-fade-out', //页面显示动画，默认为”slide-in-right“；
			duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		aniTab: {
			aniShow: 'fade-in', //页面显示动画，默认为”slide-in-right“；
			duration: '350' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		aniDetal: {
			aniShow: 'fade-in', //页面显示动画，默认为”slide-in-right“；
			duration: '150' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		aniConfirm: {
			aniShow: 'zoom-fade-out', // 页面显示动画：从小变大，从透明到不透明
			duration: '200' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		aniForm: {
			aniShow: 'slide-in-bottom', // 页面显示动画：从下侧竖向滑动效果
			duration: '400' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		}
	}
})();

/**
 * 配置沉浸式栏的高度距离
 */
function statusbar() {
	if(!window.plus) {
		return;
	}
	var barTop = Math.round(plus.navigator.getStatusbarHeight()) * sizeObj.dpl;
	document.querySelector('#Js-header').style.paddingTop = barTop + 'px';
    plus.navigator.setStatusBarStyle('dark');
};
//判断用户是否登录
function isLogin(){
    var flag = plus.storage.getItem('timestamp')
    var timenow = new Date().getTime().toString().substr(0, 10)
    if (!flag || timenow > flag) {
        mui.openWindow({
            url: 'login.html',
            id: 'login',
            show: animateObj.aniPage
        });
    }
}
// 打开遮罩层，弹框
function showPopu(url, id, type, data) {
	var _self = plus.webview.currentWebview();
	var _mask = null; // 窗口：弹框对象
	var move = {};

	_self.setStyle({
		mask: 'rgba(0,0,0,0.5)'
	}); // 显示遮罩层

	_mask = plus.webview.create(url, id, { //创建窗口：弹框
		width: "100%",
		height: '100%',
		background: 'transparent',
		popGesture: "none"
		},
		{
			data: data
		}
	);

	switch(type){
		case 'center':
			move.ani = animateObj.aniConfirm.aniShow;
			move.dur = animateObj.aniConfirm.duration;
			break;
		case 'bottom':
			move.ani = animateObj.aniForm.aniShow;
			move.dur = animateObj.aniForm.duration;
			break;
	}
	_mask.show(move.ani, move.dur); // 显示弹框窗口
};

// 关闭遮罩层，弹框对象
var ClosePopu = function() {
	// 获取当前页面的对象
	this.self = plus.webview.currentWebview();
	// 获取当前页面的创建者
	this.opener = this.self.opener();

	// 创建透明全屏覆盖层，用途：点击透明区域可关闭遮罩层，弹框
	var popuDiv = document.createElement("div");
	popuDiv.id = 'maskInit';
	popuDiv.style.position = 'fixed';
	popuDiv.style.left = 0;
	popuDiv.style.top = 0;
	popuDiv.style.width = '100%';
	popuDiv.style.height = '100%';
	popuDiv.style.zIndex = 1;
	document.body.appendChild(popuDiv);
};

ClosePopu.prototype.closepop = function(){
	this.self.close();
	this.opener.setStyle({
		mask: 'none'
	});		
}



/*
 WebSocket 服务器主动推送信息
 */
//webSocket();
function webSocket(){
	var $ws = new WebSocket('ws://www.luckyins.com:2346');
	var heartCheck = {
	    timeout: 60000,//60ms
	    timeoutObj: null,
	    serverTimeoutObj: null,
	    reset: function(){
	        clearTimeout(this.timeoutObj);
	        clearTimeout(this.serverTimeoutObj);
	　　　　 this.start();
	    },
	    start: function(){
	        var self = this;
	        this.timeoutObj = setTimeout(function(){
	        	var uid = '469';
	            $ws.send(uid);
	            self.serverTimeoutObj = setTimeout(function(){
	                $ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
	            }, self.timeout)
	        }, this.timeout)
	    },
	}
	$ws.onopen = function () {
	   heartCheck.start();
	};
	$ws.onmessage = function (event) {
		var object = JSON.parse(event.data);
		alert(JSON.stringify(object))
	}
	$ws.onclose = function () {
	    heartCheck.reset();
	};
	$ws.onerror = function () {
	    heartCheck.reset();
	};
}


