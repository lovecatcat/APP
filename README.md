
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
    "version": "1.9.0421",
    "title": "汇盟e家 2.0 app 下载",
    "note": "",
    "url": "https://itunes.apple.com/us/app/%E4%BF%9D%E9%99%A9-%E7%94%A8%E7%A7%91%E6%8A%80%E8%B5%8B%E8%83%BD%E8%90%A5%E9%94%80-%E6%94%B9%E9%9D%A9%E4%BC%A0%E7%BB%9F%E4%BF%9D%E9%99%A9%E6%A8%A1%E5%BC%8F/id1298445808?l=zh&ls=1&mt=8"
  },
  "Android": {
    "version": "1.9.0421",
    "title": "汇盟e家 2.0 app 下载",
    "note": "",
    "url": "https://www.ehuimeng.com/Public/Uploads/app/H517AA33E_0420181055.apk"
  },
  "wgt": {
  	"iOS": {
		"version": "1.9.0509",
		"url": "https://www.ehuimeng.com/Public/Uploads/iOS/H517AA33E.wgt"
	},
	"Android": {
		"version": "1.9.0509",
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
