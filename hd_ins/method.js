var SCID = '19';
var onlineIns = ['272', '276', '340', '348', '370']; // 上线的主险id
//               恒久    护航    青  福享金生    红
//主险
var qwhh = '276'; //千万护航
var hjjk = '272'; //恒久健康
var fxjs = '348'; //福享金生
var wnh = '370'; //万年红
var wnq = '340'; //万年青

//附加险
var tbrhm = '273'; //投保人豁免重疾2017版
var hx = '279'; //恒祥
var hs = '278'; //恒顺
var zxak = '277'; //尊享安康
var hjax = '16205'; //恒久安心住院
var cjb = '373'; //传家宝

var zrwnzh = 'LBD0001' //转入万能账户

var ISASSURED = 'LAC0001'; //被保人是本人
var IDNO = ['LAA0001', 'LAA0002']; //身份证、户口本
var BOOKLET = 'LAA0002'; //户口本
var IDcard = 'LAA0001'; //身份证
var BORNid = 'LAA0005'; //出生证
var MALE = 'LAB0001'; //男
var FEMALE = 'LAB0002'; //女
var TAXTYPE = 'LAH0001'; //仅为中国税收居民
var NATION = 'LAI0001'; //中国
var BEN_ISASSURED = 'LAN0001'; //受益人是被保人
var BEN_DEFAULT = 'LAO0001';//受益人法定
var BEN_SPEC = 'LAO0002';//受益人指定
var SY_TYPE = 'LAP0001'; //受益类型：身故
var has_social_security = 'LAG0001'; //有社保
var no_social_security = 'LAG0002';//无社保
var marry_no = 'LAD0001'
var marry_yes = 'LAD0002'

//证件号校验
var IDValidate = function (type, id, owner,data) {
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
                    }
                }
                break;
            case 15382: //出生证
                if (id.length < 3) {
                    toast_text = owner + '出生证号码不能少于3位';
                }
                break;
        }
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
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
    if (!term || term === '0000-00-00') {
        toast_text = owner + '证件有效期不能为空'
    } else if (/\d{4}(-|\/)\d{2}(-|\/)\d{2}(-|\/)/.test(term)) {
        toast_text = owner + '有效日期格式不正确'
    } else if ((new Date(term).getTime() - asDays(-1)) < 0) {
        toast_text = owner + '证件已过有效期'
    }
    const yearTime = 365 * 24 * 60 * 60 * 1000
    var age = ''
    if (owner === '投保人') {
        age = getAge(e.holder_birthday)
    } else if (owner === '被保人') {
        age = getAge(e.insured_birthday)
    } else {
        age = getAge(e.beneficiary.birthday)
    }
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
    } else if (!m || m.length < 12) {
        toast_text = owner + '详细地址填写有误,请确认至少有12个汉字'
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//校验邮编
var checkZipcode = function (val, province, owner) {
    var toast_text = null;
    // console.log(val + province + owner);
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
    appl.holder_contact_province = appl.holder_home_province
    appl.holder_contact_city = appl.holder_home_city
    appl.holder_contact_district = appl.holder_home_district
    appl.holder_contact_province_name = '广东'
    appl.holder_contact_city_name = '深圳'
    appl.holder_contact_district_name = appl.holder_home_district_name
    appl.holder_contact_address = appl.holder_home_address
    appl.holder_contact_zip = appl.holder_home_zip
};
//校验投保人信息
var checkAppl = function (appl) {
    var toast_text = null
    var vm = this
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
    } else if (appl.appl_age < 18) {
        toast_text = '投保人不能小于18岁'
    } else if (appl.appl_age > 60) {
        toast_text = '投保人不能大于60岁'
    } else if (!checkPhone('投保人', appl.holder_mobile)) {
        return false
    } else if (!appl.temp_holder_job_code) {
        toast_text = '投保人职业不能为空'
    } else if (!checkOccupation('投保人',appl)) {
        return false
    } else if (appl.appl_age >= 18 && (appl.holder_job_code === '7852' || appl.holder_job_code === '7853')) {
        toast_text = '客户的职业类别与年龄不符'
    } else if (!appl.holder_marriage) {
        toast_text = '投保人婚姻状况不能为空'
    } else if (!appl.holder_salary_from) {
        toast_text = '投保人收入来源不能为空'
    } else if (!checkEarnings(1, appl.holder_salary_avg)) {
        return false
    } else if (!checkHeight('投保人', appl.holder_height)) {
        return false
    } else if (!checkWeight('投保人', appl.holder_weight)) {
        return false
    } else if (!checkEmail('投保人', appl.holder_email)) {
        return false
    } else if (!appl.resident_type) {
        toast_text = '投保人居民类型不能为空'
    } else if (!appl.holder_home_province) {
        toast_text = '投保人现在住址【省级】不能为空'
    } else if (!appl.holder_home_city) {
        toast_text = '投保人现在住址【市级】不能为空'
    } else if (!checkAddress(appl.holder_home_address, '投保人')) {
        return false
    } else if (!checkZipcode(appl.holder_home_zip, appl.holder_home_province, '投保人')) {
        return false
    } else if (appl.mail_addr_type ) {
        ApplSameHomeAddress(appl)
    } else if (!appl.mail_addr_type && !appl.holder_contact_province) {
        toast_text = '投保人通讯地区【省级】不能为空'
    } else if (!appl.mail_addr_type && !appl.holder_contact_city) {
        toast_text = '投保人通讯地区【市级】不能为空'
    } else if (!appl.mail_addr_type && !checkAddress(appl.holder_contact_address, '投保人通讯')) {
        return false
    } else if (!appl.mail_addr_type && !checkZipcode(appl.holder_contact_zip, appl.holder_contact_province, '投保人通讯')) {
        return false
    }

    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true;
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
    } else if (!checkHeight('被保人', assu.insured_height)) {
        return false
    } else if (!checkWeight('被保人', assu.insured_weight)) {
        return false
    } else if (!assu.insured_home_province) {
        toast_text = '被保人现在住址【省级】不能为空'
    } else if (!assu.insured_home_city) {
        toast_text = '被保人现在住址【市级】不能为空'
    } else if (!checkAddress(assu.insured_home_address, '被保人')) {
        return false
    } else if (!checkZipcode(assu.insured_home_zip, assu.insured_home_province, '被保人')) {
        return false
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
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
        occu = e.insured_temp_job_code
        sex = e.insured_gender
    }
    // console.log('职业：' + owner + 'age:' + age + ';occu:' + occu + ';sex:' + sex)
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

