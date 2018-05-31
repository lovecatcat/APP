var SCID = '85'; //招商仁和

var onlineIns = ['1001']; // 上线的主险code
//               爱倍护

//主险
var abh = '1001'; //爱倍护

//附加险
var hmzj = '1002'; //附加豁免保险费重大疾病保险
var tbrhmds = '1011'; //附加投保人豁免保险费定期寿险
var ylnj = '1003'; //附加爱倍护养老年金
var zybc = '1018';//附加住院补偿
var zybt = '1017';//附加住院每日补贴
var ywmjz = '1015';//附加意外门急诊
var tbrhmzj = '1012';//附加投保人豁免保险费重大疾病保险


var typename = {'LAA004A': '身份证', 'LAA004B': '户口簿', 'LAA004D': '军人身份证','LAA004E':'士兵证','LAA004G':'中国护照','LAA004I':'港澳通行证','LAA004J':'台湾通行证','LAA004L':'出生证'}
var ISASSURED = 'LAC001C'; //被保人是本人
var COUPLE = 'LAC001D';//投被保人为配偶
var BCOUPLE = 'LAN003H';//受益人与被保人为配偶
var IDNO = ['LAA004A', 'LAA004B']; //身份证、户口本
var BOOKLET = 'LAA004B'; //户口本
var IDcard = 'LAA004A'; //身份证
var BORNid = 'LAA004L'; //出生证
var MALE = 'LAB0017'; //男
var FEMALE = 'LAB0018'; //女
var TAXTYPE = 'LAH0007'; //仅为中国税收居民
var NATION = 'LAI005L'; //中国
var unknowmarry = 'LAD001B' ;//婚姻状况未知

var SY_TYPE = 'LAP000C'; //受益类型：身故
var has_social_security = 'LAG000C'; //有社保
var no_social_security = 'LAG000D';//无社保

//证件号校验
var IDValidate = function (type, id, owner,data) {
    console.log('IDValidate'+type+';'+ id+';'+ owner)
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
                // 0为女，1为男
                var sexCode = [FEMALE, MALE];

                // 不能为空
                if (!id) {
                    toast_text = owner + '身份证号码不能为空';
                } else if (id.length !== 18) {
                    toast_text = owner + '不符合身份证号码18位校验规则';
                } else if (!Validator.isValid(id, 18)) {
                    toast_text = owner + '身份证号码不符合公安部校验规则，请确认!';
                } else {
                    const idInfo = Validator.getInfo(id);
                    if (owner === '投保人') {
                        data.holder_birthday = idInfo.birth;
                        data.holder_gender = sexCode[idInfo.sex];
                    } else if (owner === '被保人') {
                        data.insured_birthday = idInfo.birth;
                        data.insured_gender = sexCode[idInfo.sex];
                    } else {
                        data.birthday = idInfo.birth;
                        data.gender = sexCode[idInfo.sex];
                    }
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
//校验姓名
var checkName = function (owner, name) {
    var toast_text = null
    var strLength = 0
    if (name) {
        for (var i = 0; i < name.length; i++) {
            if ((name.charCodeAt(i) < 0) || (name.charCodeAt(i) > 255)) {
                strLength = strLength + 3
            } else {
                strLength = strLength + 1
            }
        }
    }
    // console.log('校验名字' + owner + name + strLength);
    if (!name) {
        toast_text = owner + '姓名不能为空';
    } else if (strLength > 200) {
        toast_text = owner + '姓名长度不能超过200字符';
    } else if (/[a-z]/i.test(name)) { // 英文
        if (name.replace(/\s/, '').length < 3) {
            toast_text = owner + '姓名不小于3个字符';
        } else if (!/^[a-z]+[a-z\s]*[a-z]+$/i.test(name) || /(\s)\1/.test(name)) {
            toast_text = owner + '姓名填写有误';
        }
    } else if (/[\u4e00-\u9fa5·]/i.test(name)) { // 中文
        if (name.length < 2) {
            toast_text = owner + '姓名不小于2个汉字';
        } else if (!/^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*[\u4e00-\u9fa5]+$/i.test(name) || /(·)\1/.test(name)) {
            toast_text = owner + '姓名填写有误';
        }
    } else if (!/^[a-z]+[\sa-z]*[a-z]+$/i.test(name) && !/^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*[\u4e00-\u9fa5]+$/i.test(name)) { //中英文
        toast_text = owner + '姓名填写有误';
    }

    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true
};
//加减几天的时间戳
var asDays = function (days) {
    var myDate = new Date();
    return myDate.setDate(myDate.getDate() + parseInt(days));
};
//证件有效期校验
var checkTerm = function (term, owner, e) {
    console.log('checkTerm:'+term+';'+owner)
    var toast_text = null
    var age = ''
    var idtype = ''
    if (owner === '投保人') {
        age = getAge(e.holder_birthday)
        idtype = e.holder_ID_type
    } else if (owner === '被保人') {
        age = getAge(e.insured_birthday)
        idtype = e.insured_ID_type
    } else {
        age = getAge(e.beneficiary.birthday)
        idtype = e.beneficiary.ID_type
    }
    if (idtype !== IDcard) {
        return true
    }
    if (!term || term === '0000-00-00') {
        toast_text = owner + '证件有效期不能为空'
    } else if (/\d{4}(-|\/)\d{2}(-|\/)\d{2}(-|\/)/.test(term)) {
        toast_text = owner + '有效日期格式不正确'
    } else if ((new Date(term).getTime() - asDays(-1)) < 0) {
        toast_text = owner + '证件已过有效期'
    }
    const yearTime = 365 * 24 * 60 * 60 * 1000


    if (age) {
        console.log(owner +'age:'+age+'term:'+term)
        if (age >= 15 && age <= 25) {
            if ((new Date(term).getTime() - asDays(-1)) > 10 * yearTime) {
                toast_text = owner + '证件有效期错误'
            }
        } else if (age > 25 && age <= 45) {
            if ((new Date(term).getTime() - asDays(-1)) > 20 * yearTime) {
                toast_text = owner + '证件有效期错误'
            }
        }
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//详细地址校验
var checkAddress = function (val, owner) {
    var toast_text = null
    var m = val.match(/[\u4e00-\u9fa5]{1}/g)
    if (!val) {
        toast_text = '请录入' + owner + '详细地址'
    } else if (!m || m.length < 4) {
        toast_text = owner + '详细地址填写有误,请确认至少有4个汉字'
    } else if (!m || m.length > 50) {
        toast_text = owner + '详细地址不能超过50个汉字'
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};

//校验邮编
var checkZipcode = function (val, owner) {
    var toast_text = null;
    console.log(val + owner);
    if (!val) {
        toast_text = owner + '地址邮编不能为空';
    } else if (!/^\d{6}$/.test(val)) {
        toast_text = '请输入' + owner + '6位数字的地址邮编';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true;
};

//校验年收入
var checkEarnings = function (owner, value) {
    var toast_text = null;
    var who = owner === 1 ? '投保人' : '被保人';
    console.log('check' + who + '年收入' + value)
    if (owner === 2) {
        return true;
    } else if (!value && value !== 0) {
        toast_text = '请录入' + who + '年收入';
    } else if (value < 0) {
        toast_text = '' + who + '年收入格式输入不正确';
    } else if (!/^\d+(.\d{0,2})?$/g.test(value)) {
        toast_text = who + '年收入请保留2位小数';
    } else if (value.toString().length > 8) {
        toast_text = who + '年收入数值超出范围, 请确保单位为万元';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//校验身高
var checkHeight = function (owner, val) {
    if (!val) {
        this.$toast.open('请录入' + owner + '身高')
        return false
    } else if (!/^\d+$/g.test(val)) {
        mui.toast(owner + '身高请保留整数', {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//校验体重
var checkWeight = function (owner, val) {
    // console.log('校验' + owner + '体重:' + val)
    if (!val) {
        mui.toast('请录入' + owner + '体重', {duration: 'short', type: 'div'});
        return false;
    } else if (!/^\d+(.\d{0,2})?$/g.test(val)) {
        mui.toast(owner + '体重请保留2位小数', {duration: 'short', type: 'div'});
        return false;
    }
    return true;
};
//投保人通讯地址同居住地址
var ApplSameHomeAddress = function (appl) {
    appl.holder_contact_province = appl.holder_home_province //居住地【省】
    appl.holder_contact_city = appl.holder_home_city //居住地【市】
    appl.holder_contact_district = appl.holder_home_district //居住地【区】
    appl.holder_contact_ssq_name = appl.holder_home_ssq_name //省市区名称
    appl.holder_contact_province_name = appl.holder_home_province_name //居住地【省】名称
    appl.holder_contact_city_name = appl.holder_home_city_name //居住地【市】名称
    appl.holder_contact_district_name = appl.holder_home_district_name //居住地【区】名称
    appl.holder_contact_address = appl.holder_home_address  //居住地【地址详情】
    appl.holder_contact_zip = appl.holder_home_zip //居住地【邮编】
};
//校验投保人信息
var checkAppl = function (appl) {
    var toast_text = null
    var appl_age = getAge(appl.holder_birthday);
    if (!appl.holder_isTaxResidents) {
        toast_text = '请选择投保人居民税收类型'
    } else if (!IDValidate(IDcard, appl.holder_ID_no, '投保人',appl)) {
        return false
    } else if (!checkTerm(appl.holder_ID_expire_end, '投保人',appl)) {
        return false
    } else if (!checkName('投保人', appl.holder_name)) {
        return false
    } else if (!appl.holder_birthday) {
        toast_text = '投保人出生日期不能为空'
    } else if (appl_age < 18) {
        toast_text = '投保人不能小于18岁'
    } else if (appl_age > 60) {
        toast_text = '投保人不能大于60岁'
    } else if (!checkPhone('投保人', appl.holder_mobile)) {
        return false
    } else if (!appl.temp_holder_job_code) {
        toast_text = '投保人职业不能为空'
    } else if (!checkOccupation('投保人',appl)) {
        return false
    } else if (!appl.holder_company) {
        toast_text = '请填写投保人工作单位'
    } else if (!checkEarnings(1, appl.holder_salary_avg)) {
        return false
    } else if (!checkHeight('投保人', appl.holder_height)) {
        return false
    } else if (!checkWeight('投保人', appl.holder_weight)) {
        return false
    } else if (!checkEmail('投保人', appl.holder_email)) {
        return false
    } else if (!appl.holder_home_province) {
        toast_text = '投保人居住地【省级】不能为空'
    } else if (!appl.holder_home_city) {
        toast_text = '投保人居住地【市级】不能为空'
    } else if (!checkAddress(appl.holder_home_address, '投保人')) {
        return false
    } else if (!checkZipcode(appl.holder_home_zip, '投保人')) {
        return false
    } else if (appl.mail_addr_type ) {
        ApplSameHomeAddress(appl)
    }

    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true;
};
//计算天数
var getDays = function(str) {
    if (!str) return
    var today = new Date()
    var birthDay = new Date(str)
    return parseInt((today - birthDay) / 1000 / 60 / 60 / 24)
};

//证件类型校验
var checkIDtype = function (birthday, idtype, owner) {
    var toast_text = null
    var age = getAge(birthday)
    if (age > 2 && idtype === BORNid) {
        toast_text = owner + '大于2周岁不能选择出生证';
    } else if ((age < 2 || age > 16) && idtype === BOOKLET) {
        toast_text = owner + '2周岁至16周岁才能选择户口本';
    } else if (getDays(birthday) < 30) {
        toast_text = '被保人0周岁需出生满30天';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true
};
//校验被保人信息
var checkAssured = function (assu) {
    // console.info('校验被保人信息')
    var toast_text = null
    const vm = this
    if (!assu.rel_insured_holder) {
        toast_text = '请选择与投保人关系'
    } else if (!assu.insured_isTaxResidents) {
        toast_text = '请选择被保人居民税收类型'
    } else if (!assu.insured_ID_type) {
        toast_text = '被保人证件类型不能为空'
    } else if (!IDValidate(assu.insured_ID_type, assu.insured_ID_no, '被保人',assu)) {
        return false
    } else if (!checkTerm(assu.insured_ID_expire_end, '被保人',assu)) {
        return false
    } else if (!vm.checkName('被保人', assu.insured_name)) { //被保人
        return false
    } else if (!assu.insured_birthday) {
        toast_text = '被保人出生日期不能为空'
    }else if(!checkIDtype(assu.insured_birthday,assu.insured_ID_type,'被保人')){
        return false
    } else if (!checkPhone('被保人', assu.insured_mobile)) {
        return false
    } else if (!assu.temp_insured_job_code) {
        toast_text = '被保人职业不能为空'
    } else if (!checkOccupation('被保人',assu)) {
        return false
    } else if (!checkEarnings(2, assu.insured_salary_avg)) {
        return false
    } else if (!assu.insured_marriage) {
        toast_text = '被保人婚姻状况不能为空'
    } else if (!assu.insured_salary_from) {
        toast_text = '被保人收入来源不能为空'
    } else if (!assu.insured_company) {
        toast_text = '请填写被保人工作单位，无工作单位请填写‘无’'
    } else if (!checkHeight('被保人', assu.insured_height)) {
        return false
    } else if (!checkWeight('被保人', assu.insured_weight)) {
        return false
    } else if (!assu.insured_home_province) {
        toast_text = '被保人现在住址【省级】不能为空'
    } else if (!assu.insured_home_city) {
        toast_text = '被保人现在住址【市级】不能为空'
    } else if (!checkHomeDistrict(assu.insured_home_district, '被保人')) {
        return false
    } else if (!checkAddress(assu.insured_home_address, '被保人')) {
        return false
    } else if (!checkZipcode(assu.insured_home_zip, '被保人')) {
        return false
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//被保人体质指数
// var checkHeightWeight = function (h, w) {
//     var flag = (w / (h * h) * 10000.00).toFixed(2)
//     if (flag < 18 || flag > 28) {
//         mui.toast('被保人体质指数' + flag + '不在18~28之间', {duration: 'short', type: 'div'});
//         return false
//     }
//     return true
// };
//职业限制
var checkOccupation = function(owner,e) {
    var toast_text = null
    var age = null
    var occu = null
    var sex = null
    if (owner === '投保人') {
        age = getAge(e.holder_birthday)
        occu = e.temp_holder_job_code
        sex = e.holder_gender
    } else if (owner === '被保人') {
        age = getAge(e.insured_birthday)
        occu = e.temp_insured_job_code
        sex = e.insured_gender
    }
    console.log('职业：' + owner + 'age:' + age + ';occu:' + occu + ';sex:' + sex)
    if (sex === MALE && occu === 'LAE0968') {
        //家庭主妇
        toast_text = owner + '职业类别与性别不符'
    } else if (age < 16 && occu !== 'LAE0646' && occu !== 'LAE0969' && occu !== 'LAE0966' && occu !== 'LAE0807') {
        //军警校除外(17周岁以下) | 学龄前儿童 | 无业人员 | 警校学生
        toast_text = owner + '职业类别与年龄不符'
    } else if (age >= 18 && (occu === 'LAE0646' || occu === 'LAE0969')) {
        // 军警校除外(17周岁以下) | 学龄前儿童
        toast_text = owner + '职业类别与年龄不符'
    } else if (age < 45 && occu === 'LAE0965') {
        //离退休人员
        toast_text = owner + '职业类别与年龄不符'
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//出生证、户口本 长期有效
var astypeChange = function () {
    assu.assured.insured_ID_no = ''
    if (assu.assured.insured_ID_type === BOOKLET || assu.assured.insured_ID_type === BORNid) {
        assu.assured.insured_ID_expire_end = '9999-12-31'
        assu.longTerm = true
    } else {
        assu.assured.insured_ID_expire_end = ''
        assu.longTerm = false
    }
};
//获取市/区
var getCityArea = function (id, cb) {
    luckyAjax({
        data: {
            server: 'PolicyIns.getArea',
            data: JSON.stringify({'id': id})
        },
        success: function (res) {
            if (res.code) {
                var arr = [];
                mui.each(res.data, function (ind, ite) {
                    arr.push({
                        text: ite.name,
                        value: ite.id,
                        zip: ite.zip_code
                    });
                });
                cb(arr)
            } else {
                cb()
            }
        }
    })
}
//获取职业
var getOccu = function (id, cb) {
    luckyAjax({
        data: {data: JSON.stringify({'id': id}), server: 'PolicyIns.getBasicEnumCode'},
        success: function (data) {
            if (data.code) {
                var arr = [];
                mui.each(data.data, function (ind, ite) {
                    arr.push({
                        text: ite.name,
                        value: ite.id
                    });
                });
                cb(arr)
            } else {
                cb()
            }
        }
    });
};
var AssuSameApplAddress = function (assu,applicant) {
    assu.insured_home_province = '20'//现在住址【省】
    assu.insured_home_city = '323'//现在住址【市】
    assu.insured_home_district = applicant.holder_home_district
    assu.insured_home_district_name = applicant.holder_home_district_name
    assu.insured_home_address = applicant.holder_home_address
    assu.insured_home_zip = applicant.holder_home_zip
};
//被保人为本人
var RSChanged = function(assu,applicant) {
    if(assu.rel_insured_holder ===ISASSURED){
        assu.insured_name= applicant.holder_name //姓名
        assu.insured_ID_type= IDcard //证件类型
        assu.insured_ID_type_name= '身份证' //证件类型名
        assu.insured_ID_no= applicant.holder_ID_no //证件号码
        assu.insured_birthday= applicant.holder_birthday //出生日期
        assu.insured_ID_expire_end= applicant.holder_ID_expire_end //证件有效期
        assu.insured_gender= applicant.holder_gender //性别  1男  2女
        assu.insured_mobile= applicant.holder_mobile//手机号
        assu.insured_email= applicant.holder_email//邮箱
        assu.insured_height= applicant.holder_height//身高
        assu.insured_weight= applicant.holder_weight//体重
        assu.insured_nation= NATION//国籍
        assu.insured_nation_name= '中国'//国籍
        assu.insured_company= applicant.holder_company//工作单位
        assu.insured_salary_from= applicant.holder_salary_from//收入来源
        assu.insured_salary_from_name= applicant.holder_salary_from_name//收入来源名
        assu.insured_salary_avg= applicant.holder_salary_avg//年收入
        assu.addr_type= true//是否所有地址同投保人
        assu.insured_has_SSID= applicant.holder_has_SSID//是否有社保
        assu.insured_marriage= applicant.holder_marriage//婚姻状况
        assu.insured_job_code= applicant.holder_job_code//职业
        assu.temp_insured_job_code= applicant.temp_holder_job_code//职业代码
        assu.insured_job_name= applicant.holder_job_name//职业名称
        assu.insured_isTaxResidents= applicant.holder_isTaxResidents
    } else {
        if(applicant.holder_ID_no === assu.insured_ID_no && assu.insured_ID_type === applicant.holder_ID_type){
            mui.toast('被保人非本人时证件号不能与投保人相同', {duration: 'short', type: 'div'});
            return false
        }
    }
    if (assu.addr_type) {
        AssuSameApplAddress(assu, applicant)
    }
    return true
}
//临时信息保存
var saveTemp = function (data) {
    luckyAjax({
        data: {data: JSON.stringify(data), server: 'PolicyIns.saveUserInfo'},
        closeWaiting: true,
        success: function (data) {
            if (data.code) {
                console.log('保存成功');
            } else {
                console.log('保存失败');
                return false;
            }
        }
    });
};
//深度拷贝
var deepClone = function (obj) {
    var newObj = obj instanceof Array ? [] : {};
    for (var i in obj) {
        newObj[i] = typeof obj[i] == 'object' ?
            deepClone(obj[i]) : obj[i];
    }
    return newObj;
}

