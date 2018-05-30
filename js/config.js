var config = {
	baseUrl: 'https://www.luckyins.com/api/api/invoke',  //团队管理服务器路径
	moduleURL: 'https://www.luckyins.com/api/api/',
	link: 'https://www.luckyins.com/index/', // 外部链接路径[闪电增员、]
	domain: 'https://www.luckyins.com'
};

//  var config = {
//      baseUrl: 'https://ts-www.luckyins.com/api/api/invoke',  //团队管理服务器路径
//      moduleURL: 'https://ts-www.luckyins.com/api/api/',
//      link: 'https://ts-www.luckyins.com/index/', // 外部链接路径[闪电增员、]
//      domain: 'https://ts-www.luckyins.com'
//  };


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
 * 获取当前手机的网络
 */
var nowNetwork = function() {
	var curNetwork = plus.networkinfo.getCurrentType();
	var networkObj = plus.networkinfo;
	switch(curNetwork){
		case networkObj.CONNECTION_TYPE:
			curNetwork = '网络连接状态未知';
		break;
		case networkObj.CONNECTION_UNKNOW:
			curNetwork = '网络连接状态未知';
		break;
		case networkObj.CONNECTION_NONE:
			curNetwork = '未连接网络';
		break;
		case networkObj.CONNECTION_ETHERNET:
			curNetwork = '有线网络';
		break;
		case networkObj.CONNECTION_WIFI:
			curNetwork = '无线WIFI网络';
		break;
		case networkObj['CONNECTION_CELL2G']:
			curNetwork = '蜂窝移动2G网络';
		break;
		case networkObj['CONNECTION_CELL3G']:
			curNetwork = '蜂窝移动3G网络';
		break;
		case networkObj['CONNECTION_CELL4G']:
			curNetwork = '蜂窝移动4G网络';
		break;
	}
	return curNetwork;
};


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

	mui.ajax(opt.url, {
		data:opt.data,
		dataType:opt.dataType,
		type:opt.type,
		timeout:opt.timeout,
		success:function(data){
			if(data.code == '-1'){
				plus.storage.clear();
				plus.nativeUI.closeWaiting();
				plus.runtime.restart();
			};
			if(!opt.closeWaiting){
				plus.nativeUI.closeWaiting();
			}
			opt.success(data);
		},
		error:function(xhr, type, errorThrown){
			//opt.error(xhr, type, errorThrown);
			plus.nativeUI.closeWaiting();
			
			//type：错误描述，可取值："timeout", "error", "abort", "parsererror"、"null"
			if(type == 'timeout'){
				mui.toast('网络请求超时，请稍后重试!', {duration: 'long', type: 'div'});	
			}else if(type == 'null' || type == 'abort'){
				mui.toast('网络异常，请检查您的网络!', {duration: 'long', type: 'div'});	
			}else{
				mui.toast(errorThrown, {duration: 'long', type: 'div'});	
				
				setTimeout(function(){
					// 截屏绘制 : 上传错误页面提示
					var bitmap= new plus.nativeObj.Bitmap('error');
					// 将webview内容绘制到Bitmap对象中
					plus.webview.currentWebview().draw(bitmap, function(){
						//console.log(bitmap.toBase64Data());
						
						bitmap.save("_doc/error.jpg" ,{} ,function(path){
							//console.log('保存图片成功：'+JSON.stringify(path));
							
							//src转base64
	       					var img = new Image()
				            img.src = path.target;
				            var canvas = document.createElement('canvas');
				            var drawer = canvas.getContext('2d');
				            img.onload = function () {
				                canvas.width = img.width;
				                canvas.height = img.height;
				                drawer.drawImage(img, 0, 0, canvas.width, canvas.height)
				                var base64Img = canvas.toDataURL('image/jpeg');
				                
				                // 删除本地图片
				                plus.io.resolveLocalFileSystemURL(path.target, function(e) {
									e.remove(function() {
										//console.log('删除成功')
									}, function() {
										//console.log('删除失败')
									})			
								}, function() {
									//console.log('读取失败')
								})
				            };
						},function(e){
							//console.log('保存图片失败：'+JSON.stringify(e));
						});
					},function(e){
						//console.log('截屏绘制图片失败：'+JSON.stringify(e));
					});
				}, 2000);
			};	
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

ClosePopu.prototype.savagery = function(){ // 关闭父窗口遮罩层
	this.opener.setStyle({
		mask: 'none'
	});
};

ClosePopu.prototype.closepop = function(){ //关闭窗口
	this.self.close();
	this.savagery();
};

ClosePopu.prototype.hidepop = function(){ // 隐藏窗口
	this.self.hide();
	this.savagery();
};