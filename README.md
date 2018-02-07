## 可复用 webview
- mainView - 用于外链
- userView - 内置页面

## 本地储存

- $state 状态信息
    - isLogin 是否登录
    - admin_id 用户ID
- $skip_version 跳过的版本号
- $user 登录信息

## 版本号规则

- v1.2.0907
-  1        —— 大版本号
-  2        —— 小版本号
-  0907     —— 月份+版次（递增）

## 更新
接口地址：`www.ehuimeng.com/Public/Uploads/app/check.json`

报文如下：
```
{
  "package": {
    "id": "H5BED76AE",
    "name": "com.huimeng.app"
  },
  "iOS": {
    "version": "1.0",
    "title": "汇盟e家 1.0 app 下载",
    "note": "",
    "url": "https://itunes.apple.com/cn/app/%E6%B1%87%E7%9B%9Fe%E5%AE%B6-%E6%89%8B%E6%9C%BA%E7%89%88/id1298445808?mt=8"
  },
  "Android": {
    "version": "1.2.1207",
    "title": "汇盟e家(1.2.1207)版本更新",
    "note": "增加考勤打卡，优化更新流程",
    "url": "https://www.ehuimeng.com/Public/Uploads/app/H5BED76AE_1207141601.apk"
  },
  "wgt": {
  	"iOS": {
		"version": "1.2.1213",
		"url": "https://www.ehuimeng.com/Public/Uploads/iOS/H5BED76AE.wgt"
	},
	"Android": {
		"version": "1.2.1212",
		"url": "https://www.ehuimeng.com/Public/Uploads/Android/H5BED76AE.wgt"
	}
  }
}
```
## 完整更新

上面的 iOS和Android对于完整更新。

## 热更新

对应 wgt 对象中的内容

## 文件上传
请将apk文件或wgt更新包 上传到 对于url对应的服务器目录
