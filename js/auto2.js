var itemName = ['bus','car','brand','show','insList','owner','applicant','assured','address'];
const CityID = {
    '323': '440301',   // 深圳
    '321': '440100',   // 广州
    '328': '440800'    // 湛江
}
const insurerCodes = ['TPIC', 'TAIC', 'UTIC', 'CPIC', 'ASTP']    // 可以报价的公司（太保、中华、阳光、天安、安盛天平、太平）
const insurerCodes_copy = ['TPIC', 'TAIC', 'UTIC', 'CPIC', 'ASTP']    // 可以报价的公司（太保、中华、阳光、天安、安盛天平、太平）
const ICName = {
    // 'PAIC': '平安',
    // 'PICC': '人保',
    // 'CICP': '中华',
    // 'CCIC': '大地',
    // 'YGBX': '阳光',
    // 'HAIC': '华安',
    // 'HHIC': '华海',
    // 'DHIC': '鼎和',
    // 'LIHI': '利宝',
    // 'FDIC': '富德',
    // 'CHAC': '诚泰',
    // 'CLPC': '国寿财',
    // 'HTIC': '华泰',
    // 'APIC': '永诚',
    // 'ACIC': '安诚',
    // 'YTBX': '亚太',
    // 'DBIC': '都邦',
    // 'YAIC': '永安',
    // 'CALI': '长安责任',
    // 'ZKIC': '紫金',
    // 'AHIC': '安华',
    // 'CINDA': '信达',
    // 'JTBX': '锦泰',
    // 'ZHONGAN': '众安'
    'ASTP': '安盛天平',
    'UTIC': '众诚',
    'TAIC': '天安',
    'CPIC': '太保',
    'TPIC': '太平'
}
const MI = ['A', 'B', 'D3', 'D4', 'Z', 'G1', 'L', 'X1', 'R'] //不计免赔险对应险种
const MI2 = ['MA', 'MB', 'MD3', 'MD4', 'MZ', 'MG1', 'ML', 'MX1', 'MR'] //不计免赔险

const DI = ['A', 'B', 'D3', 'D4', 'G1', 'F'] //默认险种

const List1 = ['F', 'Z', 'Q3', 'X1', 'L', 'Z3', 'Z2'] //车损险（关联）
const List2 = ['B', 'D3', 'D4'] //责任险（关联）
// 商业险列表
var biCoverageList = [
    { //默认投保列表
        'coverageCode': 'A',
        'coverageName': '机动车损失保险',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'B',
        'coverageName': '第三者责任险',
        'insuredAmount': 1000000,
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'G1',
        'coverageName': '全车盗抢险',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'D3',
        'coverageName': '车上人员责任保险(驾驶员)',
        'insuredAmount': 50000,
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'D4',
        'coverageName': '车上人员责任保险(乘客)',
        'insuredAmount': 50000,
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'MA',
        'coverageName': '不计免赔险(机动车损失保险)',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'MB',
        'coverageName': '不计免赔险(第三者责任险)',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'MD3',
        'coverageName': '不计免赔险(车上人员责任保险(驾驶员)',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
    }, {
        'coverageCode': 'MD4',
        'coverageName': '不计免赔险(车上人员责任保险(乘客)',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
        /*  }, {
            'coverageCode': 'F',
            'coverageName': '玻璃单独破碎险',
            'insuredAmount': 'Y',
            'insuredPremium': 0,
            'flag': 1*/
    }, {
        'coverageCode': 'MG1',
        'coverageName': '不计免赔险（全车盗抢保险）',
        'insuredAmount': 'Y',
        'insuredPremium': 0,
        'flag': null
    }
]
// 交强险列表
var ciCoverageList = [{
    'coverageCode': 'FORCEPREMIUM',
    'coverageName': '交强险 + 车船税',
    'insuredAmount': 'Y',
    'flag': "",
    'insuredPremium': "",

}]
// 返回修改车牌号
var changeLicenseNo = function () {
    setTimeout(function () {
        mui.openWindow({
            url: 'auto2c.html',
            id: 'auto2c',
            show: animateObj.aniDetal
        })
    },500)
}
// 校验车牌号
var checkLicense = function (isNew, cityNo) {
    var toast_text = null
    if (!isNew) {
        if (!cityNo) {
            toast_text = '车牌号码不能为空';
        }else if (/^[a-zA-Z]{1}[a-zA-Z0-9]{5,8}$/.test(cityNo) === false) {
            toast_text = '请输入正确的车牌号码';
        }

        if (toast_text) {
            mui.toast(toast_text, {duration: 'short', type: 'div'});
            return false;
        }
    }
    return true
}
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
// 校验手机号
var checkPhone = function (owner, phone) {
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
//证件号校验
var IDValidate = function (owner, id, data) {
    var Validator = new IDValidator();
    var toast_text = null;
    var sexCode = [0, 1];
    if (!id) {
        toast_text = owner + '证件号码不能为空';
    } else {
        if (!id) {
            toast_text = owner + '身份证号码不能为空';
        } else if (id.length !== 18) {
            toast_text = owner + '身份证号码不符合18位校验规则';
        } else if (!Validator.isValid(id, 18)) {
            toast_text = owner + '身份证号码不符合公安部校验规则，请确认!';
        } else {
            const idInfo = Validator.getInfo(id);
            data.birthday = idInfo.birth;
            data.sex = sexCode[idInfo.sex];
        }
    }
    if (toast_text) {
        mui.toast(toast_text, {duration: 'long', type: 'div'});
        return false;
    }
    return true;
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
var generatorID = function () {
    var n = 3 //随机位数
    var time = new Date()
    var now = time.Format('yyyyMMddhhmmss')
    var ms = '00' + time.getMilliseconds()
    var rand = Math.round((Math.random()) * Math.pow(10, n))
    return now + ms.slice(-3) + rand
}

// insurerCode == 公司代码， quote == 报价信息
var setCarinsData = function (insurerCode, quote) {
    console.log(JSON.stringify(quote))
    var bus =  JSON.parse(plus.storage.getItem('bus'))
    var owner =  JSON.parse(plus.storage.getItem('owner'))
    var applicant = JSON.parse(plus.storage.getItem('applicant'))
    var assured = JSON.parse(plus.storage.getItem('assured'))
    var address = JSON.parse(plus.storage.getItem('address'))
    var car = JSON.parse(plus.storage.getItem('car'))
    var brand = JSON.parse(plus.storage.getItem('brand'))
    var insList = JSON.parse(plus.storage.getItem('insList'))
//  var coverageList = []
//  if (insList.ciCoverageList.length == 0) {
//      coverageList = insList.biCoverageList
//  } else {
//      coverageList = insList.biCoverageList.concat(insList.ciCoverageList)
//  }
    var data = {
        sale_id: bus.user_id,
        business_no: bus.business_no,
        thp_business_no: quote? quote.bizID: "",
        company: insurerCode,
        ins_city: bus.cityCode,
        zhekou_rate: '', // 折标率
        app_name: applicant.name,
        app_cardno: applicant.Idno,
        app_tel: applicant.mobile,
        app_sex: applicant.sex,
        app_birthday: applicant.birthday,

        ass_name: assured.name,
        ass_cardno: assured.Idno,
        ass_tel: assured.mobile,
        ass_sex: assured.sex,
        ass_birthday: assured.birthday,

        address_name: address? address.name: "",
        address_address: address? (address.location + address.detail): "",
        address_mobile: address? address.mobile: "",
        address_mail: address? address.email: "",

        vehicle_owner: owner.name,
        vehicle_tel: owner.mobile,
        vehicle_idcard: owner.Idno,

        vehicle_no: car.licenseNo,
        vehicle_model: ([brand.brandName,brand.vehicleFgwName,brand.parentVehName].join(' ')).trim(),
        vehicle_model_no: brand.brandCode,
        vin_code: car.frameNo,
        vehicle_type: 1, //机动车种类 :1是客车, 2是货车
        is_operating: 1, //非营运
        engine_no: car.engineNo,
        car_seats: car.seatCount,
        register_date: car.registerDate,
        car_isnew: car.car_isnew,
        is_trans: car.isTrans ? '1' : '0',
        trans_date: car.transDate,

        coverageList: quote? quote.coverageList: coverageList,
        // biBeginDate: state.Calculated.biBeginDate || state.biBeginDate,
        // ciBeginDate: state.Calculated.ciBeginDate || state.ciBeginDate,
        biBeginDate: insList.biBeginDate,
        ciBeginDate: insList.ciBeginDate,
        commercial: insList.commercial,
        forcepremium: insList.forcepremium,
        vehicle_tax: quote? quote.carshipTax: 0,
        // 'vehicle_tax': state.Calculated.carshipTax || 0,
        bitotal: quote? quote.biPremium: 0,
        // 'bitotal': state.Calculated.biPremium || 0,
        citotal: quote? quote.ciPremium: 0,
        // 'citotal': state.Calculated.ciPremium || 0,
        image: []
        // 'image': state.images || []
    }
    console.log(JSON.stringify(data))
    return data
}

var setCalculateData = function (insurerCode) {
    var bus =  JSON.parse(plus.storage.getItem('bus'))
    var owner =  JSON.parse(plus.storage.getItem('owner'))
    var applicant = JSON.parse(plus.storage.getItem('applicant'))
    var assured = JSON.parse(plus.storage.getItem('assured'))
    var car = JSON.parse(plus.storage.getItem('car'))
    var brand = JSON.parse(plus.storage.getItem('brand'))
    var insList = JSON.parse(plus.storage.getItem('insList'))

    var coverageList = []
    if (insList.ciCoverageList.length == 0) {
        coverageList = insList.biCoverageList
    } else {
        coverageList = insList.biCoverageList.concat(insList.ciCoverageList)
    }
    var data = {
        thpBizID: bus.business_no,
        refId: '',
        remittingTax: null,
        invoiceType: 1,
        payType: 2,
        cityCode: bus.cityCode,
        biBeginDate: insList.biBeginDate,
        ciBeginDate: insList.ciBeginDate,
        insurerCode: insurerCode,
        responseNo: car.responseNo,
        carInfo: {
            licenseNo: car.licenseNo,
            frameNo: car.frameNo,
            brandCode: brand.brandCode,
            engineNo: car.engineNo,
            is_trans: car.isTrans ? '1' : '0',
            trans_date: car.transDate,
            // 'sourceCertificateNo': state.sourceCertificateNo,
            firstRegisterDate: car.registerDate
        },
        personInfo: {
            ownerName: owner.name,
            ownerID: owner.Idno,
            ownerMobile: owner.mobile,
            applicantName: applicant.name,
            applicantID: applicant.Idno,
            applicantMobile: applicant.mobile,
            insuredName: assured.name,
            insuredID: assured.Idno,
            insuredMobile: assured.mobile
        },
        coverageList: coverageList
    }
    return data
}
//深度拷贝
var deepClone = function (obj) {
    var newObj = obj instanceof Array ? [] : {};
    for (var i in obj) {
        newObj[i] = typeof obj[i] == 'object' ?
            deepClone(obj[i]) : obj[i];
    }
    return newObj;
}
// 清除本地存储
var clearStorage = function() {
    for (var i = 0; i < itemName.length; i++) {
        plus.storage.removeItem(itemName[i])
    }
}
