/**
 * Created by Administrator on 2018/4/4.
 */
var Tunnel = {
    /**
     * WebSocket实例
     */
    _webSocket: null,

    /**
     * 是否需要重新连接
     */
    _lockReconnect: false,

    /**
     * 传输报文(格式固定,否则服务器会拒绝登录)
     */
    _message: {uid: 0, type: 0, flag: ''},

    /**
     * WS服务器地址
     */
    _url: 'ws://114.55.41.160:2346',

    /**
     * 自定义事件处理方法
     */
    _action: null,

    /**
     * 是否停止全局请求
     */
    _isStop: false,

    /**
     * 重新连接次数
     */
    _rNumber: 0,

    /**
     * 创建WS实例
     * @param uid 用户ID
     * @param flag  用户终端唯一标识
     * @param action 事件处理
     * @constructor
     */
    Create: function (uid, flag, action) {
        if(typeof(uid) != 'undefined' && typeof(flag) != 'undefined' && typeof(action) != 'undefined'){
            Tunnel._message.uid = uid;
            Tunnel._message.flag = flag;
            Tunnel._action = action;
        }

        try {
            Tunnel._webSocket = new WebSocket(Tunnel._url);
            Tunnel.InitEventHandle();
        } catch (e) {
            Tunnel.Reconnect(Tunnel._url);
        }
    },

    /**
     * 初始化WS必要方法
     * @constructor
     */
    InitEventHandle: function () {
        Tunnel._webSocket.onclose = function () {
            if(!Tunnel._isStop) {
                Tunnel.Reconnect(Tunnel._url);
            }
        };
        Tunnel._webSocket.onerror = function () {
            if(!Tunnel._isStop) {
                Tunnel.Reconnect(Tunnel._url);
            }
        };
        Tunnel._webSocket.onopen = function () {
            Tunnel._message.type = 1;

            /* 发送登入请求 */
            Tunnel._webSocket.send(JSON.stringify(Tunnel._message));

            //心跳检测重置
            Tunnel.HeartCheck.reset().start();
        };

        Tunnel._webSocket.addEventListener('message', function (event) {
            /* 重复登录停止全局 */
            var _message = JSON.parse(event.data);
            if(parseInt(_message.code) > 0){
                Tunnel.HeartCheck.reset();
                Tunnel._isStop = true;
            }else{
                Tunnel.HeartCheck.reset().start();
            }
        });
        Tunnel._webSocket.onmessage = Tunnel._action;
    },

    /**
     *重新连接
     * @param url
     * @constructor
     */
    Reconnect: function () {
        if(Tunnel._lockReconnect) return;

        Tunnel._lockReconnect = true;

        //没连接上会一直重连，设置延迟避免请求过多.超过五次停止
        if(Tunnel._rNumber >= 5){
            Tunnel._isStop = true;
            return;
        }

        setTimeout(function () {
            Tunnel._rNumber++;
            Tunnel.Create();
            Tunnel._lockReconnect = false;
        }, 5000);
    },

    /**
     * 心跳计时
     */
    HeartCheck: {
        timeout: 18000,//3min
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function(){
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function(){
            var self = this;
            this.timeoutObj = setTimeout(function(){
                //这里发送一个心跳，后端收到后，返回一个心跳消息，onmessage拿到返回的心跳就说明连接正常
                Tunnel._message.type = 2;
                Tunnel._webSocket.send(JSON.stringify(Tunnel._message));

                self.serverTimeoutObj = setTimeout(function(){
                    //如果超过一定时间还没重置，说明后端主动断开了
                    //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    Tunnel._webSocket.close();
                }, self.timeout)
            }, this.timeout)
        }
    }
}