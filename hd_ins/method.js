var SCID = '19';
var onlineIns = ['272', '276', '340', '348', '370', '16328']; // 上线的主险id
//               恒久    护航    青  福享金生    红     青
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

//数据初始化
var applicant = {
    holder_name: '张三', //姓名
    holder_ID_type: IDcard, //证件类型
    holder_ID_type_name: '身份证', //证件类型名
    holder_ID_no: '542221198105086418', //证件号码
    holder_birthday: '1981-05-08', //出生日期
    holder_ID_expire_end: '2020-01-01', //证件有效期
    holder_gender: MALE,//性别  1男  2女
    holder_mobile: '15923526890',//手机号
    holder_email: '454522525@126.com',//邮箱
    holder_height: '160',//身高
    holder_weight: '50',//体重
    holder_nation: NATION,//国籍
    holder_salary_from: 'LAF0001',//收入来源
    holder_salary_from_name: '工薪',//收入来源名
    holder_salary_avg: '20',//年收入

    holder_home_province: '20',//现在住址【省】
    holder_home_city: '323',//现在住址【市】
    holder_home_district: '2235',//现在住址【区】
    holder_home_district_name: '罗湖',//现在住址【区】名称
    holder_home_address: '测试测试测是', //现在住址【地址详情】
    holder_home_zip: '518021',//现在住址【邮编】
    mail_addr_type: false,//（通讯地址）同现在住址
    holder_contact_province: '4',//通讯地址【省】
    holder_contact_city: '87',//通讯地址【市】
    holder_contact_district: '',//通讯地址【区】
    holder_contact_province_name: '重庆',//通讯地址【省】名称
    holder_contact_city_name: '万州',//通讯地址【市】名称
    holder_contact_district_name: '',//通讯地址【区】名称
    holder_contact_address: '哈哈哈哈哈哈或分隔符付付付付付', //通讯地址【地址详情】
    holder_contact_zip: '404000',//通讯地址【邮编】

    holder_has_SSID: no_social_security,//是否有社保
    holder_marriage: marry_yes,//婚姻状况
    holder_job_code: 'LAE0681',//职业
    holder_job_name: '一般内勤人员',//职业名称
    holder_isTaxResidents: TAXTYPE, //税收标识
    resident_type: 'LAL0001' //居民类型
};
var assured = {
    rel_insured_holder: 'LAC0002',//是投保人的  配偶
    insured_name: '李四', //姓名
    insured_ID_type: IDcard, //证件类型
    insured_ID_type_name: '身份证', //证件类型名
    insured_ID_no: '54222119810508456x', //证件号码
    insured_birthday: '1980-05-08', //出生日期
    insured_ID_expire_end: '2020-10-10', //证件有效期
    insured_gender: FEMALE, //性别  1男  2女
    insured_mobile: '15963254578',//手机号
    insured_email: '54656565@126.com',//邮箱
    insured_height: '170',//身高
    insured_weight: '60',//体重
    insured_nation: NATION,//国籍
    insured_nation_name: '中国',//国籍
    insured_salary_from: 'LAF0001',//收入来源
    insured_salary_from_name: '工薪',//收入来源名
    insured_salary_avg: '50',//年收入

    addr_type: false,//是否所有地址同投保人,
    insured_home_province: '20',//现在住址【省】
    insured_home_city: '323',//现在住址【市】
    insured_home_district: '2237',//现在住址【区】
    insured_home_district_name: '南山',//现在住址【区】名称
    insured_home_address: '分隔符付付付付付分隔符付付付付付', //现在住址【地址详情】
    insured_home_zip: '518051',//现在住址【邮编】

    insured_has_SSID: false,//是否有社保
    insured_marriage: marry_yes,//婚姻状况
    insured_job_code: 'LAE0540',//职业
    insured_job_name: '内勤人员',//职业名称
    insured_isTaxResidents: TAXTYPE //税收标识
}
var beneficiary = {
    beneficiary_is_insured: 'LAN0004',//与被保人关系
    fullname: '洒洒水',//姓名
    ID_type: BOOKLET,//证件类型
    ID_no: '542221201705081201',//证件号码
    ID_expire_end: '9999-12-31',//证件有效期
    gender: FEMALE,//性别
    birthday: '2017-05-08',//出生日期
    sort_order: 1,//受益顺序
    rate: '100',//受益比例
    type: SY_TYPE,//受益类型：身故
    addr_type: 3,//地址类型 1同投保人 2同被保人 3否
    province: '20',
    city: '323',
    district: '2237',
    address: '手动发发的发手动发发的发手动',//详细地址,
    zip: '518051'//邮编
}
//

//证件号校验
var IDValidate = function (type, id, owner) {
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
                        appl.applicant.holder_birthday = idInfo.birth;
                        appl.applicant.holder_gender = sexCode[idInfo.sex];
                    } else if (owner === '被保人') {
                        assu.assured.insured_birthday = idInfo.birth;
                        assu.assured.insured_gender = sexCode[idInfo.sex];
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
var checkTerm = function (term, owner) {
    var toast_text = null
    if (!term || term === '0000-00-00') {
        toast_text = '证件有效期不能为空'
    } else if (/\d{4}(-|\/)\d{2}(-|\/)\d{2}(-|\/)/.test(term)) {
        toast_text = '有效日期格式不正确'
    } else if (new Date(term) - (new Date().getDate() - 1) < 0) {
        toast_text = '证件已过有效期'
    }
    const yearTime = 365 * 24 * 60 * 60 * 1000
    var age = ''
    if (owner === '投保人') {
        age = this.appl_age
    } else if (owner === '投保人') {
        age = this.assu_age
    }
    if (age) {
        if (age >= 15 && age <= 25) {
            if (new Date(term) - (new Date().getDate() - 1) > 10 * yearTime) {
                toast_text = '证件有效期错误'
            }
        } else if (age > 25 && age <= 45) {
            if (new Date(term) - (new Date().getDate() - 1) > 20 * yearTime) {
                toast_text = '证件有效期错误'
            }
        }
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
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
//校验投保人信息
var checkAppl = function () {
    var toast_text = null
    var vm = this
    if (!appl.applicant.holder_isTaxResidents) {
        toast_text = '请选择投保人居民税收类型'
    } else if (!IDValidate(IDcard, appl.applicant.holder_ID_no, '投保人')) {
        return false
    } else if (!checkTerm(appl.applicant.holder_ID_expire_end, '投保人')) {
        return false
    } else if (!checkName('投保人', appl.applicant.holder_name)) {
        return false
    } else if (!appl.applicant.holder_birthday) {
        toast_text = '投保人出生日期不能为空'
    } else if (appl.appl_age < 18) {
        toast_text = '投保人不能小于18岁'
    } else if (appl.appl_age > 60) {
        toast_text = '投保人不能大于60岁'
    } else if (!checkPhone('投保人', appl.applicant.holder_mobile)) {
        return false
    } else if (!appl.applicant.temp_holder_job_code) {
        toast_text = '投保人职业不能为空'
    } else if (!checkOccupation('投保人')) {
        return false
    } else if (appl.appl_age >= 18 && (appl.applicant.holder_job_code === '7852' || appl.applicant.holder_job_code === '7853')) {
        toast_text = '客户的职业类别与年龄不符'
    } else if (!appl.applicant.holder_marriage) {
        toast_text = '投保人婚姻状况不能为空'
    } else if (!appl.applicant.holder_salary_from) {
        toast_text = '投保人收入来源不能为空'
    } else if (!checkEarnings(1, appl.applicant.holder_salary_avg)) {
        return false
    } else if (!checkHeight('投保人', appl.applicant.holder_height)) {
        return false
    } else if (!checkWeight('投保人', appl.applicant.holder_weight)) {
        return false
    } else if (!checkEmail('投保人', appl.applicant.holder_email)) {
        return false
    } else if (!appl.applicant.resident_type) {
        toast_text = '投保人居民类型不能为空'
    } else if (!appl.applicant.holder_home_province) {
        toast_text = '投保人现在住址【省级】不能为空'
    } else if (!appl.applicant.holder_home_city && appl.applicant.holder_home_province !== '3877') {
        toast_text = '投保人现在住址【市级】不能为空'
    } else if (!appl.applicant.holder_home_district && appl.applicant.holder_home_province !== '3877') {
        toast_text = '投保人现在住址【县/区】不能为空'
    } else if (!checkAddress(appl.applicant.holder_home_address, '投保人')) {
        return false
    } else if (!checkZipcode(appl.applicant.holder_home_zip, appl.applicant.holder_home_province, '投保人')) {
        return false
    } else if (appl.applicant.mail_addr_type === 0 && !appl.applicant.holder_contact_province) {
        toast_text = '投保人通讯地区【省级】不能为空'
    } else if (appl.applicant.mail_addr_type === 0 && !appl.applicant.holder_contact_city && appl.applicant.holder_contact_province !== '3877') {
        toast_text = '投保人通讯地区【市级】不能为空'
    } else if (appl.applicant.mail_addr_type === 0 && !appl.applicant.holder_contact_district && appl.applicant.holder_contact_province !== '3877') {
        toast_text = '投保人通讯地区【县/区】不能为空'
    } else if (appl.applicant.mail_addr_type === 0 && !checkAddress(vm.applicant.holder_contact_address, '投保人通讯')) {
        return false
    } else if (appl.applicant.mail_addr_type === 0 && !checkZipcode(vm.applicant.holder_contact_zip, vm.applicant.holder_contact_province, '投保人通讯')) {
        return false
    }

    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true;
};
//校验被保人信息
var checkAssured = function () {
    // console.info('校验被保人信息')
    var toast_text = null
    const vm = this
    if (!assu.assured.rel_insured_holder) {
        toast_text = '请选择与投保人关系'
    } else if (!assu.assured.insured_isTaxResidents) {
        toast_text = '请选择被保人居民税收类型'
    } else if (!assu.assured.insured_ID_type) {
        toast_text = '被保人证件类型不能为空'
    } else if (!IDValidate(assu.assured.insured_ID_type, assu.assured.insured_ID_no, '被保人')) {
        return false
    } else if (!checkTerm(assu.assured.insured_ID_expire_end, '被保人')) {
        return false
    } else if (!vm.checkName('被保人', assu.assured.insured_name)) { //被保人
        return false
    } else if (!assu.assured.insured_birthday) {
        toast_text = '被保人出生日期不能为空'
    } else if (!checkPhone('被保人', assu.assured.insured_mobile)) {
        return false
    } else if (!assu.assured.temp_insured_job_code) {
        toast_text = '被保人职业不能为空'
    } else if (!checkOccupation('被保人')) {
        return false
    } else if (!checkEarnings(2, assu.assured.insured_salary_avg)) {
        return false
    } else if (!assu.assured.insured_marriage) {
        toast_text = '被保人婚姻状况不能为空'
    } else if (!assu.assured.insured_salary_from) {
        toast_text = '被保人收入来源不能为空'
    } else if (!checkHeight('被保人', assu.assured.insured_height)) {
        return false
    } else if (!checkWeight('被保人', assu.assured.insured_weight)) {
        return false
    } else if (!assu.assured.insured_home_province) {
        toast_text = '被保人现在住址【省级】不能为空'
    } else if (!assu.assured.insured_home_city && assu.assured.insured_home_province !== '3877') {
        toast_text = '被保人现在住址【市级】不能为空'
    } else if (!assu.assured.insured_home_district && assu.assured.insured_home_province !== '3877') {
        toast_text = '被保人现在住址【县/区】不能为空'
    } else if (!checkAddress(assu.assured.insured_home_address, '被保人')) {
        return false
    } else if (!checkZipcode(assu.assured.insured_home_zip, assu.assured.insured_home_province, '被保人')) {
        return false
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};
//职业限制
var checkOccupation = function(owner) {
    let toast_text = null
    let age = null
    let occu = null
    let sex = null
    if (owner === '投保人') {
        age = getAge(appl.applicant.holder_birthday)
        occu = appl.applicant.temp_holder_job_code
        sex = appl.applicant.holder_gender
    } else if (owner === '被保人') {
        age = getAge(assu.assured.insured_birthday)
        occu = assu.assured.insured_temp_job_code
        sex = assu.assured.insured_gender
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
}

//被保人为本人
var RSChanged = function(applicant) {
    if(assu.assured.rel_insured_holder ===ISASSURED){
            assu.assured.insured_name= applicant.holder_name //姓名
            assu.assured.insured_ID_type= IDcard //证件类型
            assu.assured.insured_ID_type_name= '身份证' //证件类型名
            assu.assured.insured_ID_no= applicant.holder_ID_no //证件号码
            assu.assured.insured_birthday= applicant.holder_birthday //出生日期
            assu.assured.insured_ID_expire_end= applicant.holder_ID_expire_end //证件有效期
            assu.assured.insured_gender= applicant.holder_gender //性别  1男  2女
            assu.assured.insured_mobile= applicant.holder_mobile//手机号
            assu.assured.insured_email= applicant.holder_email//邮箱
            assu.assured.insured_height= applicant.holder_height//身高
            assu.assured.insured_weight= applicant.holder_weight//体重
            assu.assured.insured_nation= NATION//国籍
            assu.assured.insured_nation_name= '中国'//国籍
            assu.assured.insured_salary_from= applicant.holder_salary_from//收入来源
            assu.assured.insured_salary_from_name= applicant.holder_salary_from_name//收入来源名
            assu.assured.insured_salary_avg= applicant.holder_salary_avg//年收入

            assu.assured.addr_type= true//是否所有地址同投保人
            assu.assured.insured_home_province= applicant.holder_contact_province//现在住址【省】
            assu.assured.insured_home_city= applicant.holder_contact_city//现在住址【市】
            assu.assured.insured_home_district= applicant.holder_contact_district//现在住址【区】
            assu.assured.insured_home_district_name= applicant.holder_contact_district_name//现在住址【区】名称
            assu.assured.insured_home_address= applicant.holder_contact_address //现在住址【地址详情】
            assu.assured.insured_home_zip= applicant.holder_contact_zip//现在住址【邮编】

            assu.assured.insured_has_SSID= applicant.holder_has_SSID//是否有社保
            assu.assured.insured_marriage= applicant.holder_marriage//婚姻状况
            assu.assured.insured_job_code= applicant.holder_job_code//职业
            assu.assured.temp_insured_job_code= applicant.temp_holder_job_code//职业代码
            assu.assured.insured_job_name= applicant.holder_job_name//职业名称
            assu.assured.insured_isTaxResidents= applicant.holder_isTaxResidents
    }
}