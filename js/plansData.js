	var plansData = []; //处理数据
	var plansDataList = {};

	var goIns_data = []; //在线投保数据
	var clause_data = []; //条框数据
	var totalMoney = 0; //总保费
	var describes = {}; //保险利益
	var hd = [272, 276, 340, 348, 370, 16217, 264, 354, 16201, 332, 347];//有在线投保的
	var zs = [16211, 16113, 16213, 16139,16120,16219,16137,16119,16139,16212,16214,16215];//招商
	var groupList = function(data, pl_id) {

		var content = data;
		var main = content.main;
		var children = content.children;
		var describes1 = main.describes
		var safe_year;
		var pay_year;
		var parent_id = content.genre
		var type = content.type
		var year_fee = 0;
		var base_money = 0;
		var children_fee = 0;

		var listMain = {}
		mui.each(describes1, function(index, item) {
			listMain[item.title] = main.list[1][index]
		})
		describes[0] = describes1
		console.log(content.safe_year)
		if(content.safe_year == 0) {
			safe_year = '终身'
		}else if(content.safe_year != 0 && content.safe_year < 50) {
			safe_year = content.safe_year
		}else if(content.safe_year > 100) {
			safe_year = '至'+String(content.safe_year).substr(0,String(content.safe_year).length-2)+'周岁';
			console.log(safe_year)
		}else if(content.safe_year == 80 && parent_id == 301) {
			safe_year = '至'+content.safe_year+'周岁';
		}
		if(parent_id == 16113) { //招商仁和爱倍护重大疾病保险
			pay_year = content.pay_year == 6000 ? '至60周岁' : content.pay_year
		}else{
			pay_year = content.pay_year
		}

		if(parent_id == 290 || parent_id == 360 || parent_id == 370 || parent_id == 16197 || parent_id == 16224) {
			year_fee = content.year_fee;
		} else if(parent_id == 347 || parent_id == 348 || parent_id == 16217) {
			year_fee = listMain["累计保费"];
		} else if(parent_id == 337) {
			year_fee = listMain["住院总保费"];
		} else {
			year_fee = listMain["年缴保费"];
		}

		if(parent_id == 264) {
			if(content.flag == 100) {
				base_money = '有社保100万';
			} else if(content.flag == 300) {
				base_money = '有社保300万';
			} else if(content.flag == 1100) {
				base_money = '无社保100万'
			} else {
				base_money = '无社保300万'
			}
		} else if(parent_id == 309) {
			if(content.flag == 1) {
				base_money = '计划一'
			} else if(content.flag == 2) {
				base_money = '计划二'
			} else {
				base_money = '计划三'
			}
		} else if(parent_id == 347 || parent_id == 301 || parent_id == 348 || parent_id == 349 ||parent_id == 370 || parent_id == 16197 || parent_id == 16217 || parent_id == 16224) {
			base_money = Number(listMain["保险金额"]).toFixed(0);
		} else if(parent_id == 360) {
			base_money = Number(listMain["保额"]).toFixed(0);
		} else if(parent_id == 337) { //复星乐健一生住院保险
			var fxflag = '';
			if(content.flag.slice(0, 1) === 'B') {
				fxflag = '有社保'
			} else {
				fxflag = '无社保'
			}
			base_money = fxflag + content.flag.substr(1)
		} else {
			base_money = Number(content.base_money).toFixed(0)
		};
		if(zs.indexOf(Number(parent_id)) > -1) {
	      totalMoney += Number(Number(year_fee).toFixed(0));
	    }else{
	      totalMoney += Number(year_fee);
	    }
		
		if(!pl_id) {
			plansData = [];
			plansDataList.mainList = {
				applicant: content.applicant,
				assured: content.assured,
				name: main.name,
				short_name: main.short_name,
				genre: content.genre,
				safe_year: safe_year,
				pay_year: pay_year,
				base_money: base_money,
				year_fee: year_fee

			};
			goIns_data = [];
			clause_data = [];
			goIns_data.push({
				name: main.name,
				genre: content.genre,
				istrue: hd.indexOf(Number(content.genre)) > -1 ? true : false
			});
			clause_data.push({
				name: main.name,
				genre: content.genre
			});
		} else {
			plansDataList.mainList = {
				pl_id: pl_id,
				applicant: content.applicant,
				appl_sex: content.appl_sex,
				appl_age: content.appl_age,
				assured: content.assured,
				assu_sex: content.assu_sex,
				assu_age: content.assu_age,
				name: main.name,
				short_name: main.short_name,
				genre: content.genre,
				safe_year: safe_year,
				pay_year: pay_year,
				base_money: base_money,
				year_fee: year_fee
			};
			goIns_data.push({
				name: main.name,
				genre: content.genre,
				istrue: hd.indexOf(Number(content.genre)) > -1 ? true : false
			});
		}

		//如果有附加险就渲染			 	
		if(children) {
			var num = 0;
			plansDataList.childrenList = [];
			mui.each(children, function(index, tml) {
				if(tml) {
					if(!pl_id && ['377', '373', '367'].indexOf(index) > 0) {
//						只有附加险有这个3个才有中高低
						//348的中高低是福享今生主险自带
						aloneDetail.haveLevel = true
					}else if(!pl_id && index == '16198'){
						//工银鑫丰盈只有在有附加年金才有资金规划
						aloneDetail.haveDesign16197 = true
					}else if(!pl_id && index == '16232'){
						//招盈金生只有在有附加年金才有资金规划
						aloneDetail.haveLevel = true
						aloneDetail.haveDesign16211 = true
						
					}
					var list = {}
					var describes2 = tml.describes
					mui.each(describes2, function(index, item) {
						list[item.title] = tml.list[1][index]
					})
					
					describes[index] = describes2
//					alert(JSON.stringify(describes))
					var children_base_money,
						children_safe_year = 1,
						children_pay_year = 1,
						children_year_fee;
					num++;
					if(list) {
						children_year_fee = list["年缴保费"]
					}
				
					
					switch(index) {
						// 信泰
						case '341': //信泰附加投保人豁免保险费重大疾病保险
							children_base_money = year_fee;
							children_safe_year = "终身";
							children_pay_year = pay_year - 1;
							break;
						case '333': //信泰百万健康重疾
							children_base_money = base_money;
							children_safe_year = tml.flag + '岁';
							children_pay_year = pay_year;
							break;
						case '367': //金掌柜年金保险（万能型）
							children_base_money = '—';
							children_safe_year = '终身';
							children_year_fee = list["累计保费"];
							break;
							//复星
						case '344': //复星联合乐健一生门急诊保险
							var fxflag = '';
							if(tml.flag.slice(0, 1) === 'B') {
								fxflag = '有社保'
							} else {
								fxflag = '无社保'
							}
							children_base_money = fxflag + tml.flag.substr(1);
							children_safe_year = '1年';
							children_pay_year = '1年';
							children_year_fee = list["门诊总保费"];
							break;

						case '16222': //复星联合附加康乐一生轻症保险(升级款)
							children_base_money = base_money * 0.2;
							children_safe_year = content.safe_year == 0 ? '终身' : '至'+String(content.safe_year).substring(0,2)+'周岁';
							children_pay_year = pay_year;
							break;
						case '16223': //复星联合附加康乐一生投保人豁免保费重大疾病保险(升级款)
							if(children[16222]) {
								children_base_money = (Number(year_fee) + Number(children[16222].list[1][1])).toFixed(2);
							} else {
								children_base_money = year_fee;
							}
							children_safe_year = content.safe_year == 0 ? '终身' : '至'+String(content.safe_year).substring(0,2)+'周岁';
							children_pay_year = pay_year - 1;
							break;

							//中国人保
						case '354':
							//品质
							children_base_money = "—";
							children_safe_year = "终身";
							children_year_fee = tml.flag;
							break;
							//中英
						case '170':
							children_base_money = list["基本保额"];
							children_safe_year = list["保险期间"] < 100 ? list["保险期间"] : '至'+ String(list["保险期间"]).substring(0,2)+'周岁';
							children_pay_year = list["缴费期间"] < 100 ? list["缴费期间"] : '至'+ String(list["缴费期间"]).substring(0,2)+'周岁';
							break;
						case '175':
							children_base_money = year_fee;
							children_safe_year = pay_year;
							children_pay_year = pay_year;
							break;
						case '222':
							children_base_money = tml.flag + '份';
							break;
						case '227':
							children_base_money = list["基本保额"];
							break;
						case '230':
							children_base_money = list["基本保额"];
							break;
						case '261':
							children_base_money = list["基本保额"];
							children_safe_year = list["缴费期间"] < 100 ? list["缴费期间"] : '至'+ String(list["缴费期间"]).substring(0,2)+'周岁';;
							children_pay_year = list["缴费期间"] < 100 ? list["缴费期间"] : '至'+ String(list["缴费期间"]).substring(0,2)+'周岁';;
							break;
						case '265':
							if(children[170] && children[353]){
								children_base_money = (year_fee + Number(children[170].list[1][1]) + Number(children[353].list[1][1])).toFixed(2);
							}else if(children[170]) {
								children_base_money = (year_fee + Number(children[170].list[1][1])).toFixed(2);
							}else if(children[353]){
								children_base_money = (year_fee + Number(children[353].list[1][1])).toFixed(2);
							}else{
								children_base_money = year_fee
							}
							children_safe_year = content.safe_year == 0 ? '终身' : content.safe_year;
							children_pay_year = pay_year;
							break;
						case '353':
							children_base_money = list["基本保额"];
							children_safe_year = content.safe_year;
							children_pay_year = list["缴费期间"];
							break;
						case '235': //xia
							children_base_money = tml.flag + '份';
							break;
						case '236': //xia
							children_base_money = tml.flag + '份';
							break;
						case '4304':
							children_base_money = list["基本保额"];
							children_safe_year = list["缴费期间"] < 100 ? list["缴费期间"] : '至'+ String(list["缴费期间"]).substring(0,2)+'周岁';;
							children_pay_year = list["缴费期间"] < 100 ? list["缴费期间"] : '至'+ String(list["缴费期间"]).substring(0,2)+'周岁';;
							break;
							//工银
						case '177': //xia
							children_base_money = content.base_money;
							break;
						case '136':
							children_base_money = tml.flag;
							children_safe_year = list["保险期间"];
							children_pay_year = list["缴费年限"];
							break;
						case '137':
							children_base_money = tml.flag;
							break;
						case '138':
							children_base_money = list["保险金额"];
							children_safe_year = list["保险期间"];
							children_pay_year = list["缴费年限"];
							break;
						case '282':
							children_base_money = year_fee;
							children_safe_year = pay_year - 1;
							children_pay_year = pay_year - 1;
							break;
						case '269':
							children_base_money = year_fee;
							children_safe_year = pay_year - 1;
							children_pay_year = pay_year - 1;
							break;
						case '182':
							children_base_money = list["住院津贴保险金（日）"];
							children_safe_year = list["保险期间"];
							children_pay_year = list["缴费年限"];
							break;
						case '16198':
							children_base_money = "—";
							children_safe_year = "至105周岁";
							children_year_fee = 100;
							break;
							//国华
						case '11':
							children_base_money = "—";
							children_safe_year = "终身";
							children_pay_year = "—";
							children_year_fee = 0;
							break;
						case '87':
							children_base_money = Number(listMain["年缴保费"]) * Number(pay_year);
							children_safe_year = "至85岁";
							children_pay_year = pay_year;
							break;
						case '355':
							children_base_money = (year_fee * pay_year).toFixed(0);
							children_safe_year = '至85周岁';
							children_pay_year = pay_year;
							break;
						case '356':
						case '357':
						case '358':
							if(children[355]) {
								children_base_money = ((year_fee + Number(children[355].list[1][1])) * (pay_year - 1)).toFixed(0);
							}else if(children[16202]) {
								children_base_money = ((Number(year_fee) + Number(children[16202].list[1][1])) * (pay_year - 1)).toFixed(0);
							} else {
								children_base_money = (year_fee * (pay_year - 1)).toFixed(0);
							}
							break;
						case '16202':
							children_base_money = list["基本保额"];
							children_pay_year = 10;
							children_safe_year = '至25周岁';
							break;
							//泰康

						case '112':
							children_base_money = list["保险金额"];
							children_safe_year = list["保障期限"];
							children_pay_year = list["缴费年间"];
							children_year_fee = list["年缴保费"];
							break;
						case '122':
							children_base_money = year_fee;
							children_safe_year = pay_year - 1;
							children_pay_year = pay_year - 1;
							children_year_fee = list["年缴保费(元)"]
							break;
						case '165':
							children_base_money = '计划' + tml.flag;
							children_safe_year = list["保障期间(年)"];
							children_pay_year = list["缴费年间(年)"];
							children_year_fee = list["年缴保费(元)"]
							break;
						case '304':
							children_base_money = list["一般意外身故/伤残保险金"];
							children_safe_year = safe_year;
							children_pay_year = pay_year;
							break;
						case '305':
							children_base_money = list["意外住院津贴日额"];
							children_safe_year = safe_year;
							children_pay_year = pay_year;
							break;
						case '10455': // 泰康健康优享住院费用医疗保险
							if(tml.flag == 1) {
								children_base_money = '有社保';
							} else {
								children_base_money = '无社保';
							}
							break;
						case '350':
							children_base_money = year_fee;
							children_safe_year = pay_year - 1;
							children_pay_year = pay_year - 1;
							break;
							//恒大
						case '273':
							//豁免保费重大疾病保险
							if(children[16216]) {
								children_base_money = Number(year_fee) + Number(children[16216].list[1][1]);
							} else {
								children_base_money = year_fee ;
							}
							children_safe_year = '终身';
							children_pay_year = pay_year - 1;
							break;
						case '291': //xia
							//金管家
							children_base_money = "—";
							children_safe_year = "终身";
							children_year_fee = tml.flag;
							break;
						case '277':
							//尊享安康
							var flag = tml.flag.toString();
							var hdFufee2;
							if(flag.slice(0, 1) === '1') {
								hdFufee2 = '有社保'
							} else {
								hdFufee2 = '无社保'
							}
							if(flag == 150 || flag == 250) {
								children_base_money = hdFufee2 + "50万";
							} else if(flag == 1100 || flag == 2100) {
								children_base_money = hdFufee2 + "100万";
							} else if(flag == 1150 || flag == 2150) {
								children_base_money = hdFufee2 + "150万";
							}

							break;
						case '278':
							//恒顺意外
							var flag = tml.flag.toString();
							if(flag == 52000 || flag == 53000 || flag == 54000 || flag == 55000 || flag == 56000 || flag == 57000 || flag == 58000 || flag == 59000 || flag == 510000 || flag == 515000 || flag == 520000 || flag == 530000 || flag == 540000 || flag == 550000) {
								children_base_money = flag.substring(1);
							} else if(flag == 62000 || flag == 63000 || flag == 64000 || flag == 65000 || flag == 66000 || flag == 67000 || flag == 68000 || flag == 69000 || flag == 610000 || flag == 615000 || flag == 620000 || flag == 630000 || flag == 640000 || flag == 650000) {
								children_base_money = flag.substring(1);
							} else {
								children_base_money = flag;
							}
							break;
						case '279':
							//恒祥住院
							children_base_money = list["住院津贴保险金"] + '元/日';
							break;
						case '373':
							//传家宝年金保险（万能型）
							children_base_money = "—";
							children_safe_year = "终身";
							children_year_fee = 100;
							break;
						case '16205':
							//安心医疗
							var hdFufee;
							var hdFufee2;
							if(tml.flag.toString().slice(0, 1) === '1') {
								hdFufee2 = '有社保'
							} else {
								hdFufee2 = '无社保'
							}
							if(tml.flag == "15000" || tml.flag == "25000") {
								hdFufee = "5千";
							} else if(tml.flag == "110000" || tml.flag == "210000") {
								hdFufee = "1万";
							}
							children_base_money = hdFufee2 + hdFufee;
							children_year_fee = list["年缴保费"]
							break;
						case '16216':
							//附加养老年金
							children_base_money = year_fee;
							children_safe_year = tml.flag == 1 ? '74周岁' : '84周岁';
							children_pay_year = pay_year;
							children_year_fee = list["年缴保费"];
							break;
						//招商仁和
						case '16120':
						case '16219':
							//附加豁免保险费重大 疾病保险
//							附加投保人豁免保险费重大疾病保险
							if(children[16119]) {
								children_base_money = Number(year_fee) + Number(children[16119].list[1][1]);
							} else {
								children_base_money = year_fee;
							}
							children_safe_year = "终身";
							children_pay_year = pay_year == 6000 ? '至59周岁' : pay_year -1; 
							children_year_fee = list["年缴保费"];
							break;
						case '16137':
							//附加投保人豁免定期寿险
							if(children[16119]) {
								children_base_money = Number(year_fee) + Number(children[16119].list[1][1]);
							} else {
								children_base_money = year_fee;
							}
							children_safe_year = pay_year + '年';
							children_pay_year = pay_year == 6000 ? '至59周岁' : pay_year -1; 
							children_year_fee = list["年缴保费"];
							break;
						case '16119':
							//附加爱倍护养老年金保险 
							children_base_money = list["保险金额"];
							children_safe_year = "至85周岁";
							children_pay_year = list["缴费年限"]; 
							children_year_fee = list["年缴保费"];
							break;
						case '16139':
							//招商仁和仁安无忧意外伤害保险
						case '16212':
							//附加意外门急诊医疗
						case '16214':
						case '16215':
							//附加住院每日补贴医疗保险"
							//附加住院费用补偿医疗保险
							children_base_money = list["保险金额"];
							children_safe_year = "1年";
							children_pay_year = "趸交"; 
							children_year_fee = list["年缴保费"];
							break;
						case '16232':
							//招管家年金保险 （万能型）"
							children_base_money = '—';
							children_safe_year = "终身";
							children_pay_year = "趸交"; 
							break;
						case '1191':
							//附加康健人生提前给付重大疾病保险
							children_base_money = content.base_money;
							children_safe_year = '终身';
							children_pay_year = pay_year; 
							children_year_fee = list["年缴保费"];
							break;
						case '1192':
							//长城附加投保人豁免保险费重大疾病保险投保
							children_base_money = year_fee * (pay_year - 1);
							children_safe_year = content.safe_year == 0 ? '终身' : '至'+String(content.safe_year).substring(0,2)+'周岁';
							children_pay_year = pay_year - 1; 
							children_year_fee = list["年缴保费"];
							break;
						case '1146':
						case '1111':
						case '1134':
							children_base_money = list["保险金额"];
							children_safe_year = "1年";
							children_pay_year = "趸交"; 
							children_year_fee = list["年缴保费"];
							break;
						case '16229': //长城附加吉康人生两全保险
							children_base_money = content.base_money;
							children_safe_year = content.safe_year == 0 ? '终身' : '至'+String(content.safe_year).substring(0,2)+'周岁';
							children_pay_year = pay_year; 
							children_year_fee = list["年缴保费"];
							break;
						case '16227': //富康附加倍健康两全保险
							children_base_money = year_fee * pay_year;
							children_safe_year = '至'+String(list["保险期间"]).substring(0,2)+'周岁';
							children_pay_year = pay_year; 
							children_year_fee = list["年缴保费"];
							break;
							
					}

					if(zs.indexOf(Number(index)) > -1) {
						totalMoney += Number(Number(children_year_fee).toFixed(0));
					}else{
						totalMoney += Number(children_year_fee);
					}

					plansDataList.childrenList.push({
						name: tml.name,
						short_name: tml.short_name,
						genre: index,
						safe_year: children_safe_year,
						pay_year: children_pay_year,
						base_money: children_base_money,
						year_fee: children_year_fee

					});
					clause_data.push({
						name: tml.name,
						genre: index
					});

				}
			});

		}
		plansData.push(plansDataList)
		plansDataList = {}
		//		alert(JSON.stringify(plansData))
		//		alert(pl_id)
		if(!pl_id) {
			//单个计划书
			aloneDetail.main = plansData[0].mainList // 主险
			aloneDetail.children = plansData[0].childrenList //附加
			aloneDetail.goIns_data = goIns_data
			aloneDetail.clause_data = clause_data
			aloneDetail.plansText = describes
			describes = {}
		} else {
			//汇总页面
			plansTotal.plansData = plansData
			plansTotal.goIns_data = goIns_data
			document.querySelector('#totalMoney').innerText = totalMoney.toFixed(2); //总保费
		}

	};