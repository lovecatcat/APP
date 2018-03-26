var ins = new Vue({
    el: '#login-wrap',
    data: {
        login_type: 1, //1用户名登录  2手机验证码登录
        pwd_type: 2, //1明文  2密文
        user_name: '雪女', //用户名
        password: '123456', //密码
        channel_id: '', //渠道号
        tel: '15970195438', //手机号
        codesms: '', //验证码
        disabled: false,
        second: 60,
        time: 0
    },
    computed: {
        text: function () {
            return this.time > 0 ? this.time + 's后可重新获取' : '点击获取'
        }
    },
    methods: {

    }
})