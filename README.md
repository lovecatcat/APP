
## 本地储存

- $state 状态信息
    - isLogin 是否登录
    - id 用户ID
- $skip_version 跳过的版本号
- $user 登录信息

## 版本号规则

- v2.0.0207
-  1        —— 大版本号
-  2        —— 小版本号
-  0207     —— 月份+版次（递增）

## 更新
接口地址：`www.ehuimeng.com/Public/Uploads/app/checklev.json`

报文如下：
```
{
  "package": {
    "id": "H517AA33E",
    "name": "com.huimeng.app"
  },
  "iOS": {
    "version": "2.0.0",
    "title": "汇盟e家 2.0 app 下载",
    "note": "",
    "url": ""
  },
  "Android": {
    "version": "2.0.0",
    "title": "汇盟e家 2.0 app 下载",
    "note": "",
    "url": "https://www.ehuimeng.com/Public/Uploads/app/H517AA33E_0416152535.apk"
  },
  "wgt": {
  	"iOS": {
		"version": "1.9.0413",
		"url": "https://www.ehuimeng.com/Public/Uploads/iOS/H517AA33E.wgt"
	},
	"Android": {
		"version": "1.9.0413",
		"url": "https://www.ehuimeng.com/Public/Uploads/Android/H517AA33E.wgt"
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
