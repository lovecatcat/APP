var methods = {
    // 去重
    unique: function (a, key) {
        var res = []
        var len = (a && a.length) || 0
        if (!len) return res
        var jLen
        for (var i = 0; i < len; i++) {
            jLen = res.length
            var j
            for (j = 0; j < jLen; j++) {
                if (res[j][key] === a[i][key]) {
                    break
                }
            }
            if (j === jLen) {
                res.push(a[i])
            }
        }
        return res
    },	
    parseVueObj: function (Obj) {
        return JSON.parse(JSON.stringify(Obj))
    },
    payYearFilter: function (value) {
        var mainSafeYear = this.insurance.safe_year
        if (this.insurance.safe_id === 'NAF') {
            if (mainSafeYear === 10 && ['10', '15', '20'].indexOf(value) > -1) {
                return false
            } else if (mainSafeYear === 15 && ['15', '20'].indexOf(value) > -1) {
                return false
            } else if (mainSafeYear === 20 && ['20'].indexOf(value) > -1) {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    },

    //重置险种信息
    resetMainIns: function () {
        this.insurance = {
            safe_id: '',
            safe_year: '',
            pay_year: '',
            money: '',
            period_money: ''
        };
        this.prospectus_type = '';
        this.prospectus_types = [];
        this.mainSyAttr = [];
        this.mainPyAttr = [];
        this.Addons = {};
        this.addonRes = {}; //附加险清空
        this.planList = {} //列表信息清空
        this.flag = {}
        this.addonRes = {}
        this.addonsSelected = {}
//		mui('.mui-switch').each(function(index , item){
//			mui(this).switch().toggleCur(false);
//		})
    },
    companyChanged: function () { //公司下拉
        var vm = this;
        companyType.show(function (items) {
            vm.company.text = items[0].text;
            vm.company.value = items[0].value;
            vm.sc_id = items[0].value;
            vm.main = {
                value: '',
                text: '请选择险种',
                ratio: []
            }
            vm.resetMainIns(); //重置

            luckyAjax({
                data: {
                    server: 'PolicyIns.getProductList',
                    device: 'mobile',
                    data: JSON.stringify({
                        supplier_id: vm.sc_id
                    })
                },
                success: function (res) {
                    if (res.code == 1) {
                        var data = []
                        mui.each(res.data, function (index, item) {
                            data.push({
                                value: item.code,
                                text: item.name,
                                ratio: item.ratio,
                                child: item.child
                            })
                        });
                        mainType.setData(data);
                        mainTypedata = data
                    } else {
                        mui.toast('加载失败')
                    }
                }
            });
        });

    },
    insChanged: function (index) { //险种下拉
        var vm = this;
        mainType.show(function (items) {
            vm.resetMainIns(); //重置

            vm.main.text = items[0].text;
            vm.main.value = items[0].value;
            vm.main.ratio = items[0].ratio;
            vm.mainInsurance = items[0].value;
            const safeid = vm.mainInsurance
            if (!safeid) return
            vm.insurance.safe_id = safeid

            if (items[0].child) {
                for (var i = 0; i < items[0].child.length; i++) {
                    var child = {
                        name: items[0].child[i].name,
                        safe_id: items[0].child[i].product_id,
                        code: items[0].child[i].code
                    } //附加险
                    vm.Addons[items[0].child[i].code] = child
                }
            }

//			vm.$nextTick(function() {
//				mui('.mui-switch').switch();
//			});

            // 保险期间
            var mainSyAttr = vm.unique(items[0].ratio, 'year') // 去重
            // mainSyAttr = mainSyAttr.sort((a, b) => a.safe_year - b.safe_year) // 排序
            mainSyAttr = mainSyAttr.sort(function (a, b) {// 排序
                return a.pay_year - b.pay_year
            })
            vm.mainSyAttr = mainSyAttr
            //长度为1直接赋值，不为1置为空
            if (mainSyAttr.length === 1) {
                vm.insurance.safe_year = mainSyAttr[0].year
            } else {
                vm.insurance.safe_year = ''
            }
            // 缴费年限
            var mainPyAttr = vm.unique(items[0].ratio, 'pay_year') // 去重
            // mainPyAttr = mainPyAttr.sort((a, b) => a.pay_year - b.pay_year)
            mainPyAttr = mainPyAttr.sort(function (a, b) {// 排序
                return a.pay_year - b.pay_year
            })
            vm.mainPyAttr = mainPyAttr
            if (mainPyAttr.length === 1) {
                vm.insurance.pay_year = mainPyAttr[0].pay_year
            } else {
                vm.insurance.pay_year = ''
            }

            // 计划类型
            switch (safeid) {
                case 'P005-3': //中国平安e生保
                    vm.prospectus_types = [{
                        value: 100,
                        name: '有社保100万'
                    }, {
                        value: 300,
                        name: '有社保300万'
                    }, {
                        value: 1100,
                        name: '无社保100万'
                    }, {
                        value: 1300,
                        name: '无社保300万'
                    }]
                    break
                case 'LE234': //恒大千万护航
                    vm.prospectus_types = [{
                        value: 50000,
                        name: '5万'
                    }, {
                        value: 100000,
                        name: '10万'
                    }, {
                        value: 150000,
                        name: '15万'
                    }, {
                        value: 200000,
                        name: '20万'
                    }]
                    break
                case '8111': //国华康运金生
                    vm.prospectus_types = [{
                        value: 100000,
                        name: '10万'
                    }, {
                        value: 150000,
                        name: '15万'
                    }, {
                        value: 250000,
                        name: '25万'
                    }, {
                        value: 500000,
                        name: '50万'
                    }]
                    break
                default:
                    vm.prospectus_types = []
                    break
            }
//			console.log(JSON.stringify(vm.prospectus_types))
            // 部分险种输入 保额， 算保费
            vm.isBaseMoney = calMoneyIns.indexOf(safeid) === -1
            vm.fuBaseMoney = fuMoneyIns.indexOf(safeid) !== -1

        })

    },
    // 重置主险费用及附加险
    resetFee: function (fx) {
        if (fx !== 'fxmz') { // 如果是复星门诊不清空
            this.isBaseMoney ? this.insurance.period_money = '' : this.insurance.money = ''
        } else {
            this.fxljysFXLJYS.mzmoney = ''
        }
        if (fx === 'fxsb') { // 切换社保，2个都重置
            this.fxljysFXLJYS.zymoney = ''
            this.fxljysFXLJYS.mzmoney = ''
        }
        if (this.fuBaseMoney) { // 如果是乐行天下
            this.insurance.period_money = ''
            this.insurance.money = ''
        }
        if (this.insurance.safe_id !== 'FXLJYS') { // 复星乐健一生不重置附加险
            this.resetAddon()
        }
    },
    // 校验主险
    checkMainForm: function () {
        const safeid = this.insurance.safe_id
        var toastText = null
        var exp = /^(([1-9]\d{0,12})|0)(\.\d{1,2})?$/

        if (this.sc_id === '0') {
            toastText = '请选择公司'
        } else if (!this.insurance.safe_id) {
            toastText = '请选择主险'
        } else if (!this.insurance.safe_year) {
            toastText = '请选择主险保险期间'
        } else if (!this.insurance.pay_year) {
            toastText = '请选择主险交费期间'
        } else if (safeid === 'LA063' && !this.flag[safeid]) { //恒大福享金生
            toastText = '请选择主险保障年限'
        } else if (safeid === '3188' && !this.flag[safeid]) { //国华盛世鑫悦
            toastText = '请选择主险生存金方式'
        } else if (this.prospectus_types.length > 0 && !this.prospectus_type) {
            toastText = '请选择主险基本保额'
        } else if (this.isBaseMoney && !this.insurance.money && !this.fuBaseMoney && this.insurance.safe_id !== 'FXLJYS') {
            toastText = '请输入主险基本保额'
        } else if (this.isBaseMoney && exp.test(this.insurance.money) === false && !this.fuBaseMoney && this.insurance.safe_id !== 'FXLJYS') {
            toastText = '数字格式不规范，请重新输入'
        } else if (!this.isBaseMoney && !this.insurance.period_money && !this.fuBaseMoney) {
            toastText = '请输入主险年缴保费'
        } else if (this.isBaseMoney && !this.insurance.period_money && this.fuBaseMoney && this.cache.pay_moneyRSC === '') {
            toastText = '请先完善附加乐行天下意外伤害保险'
        } else if (this.isBaseMoney && !this.insurance.period_money && this.fuBaseMoney && this.cache.pay_moneyRSD === '') {
            toastText = '请先完善附加乐行天下意外住院津贴医疗保险'
        } else if (this.insurance.safe_id === 'FXLJYS' && this.fxljysFXLJYS.zytc === '0') {
            toastText = '请选择乐健一生住院套餐'
        } else if (this.insurance.safe_id === 'FXLJYS' && this.fxljysFXLJYS.zynmp === '0') {
            toastText = '请选择乐健一生住院免赔额'
        }
        if (toastText) {
            mui.toast(toastText)
            return false
        }
        return true
    },
    // 校验主险投保年龄
    checkMainAge: function (safeid) {
        var applAge = this.appl.age
        var assuAge = Number(this.assu.age)
        var assuSex = this.assu.sex
        var mainSafeYear = this.mainSafeYear
        var mainPayYear = this.mainPayYear
        var payOverage = mainPayYear + assuAge // 缴费期满年龄
        var safeid = String(safeid)
        var name = this.main.text
        var toastText = null

        switch (safeid) {
            //泰康
            case 'A40': // 乐安康
                if (assuAge > 50 && mainPayYear > 10) {
                    toastText = '被保人年龄不能大于50周岁'
                } else if (assuAge > 55 && mainPayYear === 10) {
                    toastText = '被保人年龄不能大于55周岁'
                } else if (assuAge > 60 && mainPayYear < 10) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
            case 'IA40': // 泰康乐安心
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                } else if (payOverage > 70) {
                    toastText = '缴费期满年龄不能大于70周岁'
                }
                break

            //国华
            case '8109': // 康运一生重大疾病保险A款
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
            case '8110': // 华宝安行
                if (assuAge > 50) {
                    toastText = '被保人年龄不能大于50周岁'
                } else if (assuAge < 18) {
                    toastText = '被保人年龄不能小于18周岁'
                }
                break
            case '3188': // 国华盛世鑫悦
                if (mainPayYear === 1 && assuAge > 60 && this.flag['3188'] === '1') {
                    toastText = '生存方式一且趸交时被保人年龄为28天-60周岁（含）'
                } else if (mainPayYear === 3 && assuAge > 57 && this.flag['3188'] === '1') {
                    toastText = '生存方式一且3年交时被保人年龄为28天-57周岁（含）'
                } else if (mainPayYear === 5 && assuAge > 55 && this.flag['3188'] === '1') {
                    toastText = '生存方式一且5年交时被保人年龄为28天-55周岁（含）'
                } else if (mainPayYear === 10 && assuAge > 50 && this.flag['3188'] === '1') {
                    toastText = '生存方式一且10年交时被保人年龄为28天-50周岁（含）'
                } else if (mainPayYear === 1 && assuAge > 45 && this.flag['3188'] === '2') {
                    toastText = '生存方式二且趸交时被保人年龄为28天-45周岁（含）'
                } else if (mainPayYear === 3 && assuAge > 42 && this.flag['3188'] === '2') {
                    toastText = '生存方式二且3年交时被保人年龄为28天-42周岁（含）'
                } else if (mainPayYear === 5 && assuAge > 40 && this.flag['3188'] === '2') {
                    toastText = '生存方式二且5年交时被保人年龄为28天-40周岁（含）'
                } else if (mainPayYear === 10 && assuAge > 35 && this.flag['3188'] === '2') {
                    toastText = '生存方式二且10年交时被保人年龄为28天-35周岁（含）'
                } else if (mainPayYear === 1 && assuAge > 45 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且趸交时被保人年龄为18周岁-45周岁（含）'
                } else if (mainPayYear === 3 && assuAge > 42 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且3年交时被保人年龄为18周岁-42周岁（含）'
                } else if (mainPayYear === 5 && assuAge > 40 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且5年交时被保人年龄为18周岁-40周岁（含）'
                } else if (mainPayYear === 10 && assuAge > 35 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且10年交时被保人年龄为18周岁-35周岁（含）'
                } else if (mainPayYear === 1 && assuAge < 18 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且趸交时被保人年龄为18周岁-45周岁（含）'
                } else if (mainPayYear === 3 && assuAge < 18 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且3年交时被保人年龄为18周岁-42周岁（含）'
                } else if (mainPayYear === 5 && assuAge < 18 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且5年交时被保人年龄为18周岁-40周岁（含）'
                } else if (mainPayYear === 10 && assuAge < 18 && this.flag['3188'] === '3') {
                    toastText = '生存方式三且10年交时被保人年龄为18周岁-35周岁（含）'
                }
                break
            case '1166': // 国华成长无忧
                if (assuAge > 7 || assuAge < 0) {
                    toastText = '被保人在0周岁到7周岁之间'
                }
                break
            case '8111': // 国华人寿康运金生
                if (mainPayYear === 5 && assuAge > 60) {
                    toastText = '5年交被保人年龄不能大于60周岁'
                } else if (mainPayYear === 10 && assuAge > 55) {
                    toastText = '10年交时被保人为年龄不能大于55周岁'
                } else if (mainPayYear === 15 && assuAge > 50) {
                    toastText = '15年交被保人为年龄不能大于50周岁'
                } else if (mainPayYear === 20 && assuAge > 45) {
                    toastText = '20年交被保人为年龄不能大于45周岁'
                } else if (mainPayYear === 30 && assuAge > 35) {
                    toastText = '30年交被保人为年龄不能大于35周岁'
                }
                break

            //工银
            case 'BRMCCI1': // 御享人生重大疾病保险
                if (mainPayYear === 5 && assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                } else if (mainPayYear === 10 && assuAge > 55) {
                    toastText = '被保人年龄不能大于55周岁'
                } else if (mainPayYear === 15 && assuAge > 50) {
                    toastText = '被保人年龄不能大于50周岁'
                } else if (mainPayYear === 20 && assuAge > 50) {
                    toastText = '被保人年龄不能大于50周岁'
                } else if (mainPayYear === 30 && assuAge > 35) {
                    toastText = '被保人年龄不能大于35周岁'
                }
                break
            case 'ANIA': // 工银安盛鑫丰盈
                if (mainPayYear === 1 && assuAge > 60) {
                    toastText = '趸交被保人不能超过60周岁'
                } else if (mainPayYear === 5 && assuAge > 55) {
                    toastText = '5年交被保人不能超过55周岁'
                } else if (mainPayYear === 10 && assuAge > 45) {
                    toastText = '10年交被保人不能超过45周岁'
                }
                break

            //平安
            case 'P005-3': // 平安e生保
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
            //信泰
            case '11A00030': // 爱驾宝两全保险(2017)
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                } else if (assuAge < 18) {
                    toastText = '被保人年龄不能小于18周岁'
                } else if (assuAge > 50 && mainSafeYear === 30) {
                    toastText = '被保人大于50周岁时,只能选择20年交'
                }
                break

            case '13F00150': // 信泰百万健康重大疾病
                if (mainPayYear === 1 && assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                } else if (mainPayYear === 3 && assuAge > 60) {
                    toastText = '3年交被保人年龄不能大于60周岁'
                } else if (mainPayYear === 5 && assuAge > 60) {
                    toastText = '5年交被保人年龄不能大于60周岁'
                } else if (mainPayYear === 10 && assuAge > 60) {
                    toastText = '10年交被保人年龄不能大于60周岁'
                } else if (mainPayYear === 15 && assuAge > 55) {
                    toastText = '15年交被保人年龄不能大于55周岁'
                } else if (mainPayYear === 20 && assuAge > 50) {
                    toastText = '20年交被保人年龄不能大于50周岁'
                } else if (mainPayYear === 30 && assuAge > 40) {
                    toastText = '30年交被保人年龄不能大于40周岁'
                }
                break
            case '12D00080': // 信泰千万人生
                if (assuAge > 55) {
                    toastText = '被保人年龄不能大于55周岁'
                } else if (mainPayYear === 10 && assuAge > 50) {
                    toastText = '10年交被保人年龄不能大于50周岁'
                }
                break
            case '209': // 信泰人寿：健康100
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
            case '210': // 信泰人寿：健康100(铂金版)
                if (assuAge > 50) {
                    toastText = '被保人年龄不能大于50周岁'
                }
                break

            // 中英

            case 'NCV': // 爱加倍
            case 'NCR': // 爱相随-尊享版
                if (assuAge > 50 && mainPayYear > 10) {
                    toastText = '被保人年龄不能大于50周岁'
                } else if (assuAge > 55 && mainPayYear === 10) {
                    toastText = '被保人年龄不能大于55周岁'
                } else if (assuAge > 60 && mainPayYear < 10) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
            case 'NAF': // 中英人寿金喜年年
                if (assuAge > 65) {
                    toastText = '被保人年龄不能大于65周岁'
                } else if (assuAge > 60 && mainPayYear === 15) {
                    toastText = '15年交时被保人为年龄不能大于60周岁'
                } else if (mainPayYear === 20 && assuAge > 55) {
                    toastText = '20年交被保人为年龄不能大于55周岁'
                }
                break
            case 'NCUA': // 中英爱守护
                if (assuAge > 60 || assuAge < 0) {
                    toastText = '被保人在0周岁到60周岁之间'
                } else if (mainPayYear === 15 && assuAge > 55) {
                    toastText = '15年交被保人不能超过55周岁'
                } else if (mainPayYear === 20 && assuAge > 50) {
                    toastText = '20年交被保人不能超过50周岁'
                }
                break
            case 'NCWA': // 中英爱守护尊享
                if (assuAge > 50 || assuAge < 0) {
                    toastText = '被保人在0周岁到50周岁之间'
                }
                break
            // 恒大
            case 'HB023': // 恒久健康终身重大疾病保险2017
                if ([1, 3, 5, 10].indexOf(mainPayYear) > -1 && assuAge > 65) {
                    toastText = (mainPayYear === 1 ? '趸交' : mainPayYear + '年交') + '投保年龄上限为65岁'
                } else if (mainPayYear === 15 && assuAge > 60) {
                    toastText = '15年交投保年龄上限为60岁'
                } else if (mainPayYear === 20 && assuAge > 55) {
                    toastText = '20年交投保年龄上限为55岁'
                }
                break
            case 'LE234': // 千万护航两全保险
                if (assuAge < 18 || assuAge > 55) {
                    toastText = '被保人年龄范围应在18-55周岁'
                }
                break
            case 'HB030': // 恒大万年青终身重疾病保险
                if (mainPayYear === 10 && assuAge > 60) {
                    toastText = '10年交被保人年龄不能大于60周岁'
                } else if (mainPayYear === 15 && assuAge > 55) {
                    toastText = '15年交被保人年龄不能大于55周岁'
                } else if (mainPayYear === 20 && assuAge > 50) {
                    toastText = '20年交被保人年龄不能大于50周岁'
                } else if (mainPayYear === 30 && assuAge > 40) {
                    toastText = '30年交被保人年龄不能大于40周岁'
                }
                break
            case 'LA063': // 恒大福享今生
                if (mainPayYear === 5 && assuAge > 55 && assuSex) {
                    toastText = '5年交男性被保人为年龄不能大于55周岁'
                } else if (mainPayYear === 20 && assuAge > 40 && assuSex) {
                    toastText = '20年交男性被保人为年龄不能大于40周岁'
                } else if (mainPayYear === 10 && assuAge > 50 && assuSex) {
                    toastText = '10年交男性被保人为年龄不能大于50周岁'
                } else if (mainPayYear === 20 && assuAge > 35 && !assuSex) {
                    toastText = '20年交女性被保人为年龄不能大于35周岁'
                } else if (mainPayYear === 10 && assuAge > 45 && !assuSex) {
                    toastText = '10年交女性被保人为年龄不能大于45周岁'
                } else if (mainPayYear === 5 && assuAge > 50 && !assuSex) {
                    toastText = '5年交女性被保人为年龄不能大于50周岁'
                }
                break

            case 'LA075': // 恒大万年红
                if (mainPayYear === 3 && assuAge > 65) {
                    toastText = '3年交被保人不能超过65周岁'
                } else if (mainPayYear === 5 && assuAge > 65) {
                    toastText = '5年交被保人不能超过65周岁'
                } else if (mainPayYear === 10 && assuAge > 60) {
                    toastText = '10年交被保人不能超过60周岁'
                }
                break
            // 复星
            case 'FXLJYS': // 复星乐健一生
                if (assuAge > 64) {
                    toastText = '被保人年龄不能大于64周岁'
                }
                break
            case 'FXKLYSA': // 康乐一生重大疾病保险A款
            case 'FXKLYSB': // 康乐一生重大疾病保险B款
                if (mainPayYear === 1 && applAge > 70) {
                    toastText = '投保人年龄不能大于70周岁'
                } else if (mainPayYear === 5 && applAge > 65) {
                    toastText = '5年交投保人年龄不能大于65周岁'
                } else if (mainPayYear === 10 && applAge > 60) {
                    toastText = '10年交投保人年龄不能大于60周岁'
                } else if (mainPayYear === 20 && applAge > 50) {
                    toastText = '20年交投保人年龄不能大于50周岁'
                } else if (assuAge > 50) {
                    toastText = '被保人年龄不能大于50周岁'
                }
                if (mainPayYear === 20 && mainSafeYear === 70) {
                    toastText = '保障期间为70年时不能20年交'
                }
                break
            //安联
            case 'CCPAAP1': // 安联-出行无忧
                if (assuAge < 18) {
                    toastText = '被保人年龄不能小于18周岁'
                }
                break
            //招商仁和
            case '1001': // 招商仁和爱倍护重大疾病保险
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                } else if (mainPayYear + assuAge > 60 && mainPayYear != 60) {
                    toastText = '投保年龄加交费年期不能大于60周岁'
                } else if (assuAge > 59 && mainPayYear === 60) {
                    toastText = '交至60周岁被保人年龄应在0到59周岁'
                }
                break
            case '1020': // 招商仁和招盈金生
                if (assuAge > 65) {
                    toastText = '被保人年龄不能大于65周岁'
                } else if (assuAge > 62 && mainPayYear == 3) {
                    toastText = '3年缴被保人年龄应在不能大于62周岁'
                } else if (assuAge > 60 && mainPayYear == 5) {
                    toastText = '5年缴被保人年龄应在不能大于60周岁'
                } else if (assuAge > 55 && mainPayYear == 10) {
                    toastText = '10年缴被保人年龄应在不能大于55周岁'
                }
                break
            case '1016': // 招商仁和仁医保费用补偿医疗保险
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
        }

        if (toastText) {
            mui.toast('【' + name + '】' + toastText)
            return false
        }
        return true
    },
    // 主险保额校验
    checkMainMoney: function (safeid) {
        var money = this.insurance.money
        var periodMoney = this.insurance.period_money
        var assuAge = Number(this.assu.age)
        var name = this.main.text
        var toastText = null
        var safeid = String(safeid)
        switch (safeid) {
            //泰康1
            case 'A40': // 乐安康
                if (money < 50000 || money % 10000 !== 0) {
                    toastText = '最低保额为5万元，且为1万元整数倍！'
                }
                break
            case 'IA40': // 泰康乐安心
                if (money < 50000 || money % 10000 !== 0) {
                    toastText = '最低保额5万元，且为1万元整数倍！'
                }
                break
            //			case 'LA0631': // 泰康乐赢家
            //				if(money < 200000 || money % 10000 !== 0) {
            //					toastText = '最低保额20万元，且为1万元整数倍！'
            //				}
            //				break
            //国华
            case '8109': // 康运一生重大疾病保险A款
                if (money < 150000 || money % 10000 !== 0) {
                    toastText = '最低保额为15万元，且为1万元整数倍'
                }
                break
            case '8110': // 国华华宝安行
                if (money < 50000 || money % 50000 !== 0) {
                    toastText = '最低保额为5万元，且为5万元整数倍'
                } else if (money > 200000) {
                    toastText = '最高保额为20万元'
                }
                break
            case '3188': // 国华盛世鑫悦
                if (this.mainPayYear === 1 && periodMoney < 10000 && periodMoney % 10000 !== 0) {
                    toastText = '趸交时，保费不能低于1万元，以万元为递增'
                } else if (this.mainPayYear === 1 && periodMoney % 10000 !== 0) {
                    toastText = '趸交时，保费不能低于1万元，以万元为递增'
                } else if ([3, 5, 10].indexOf(this.insurance.pay_year) > -1 && periodMoney < 5000) {
                    toastText = '3年、5年或10年时，保费不能低于5千元，以千元为递增'
                } else if ([3, 5, 10].indexOf(this.insurance.pay_year) > -1 && periodMoney % 1000 !== 0) {
                    toastText = '3年、5年或10年时，保费不能低于5千元，以千元为递增'
                }
                break

            case '1166': //国华成长无忧
                if (money < 300000) {
                    toastText = '最低基本保额为30万元'
                } else if (money % 10000 !== 0) {
                    toastText = '保费需为1万元整数倍'
                }
                break
            //工银
            case 'BRMCCI1': // 工银御享人生重大疾病保险
                if (money < 50000) {
                    toastText = '最低保额为5万元'
                }
                break
            //平安
            //信泰

            case '11A00030': // 信泰爱驾宝两全保险(2017)
                if (money < 10000 || money % 10000 !== 0) {
                    toastText = '保额最低1万元，且为1万元整数倍'
                }
                break
            case '13F00150': // 信泰百万健康重大疾病
                if (money < 50000 || money % 1000 !== 0) {
                    toastText = '最低保额5万元，且为1千元整数倍！'
                }
                break
            case '12D00080': // 信泰千万人生
                if (this.mainPayYear === 1 && periodMoney < 50000) {
                    toastText = '趸交时，保费不能低于5万元'
                } else if ([3, 5, 10].indexOf(this.insurance.pay_year) > -1 && periodMoney < 10000) {
                    toastText = '3年、5年或10年时，保费不能低于1万元'
                } else if (periodMoney % 1000 !== 0) {
                    toastText = '保费应为千元整数倍'
                }
                break
            case '209': // 信泰人寿：健康100
                if (money < 50000 || money % 10000 !== 0) {
                    toastText = '最低保额为5万元，且为1万元整数倍'
                }
                break
            case '210': // 信泰人寿：健康100(铂金版)
                if (money < 300000 || money % 10000 !== 0) {
                    toastText = '最低保额为30万元，且为1万元整数倍'
                }
                break
            //中英
            case 'NCR': // 爱相随-尊享版
                if (assuAge >= 18 && money > 1000000) {
                    toastText = '成年人最高保额为100万元'
                } else if (assuAge < 18 && money > 500000) {
                    toastText = '未成年人最高保额为50万元'
                } else if (this.mainPayYear === 19) {
                    if (money < 300000 || money % 10000 !== 0) {
                        toastText = '19年交最低保额30万元，且为1万元整数倍！'
                    }
                } else if (money < 50000 || money % 10000 !== 0) {
                    toastText = '保额最低5万元，且为1万元整数倍'
                }
                break
            case 'NCV': // 中英爱加倍
                if (this.mainPayYear === 19) {
                    if (money < 100000 || money % 10000 !== 0) {
                        toastText = '19年交最低保额10万元，且为1万元整数倍！'
                    }
                } else if (money < 20000 || money % 10000 !== 0) {
                    toastText = '保额最低2万元，且为1万元整数倍'
                }
                break
            case 'NAF': // 中英人寿金喜年年
                if (money < 1500 || money % 500 !== 0) {
                    toastText = '最低保额1500元，且为500元整数倍！'
                }
                break
            case 'NCUA': // 中英爱守护
                if (money < 50000) {
                    toastText = '最低基本保额为5万元'
                } else if (money % 10000 !== 0) {
                    toastText = '保费需为1万元整数倍'
                }
                break
            case 'NCWA': // 中英爱守护尊享
                if (money < 300000) {
                    toastText = '最低基本保额为30万元'
                } else if (money % 10000 !== 0) {
                    toastText = '保费需为1万元整数倍'
                }
                break
            //恒大
            case 'HB023': // 恒久健康终身重大疾病保险2017
                if (money < 10000 || money % 1000 !== 0) {
                    toastText = '最低保额为1万元,且为1千元整数倍'
                }
                break
            case 'LE234': // 恒大千万护航两全保险
                if (!money) {
                    toastText = '请选择保额'
                }
                break
            case 'HB030': // 恒大万年青终身重疾病保险
                if (money < 50000 || money % 1000 !== 0) {
                    toastText = '最低保额5万元，且为1千元整数倍！'
                } else if (assuAge < 18 && money > 400000) {
                    toastText = '未成年人最高保额为40万！'
                }
                break
            case 'LA063': // 恒大福享金生
                if (periodMoney < 1000 || periodMoney % 1000 !== 0) {
                    toastText = '最低保费1000元，且为1000元整数倍！'
                }
                break
            case 'LA075': // 恒大万年红
                if (periodMoney < 1000) {
                    toastText = '最低年缴保费为1千元'
                } else if (periodMoney % 1000 !== 0) {
                    toastText = '保费需为1千元整数倍'
                }
                break
            //复星
            case 'FXKLYSA': // 康乐一生重大疾病保险A款
            case 'FXKLYSB': // 康乐一生重大疾病保险B款
                if (money > 200000 && assuAge < 2) {
                    toastText = '未满2周岁，投保限额为20万！'
                } else if (money > 500000 && assuAge > 2 && assuAge < 19) {
                    toastText = '2 周岁‐18 周岁，投保限额为50万！'
                } else if (money < 50000) {
                    toastText = '最低保额5万元！'
                }
                break
            //招商仁和
            case '1001': // 招商仁和爱倍护重大疾病保险
                if (money < 10000) {
                    toastText = '最低基本保额为1万元'
                } else if (money % 1000 !== 0) {
                    toastText = '保费需为1千元整数倍'
                }
                break
            case '1020': // 招商仁和招盈金生
                if (money < 5000) {
                    toastText = '最低基本保额为5千元'
                } else if (money % 1000 !== 0) {
                    toastText = '保费需为1千元整数倍'
                }
                break

        }
        if (toastText) {
            mui.toast('【' + name + '】' + toastText)
            return false
        }
        return true
    },
    // 主险保费校验
    checkMainFee: function (safeid) {
        var toastText = null
        var periodMoney = this.insurance.period_money
        var money = this.insurance.money
        if (this.isBaseMoney && !this.insurance.period_money && !this.fuBaseMoney) {
            toastText = this.insurance.period_money === 0 ? '超出费率表计算范围，无法投保' : '请计算主险年缴保费'
        } else if (!this.isBaseMoney && !this.insurance.money && !this.fuBaseMoney) {
            toastText = this.insurance.money === 0 ? '超出费率表计算范围，无法投保' : '请计算主险基本保额'
        } // 3188和12D00080要禁止改判断不然不能计算保险金额，分别写在更改附加险和checkIns里面
        if (toastText) {
            mui.toast(toastText)
            return false
        }

        switch (safeid) {
            case 'ANIA': // 工银鑫丰盈
                if (this.mainPayYear === 1 && money < 3000) {
                    toastText = '趸交最低基本保额3000元'
                } else if (this.mainPayYear !== 1 && money < 2000) {
                    toastText = '年交最低基本保额2000元'
                }
                break
            case 'BRMCCI1': // 御享人生重大疾病保险
                if (periodMoney < 1000) {
                    toastText = '该主险最低年缴保费为1000元'
                }
                break
             case '1020': // 招商仁和招盈金生
                if (periodMoney < 100000 && this.mainPayYear === 1) {
                    toastText = '趸交年缴保费必须大于10万元'
                } else if(periodMoney < 10000 && this.mainPayYear === 3){
                	 toastText = '3交年缴保费必须大于1万元'
                } else if(periodMoney < 10000 && this.mainPayYear === 5){
                	 toastText = '5交年缴保费必须大于1万元'
                } else if(periodMoney < 5000 && this.mainPayYear === 10){
                	 toastText = '10交年缴保费必须大于5千元'
                }
                break    
        }
        if (toastText) {
            mui.toast(toastText)
            var vm = this
            setTimeout(function () {
                if (safeid === 'ANIA') {
                    vm.insurance.money = ''
                } else {
                    vm.insurance.period_money = ''
                }
            }, 2000)
            return false
        }
        return true
    },

    /**
     * 附加险
     * @param index
     * @returns {boolean}
     */
    // 校验关系
    checkRS: function () {
        console.info('checkRS')
        if (this.appl.name === this.assu.name &&
            this.appl.sex === this.assu.sex &&
            this.appl.age === this.assu.age) {
            // 3要素相同
            this.samePerson = true
            console.log('被保险人和投保人为同一人')
        } else {
            this.samePerson = false
        }
    },
    // 更改附加险状态
    chAddonState: function (index) {
    	var vm = this
        if (this.uploading) {
            this.addonsSelected[index] = !this.addonsSelected[index]
            this.$forceUpdate()
            return false
        }
        this.checkRS()
        var toastText = null
        //安卓低配手机点击值不变，手动赋值，解决办法
//      if(this.addonsSelected[index] === undefined) {
//      	this.addonsSelected[index] = true
//      	this.$forceUpdate()
//      }
        this.$nextTick(function(){
        	 console.log(JSON.stringify(this.addonsSelected[index]))
        	   if (this.addonsSelected[index]) {
            // 主险保费校验不合格
            if (!this.checkMainFee(this.insurance.safe_id)) {
                this.addonsSelected[index] = false
                this.$forceUpdate()
                return false
            }
            var periodMoney = this.insurance.period_money

            switch (this.insurance.safe_id) {
                case 'HB023': // 恒久健康
                    if (["HA007", "HA006", "HA005"].indexOf(index) > -1) {
                        if (this.insurance.money < 200000) {
                            toastText = '主险保额小于20万元时不可附加该险种'
                        }
                    } else if (index === "HA014") {
                        if (this.insurance.money < 50000) {
                            toastText = '主险保额小于5万元时不可附加该险种'
                        } else if (this.insurance.period_money < 3000) {
                            toastText = '期交保费小于3千元时不可附加该险种'
                        }
                    }
                    break
                case 'LE234': // 千万护航
                    if (["HA007", "HA006", "HA005", "HA014"].indexOf(index) > -1) {
                        if (this.insurance.money < 200000) {
                            toastText = '主险保额小于20万元时不可附加该险种'
                        }
                    }
                    break
                case 'HB030': // 恒大万年青
                    if (["HA005", "HA014"].indexOf(index) > -1 && this.insurance.money < 50000) {
                        toastText = '主险保额小于5万元时不可附加该险种'
                    } else if (["HA005", "HA014"].indexOf(index) > -1 && this.insurance.period_money < 3000) {
                        toastText = '期交保费小于3千元时不可附加该险种'
                    } else if (index === 'HB024' && this.mainPayYear === 30) {
                        toastText = '30年缴不可附加'
                    }
                    break
                case 'LA063': // 福享今生
                case 'LA075': // 恒大万年红
                    if (index === "HA005" && this.insurance.period_money < 10000) {
                        toastText = '期交保费小于一万元时不可附加该险种'
                    } else if (index === "HA014" && this.insurance.period_money < 5000) {
                        toastText = '期交保费小于5千元时不可附加该险种'
                    }
                    break
                default:
                    break
            }
            switch (index) {
                //豁免
                case 'HB024': // 恒大附加投保人豁免保费重大疾病保险2017版
                case 'WRGP': // 乐安心的附加险乐相伴豁免B款
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    }
                    if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break
                //泰康
                case 'RH7B':
                    if (periodMoney < 3000) {
                        toastText = '主险年交保费小于3000元不可附加该险种'
                    }
                    break
                case 'WPJP':
                    if (!periodMoney) {
                        toastText = '请先完善其他附加险，算出主险年缴保费'
                    }
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    }
                    if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break

                //国华
                case '1168': // 国华康运金生附加养老年金
                    if (this.mainPayYear === 30) {
                        toastText = '主险30年交不可附加该险种'
                    }
                    break
                case '1167':
                    this.addonsSelected['1165'] = false
                    this.addonRes['1165'] = ''
                    this.addonsSelected['116502'] = false
                    this.addonRes['116502'] = ''
                    this.addonsSelected['116503'] = false
                    this.addonRes['116503'] = ''
                    this.$forceUpdate()
                    break
                case '116502': // 国华康运金生附加豁免轻症疾病豁免保险费
                case '116503': // 国华康运金生附加豁免身故豁免保险费
                    if (!this.addonsSelected['1165']) {
                        toastText = '请先完成豁免保险费重大疾病保险（2017）'
                    }
                    break
                case '1165': // 国华康运金生附加豁免保险费重大疾病保险（2017）
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    } else if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    } else if (this.appl.age < 18 || this.appl.age > 60) {
                        toastText = '投保人年龄小于18周岁或大于60周岁不可附加'
                    }
                    break
                //工银
                case 'HR':
                    if (periodMoney < 1000) {
                        toastText = '主险年交保费小于1000元不可附加该险种'
                    }
                    break
                case 'ACIWP': // 附加豁免保险费重大疾病保险
                case 'NWPD': // 附加豁免保险费定期寿险(2016)
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    }
                    if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break
                case 'HI':
                    if (periodMoney < 1000) {
                        toastText = '主险年交保费小于1000元不可附加该险种'
                    }
                    break

                //信泰
                case '33F00030': // 信泰附加投保人豁免保险费重大疾病保
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    } else if (this.mainPayYear === 1 || this.mainPayYear === 3) {
                        toastText = '主险趸交或3年交不可附加该险种'
                    } else if (this.appl.age < 18 || this.appl.age > 60) {
                        toastText = '投保人年龄小于18周岁或大于60周岁不可附加'
                    }
                    break

                //中英
                case 'PFR': //  附加交通意外伤害保险
                    this.addonsSelected['JER'] = false
                    this.addonRes['JER'] = ''
                    this.$forceUpdate()
                    break
                case 'CKRA': //   附加额外给付重大疾病保险（B款）
                    this.addonsSelected['JER'] = false
                    this.addonRes['JER'] = ''
                    this.$forceUpdate()
                    break
                case 'JER': //  附加投保人保费豁免重大疾病保险(和PFR，CKRA有关）
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    } else if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break
                case 'JCR': // 中英人寿附加保费豁免重大疾病保险
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    }
                    if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break
                //复星
                case 'FJKLYSQZ': // 附加康乐一生轻症保险
                    this.addonsSelected['FXKLYSFJ'] = false
                    this.addonRes['FXKLYSFJ'] = ''
                    this.$forceUpdate()
                    break
                case 'FXKLYSFJ': // 附加康乐一生投保人豁免保费重大疾病保险
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    } else if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break
                case 'LJYSMZ': //
                    if (this.assu.age > 54) {
                        toastText = '被保人年龄不能大于54周岁'
                    }
                    break
                //招商仁和
//              case '1002': // 附加豁免保险费重大疾病保险
                case '1011': // 招商仁和附加投保人豁免保险费定期寿险
                    if (this.samePerson) {
                        toastText = '投被保人为同人时不可附加该险种'
                    } else if (this.mainPayYear === 1) {
                        toastText = '主险趸交不可附加该险种'
                    }
                    break
                case '1003':
                	this.addonsSelected['1002'] = false
                    this.addonRes['1002'] = ''
                	this.addonsSelected['1011'] = false
                    this.addonRes['1011'] = ''
                    this.$forceUpdate()
                 	break    

            }

            if (toastText) {
                mui.toast(toastText)
                this.addonsSelected[index] = false
                this.$forceUpdate()
            } else if (directNeedCal.indexOf(index) > -1) { // 直接计算
                this.calMoney(false, index) // 试算附加险
            }
        } else {
            if (mustSelected.indexOf(index) > -1) {
                toastText = '该附加险必须附加，不能取消'
                mui.toast(toastText)
                this.addonsSelected[index] = true
                return false;
            } else if (index === '1168') {
                this.flag[index] = ''
                this.addonInsData = {}
                this.addonRes = {}
                this.addonsSelected = {}
            } else if (index === '1167') {
                this.flag[index] = ''
                this.addonInsData = {}
                this.addonRes = {}
                this.addonsSelected = {}
            } else if (index === '1165') {
                this.flag[index] = ''
                this.$delete(this.addonInsData, index)
                this.$delete(this.addonRes, index)
                this.$delete(this.addonInsData, '116502')
                this.$delete(this.addonRes, '116502')
                this.addonsSelected['116502'] = false
                this.$delete(this.addonInsData, '116503')
                this.$delete(this.addonRes, '116503')
                this.addonsSelected['116503'] = false
            } else if (index === 'PFR') {
                this.flag[index] = ''
                this.flag['PFR1'] = ''
                this.cache.base_moneyPFR = ''
                this.$delete(this.addonInsData, index)
                this.$delete(this.addonRes, index)
                this.$delete(this.addonInsData, 'JER')
                this.$delete(this.addonRes, 'JER')
                this.addonsSelected['JER'] = false
            } else if (index === 'CKRA') {
                this.$delete(this.addonInsData, index)
                this.$delete(this.addonRes, index)
                this.$delete(this.addonInsData, 'JER')
                this.$delete(this.addonRes, 'JER')
                this.addonsSelected['JER'] = false
            }  else if (index === '1003') {
                this.$delete(this.addonInsData, index)
                this.$delete(this.addonRes, index)
                this.$delete(this.addonInsData, '1002')
                this.$delete(this.addonRes, '1002')
                this.addonsSelected['1002'] = false
                this.$delete(this.addonInsData, '1011')
                this.$delete(this.addonRes, '1011')
                this.addonsSelected['1011'] = false
            } else {
                //            取消时 清除缓存的提交数据
                this.flag[index] = ''
                this.$delete(this.addonInsData, index)
                this.$delete(this.addonRes, index)
                this.$delete(this.planList, index)
            }
            this.$forceUpdate()
        }
        })
       
      
    },
    flagChanged: function (id, num) {
        this.addonRes[id] = null
        this.flag[id] = num ? num : this.flag[id]
        this.$forceUpdate()
    },
    // 重置附加险默认信息
    resetAddon: function () {
        var safeid = this.insurance.safe_id
        if (safeid === 'ANIA') {
            this.flag['DAR'] = ''
            this.flag['AMRB'] = ''
            this.flag['HR'] = ''
            this.cache.quotaHR = 2
            this.flag['NADD'] = ''
            this.cache.base_moneyNADD = 0
        } else if (safeid == 'NAF' || safeid == 'NCR' || safeid == 'NCUA' || safeid == 'NCWA') {
            this.flag['CBR'] = ''
            this.cache.base_moneyCBR = ''
            this.flag['PGR'] = ''
            this.cache.base_moneyPGR = ''
            this.flag['AMR'] = ''
            this.cache.base_moneyAMR = ''
            this.flag['TLR'] = ''
            this.cache.base_moneyTLR = ''
            this.flag['CKRA'] = ''
            this.cache.base_moneyCKRA = ''
            this.flag['PFR'] = ''
            this.flag['PFR1'] = ''
            this.cache.base_moneyPFR = ''
        } else if (safeid === '13F00150') {
            this.flag['31A00050'] = ''
        } else if (safeid === 'A66') {
            this.flag['RSC'] = ''
        } else if (safeid === 'HB023' || safeid === 'LE234' || safeid === 'HB030' || safeid === 'LA063' || safeid === 'LA075') { // 新增恒大万年青终身重疾病保险,万年红
            this.flag["HA006"] = ''
            this.flag["HA005"] = ''
            this.flag["HA014"] = ''
        } else if (safeid === 'BRMCCI1') {
            this.flag['AMRB'] = ''
            this.flag['HR'] = ''
            this.cache.quotaHR = 2
            this.flag['NADD'] = ''
            this.cache.base_moneyNADD = 0
        } else if (safeid === '8109') {
            this.flag[273] = ''
        } else if (safeid === 'A40' || safeid === 'IA40') {
            this.flag['RP8P'] = ''
            this.flag['A47P'] = ''
        } else if (safeid === 'PFR' || safeid === 'NCV') {
            this.flag[235] = ''
            this.flag[236] = ''
            this.flag['HIA'] = ''
        }
        this.cache.base_moneyHA007 = ''
        this.cache.pay_moneyRSC = ''
        this.cache.pay_moneyRSD = ''
        this.cache.derate_money12E20010 = ''
        this.cache.derate_money1167 = ''
        //		if (this.Addons) {
        //        for (var i in this.Addons[safeid]) {
        //          const j = this.Addons[safeid][i].safe_id
        //          this.addonsSelected[j] = false
        //        }
        //      }
        this.addonRes = {}
        this.addonsSelected = {}
//		mui('.mui-switch').each(function(index , item){
//			mui(this).switch().toggleCur(false);
//		})

    },
    // 校验附加险投保年龄
    checkExtraAge: function (safeid) {
        var assuAge = Number(this.assu.age)
        var applAge = Number(this.appl.age)
        var mainSafeYear = this.mainSafeYear
        var mainPayYear = this.mainPayYear
        var payOverage = Number(this.insurance.pay_year) - 1 + applAge // 期满年龄\
        var name = this.Addons[safeid].name
        var toastText = null

        switch (safeid) {
            //泰康
            case 'RH7B':
                if (assuAge > 55) {
                    toastText = '被保人年龄不能大于55周岁'
                }
                break
            case 'WPJP':
                if (applAge > 69) {
                    toastText = '被豁免合同投保人年龄不能大于69周岁'
                }
                break
            case 'RP8P':
                if (applAge > 68) {
                    toastText = '被豁免合同投保人年龄不能大于68周岁'
                }
                break
            case 'A47P':
                if (assuAge > 65) {
                    toastText = '被保人年龄不能大于65周岁'
                }
                break

            //国华
            case '1161':
                if (mainPayYear === 20 && assuAge > 40) {
                    toastText = '缴费为20年交，被保人年龄大于40岁时，不可附加该险种'
                }
                break

            //恒大
            case 'HA005': // 尊享安康
                if (assuAge > 65) {
                    toastText = '被保人年龄不能大于65周岁'
                }
                break
            case 'HA006': // 恒顺
                if (assuAge > 55) {
                    toastText = '被保人年龄不能大于55周岁'
                }
                break

            //工银
            case 'AMRB':
            case 'HR':
            case 'HI':
                if (applAge > 68) {
                    toastText = '被豁免合同投保人年龄不能大于68周岁'
                }
                break
            case 'NWPD': //工银安盛人寿附加豁免保险费定期寿险
                if (applAge > 60) {
                    toastText = '投保人年龄不能大于60周岁'
                } else if (mainPayYear === 15 && applAge > 50) {
                    toastText = '15年交投保人年龄不能大于50周岁'
                } else if (mainPayYear === 20 && applAge > 40) {
                    toastText = '20年交投保人年龄不能大于40周岁'
                } else if (mainPayYear === 30 && applAge > 27) {
                    toastText = '30年交投保人年龄不能大于27周岁'
                }
                break
            case 'NADD':
                if (assuAge > 70) {
                    toastText = '被保人年龄不能大于70周岁'
                }
                break

            //信泰
            case '31A00050': // 附加信泰百万健康重大疾病
                if (mainPayYear === 1 && assuAge > 50) {
                    toastText = '被保人年龄不能大于50周岁'
                } else if (mainPayYear === 3 && assuAge > 50) {
                    toastText = '3年交被保人年龄不能大于50周岁'
                } else if (mainPayYear === 5 && assuAge > 50) {
                    toastText = '5年交被保人年龄不能大于50周岁'
                } else if (mainPayYear === 10 && assuAge > 50) {
                    toastText = '10年交被保人年龄不能大于50周岁'
                } else if (mainPayYear === 15 && assuAge > 45) {
                    toastText = '15年交被保人年龄不能大于45周岁'
                } else if (mainPayYear === 20 && assuAge > 40) {
                    toastText = '20年交被保人年龄不能大于40周岁'
                } else if (mainPayYear === 30 && assuAge > 35) {
                    toastText = '30年交被保人年龄不能大于35周岁'
                }
                break
            case '12E20010': // 信泰千万人生金掌柜
                if (toastText) break
                if (this.cache.derate_money12E20010 === '') {
                    toastText = '年缴保费不能为空'
                } else if (this.cache.derate_money12E20010 === 0) {
                    toastText = '年缴保费不能为0'
                } else if (this.cache.derate_money12E20010 % 1000 !== 0) {
                    toastText = '年缴保费为1000元整数倍'
                }
                break

            //中英
            case 'CKRA':
            case 'PFR': // 中英人寿附加交通意外伤害保险投保规则
            case 'PGR': // 中英人寿附加意外伤害保险（2013版）
            case 'CBR': // 中英人寿附加额外给付重大疾病保险
                if (assuAge > 65) {
                    toastText = '被保人年龄不能大于65周岁'
                }
                break
            case 'JCR': // 中英人寿附加保费豁免重大疾病保险
                if (applAge > 60) {
                    toastText = '被豁免合同投保人年龄不能大于60周岁'
                }
                break
            case 'HIA':
            case 'AMR': // 中英人寿附加意外伤害医疗保险
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break
            case 'TLR': // 中英人寿附加定期寿险
                if (assuAge < 18 || assuAge > 60) {
                    toastText = '被保人年龄在18周岁到60周岁之间'
                }
                break
            case 'JER': // 中英人寿附加投保人保费豁免重大疾病保险
                if (applAge > 68 || applAge < 18) {
                    toastText = '被豁免合同被保人年龄在18到68周岁之间'
                } else if (applAge > 65 && mainPayYear === 10) {
                    toastText = '10年交投保人年龄不能大于65周岁'
                } else if (applAge > 60 && mainPayYear === 15) {
                    toastText = '15年交投保人年龄不能大于60周岁'
                } else if (applAge > 55 && mainPayYear === 20) {
                    toastText = '20年交投保人年龄不能大于55周岁'
                } else if (applAge > 45 && mainPayYear === 30) {
                    toastText = '30年交投保人年龄不能大于45周岁'
                }
                break
            //复星
            case 'FXKLYSFJ': // 附加康乐一生投保人豁免保费重大疾病保险
                if (applAge > 50) {
                    toastText = '投保人年龄不能大于50周岁'
                }
                break
            case 'FJKLYSQZ': //
                if (mainPayYear === 20 && mainSafeYear === 70) {
                    toastText = '保障期间为70年，缴费为20年交时，不可附加该险种'
                }
                break
            case 'LJYSMZ': // 复星乐健一生门诊保险（主险）
                if (toastText) break
                if (this.fxljysFXLJYS.mztc === '0') {
                    toastText = '请选择门急诊医疗保险套餐'
                } else if (this.fxljysFXLJYS.mznmp === '0') {
                    toastText = '请选择门急诊医疗保险免赔额'
                }
                break
            //招商仁和
            case '1011': // 招商仁和附加投保人豁免保险费定期寿险
                if (applAge > 65) {
                    toastText = '投保人年龄不能大于65周岁'
                } else if (mainPayYear + applAge > 70 && mainPayYear != 60) {
                    toastText = '投保年龄加交费年期不能大于70周岁'
                }
                break
             case '1003': // 附加爱倍护养老年金保险
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                } else if (mainPayYear + assuAge > 60 && mainPayYear != 60) {
                    toastText = '投保年龄加交费年期不能大于60周岁'
                } else if (assuAge > 59 && mainPayYear === 60) {
                    toastText = '交至60周岁被保人年龄应在0到59周岁'
                }
                break    
             case '1013': // 招商仁和仁安无忧意外伤害保险
                if (assuAge > 65 || assuAge < 18) {
                    toastText = '被保人年龄在18周岁到65周岁之间'
                }
                break    
             case '1015': // 附加意外门急诊医疗保险
             case '1017': // 附加住院每日补贴医疗保险
             case '1018': // 招商仁和仁医保费用补偿医疗保险
                if (assuAge > 60) {
                    toastText = '被保人年龄不能大于60周岁'
                }
                break    

        }

        if (toastText) {
            mui.toast('【' + name + '】' + toastText)
            this.addonsSelected[safeid] = false
            this.$forceUpdate()
            return false
        }
        return true
    },
    // 校验附加险保额
    checkExtraForm: function (safeid) {
        var toastText = null
        var flag = Number(this.flag[safeid])
        var periodMoney = this.insurance.period_money
        var name = this.Addons[safeid].name
        var assuAge = Number(this.assu.age)
        switch (safeid) {
            //泰康
            case 'RP8P':
                if (!flag) {
                    toastText = '请先选择计划'
                }
                break
            case 'RSC': // 乐行天下  附加乐行天下意外伤害保险
            case 'A47P': // 健康优享住院费用医疗保险
                if (!flag) {
                    toastText = '请先选择保险金额'
                }
                break
            //工银
            case 'AMRB':
                if (!flag) {
                    toastText = '请先选择保险金额'
                }
                break
            case 'HR':
                if (periodMoney < 1000) {
                    toastText = '主险年交保费小于1000元不可附加该险种'
                } else if (!flag) {
                    toastText = '请先选择保险金额'
                }
                break
            case 'NADD':
                if (!this.cache.base_moneyNADD) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyNADD < 50000 || this.cache.base_moneyNADD > 3000000) {
                    toastText = '保险金额范围为5万~300万'
                } else if (this.cache.base_moneyNADD > this.insurance.money * 5) {
                    toastText = '保额不得超过主险保额的5倍'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                }
                break
            case 'DAR': // 工银养老年金
                if (!flag) {
                    toastText = '请先选择领取年龄'
                }
                break

            //恒大
            case 'HA005': // 恒大尊享安康
            case 'HA014': // 恒大恒久安心
                if (!flag) {
                    toastText = '请先选择保险金额'
                }
                break

            case 'HA006': // 恒顺
                if (toastText) break
                var extraMoney = flag > 50000 ? flag.toString().substr(1) : flag
                if (!flag) {
                    toastText = '请先选择保险金额'
                } else if (extraMoney > this.insurance.period_money * this.mainPayYear * 0.2 && ['290', '378', '401'].indexOf(this.insurance.safe_id) > -1) {
                    // 主险--金财D,福享今生
                    toastText = '该附加险保额不超主合同总保费（期交保费*缴费年限）*20%'
                } else if (extraMoney > this.insurance.money * 0.2 && ['HB023', '369'].indexOf(this.insurance.safe_id) > -1) {
                    // 恒久健康，万年青
                    toastText = '该附加险保额不能大于主险保额的20%'
                } else if (extraMoney > this.insurance.money * 50000 * 0.2 && this.insurance.safe_id === '292') {
                    // 千万护航
                    toastText = '该附加险保额不能大于主险保额的20%'
                }
                break
            case 'HA007': // 恒祥
                if (toastText) break
                if (!this.cache.base_moneyHA007) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyHA007 < 50 || this.cache.base_moneyHA007 > 200 || this.cache.base_moneyHA007 % 10 !== 0) {
                    toastText = '保险金额范围50-200元，且为10的整数'
                }
                break

            //信泰
            case '31A00050': // 附加百万健康两全保险
                if (!flag) {
                    toastText = '请先选择保障期间'
                }
                break

            //中英
            case 'PFR': //附加交通意外伤害
                if (!this.cache.base_moneyPFR) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyPFR < 50000 && assuAge < 18) {
                    toastText = '未成年人保险金额最低为5万元'
                } else if (this.cache.base_moneyPFR < 100000 && assuAge >= 18) {
                    toastText = '成年人保险金额最低为10万元'
                } else if (this.cache.base_moneyPFR > 5000000 && assuAge >= 18) {
                    toastText = '成年人保额上限为 500 万'
                } else if (this.cache.base_moneyPFR > 200000 && assuAge < 10) {
                    toastText = '0-9 岁未成年人保额上限为 20 万'
                } else if (this.cache.base_moneyPFR > 500000 && assuAge >= 10 && assuAge < 18) {
                    toastText = '10-17 岁未成年人保额上限为 50 万'
                } else if (this.cache.base_moneyPFR % 10000 !== 0) {
                    toastText = '保额以一万元为单位递增'
                } else if (!flag) {
                    toastText = '请先选择缴费年限'
                } else if (flag > this.insurance.safe_year) {
                    toastText = '该附加险缴费年限不能超过主险保障期间'
                } else if (!this.flag['PFR1']) {
                    toastText = '请先选择保险期限'
                } else if (this.flag['PFR1'] < '1000' && this.flag['PFR1'] > this.insurance.safe_year) {
                    toastText = '该附加险保险期间不能超过主险保险期间'
                } else if (this.flag['PFR1'] === '5500' && (55 - assuAge > this.insurance.safe_year)) {
                    toastText = '该附加险保险期间不能超过主险保险期间'
                } else if (this.flag['PFR1'] === '6000' && (60 - assuAge > this.insurance.safe_year)) {
                    toastText = '该附加险保险期间不能超过主险保险期间'
                } else if (this.flag['PFR1'] === '6500' && (65 - assuAge > this.insurance.safe_year)) {
                    toastText = '该附加险保险期间不能超过主险保险期间'
                } else if (this.flag['PFR1'] === '7000' && (70 - assuAge > this.insurance.safe_year)) {
                    toastText = '该附加险保险期间不能超过主险保险期间'
                } else if (this.flag['PFR1'] === '7500' && (75 - assuAge > this.insurance.safe_year)) {
                    toastText = '该附加险保险期间不能超过主险保险期间'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 50 && flag === 1) {
                    toastText = '该附加险保险期间为至55岁且趸交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 45 && flag === 3) {
                    toastText = '该附加险保险期间为至55岁且3年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 45 && flag === 5) {
                    toastText = '该附加险保险期间为至55岁且5年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 40 && flag === 9) {
                    toastText = '该附加险保险期间为至55岁且9年交被保人年龄不能超过40岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 40 && flag === 10) {
                    toastText = '该附加险保险期间为至55岁且10年交被保人年龄不能超过40岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 35 && flag === 15) {
                    toastText = '该附加险保险期间为至55岁且15年交被保人年龄不能超过35岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 30 && flag === 19) {
                    toastText = '该附加险保险期间为至55岁且19年交被保人年龄不能超过30岁'
                } else if (this.flag['PFR1'] === '5500' && assuAge > 30 && flag === 20) {
                    toastText = '该附加险保险期间为至55岁且20年交被保人年龄不能超过30岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 55 && flag === 1) {
                    toastText = '该附加险保险期间为至60岁且趸交被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 50 && flag === 3) {
                    toastText = '该附加险保险期间为至60岁且3年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 50 && flag === 5) {
                    toastText = '该附加险保险期间为至60岁且5年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 45 && flag === 9) {
                    toastText = '该附加险保险期间为至60岁且9年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 45 && flag === 10) {
                    toastText = '该附加险保险期间为至60岁且10年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 40 && flag === 15) {
                    toastText = '该附加险保险期间为至60岁且15年交被保人年龄不能超过40岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 35 && flag === 19) {
                    toastText = '该附加险保险期间为至60岁且19年交被保人年龄不能超过35岁'
                } else if (this.flag['PFR1'] === '6000' && assuAge > 35 && flag === 20) {
                    toastText = '该附加险保险期间为至60岁且20年交被保人年龄不能超过35岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 60 && flag === 1) {
                    toastText = '该附加险保险期间为至65岁且趸交被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 55 && flag === 3) {
                    toastText = '该附加险保险期间为至65岁且3年交被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 55 && flag === 5) {
                    toastText = '该附加险保险期间为至65岁且5年交被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 50 && flag === 9) {
                    toastText = '该附加险保险期间为至65岁且9年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 50 && flag === 10) {
                    toastText = '该附加险保险期间为至65岁且10年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 45 && flag === 15) {
                    toastText = '该附加险保险期间为至65岁且15年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 40 && flag === 19) {
                    toastText = '该附加险保险期间为至65岁且19年交被保人年龄不能超过40岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 40 && flag === 20) {
                    toastText = '该附加险保险期间为至65岁且20年交被保人年龄不能超过40岁'
                } else if (this.flag['PFR1'] === '6500' && assuAge > 40 && flag === 20) {
                    toastText = '该附加险保险期间为至65岁且20年交被保人年龄不能超过40岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 65 && flag === 1) {
                    toastText = '该附加险保险期间为至70岁且趸交被保人年龄不能超过65岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 60 && flag === 3) {
                    toastText = '该附加险保险期间为至70岁且3年交被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 60 && flag === 5) {
                    toastText = '该附加险保险期间为至70岁且5年交被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 55 && flag === 9) {
                    toastText = '该附加险保险期间为至70岁且9年交被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 55 && flag === 10) {
                    toastText = '该附加险保险期间为至70岁且10年交被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 50 && flag === 15) {
                    toastText = '该附加险保险期间为至70岁且15年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 45 && flag === 19) {
                    toastText = '该附加险保险期间为至70岁且19年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '7000' && assuAge > 45 && flag === 20) {
                    toastText = '该附加险保险期间为至70岁且20年交被保人年龄不能超过45岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 65 && flag === 1) {
                    toastText = '该附加险保险期间为至75岁且趸交被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 65 && flag === 3) {
                    toastText = '该附加险保险期间为至75岁且3年交被保人年龄不能超过65岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 65 && flag === 5) {
                    toastText = '该附加险保险期间为至75岁且5年交被保人年龄不能超过65岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 60 && flag === 9) {
                    toastText = '该附加险保险期间为至75岁且9年交被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 60 && flag === 10) {
                    toastText = '该附加险保险期间为至75岁且10年交被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 55 && flag === 15) {
                    toastText = '该附加险保险期间为至75岁且15年交被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 50 && flag === 19) {
                    toastText = '该附加险保险期间为至75岁且19年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '7500' && assuAge > 50 && flag === 20) {
                    toastText = '该附加险保险期间为至75岁且20年交被保人年龄不能超过50岁'
                } else if (this.flag['PFR1'] === '15' && assuAge > 60) {
                    toastText = '该附加险保险期间为15年被保人年龄不能超过60岁'
                } else if (this.flag['PFR1'] === '20' && assuAge > 55) {
                    toastText = '该附加险保险期间为20年被保人年龄不能超过55岁'
                } else if (this.flag['PFR1'] === '30' && assuAge > 45) {
                    toastText = '该附加险保险期间为30年被保人年龄不能超过45岁'
                }
                break
            case 'HIA': // 附加住院津贴医疗保险
                if (!flag) {
                    toastText = '请先选择保险份数'
                }
                break
            case 'PGR': // 中英人寿附加意外伤害医疗保险2013
                if (!this.cache.base_moneyPGR) {
                    toastText = '请先输入保险金额'
                } else if (flag === 5 && this.cache.base_moneyPGR > 200000) {
                    toastText = '投保本险种5类职业累计保额限20万'
                } else if (flag === 6 && this.cache.base_moneyPGR > 100000) {
                    toastText = '投保本险种6类职业累计保额限10万'
                } else if (this.cache.base_moneyPGR < 50000 && assuAge > 18) {
                    toastText = '成年人保额最低为5万'
                } else if (this.cache.base_moneyPGR < 20000 && assuAge < 18) {
                    toastText = '未成年人保额最低为2万'
                } else if (this.cache.base_moneyPGR > 5000000 && assuAge > 18) {
                    toastText = '投保本险种 1-4 类职业累计保额最高 500 万'
                } else if (this.cache.base_moneyPGR > 200000 && assuAge > 0 && assuAge < 10) {
                    toastText = '投保本险种 1-4 类职业累计保额最高 20 万'
                } else if (this.cache.base_moneyPGR > 500000 && assuAge > 9 && assuAge < 18) {
                    toastText = '投保本险种 1-4 类职业累计保额最高 50 万'
                } else if (this.cache.base_moneyPGR % 1000 !== 0) {
                    toastText = '保额以一千元为单位递增'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                }
                break
            case 'AMR': // 中英人寿附加意外伤害医疗保险
                if (!this.cache.base_moneyAMR) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyAMR > 50000 || this.cache.base_moneyAMR < 2000) {
                    toastText = '该险种最低保额为2千元，最高保额为5万元'
                } else if (this.cache.base_moneyAMR % 1000 !== 0) {
                    toastText = '保额以一千元为单位递增'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                }
                break
            case 'TLR': // 中英人寿附加定期寿险
                if (toastText) break
                if (!this.cache.base_moneyTLR) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyTLR < 50000) {
                    toastText = '保险金额最低为5万元'
                } else if (this.cache.base_moneyTLR % 1000 !== 0) {
                    toastText = '保额以 1000 元为单位递增'
                } else if (!flag) {
                    toastText = '请先选择缴费年限'
                }
                break
            case 'CBR': // 中英人寿附加额外给付重大疾病保险
                if (toastText) break
                if (!this.cache.base_moneyCBR) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyCBR < 10000) {
                    toastText = '保险金额最低为一万元'
                } else if (this.cache.base_moneyCBR > this.insurance.money * 5 && assuAge > 17) {
                    toastText = '成年人保额上限为主险保额5倍'
                } else if (this.cache.base_moneyCBR > this.insurance.money * 10 && assuAge < 18) {
                    toastText = '未成年人保额上限为主险保额10倍'
                } else if (this.cache.base_moneyCBR % 1000 !== 0) {
                    toastText = '保额以 1000 元为单位递增'
                } else if (!flag) {
                    toastText = '请先选择缴费年限'
                } else if (flag > this.insurance.safe_year) {
                    toastText = '该附加险缴费年限不能超过主险保障期间'
                } else if ((flag + assuAge) > 75) {
                    toastText = '缴费期结束时被保险人不能超过 75 周岁'
                }
                break
            case 'CKRA': // 中英人寿附加额外给付重大疾病保险（B 款
                if (!this.cache.base_moneyCKRA) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_moneyCKRA < 10000) {
                    toastText = '保险金额最低为一万元'
                } else if (this.cache.base_moneyCKRA > 500000 && assuAge >= 18) {
                    toastText = '成年人保额上限为 50 万'
                } else if (this.cache.base_moneyCKRA > 300000 && assuAge < 18) {
                    toastText = '未成年人保额上限为 30 万'
                } else if (this.cache.base_moneyCKRA % 1000 !== 0) {
                    toastText = '保额以 1000 元为单位递增'
                } else if (!flag) {
                    toastText = '请先选择缴费年限'
                } else if (flag > this.insurance.safe_year) {
                    toastText = '该附加险缴费年限不能超过主险保障期间'
                } else if (this.insurance.safe_year === 30 && assuAge > 50) {
                    toastText = '主险保险期间为30年被保人年龄不能超过50岁'
                } else if (this.insurance.safe_year === 20 && assuAge > 60) {
                    toastText = '主险保险期间为20年被保人年龄不能超过60岁'
                } else if (this.insurance.safe_year === 20 && assuAge > 55 && flag === 15) {
                    toastText = '主险保险期间为20年且附加险缴费年限为15年交被保人年龄不能超过55岁'
                } else if (this.insurance.safe_year === 15 && assuAge > 65) {
                    toastText = '主险保险期间为15年被保人年龄不能超过65岁'
                } else if (this.insurance.safe_year === 15 && assuAge > 60 && flag === 10) {
                    toastText = '主险保险期间为15年且附加险缴费年限为10年交被保人年龄不能超过60岁'
                } else if (this.insurance.safe_year === 15 && assuAge > 55 && flag === 15) {
                    toastText = '主险保险期间为15年且附加险缴费年限为15年交被保人年龄不能超过55岁'
                } else if (this.insurance.safe_year === 10 && assuAge > 65) {
                    toastText = '主险保险期间为10年被保人年龄不能超过65岁'
                } else if (this.insurance.safe_year === 10 && assuAge > 60 && flag === 10) {
                    toastText = '主险保险期间为10年且附加险缴费年限为10年交被保人年龄不能超过60岁'
                }
                break
                //招商仁和
                 case '1013': // 招商仁和仁安无忧意外伤害保险
                 if (!this.cache.base_money1013) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_money1013 < 100000) {
                    toastText = '最低基本保额为10万元'
                } else if (this.cache.base_money1013 % 1000 !== 0) {
                    toastText = '保费需为1千元整数倍'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                } 
                break
                 case '1015': // 附加意外门急诊医疗保险
                 if (!this.cache.base_money1015) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_money1015 < 5000) {
                    toastText = '最低基本保额为5千元'
                } else if (this.cache.base_money1015 > 30000) {
                    toastText = '最高基本保额为3万元'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                } else if (!this.flag['10151']) {
                    toastText = '请先选择有无社保'
                }
                break
                case '1017': // 附加住院每日补贴医疗保险
                if (!this.cache.base_money1017) {
                    toastText = '请先输入保险金额'
                } else if (this.cache.base_money1017 < 30) {
                    toastText = '最低基本保额为30元/天'
                } else if (this.cache.base_money1017 > 500) {
                    toastText = '最高基本保额为500元/天'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                }
                break
                case '1018': // 招商仁和仁医保费用补偿医疗保险
                if (!this.cache.base_money1018) {
                    toastText = '请先输入保险金额'
                }else if (this.cache.base_money1018 < 5000) {
                    toastText = '最低基本保额为5千元'
                } else if (this.cache.base_money1018 > 50000) {
                    toastText = '最高基本保额为5万元'
                } else if (!flag) {
                    toastText = '请先选择职业分类'
                }
                break

        }
        if (toastText) {
            this.$delete(this.addonRes, safeid)
            mui.toast('【' + name + '】' + toastText)
            this.$forceUpdate()
            return false
        }
        return true
    },
    // 校验附加险保费
    checkExtraFee: function (safeid) {
        var name = this.Addons[safeid].name
        if (!this.addonRes[safeid]) {
            mui.toast('请先计算【' + name + '】')
            return false;
        }
        return true
    },
    /**
     * 计算
     * @param isMain
     * @param addonSafeid
     * @returns {boolean}
     */
    calMoney: function (isMain, addonSafeid) {
        var vm = this
        if (this.uploading) {
            mui.toast('请勿连续点击！')
            return false
        }
        this.uploading = true
        setTimeout(function () {
            vm.uploading = false
        }, 1000)
        const safeid = isMain ? this.insurance.safe_id : addonSafeid
        if (!safeid) {
            mui.toast('险种ID不正确')
            return false
        }
        var genre = '';
        luckyAjax({
            data: {
                server: 'Proposal.getProductInfo',
                device: 'mobile',
                view: false,
                data: JSON.stringify({
                    code: safeid,
                    id: ''

                })
            },
            success: function (res) {
                if (res.code == 1) {
                    genre = res.data.id
                    vm.calMoney1(isMain, safeid, genre)
                } else {
                    mui.toast('加载失败')
                }
            }
        });

    },
    calMoney1: function (isMain, safeid, genre) {

        this.mainPayYear = Number(this.insurance.pay_year)
        this.mainSafeYear = Number(this.insurance.safe_year)
        if (isMain && !this.checkMainForm()) {
            return false
        }
        if (isMain) { // 主险
            if (!this.checkMainAge(safeid)) {
                return false
            }
            if (!this.checkMainMoney(safeid)) {
                return false
            }
        } else { // 附加险
            if (!this.checkExtraAge(safeid)) {
                return false
            }
            if (!this.checkExtraForm(safeid)) {
                return false
            }
        }
        var data = {
            user_id: user_id,
            applicant: this.appl.name,
            appl_sex: this.appl.sex === true ? 1 : 2,
            appl_age: this.appl.age,
            assured: this.assu.name,
            assu_sex: this.assu.sex === true ? 1 : 2,
            assu_age: this.assu.age,
            safe_year: this.mainSafeYear === 999 ? 0 : this.mainSafeYear,
            pay_year: this.mainPayYear,
            warranty_year: 1,
            genre: genre,
            fj: !isMain,
            is_save: 0,
            derate_money: 0,
            need_packet: 0,
            flag: 0,
            check: 0,
            alias: null
        }
        // 添加特殊参数
        var filterSafeid = ['31A00050', '12D00080', "HB030", 'DAR', 'LA073', '1003']
        if (filterSafeid.indexOf(safeid) > -1) {
                data.assume_rate = '0';
                data.sa_one= '0';
                data.fa_one= '0';
                data.money_one= '0';
                data.sa_two= '0';
                data.fa_two= '0';
                data.money_two= '0';
                data.sa_three= '0';
                data.fa_three= '0';
                data.money_three= '0';
                data.sa_four= '0';
                data.fa_four= '0';
                data.money_four= '0';
                data.sa_five= '0';
                data.fa_five= '0';
                data.money_five= '0';
                data.sa_six= '0';
                data.fa_six= '0';
                data.money_six= '0';
                data.sa_seven= '0';
                data.fa_seven= '0';
                data.money_seven= '0';
                data.sa_eight= '0';
                data.fa_eight= '0';
                data.money_eight= '0';
                data.sa_night= '0';
                data.fa_night= '0';
                data.money_night= '0';
                data.sa_ten= '0';
                data.fa_ten= '0';
                data.money_ten= '0'
             
        }
        if (safeid === 'CCPAAP1' || safeid === 'P005-3') {
            data.flag = this.prospectus_type
        }

        // 计算保额还是保费
        if (this.isBaseMoney) {
            data.base_money = this.insurance.money
        } else {
            data.year_fee = this.insurance.period_money
        }

        var py = this.mainPayYear === 1 ? 1 : this.mainPayYear - 1 // 主险缴费期间减一年
        var periodMoney = Number(this.insurance.period_money)
        var money = Number(this.insurance.money)

        // 险种参数
        if (safeid === 'LA063') { // 恒大
            // 恒大福享今生
            data.level = 2 // 不知道为什么要传这个才能做计划书
            data.flag = this.flag[safeid]
        } else if (safeid === 'HA005') {
            // 恒大 尊享安康
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = 500000
            data.flag = this.flag[safeid]
        } else if (safeid === 'LA073') {
            // 恒大 万年红传家宝
            data.pay_year = 1
            data.safe_year = 0
            data.base_money = 0
            data.year_fee = 100
            data.derate_money = 100
            data.flag = 100
            data.ylnj = 0
            data.zsj = 0
            data.njy = 0
            data.nje = 0
            data.tbnj = 0
        } else if (safeid === 'HA006') {
            // 恒大 恒顺
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = this.flag[safeid] > 50000 ? this.flag[safeid].toString().substr(1) : this.flag[safeid]
            data.flag = this.flag[safeid]
        } else if (safeid === 'HA007') {
            // 恒大恒祥
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = this.cache.base_moneyHA007
        } else if (safeid === 'HA014') { // 恒大附加恒久安心住院医疗保险
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = 0
            data.assu_sex = 0
            data.flag = this.flag[safeid]
        } else if (safeid === 'HB024') {
            // 恒大附加投保人豁免保费重大疾病保险2017版
            data.pay_year = py
            data.safe_year = py
            data.base_money = periodMoney
        } else if (safeid === 'WPJP') { // 附加乐相伴豁免保险费重大疾病保险
            data.pay_year = py
            data.safe_year = py
            data.year_fee = periodMoney
            data.base_money = periodMoney
        } else if (safeid === 'RH7B') { // 泰康 附加如意尊享住院费用B款医疗保险
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = 250000
        } else if (safeid === 'RP8P') { // 附加乐无忧住院医疗保险
            data.pay_year = 1
            data.safe_year = 1
            data.flag = this.flag[safeid]
        } else if (safeid === 'RSC') {
            // 乐行天下附加
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainSafeYear
            data.base_money = this.flag[safeid]
        } else if (safeid === 'A47P') { // 泰康健康优享住院费用医疗保险
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = 0
            data.flag = this.flag[safeid]
        } else if (safeid === 'WRGP') { // 乐安心的附加险乐相伴豁免B款
            data.pay_year = py
            data.safe_year = py
            data.year_fee = periodMoney
        } else if (safeid === 'RSD') {
            // 乐行天下附加
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainSafeYear
            data.base_money = 100
        } else if (safeid === 'A66') {
            // 乐行天下主险
            data.money_one = this.cache.pay_moneyRSC
            data.money_two = this.cache.pay_moneyRSD;} else if (safeid === '8111') { // 国华人寿康运金生
            data.flag = money / 10000
        } else if (safeid === '1166') { // 国华少儿成长无忧重大疾病保险
            data.pay_year = this.mainPayYear
            data.safe_year = 2500
            data.base_money = money
        } else if (safeid === '3188') { // 国华盛世鑫悦
            data.flag = this.flag[safeid]
            data.base_money = 0
            data.safe_year = 10000
        } else if (safeid === '1161') { //国华附加年金
            data.base_money = periodMoney * this.mainPayYear
            data.safe_year = 85
        } else if (safeid === '1168') { // 国华康运金生附加养老年金
            data.pay_year = this.mainPayYear
            data.safe_year = '8500'
            data.base_money = periodMoney * this.mainPayYear
            data.flag = 0
        } else if (safeid === '1165' || safeid === '116502' || safeid === '116503') { // 国华康运金生附加豁免保险费重大疾病保险（2017）
            data.pay_year = 1
            data.safe_year = 1
            if (this.addonRes['1168']) {
                data.base_money = (periodMoney + Number(this.addonRes['1168']['年缴保费'])) * (this.mainPayYear - 1)
            } else if (this.addonRes['1167']) {
                data.base_money = (periodMoney + Number(this.addonRes['1167']['年缴保费'])) * (this.mainPayYear - 1)
            } else {
                data.base_money = periodMoney * (this.mainPayYear - 1)
            }
            data.flag = 0
        } else if (safeid === '1167') { // 国华附加少儿成长无忧年金保险
            data.pay_year = 10
            data.safe_year = 2500
            data.base_money = this.cache.base_money1167 * periodMoney * 10
            data.year_fee = this.cache.base_money1167
        } else if (safeid === 'ANIA') { //工银鑫丰盈
            data.safe_year = 10500
        } else if (safeid === 'HR' || safeid === 'AMRB') { //工银附加险
            // 附加住院费用医疗保险  附加意外伤害医疗B
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = money
            data.year_fee = periodMoney
            data.flag = this.flag[safeid]
        } else if (safeid === 'NADD') { // 附加综合意外伤害保险
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = this.cache.base_moneyNADD
            data.flag = this.flag[safeid]
        } else if (safeid === 'ACIWP' || safeid === 'NWPD') {
            // 附加豁免保险费重大疾病保险 附加豁免保险费定期寿险
            data.pay_year = py
            data.safe_year = py
            data.base_money = periodMoney
        } else if (safeid === 'HI') { // 附加住院津贴医疗保险
            data.pay_year = 1
            data.safe_year = 1
            if (periodMoney >= 1000 && periodMoney <= 3000) {
                data.base_money = 1
            } else if (periodMoney > 3000 && periodMoney <= 10000) {
                data.base_money = 2
            } else if (periodMoney > 10000 && periodMoney <= 20000) {
                data.base_money = 3
            } else if (periodMoney > 20000 && periodMoney <= 30000) {
                data.base_money = 5
            } else if (periodMoney > 30000 && periodMoney <= 50000) {
                data.base_money = 7
            } else if (periodMoney > 50000) {
                data.base_money = 10
            }
            data.year_fee = periodMoney
        } else if (safeid === 'DAR') { // 工银安盛-鑫丰盈年金保险-养老年金
            data.pay_year = 1
            data.safe_year = 10500
            data.year_fee = 100
            data.level = 0
            data.flag = this.flag[safeid]
            data.ylnj = 0
            data.zsj = 0
            data.njy = 0
            data.nje = 0
            data.tbnj = 0
            this.addonRes[safeid] = {
                '年缴保费': 100
            }
            this.$forceUpdate()
        } else if (safeid === '12D00080') { // 信泰千万人生
            data.flag = 0
        } else if (safeid === '31A00050') {
            // 信泰百万健康重大疾病
            data.pay_year = this.mainPayYear
            data.safe_year = this.flag[safeid]
            data.flag = this.flag[safeid]
        } else if (safeid === '33F00030') { // 信泰附加投保人豁免保险费重大疾病保险
            data.pay_year = py
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
            data.base_money = periodMoney
        } else if (safeid === '12E20010') { // 附加金掌柜年金保险
            data.pay_year = 1
            data.safe_year = 1
            data.derate_money = this.cache.derate_money12E20010
            data.flag = this.cache.derate_money12E20010
            data.year_fee = this.cache.derate_money12E20010
        } else if (safeid === 'NCUA') { // 中英爱守护zhu
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
            data.base_money = money
        } else if (safeid === 'NCWA') { // 中英爱守护尊享
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
            data.base_money = money
        } else if (safeid === 'PFR') { // 中英人寿附加交通意外伤害保险
            data.pay_year = this.flag[safeid]
            data.safe_year = this.flag['PFR1']
            data.base_money = this.cache.base_moneyPFR
            data.flag = 0
        } else if (safeid === 'JER') {
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainPayYear
            if (this.addonRes['PFR'] && this.addonRes['CKRA']) {
                data.base_money = periodMoney + this.addonRes['PFR']['年缴保费'] + this.addonRes['CKRA']['年缴保费']
            } else if (this.addonRes['PFR']) {
                data.base_money = periodMoney + this.addonRes['PFR']['年缴保费']
            } else if (this.addonRes['CKRA']) {
                data.base_money = periodMoney + this.addonRes['CKRA']['年缴保费']
            } else {
                data.base_money = periodMoney
            }
        } else if (safeid === 'JCR') {
            // 中英人寿附加保费豁免重大疾病保险
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainPayYear
            data.base_money = periodMoney
        } else if (safeid === '235' || safeid === '236' || safeid === 'HIA') {
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = periodMoney
            data.flag = this.flag[safeid]
        } else if (safeid === 'PGR') { // 中英附加意外伤害保险（2013版）投
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = this.cache.base_moneyPGR
            data.flag = this.flag[safeid]
            data.assu_sex = 0
        } else if (safeid === 'AMR') { // 中英人寿附加意外伤害医疗保险
            data.pay_year = 1
            data.safe_year = 1
            data.base_money = this.cache.base_moneyAMR
            data.flag = this.flag[safeid]
            data.assu_sex = 0
        } else if (safeid === 'TLR') { // 中英人寿附加定期寿险
            data.pay_year = this.flag[safeid]
            data.safe_year = this.flag[safeid]
            data.base_money = this.cache.base_moneyTLR
            data.flag = 0
        } else if (safeid === 'CBR') { // 中英人寿附加额外给付重大疾病保险
            data.pay_year = this.flag[safeid]
            data.safe_year = this.flag[safeid]
            data.base_money = this.cache.base_moneyCBR
            data.flag = 0
        } else if (safeid === 'CKRA') { // 中英人寿附加额外给付重大疾病保险（B 款）
            data.pay_year = this.flag[safeid]
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
            data.base_money = this.cache.base_moneyCKRA
            data.flag = 0
        } else if (safeid === 'FXKLYSB') { //复星
            //  b款
            data.safe_year = this.mainSafeYear === 999 ? 0 : 7000
        } else if (safeid === 'FXKLYSFJ') { //复星
            //  附加康乐一生投保人豁免保费重大疾病保险
            data.pay_year = py
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
            if (this.addonRes['FJKLYSQZ']) {
                data.base_money = Number(periodMoney) + Number(this.addonRes['FJKLYSQZ'].年缴保费)
            } else {
                data.base_money = periodMoney
            }
        } else if (safeid === 'FJKLYSQZ') {
            //  附加康乐一生轻症保险
            data.pay_year = this.mainPayYear
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
            data.base_money = money * 0.2
        } else if (safeid === 'FXLJYS') {
            //  复星乐健一生住院
            data.flag = this.fxljysFXLJYS.shebao + this.fxljysFXLJYS.zytc
            data.zynmp = this.fxljysFXLJYS.zynmp // 住院年免赔
            data.zfbl = 1 // 自负比例
            data.mznmp = this.fxljysFXLJYS.mznmp // 门诊年免赔
            data.mzptcmp = this.fxljysFXLJYS.mzptcmp // 门诊普通次免赔
            data.mztxcimp = this.fxljysFXLJYS.mztxcimp // 门诊特需次免赔
        } else if (safeid === 'LJYSMZ') {
            //  复星乐健一生门诊
            data.flag = this.fxljysFXLJYS.shebao + this.fxljysFXLJYS.mztc
            data.zynmp = this.fxljysFXLJYS.zynmp // 住院年免赔
            data.zfbl = 1 // 自负比例
            data.mznmp = this.fxljysFXLJYS.mznmp // 门诊年免赔
            data.mzptcmp = this.fxljysFXLJYS.mzptcmp // 门诊普通次免赔
            data.mztxcimp = this.fxljysFXLJYS.mztxcimp // 门诊特需次免赔

        } else if (safeid === '1001') { //  招商仁和
            	//招商仁和爱倍护重大疾病保险
            data.pay_year = this.mainPayYear === 60 ? 6000 : this.mainPayYear
        } else if (safeid === '1002') {
            //  附加豁免保险费重大疾病保险
            data.pay_year = this.mainPayYear === 60 ? 5900 : py
            data.safe_year = this.mainSafeYear === 999 ? 0 : this.mainSafeYear
             if (this.addonRes['1003']) {
                data.base_money = Number(periodMoney) + Number(this.addonRes['1003']['年缴保费'])
            } else {
                data.base_money = periodMoney
            }
        } else if (safeid === '1011') {
            //  投保人豁免保险费定期寿险
            if (this.addonRes['1003']) {
                data.base_money = Number(periodMoney) + Number(this.addonRes['1003']['年缴保费'])
            } else {
                data.base_money = periodMoney
            }
            data.pay_year = this.mainPayYear === 60 ? 5900 : py
            data.safe_year = this.mainPayYear
        } else if (safeid === '1003') {
            //  附加爱倍护养老年金保险
            this.addonsSelected['1002'] = false
            this.addonRes['1002'] = ''
        	this.addonsSelected['1011'] = false
            this.addonRes['1011'] = ''
            this.$forceUpdate()
            data.pay_year = this.mainPayYear
            data.safe_year = 8500
            data.base_money = this.insurance.money
            data.njy = this.insurance.period_money * this.mainPayYear
        } else if (safeid === '1013') {
            //  招商仁和仁安无忧意外伤害保险
            data.assu_sex = 0
            data.pay_year = 1
            data.safe_year = 1
            data.flag = this.flag[safeid]
            data.base_money = this.cache.base_money1013
        } else if (safeid === '1015') {
            //  附加意外门急诊医疗保险
            data.assu_sex = 0
            data.pay_year = 1
            data.safe_year = 1
            data.flag = this.flag['10151'] + this.flag[safeid]
            data.base_money = this.cache.base_money1015
        } else if (safeid === '1017') {
            //  附加住院每日补贴医疗保险
            data.assu_sex = 0
            data.pay_year = 1
            data.safe_year = 1
            data.flag = this.flag[safeid]
            data.base_money = this.cache.base_money1017
        } else if (safeid === '1018') {
            // 招商仁和仁医保费用补偿医疗保险
            data.assu_sex = 0
            data.pay_year = 1
            data.safe_year = 1
            data.flag = this.flag[safeid]
            data.base_money = this.cache.base_money1018
        }else if (safeid === '1016') {
            // 招商仁和仁医保费用补偿医疗保险
            data.assu_sex = 0
            data.flag = this.flag[safeid]
        }

        if (isMain) {
            this.mainInsData = data
        } else {
            this.addonInsData[safeid] = data
            if (noNeedCal.indexOf(safeid) > -1) {
                return false
            }
//			alert(JSON.stringify(this.addonInsData[safeid]))
        }
        console.log(JSON.stringify({
            safes: JSON.stringify([data])
        }))
        console.log(safeid)
        pushData = data
        var vm = this
        luckyAjax({
            data: {
                server: 'Proposal.add',
                device: 'mobile',
                data: JSON.stringify({
                    safes: JSON.stringify([data])
                })
            },
            success: function (ret) {
                if (isMain && ret.data.data &&
                    ret.data.data[0][genre] &&
                    ret.data.data[0][genre].main &&
                    ret.data.data[0][genre].main.list &&
                    ret.data.data[0][genre].main.list[1]) {
                    var i = 0;
                    var j = 0;
                    var ret = ret.data.data[0][genre].main
                    mui.each(ret.describes, function (index, item) {
                        if (ret.describes[index].title == '住院总保费' && safeid === 'FXLJYS') {
                            i = index
                        } else if (ret.describes[index].title == '年缴保费') {
                            i = index
                        }
                        if (ret.describes[index].title == '保险金额') {
                            j = index
                        }
                    })
                    var data = ret.list[1]
                    if (vm.isBaseMoney && !vm.fuBaseMoney) {
                        vm.insurance.period_money = data[i]
                    } else if (vm.isBaseMoney && vm.fuBaseMoney) {
                        //乐行天下
                        vm.insurance.period_money = data[i]
                        vm.insurance.money = data[j]
                    } else {
                        vm.insurance.money = data[j]
                    }
                    if (safeid !== 'A66' && safeid !== 'FXLJYS') {
                        vm.resetAddon()
                    }
                    vm.checkMainFee(safeid)
                    var list = {  //主险要把公司信息也带回去，方便编辑功能
                        name: ret.name,
                        safe_id: safeid,
                        safe_year: vm.insurance.safe_year,
                        pay_year: vm.insurance.pay_year,
                        money: vm.insurance.money, // 基本保险金额
                        period_money: vm.insurance.period_money, // 年交保费
                        fj: false,
                        company: ins.company,
                        main: ins.main,
                        mainSyAttr: ins.mainSyAttr,
                        mainPyAttr: ins.mainPyAttr,
                        Addons: ins.Addons,
                        insurance: ins.insurance,
                        mainTypedata: mainTypedata
                    }
                    vm.planList[0] = list
                } else if (!isMain && ret.data.data &&
                    ret.data.data[-1][genre] &&
                    ret.data.data[-1][genre].main &&
                    ret.data.data[-1][genre].main.list &&
                    ret.data.data[-1][genre].main.list[1]) { // 附加险
                    var i = 0;
                    var j = 0;
                    var res = ret.data.data[-1][genre].main
                    var data = {}
                    mui.each(res.describes, function (index, item) {
                        data[item.title] = res.list[1][index]
                    })
                    vm.addonRes[safeid] = data
                    if (safeid === 'RSC') {
                        vm.cache.pay_moneyRSC = vm.addonRes[safeid]['年缴保费'] || vm.addonRes[safeid]['年缴保费(元)']
                    } else if (safeid === 'RSD') {
                        vm.cache.pay_moneyRSD = vm.addonRes[safeid]['年缴保费'] || vm.addonRes[safeid]['年缴保费(元)']
                    } else if (safeid === 'LJYSMZ') {
                        vm.fxljysFXLJYS.mzmoney = vm.addonRes[safeid]['门诊总保费']
                    }
                    vm.$forceUpdate()

                    var list = {
                        name: res.name,
                        safe_id: safeid,
                        safe_year: ret.data.data[-1][genre].safe_year,
                        pay_year: ret.data.data[-1][genre].pay_year,
                        money: ret.data.data[-1][genre].base_money, // 基本保险金额
                        period_money: vm.addonRes[safeid]['年缴保费'] || vm.addonRes[safeid]['年缴保费(元)'] || vm.addonRes[safeid]['累计保费'] || vm.addonRes[safeid]['门诊总保费'] || ret.data.data[-1][genre].year_fee, // 年交保费
                        flag: ret.data.data[-1][genre].flag,
                        fj: true
                    }
                    vm.planList[safeid] = list
                } else {
                    mui.toast('计算出错,请重试！')
                }
            }
        });

    },
    checkIns: function () {
        if (!this.checkMainForm()) {
            return false
        } else if (!this.checkMainFee(this.insurance.safe_id)) {
            return false
        }
        if (this.insurance.safe_id === 'A66' && !this.insurance.period_money && !this.insurance.money) {
            // 乐行天下
            mui.toast('请乐行天下先计算主险保费')
            return false
        }
        var bool = true
        for (var i in this.addonsSelected) {
            if (this.addonsSelected[i] && !this.checkExtraForm(i)) {
                bool = false
            }
            if (this.addonsSelected[i] && !this.checkExtraFee(i)) {
                bool = false
            }
        }
        var vm = this
        mustSelected.forEach(function (index, item) {
            if (vm.Addons[index] && !vm.addonsSelected[index]) {
                var name = vm.Addons[index].name
                mui.toast('【' + name + '】为必选')
                bool = false
            }
        })
        return bool
    },
    savePlan: function () { //保存
        // 主险费用
        if (!this.checkIns(this.insurance.safe_id)) {
            return false
        }
        console.info('savePlan')
        mui.fire(parent_self, 'SET_INS', {
            plan_id: this.plan_id,
            ins: {
                main: this.mainInsData,
                addon: this.addonInsData,
                insurance: this.insurance
            },
            planList: this.planList,
            safeid: this.insurance.safe_id
        });

        old_back()
    }
}