const onlineIns = ['288', '292', '369', '378', '401'] // 上线的主险id

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

var Validator = new IDValidator();

//证件号校验
var IDValidate = function (type, id, owner) {
    var vm = this;
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
                        vm.applicant.holder_birthday = idInfo.birth;
                        vm.applicant.holder_gender = sexCode[idInfo.sex];
                    } else if (owner === '被保人') {
                        vm.assured.assured_birthday = idInfo.birth;
                        vm.assured.assured_gender = sexCode[idInfo.sex];
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
}
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
}