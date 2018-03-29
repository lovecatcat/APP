var SCID = 19;
var onlineIns = ['272', '276', '340', '348', '370', '16328']; // 上线的主险id
//               恒久    护航    青  福享金生    红     青
//主险
var qwhh = 276; //千万护航
var hjjk = 272; //恒久健康
var fxjs = 348; //福享金生
var wnh = 370; //万年红
var wnq = 340; //万年青

//附加险
var tbrhm = 271; //投保人豁免重疾
var tbrhm2017 = 273; //投保人豁免重疾2017版
var hx = 279; //恒祥
var hs = 278; //恒顺
var zxak = 277; //尊享安康
var hjax = 16205; //恒久安心住院
var cjb = 16340; //传家宝

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


// 身份邮编对照表
var zipcodes = {
    '129': ['10'],
    '147': ['30'],
    '165': ['05', '06', '07'],
    '348': ['03', '04'],
    '479': ['01', '02', '13', '16'],
    '594': ['11', '12'],
    '713': ['13'],
    '783': ['15', '16'],
    '929': ['20'],
    '948': ['21', '22'],
    '1061': ['31', '32'],
    '1174': ['23', '24'],
    '1296': ['35', '36'],
    '1391': ['33', '34'],
    '1503': ['25', '26', '27'],
    '1660': ['45', '46', '47'],
    '1837': ['43', '44'],
    '1955': ['41', '42'],
    '2092': ['51', '52'],
    '2290': ['53', '54'],
    '2419': ['57'],
    '2451': ['40'],
    '2495': ['61', '62', '63', '64'],
    '2700': ['55', '56'],
    '2798': ['65', '66', '67'],
    '2944': ['85'],
    '3026': ['71', '72'],
    '3150': ['73', '74'],
    '3254': ['81'],
    '3306': ['75'],
    '3334': ['83', '84'],
    '3453': ['99'],
    '3844': ['99'],
    '3866': ['99'],
    '3877': ['99'],
    '24021': ['99']
};
//证件号校验
var IDValidate = function (type, id, owner) {
    var Validator = new IDValidator();
    var toast_text = null;
    console.log(id);
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
                        assu.assured.assured_birthday = idInfo.birth;
                        assu.assured.assured_gender = sexCode[idInfo.sex];
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
    console.log('手机校验' + owner + phone);
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
    console.log(owner + email);
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
    for (var i = 0; i < name.length; i++) {
        if ((name.charCodeAt(i) < 0) || (name.charCodeAt(i) > 255)) {
            strLength = strLength + 3
        } else {
            strLength = strLength + 1
        }
    }
    console.log('校验名字' + owner + name + strLength);
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
    } else if (!m || m.length < 3) {
        toast_text = owner + '详细地址填写有误,请确认至少有3个汉字'
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
    console.log(val + province + owner);
    if (!val) {
        toast_text = owner + '地址邮编不能为空';
    } else if (!/^\d{6}$/.test(val)) {
        toast_text = '请输入' + owner + '6位数字的地址邮编';
    } else if (zipcodes[province] && zipcodes[province].indexOf(val.substr(0, 2)) === -1) {
        toast_text = owner + '地址所属省份邮编，与输入的邮政编码开头不符';
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false;
    }
    return true;
};
//职业限制
var checkOccupation = function (owner) {
    var toast_text = null;
    var age = null;
    var occu = null;
    var sex = null;
    if (owner === '投保人') {
        age = appl.appl_age;
        occu = appl.applicant.holder_job_code;
        sex = appl.applicant.holder_gender;
    } else if (owner === '被保人') {
        age = assu.assu_age;
        occu = assu.assured.assured_job_code;
        sex = assu.assured.assured_gender;
    }
    console.log('职业：' + owner + 'age:' + age + ';occu:' + occu + ';sex:' + sex);
    if (sex === '15406' && occu === '7852') {
        //家庭主妇
        toast_text = owner + '职业类别与性别不符';
    } else if (age < 16 && occu !== '7530' && occu !== '7853' && occu !== '7850' && occu !== '7691') {
        //（军警校除外）（17周岁以下） | 学龄前儿童 | 无业人员 | 警校学生
        toast_text = owner + '职业类别与年龄不符';
    } else if (age >= 18 && (occu === '7530' || occu === '7853')) {
        //（军警校除外）（17周岁以下） | 学龄前儿童
        toast_text = owner + '职业类别与年龄不符';
    } else if (age < 45 && occu === '7849') {
        //离退休人员
        toast_text = owner + '职业类别与年龄不符';
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
    console.log('校验' + owner + '体重:' + val)
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
    } else if (!appl.applicant.holder_job_code) {
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
    } else if (!appl.checkEmail('投保人', appl.applicant.holder_email)) {
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
var checkAssured = function () {
    console.info('校验被保人信息')
    var toast_text = null
    const vm = this
    if (!vm.checkName('被保人', assu.assured.assured_name)) { //被保人
        return false
    } else if (!assu.assured.assured_ID_type) {
        toast_text = '被保人证件类型不能为空'
    } else if (!IDValidate(assu.assured.assured_ID_type, assu.assured.assured_ID_no, '被保人')) {
        return false
    } else if (!checkTerm(assu.assured.assured_ID_expire_end, '被保人')) {
        return false
    } else if (!assu.assured.assured_birthday) {
        toast_text = '被保人出生日期不能为空'
    } else if (!checkPhone('被保人', assu.assured.assured_mobile)) {
        return false
    } else if (!assu.assured.assured_home_province) {
        toast_text = '被保人现在住址【省级】不能为空'
    } else if (!assu.assured.assured_home_city && assu.assured.assured_home_province !== '3877') {
        toast_text = '被保人现在住址【市级】不能为空'
    } else if (!assu.assured.assured_home_district && assu.assured.assured_home_province !== '3877') {
        toast_text = '被保人现在住址【县/区】不能为空'
    } else if (!checkAddress(assu.assured.assured_home_address, '被保人')) {
        return false
    } else if (!checkZipcode(assu.assured.assured_home_zip, assu.assured.assured_home_province, '被保人')) {
        return false
    } else if (assu.assured.addr_type === 0 && !assu.assured.assured_contact_province) {
        toast_text = '被保人通讯地区【省级】不能为空'
    } else if (assu.assured.addr_type === 0 && !assu.assured.assured_contact_city && assu.assured.assured_contact_province !== '3877') {
        toast_text = '被保人通讯地区【市级】不能为空'
    } else if (assu.assured.addr_type === 0 && !assu.assured.assured_contact_district && assu.assured.assured_contact_province !== '3877') {
        toast_text = '被保人通讯地区【县/区】不能为空'
    } else if (assu.assured.addr_type === 0 && !checkAddress(assu.assured.assured_contact_address, '被保人通讯')) {
        return false
    } else if (assu.assured.addr_type === 0 && !checkZipcode(assu.assured.assured_contact_zip, assu.assured.assured_contact_province, '投保人通讯')) {
        return false
    } else if (!assu.assured.assured_job_code) {
        toast_text = '被保人职业不能为空'
    } else if (!checkOccupation('被保人')) {
        return false
    } else if (!assu.assured.assured_marriage) {
        toast_text = '被保人婚姻状况不能为空'
    } else if (!checkEarnings(2, assu.assured.assured_salary_avg)) {
        return false
    } else if (!checkHeight('被保人', assu.assured.assured_height)) {
        return false
    } else if (!checkWeight('被保人', assu.assured.assured_weight)) {
        return false
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'short', type: 'div'});
        return false
    }
    return true
};