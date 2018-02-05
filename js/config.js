
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
