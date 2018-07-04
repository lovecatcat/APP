var SCID = '8' //平安

var ISASSURED = 'LAC0008'; //被保人是本人
var COUPLE = 'LAC0009';//投被保人为配偶
var OTHER = 'LAC0010'; //其他关系
var typename = {'LAA0006': '身份证', 'LAA0013': '户口本', 'LAA0012': '出生证','LAA0011':'驾驶证','LAA0009':'少儿证','LAA0010':'港澳台回乡证','LAA0007':'护照','LAA0008':'军人证'}
var IDNO = ['LAA0006', 'LAA0013','LAA0011','LAA0009']; //身份证、户口本、驾驶证、少儿证
var BOOKLET = 'LAA0013'; //户口本
var IDcard = 'LAA0006'; //身份证
var BORNid = 'LAA0012'; //出生证
var CHILDRENid = 'LAA0009'; //少儿证
var DRIVER = 'LAA0011'; //驾驶证
var HKTW = 'LAA0010'; //港澳台
var PASSPORT = 'LAA0007'; //护照
var SOLDIER = 'LAA0008'; //军人证
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

//校验姓名
var checkName = function(owner, name) {
    var toast_text = null
    var strLength = 0
    for (var i = 0; i < name.length; i++) {
        if ((name.charCodeAt(i) < 0) || (name.charCodeAt(i) > 255)) {
            strLength = strLength + 3
        } else {
            strLength = strLength + 1
        }
    }
    if (!name) {
        toast_text = owner + '姓名不能为空'
    } else if (strLength > 200) {
        toast_text = owner + '姓名长度不能超过200字符'
    } else if (/[a-z]/i.test(name)) { // 英文
        if (name.replace(/\s/, '').length < 3) {
            toast_text = owner + '姓名不小于3个字符'
        } else if (!/^[a-z]+[a-z\s]*[a-z]+$/i.test(name) || /(\s)\1/.test(name)) {
            toast_text = owner + '姓名填写有误'
        }
    } else if (/[\u4e00-\u9fa5·]/i.test(name)) { // 中文
        if (name.length < 2) {
            toast_text = owner + '姓名不小于2个汉字'
        } else if (!/^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*[\u4e00-\u9fa5]+$/i.test(name) || /(·)\1/.test(name)) {
            toast_text = owner + '姓名填写有误'
        }
    } else if (!/^[a-z]+[\sa-z]*[a-z]+$/i.test(name) && !/^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*[\u4e00-\u9fa5]+$/i.test(name)) { //中英文
        toast_text = owner + '姓名填写有误'
    }

    if (toast_text) {
        mui.toast(toast_text, {duration: 'long', type: 'div'});
        return false;
    }
    return true
};

//校验邮箱
var checkEmail = function (owner, email) {
    console.log(owner + email);
    const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var toast_text = null;
    if (!email) {
        toast_text = owner + '邮箱不能为空';
    } else if (!reg.test(email)) {
        toast_text = '请输入' + owner + '正确格式的邮箱';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'long', type: 'div'});
        return false;
    }
    return true;
};

// 校验手机号
var checkPhone = function (owner, phone) {
    console.log('手机校验' + owner + phone);
    var toast_text = null;
    if (!phone) {
        toast_text = owner + '手机号码不能为空';
    } else if (!/^1[3-9][0-9]{9}$|^00852[0-9]{8}$/.test(phone)) {// 港澳居民来往内地通行证 手机号位数可为11或13位
        toast_text = '请输入' + owner + '正确的11位或13位手机号'
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'long', type: 'div'});
        return false;
    }
    return true
};
//证件号校验
var IDValidate = function (type, id, owner, data) {
    console.log(type+';'+id)
    var Validator = new IDValidator();
    var toast_text = null;
    if (!type) {
        toast_text = owner + '证件类型不能为空';
    } else if (!id) {
        toast_text = owner + '证件号码不能为空';
    } else {
        switch (type) {
            case BOOKLET: // 户口簿
            case IDcard: // 身份证
            case DRIVER: //驾驶证
            case CHILDRENid: //少儿证
                // 0为女，1为男
                var sexCode = [FEMALE, MALE];

                // 不能为空
                if (!id) {
                    toast_text = owner + '证件号码不能为空';
                } else if (id.length !== 18) {
                    toast_text = owner + '证件号码不符合18位校验规则';
                } else if (!Validator.isValid(id, 18)) {
                    toast_text = owner + '证件号码不符合公安部校验规则，请确认!';
                } else {
                    const idInfo = Validator.getInfo(id);
                    if (owner === '投保人') {
                        data.holder_birthday = idInfo.birth;
                        data.holder_gender = sexCode[idInfo.sex];
                    } else if (owner === '被保人') {
                        data.insured_birthday = idInfo.birth;
                        data.insured_gender = sexCode[idInfo.sex];
                    }
                }
                break;

            case PASSPORT:// 护照
                if (!(/^.[A-Za-z0-9]{4,20}$/).test(id)) {
                    toast_text = '请输入' + owner + '3位以上有效的证件号码'
                }
                break;
            case HKTW://港澳台
                if (!(/^.[A-Za-z0-9()（）]{8,20}$/).test(id)) {
                    toast_text = '请输入' + owner + '至少8位且有效的港澳台证件号'
                }
                break;

            case SOLDIER:// 军人证/士兵证
                if (!(/^.*字第(\d{6,8})$/).test(id)) {
                    toast_text = '请输入' + owner + '正确格式的军人证号码'
                }
                break;
            case BORNid: //出生证
                if (id.length < 3) {
                    toast_text = owner + '出生证号码不能少于3位';
                }
                break;
        }
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'long', type: 'div'});
        return false;
    }
    return true;
};


//生日改变
var changeBirthday = function(owner,val) {
    console.log('changeBirthday'+owner+val)
    var age = getAge(val)
    if (!val) {
        mui.toast('请选择' + owner + '的出生日期', {duration: 'long', type: 'div'});
        return false
    }else if (owner === '投保人' && age < 16) {
        mui.toast('投保人不能小于16周岁', {duration: 'long', type: 'div'});
        return false
    } else if (owner === '被保人' && age > 65) {
        mui.toast('被保人不能大于65周岁', {duration: 'long', type: 'div'});
        return false
    } else if (owner === '被保人' && getDays(val) < 28) {
        mui.toast('被保人不能小于28天', {duration: 'long', type: 'div'});
        return false
    }
    return true
};

//计算年龄
var getAge = function (str) {
    if (!str) return;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var r = str.split('-').map(function (item) {
        return parseInt(item);
    });
    var age = year - r[0];
    if (r[1] > month || (r[1] === month && r[2] >= day)) { // 当月
        age -= 1;
    }
    return age;
};

//计算天数
var getDays = function(str) {
    if (!str) return
    var today = new Date()
    var birthDay = new Date(str)
    return parseInt((today - birthDay) / 1000 / 60 / 60 / 24)
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
