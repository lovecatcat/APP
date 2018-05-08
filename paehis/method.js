var SCID = '8' //平安

var ISASSURED = 'LAC0008'; //被保人是本人
var COUPLE = 'LAC0009';//投被保人为配偶
var IDNO = ['LAA0006', 'LAA0013']; //身份证、户口本
var BOOKLET = 'LAA0013'; //户口本
var IDcard = 'LAA0006'; //身份证
var BORNid = 'LAA0012'; //出生证
var CHILDRENid = 'LAA0009'; //少儿证
var MALE = 'LAB0005'; //男
var FEMALE = 'LAB0006'; //女

var has_social_security = 'LAG0003'; //有社保
var no_social_security = 'LAG0004';//无社保


//整理下拉框需要的数据
var dataToselect = function (data, type) {
    var arr = [];
    mui.each(data, function (ind, ite) {
        arr.push({
            text: type ? ite.name : ite.enum_name,
            value: ite.id
        });
    });
    return arr;
};

//校验邮箱
var checkEmail = function (owner, email) {
    // console.log(owner + email);
    const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var toast_text = null;
    if (!email) {
        toast_text = owner + '邮箱不能为空';
    } else if (!reg.test(email)) {
        toast_text = '请输入' + owner + '正确格式的邮箱';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true;
};

// 校验手机号
var checkPhone = function (owner, phone) {
    // console.log('手机校验' + owner + phone);
    var toast_text = null;
    if (!phone) {
        toast_text = owner + '手机号码不能为空';
    } else if (phone.length !== 11) {
        toast_text = owner + '手机号码长度有误，请核对!';
    } else if (!/^1[3-9][0-9]{9}$/.test(phone)) {
        toast_text = owner + '手机号码不符合正常号码的校验规则';
    } else if (/^1[3-9][0-9](\d)\1{7}$/.test(phone)) {
        toast_text = owner + '手机号码录入有误';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true
};
//日期格式处理
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
