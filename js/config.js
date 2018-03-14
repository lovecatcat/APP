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
			duration: '350' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
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
};

// 打开遮罩层，弹框
function showPopu(url, id, type) {
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
	});
	
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

