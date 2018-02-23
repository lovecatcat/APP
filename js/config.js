
/**
* 根据不同手机的屏幕Dpi，计算并重置屏幕缩放比例
*/
var sizeObj = (function(win){
	var _width = parseInt(win.screen.width);
	var _screen = _width * win.devicePixelRatio;
	var scale = _width/_screen;
	document.write('<meta name="viewport" content="width= '+_screen+', minimum-scale = '+scale+', maximum-scale = '+scale+', user-scalable=no, target-densitydpi=device-dpi">');
	return {
		dpl: win.devicePixelRatio
	}
})(window);


/**
* 配置所有打开/关闭新窗口(page),切换窗口动画(tab),详情页窗口动画(detal)
*/
var animateObj = (function(){
	return {
		aniPage:{
			aniShow:'zoom-fade-out',//页面显示动画，默认为”slide-in-right“；
			duration:'200'//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		aniTab:{
			aniShow:'fade-in',//页面显示动画，默认为”slide-in-right“；
			duration:'350'//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		aniDetal:{
			aniShow:'fade-in',//页面显示动画，默认为”slide-in-right“；
			duration:'150'//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		}
	}
})();

/**
* 配置沉浸式栏的高度距离
*/
function statusbar(){
	if(!window.plus){
		return;	
	}
	var barTop = Math.round(plus.navigator.getStatusbarHeight()) * sizeObj.dpl;
	document.querySelector('#Js-header').style.paddingTop = barTop + 'px';	
};
