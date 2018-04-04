mui.init();

var aloneDetail = new Vue({
	el: '#Js-alone',
	data: {
		list: {}, //全部信息
		pl_id: '', //
		main: {}, //主险信息
		children: {}, //附加险信息,
		adviser: '', //业务员信息
		tk: [130, 318, 348, 363],
		gh: [272, 316, 379, 384, 19388],
		gy: [283, 19384],
		pa: [280],
		xt: [210, 313, 361, 377],
		zy: [165, 319, 382, 19390, 19391],
		hd: [288, 292, 360, 369, 378, 401],
		al: [309],
		fx: [364, 365, 366],
		behalfTable: [365, 377, 382, 384, 401, 19384, 19388], //主险利益演示表和附加险有关系的
		level: [401, 378, 377], //有中高低的
		levelNum: 'mid',
		manual_content: {},
		plansText: {}, //文案
		goIns_data: [], // 在线投保数据
		clause_data: [] //条款数据
	},
	methods: {
		detail: function(id){
			var data = {
					modalID : 'modal-bottom',
					formID : id
				}
			//打开弹框
			showPopu("member-plans-alone-modal.html", "member_plans_alone_modal", 'bottom', data);

		},
		clause: function(id){
			var data = {
					modalID : 'modal-list',
					formID : "member_plans_alone",
					goIns_data : clause_data
				}
			//打开弹框
			showPopu("popup-content.html", "popup_content", 'center', data);

		},
		table: function(id){
			var list = {};
			// 判断是不是需要附加险，是传全部，不是只传主险
			if(this.behalfTable.indexOf(Number(id)) > -1){
				list = this.list
			}else{
				list = this.list.main
			}
			var data = {
					modalID : 'modal-bottom',
					formID : id, //险种id
					list : list,
					pay_year : aloneDetail.list.pay_year,
					safe_year : aloneDetail.pl_id,
					levelNum : this.levelNum
				}
			//打开弹框
			showPopu("member-plans-alone-table.html", "member_plans_alone_table", 'bottom', data);

		},
		changeLevel: function(levelNum) { //切换中高低
			var manual_content = this.manual_content
			if(levelNum == 'min'){
			  	this.levelNum = 'min'
			}else if(levelNum == 'mid'){
			  	this.levelNum = 'mid'
			}else if(levelNum == 'max'){
			  	this.levelNum = 'max'
			} 
		},
		design: function(id){
			var data = {
					modalID : 'modal-form',
					formID : id, //险种id
					assu_age : aloneDetail.list.assu_age, //被保人年龄
					pl_id : aloneDetail.pl_id, //
					levelNum : this.levelNum
				}
			//打开弹框
			showPopu("member-plans-alone-design.html", "member_plans_alone_design", 'center', data);

		},
		designSave: function(id){
			alert(JSON.stringify(this.manual_content))
			var data = {
				server: 'Proposal.writeManualContent',
				data: JSON.stringify({
					pl_id: aloneDetail.pl_id,
					manual_content: this.manual_content
				}),
				device: 'mobile'
			};
			mui.post("http://ts-www.luckyins.com/api/api/invoke", data, function(res) {
				if(res.code == 1) {
					mui.toast('保存成功')
				} else { 
					mui.toast(res.msg)
				}
			});

		},
		designDel :function(index){
			var arr = []
			for(var i =0; i <this.manual_content[this.levelNum].length; i++){
				if(index !== i){
					alert(222)
					arr.push(this.manual_content[this.levelNum][i])
				}
			}
			alert(JSON.stringify(arr))
			this.manual_content[this.levelNum] = arr					
		}
	}
});

(function($) {
	//阻尼系数
//			var deceleration = mui.os.ios ? 0.003 : 0.0009;
	var winH = window.innerHeight;
	var fotHeight = document.querySelector('#Js-footer').offsetHeight;
	document.querySelector('#Js-plansDetail').style.height = fotHeight + 'px';
	
	$.plusReady(function() {
		
		var parent_self = plus.webview.getWebviewById('member_plans_detail')//父级id
		   //接收单个计划书数据alone
			window.addEventListener('alone',function(event){
				var data = event.detail.data
//				console.log(JSON.stringify(data.main))
				aloneDetail.list = data
				aloneDetail.adviser = event.detail.adviser
				aloneDetail.pl_id = event.detail.pl_id
				groupList(data)
				var plans = {
					130: [
						{
							title: '轻症疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "22种轻症保障，每种轻症赔付20%，最高赔付3次累计；",
										money: data.main.name
									}
								]
						},
						{
							title: '重大疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "60种重大疾病均可覆盖",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "18岁前身故按累计已交主险保费给付身故保险金，18岁后身故，按基本保额赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '轻症豁免保险费',
							isDetail: false,
							list: [
									{
										txt: "若在交费期间内被保险人不幸罹患约定的轻症疾病，可豁免保险费，无需再交纳剩余应交保险费，合同继续有效。",
										money: data.main.name
									}
								]
						}
						
					],
					318: [
						{
							title: '一般意外身故或伤残',
							isDetail: false,
							list: [
									{
										txt: "因意外伤害直接导致被保险人在180日内身故，按本附加合同基本保额赔付； 导致伤残的，根据以上身故赔付*伤残给付比例进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '航空意外身故或伤残',
							isDetail: false,
							list: [
									{
										txt: "若被保险人身故时未满75周岁，按本附加合同的基本保额的10倍赔付； 若被保险人身故时年满75周岁（含75周岁），按本附加合同的基本保险金额的5倍赔付；  导致伤残的，根据以上身故赔付*伤残给付比例进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '交通工具身故或伤残',
							isDetail: false,
							list: [
									{
										txt: "赔付金额同上一条“航空意外身故或伤残保险金”",
										money: data.main.name
									}
								]
						},
						{
							title: '自驾车身故或伤残',
							isDetail: false,
							list: [
									{
										txt: "意外事故发生之日起180日身故的，按本附加合同基本保额2倍赔付； 意外事故发生之日起180日身故的，赔付金额“航空意外身故或伤残保险金”； 导致伤残的，根据以上身故赔付*伤残给付比例进行赔付。  ",
										money: data.main.name
									}
								]
						},
						{
							title: '重大自然灾害意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按本附加合同的基本保额的5倍赔付； 导致伤残的，根据以上身故赔付*伤残给付比例进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '法定节假日意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按本附加合同的基本保额的5倍赔付； 导致伤残的，根据以上身故赔付*伤残给付比例进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '电梯意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按本附加合同的基本保额的5倍赔付； 导致伤残的，根据以上身故赔付*伤残给付比例进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '非意外身故保险金',
							isDetail: false,
							list: [
									{
										txt: "若被保险人身故发生在交费期间届满前（含交费期间届满日）， 身故保险金等于主险的基本保额×身故时的保单年度数×120%； 若被保险人身故发生在交费期间届满后，身故保险金等于主险的基本保额×交费年期×120%。",
										money: data.main.name
									}
								]
						},
						{
							title: '生存保险金',
							isDetail: false,
							list: [
									{
										txt: "被保险人在保险期间届满时仍然生存，按主险的基本保额×交费年期×120%，给付生存保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '意外住院津贴保险金',
							isDetail: false,
							list: [
									{
										txt: "意外住院津贴保险金 ＝ 实际住院天数 × 住院日额",
										money: data.main.name
									}
								]
						}
					],
					348:[
						{
							title: '保险金额',
							isDetail: false,
							list: [
									{
										txt: "第一年的保险金额等于本合同的基本保险金额，第二及以后各年度的保险金额为上一年度保险金额的1.03倍。",
									}
								]
						},{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "合同生效或复效90天内非因意外导致身故，按已交保费赔付； 90天后身故未满18周岁的，取已交保费和现金价值的较大者赔付； 90天后身故满18周岁的，取保险金额和已交保费160%的较大者赔付。 ",
									}
								]
						},{
							title: '减额领取',
							isDetail: false,
							list: [
									{
										txt: "如未发送保险事故，犹豫期后可申请减保，并领取相对应的现金价值。",
									}
								]
						}
					],
					363: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: "30种轻度重疾，3次赔付，每次赔付基本保额的20%。",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: "60种重疾，按本合同基本保险金额给付重大疾病保 险金，且身故责任继续有效。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "合同生效或复效90天内非因意外导致身故，按已交保费赔付；90天后身故未满18周岁的，取已交保费和现金价值的较大者赔付； 90天后身故满18周岁的，取保险金额和已交保费160%的较大者赔付。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保障',
							isDetail: false,
							list: [
									{
										txt: "等待期后，未满18周岁身故的，给付200%已交保费； 满18周岁身故的，给付保额，合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '保费豁免',
							isDetail: false,
							list: [
									{
										txt: "只要轻症或重疾获得赔付，均豁免确诊日后的应交 保费，合同终身有效。",
										money: data.main.name
									}
								]
						}
						
					],
					272: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: "23种轻症，被保险人初次确诊，按保险金额20%赔付，每种轻症最多赔付1次，累计赔付次数最高3次。",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: "60种重疾+终末期疾病，被保险人初次确诊，按保险金额赔付。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "未满18周岁，退还已交所有保费；满18周岁，按保险金额100%赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '轻症豁免',
							isDetail: false,
							list: [
									{
										txt: "被保险人首次获得轻症赔付 ",
										money: data.main.name
									}
								]
						},
						{
							title: '投保人豁免',
							isDetail: false,
							list: [
									{
										txt: "主合同投保人身故或初次确诊为本附加合同约定的重大疾病，我们豁免确诊日以后应交的主合同和保险期间超过1年的附加合同的各期保险费。",
										money: data.main.name
									}
								]
						}
						
					],
					316: [
						{
							title: '航空意外身故/全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按基本保额的50倍进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '水陆公共交通工具身故/全残保险金',
							isDetail: false,
							list: [
									{
										txt: "	按基本保额的10倍进行赔付。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '私家车意外身故/全残保险金',
							isDetail: false,
							list: [
									{
										txt: "包含私家车、租用车、单位公务或商务用车，第一年按基本保额5倍赔付，第二年按基本保额的7.5倍 赔付，第三年起按基本保额的10倍",
										money: data.main.name
									}
								]
						},
						{
							title: '其他意外身故/全残',
							isDetail: false,
							list: [
									{
										txt: "按基本保额的2倍进行赔付。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '非意外身故/全残',
							isDetail: false,
							list: [
									{
										txt: "在合同生效或复效的180天等待期内发生的，退回已交所有保费；等待期后发生按已交保费160%赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '满期保险金',
							isDetail: false,
							list: [
									{
										txt: "按合同累计已交保险费之和给付。",
										money: data.main.name
									}
								]
						}
						
					],
					379: [
						{
							title: '生存保险金',
							isDetail: false,
							list: [
									{
										txt: data.main.name +"岁后每年返还基本保额，领到100周岁。",
										money: data.main.name
									}
								]
						},
						{
							title: '满期保险金',
							isDetail: false,
							list: [
									{
										txt: "若被保险人于保险期满时仍生存，我们按本合同累计已交保险费给付满期保险金，本合同终止。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "身故保险金的数额等于下列两者中的较大值：（1）已交纳的本合同的累计保险费;（2）被保险人身故之日的本合同的现金价值；",
										money: data.main.name
									}
								]
						}
					],
					384: [
						{
							title: '首次重大疾病医疗保险金',
							isDetail: true,
							list: [
									{
										txt: "（1）首次重大疾病住院医疗保险金;（2）首次重大疾病住院前后门急诊医疗保险金（前7天后30天）;（3）首次重大疾病特定门诊医疗保险金; 以上三项在通过社会医疗保险、公费医疗等途径取得医疗费用补偿后，可获得扣除补偿后的首次重大疾病医疗保险将，有社保可报销100%，无社保可报销70%，且可多次报销，不限次数。",
										money: data.main.name
									}
								]
						},
						{
							title: '二次重大疾病保险金',
							isDetail: false,
							list: [
									{
										txt: " 被保险人自首次重大疾病确诊之日起满1年（含确诊日当日）后，初次发生并被医院的专科医生确诊患有首次重大疾病以外其他的任何一种或一种以上的本合同约定的重大疾病，赔付金额为：重大疾病保险金额-累计已给付的首次重大疾病医疗保险金额，合同终止。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "（1） 身故时未满18周岁，赔付金额为：累计已交保费-累计已给付的首次重大疾病医疗保险金。（2）身故时已满（含）18周岁，赔付金额为：身故保险金-累计已给付的首次重大疾病医疗保险金后",
										money: data.main.name
									}
								]
						}
					],
					19388: [
						{
							title: '重大疾病保险金',
							isDetail: false,
							list: [
									{
										txt: "20类重疾保障，涵盖市场高发的少儿重大疾病，被保险人初次发生并确诊其中一种重大疾病，按基本保额给付保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: " 若被保险人身故的，按照被保险人身故时已交保险费的两倍给付身故保险金后，合同终止。 ",
										money: data.main.name
									}
								]
						}
					],
					283: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: "30种轻症，分4组3次赔付，每次各赔付基本保额的20%；首次重疾责任赔付后，该项责任终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: " 80种重大疾病，分4组3次赔付，赔付金额等于基本保险金额，第三次重疾赔付后，合同效力终止。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "未满18周岁，赔付已交保费；满18周岁后，赔付基本保额；首次重疾责任赔付后，该项责任终止。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '轻症疾病豁免保费',
							isDetail: false,
							list: [
									{
										txt: "首次确诊患有约定的任何一种轻症，将豁免剩余交费期的续期保险费，保险合同继续有效。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾豁免保费',
							isDetail: false,
							list: [
									{
										txt: "首次确诊患有约定的任一种重大疾病，将豁免剩余交费期的续期保险费，保险合同继续有效。 ",
										money: data.main.name
									}
								]
						}
					],
					19384: [
						{
							title: '年金',
							isDetail: false,
							list: [
									{
										txt: "自本合同第 5 个保险合同周年日（含）至被保险人年满64 周岁后的首个保险合同周年日（含），领取金额为：当时基本保险金额×30%",
										money: data.main.name
									},
									{
										txt: "自被保险人年满 65 周岁后的首个保险合同周年日（含）至被保险人年满 69 周岁后的首个保险合同周年日（含），领取金额为：当时基本保险金额所对应的已交保险费×20%。",
										money: data.main.name
									},
									{
										txt: "自被保险人年满 70 周岁后的首个保险合同周年日（含）至被保险人年满104周岁后的首个保险合同周年日（含），领取金额为：当时基本保险金额×40% 。",
										money: data.main.name
									}
								]
						},
						{
							title: '满期金',
							isDetail: false,
							list: [
									{
										txt: " 若被保险人生存至105岁合同期满，可获100%基本保险金额的满期金，此外还始终享有身故保障，让生活安泰让后顾无忧。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "在本合同有效期内，若被保险人身故，我们按以下两项金额中的较大者给付身故保险金予身故保险金受益人，本合同效力终止：（1）被保险人身故时本合同基本保险金额所对应的已交保险费减去我们已给付的年金总和；（2）被保险人身故之日的本合同的现金价值；  "
									}
								]
						}
					],
					280: [
						{
							title: '一般医疗保险金',
							isDetail: false,
							list: [
									{
										txt: "因意外伤害或在等待期30天后因患疾病，在医院接受治疗的，我们依照约定给付下列保险金： 1、住院医疗费用：床位费、加床费、重症监护室床位费、护理费、膳食费、检查校验费、治疗费、药品费、医生费、手术费、救护车使用费 2、指定门诊医疗费用：门诊手术费、门诊肾透析费、器官移植后的门诊抗排异治疗费、门诊恶性肿瘤化疗/放疗/免疫治疗/内分泌治疗/靶向治疗费用 3、住院前后7天门急诊费用",
										money: data.main.name
									}
								]
						},
						{
							title: '恶性肿瘤保险金',
							isDetail: false,
							list: [
									{
										txt: " 因等待期30天后初次确诊罹患恶性肿瘤，在医院接受治疗的，在一般医疗保险金累计给付达到保额后，我们依照约定给付下列保险金： 1、恶性肿瘤住院医疗费用：床位费、加床费、重症监护室床位费、护理费、膳食费、检查校验费、治疗费、药品费、医生费、手术费、救护车使用费  2、恶性肿瘤特殊门诊医疗费用：化疗/放疗/免疫治疗/内分泌治疗/靶向治疗费用  3、恶性肿瘤住院前后7天门急诊费用 ",
										money: data.main.name
									}
								]
						},
						{
							title: '年免赔额',
							isDetail: false,
							list: [
									{
										txt: "当年度产生的、报销范围内的医疗费用，自付部分只要累计超过1万，则1万以上的医疗费用可以计入赔付。1万以下的部分可以拿到单位或者其他保险公司进行报销 ",
										money: data.main.name
									}
								]
						},
						{
							title: '保障区域',
							isDetail: false,
							list: [
									{
										txt: "中国大陆(不含港澳台) "
									}
								]
						},
						{
							title: '医院范围',
							isDetail: false,
							list: [
									{
										txt: "二级或二级以上公立医院普通部 "
									}
								]
						}
					],
					210: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: "20种轻度重疾，额外贴心给付2次，等待期后，初次确诊轻症，额外给付20%保额，该种轻症责任终止，豁免后续应交保费，合同继续；距离初次确诊180日后，初次确诊其他轻症，再额外给付20%保额，全部轻症责任终止，合同继续。",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: " 80种重疾，2次赔付，等待期后，初次确诊A、B组任意重疾，给付保额，本组重疾责任终止，现金价值为零，豁免后续应交保费，轻症、疾病终末期和身故责任终止；距离初次确诊一年后，初次确认另一组重疾，给付保额，合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '疾病终末期保障',
							isDetail: false,
							list: [
									{
										txt: "等待期后，未满18周岁初次确诊的，给付120%应交保费；满18周岁初次确诊的，给付保额，合同终止。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保障金',
							isDetail: false,
							list: [
									{
										txt: "等待期后，未满18周岁身故的，给付120%应交保费；满18周岁身故的，给付保额，合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '保费豁免',
							isDetail: false,
							list: [
									{
										txt: "只要轻症或重疾获得赔付，均豁免确诊日后的应交保费，合同继续。 "
									}
								]
						}
					],
					361: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: "50种轻度重疾，分5组3次赔付。每次依次各赔付保额的25%、30%、35%，累计高达保额的90%。",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: " 105种重疾，分5组4次赔付，赔付金额等于基本保险金额，第四次重疾赔付后，合同效力终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '满期祝寿金：已交所有保费',
							isDetail: false,
							list: [
									{
										txt: "无论是否发生轻症或重疾理赔，只要重疾4次赔付未满，那么在约定的年龄仍生存，可提取所有的已交保费，而且主险合同继续有效养老生活安康无忧。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保障金',
							isDetail: false,
							list: [
									{
										txt: "等待期后，未满18周岁身故的，给付200%已交保费； 满18周岁身故的，给付保额，合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '保费豁免',
							isDetail: false,
							list: [
									{
										txt: "只要轻症或重疾获得赔付，均豁免确诊日后的应交保费，合同继续。 "
									}
								]
						}
					],
					377: [
						{
							title: '养老保险金',
							isDetail: false,
							list: [
									{
										txt: "被保险人在满60周岁的首个保单周年日起，在每个保单周年日零时生存的，按照本合同基本保险金额给付养老年金。",
										money: data.main.name
									}
								]
						},
						{
							title: '祝寿保险金',
							isDetail: false,
							list: [
									{
										txt: " 被保险人在年满80周岁的首个保单周年日零时生存的，按本合同累计已交保险费给付祝寿保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保障金',
							isDetail: false,
							list: [
									{
										txt: "身故保险金的数额等于下列两者中的较大值：（1） 已交纳的本合同的累计保险费;（2）被保险人身故之日的本合同的现金价值；",
										money: data.main.name
									}
								]
						},
						{
							title: '保费豁免',
							isDetail: false,
							list: [
									{
										txt: "只要轻症或重疾获得赔付，均豁免确诊日后的应交保费，合同继续。 "
									}
								]
						}
					],
					313: [
						{
							title: '私家车、公务车意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按照基本保额的10倍进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '网约车、租赁车意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: " 按照基本保额的10倍进行赔付",
										money: data.main.name
									}
								]
						},
						{
							title: '坐公共交通工具意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按照基本保额的10倍进行赔付",
										money: data.main.name
									}
								]
						},
						{
							title: '意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按照基本保额的1倍进行赔付",
										money: data.main.name
									}
								]
						},
						{
							title: '疾病身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: "按照基本保额最高1.6倍应交保险费赔付 ",
										money: data.main.name
									}
								]
						},
						{
							title: '满期保险金',
							isDetail: false,
							list: [
									{
										txt: "按照已交保险费100%总额赔付  ",
										money: data.main.name
									}
								]
						}
					],
					165: [
						{
							title: '首次重大疾病保险金',
							isDetail: true,
							list: [
									{
										txt: " 等待期后90天，如果被保险人初次确诊为患本合同所列的重大疾病，我们给付首次重大疾病保险金。我们对该重大疾病所属组别内所有重大疾病的保险责任终止，本合同轻症疾病保险金和身故保险金的保险责任。我们给付首次重大疾病保险金后，本合同的现金价值降低为零。",
										money: data.main.name
									}
								]
						},
						{
							title: '轻症疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "  在等待期后，如果被保险人初次确诊患本合同所列任何一种轻症疾病，并且在轻症疾病确诊前未被确诊患本合同附表一所列任何一种重大疾病。我们给付轻症疾病保险金。同一种轻症疾病仅给付一次轻症保险金，轻症疾病保险金最多给付2次，轻症疾病保险给付满两次后，本项保险责任终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '二次重大疾病保险金',
							isDetail: false,
							list: [
									{
										txt: "  我们给付首次重大基本保险金后，在确诊患首次重大疾病之日起365天后，如果被保险人初次确诊患首次重大基本所属组别的其他组别中的重大疾病，我们给付第二次重大疾病保险金 ，同时本合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: " 如果被保险人在年满18周岁前身故，我们将按您已经缴纳的本合同的全部保险费给付身故保险金，同时本合同终止。如果被保险人在年满18周岁后身故，我们给付身故保险金，同时本合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '被保险人豁免保费',
							isDetail: false,
							list: [
									{
										txt: "在等待期后，如果被保险人初次确诊患本合同所列任何一种重大疾病或轻症疾病，我们将豁免疾病确诊日后本合同保险期间内的各期保险费。"
									}
								]
						},
						{
							title: '投保人豁免保费',
							isDetail: false,
							list: [
									{
										txt: "等待期后（90天），主合同投保人初次发生并确诊患本附加合同列明的任何一种轻症疾病，将豁免以后主合同及其保险期间超过一年的附加合同的各期保险费，同时本附加合同终止。",
										money: '轻症豁免'
									},
									{
										txt: "等待期后（90天），主合同投保人初次发生并确诊患本附加合同列明的任何一种重大疾病，将豁免以后主合同及其保险期间超过一年的附加合同的各期保险费，同时本附加合同终止。",
										money: '重疾豁免'
									},
									{
										txt: "主合同投保人因意外伤害事故或疾病导致身故或全残，我们将豁免以后主合同及其保险期间超过一年的附加合同的各期保险费，同时本附加合同终止。",
										money: '身故/全残豁免'
									}
								]
						}
					],
					319: [
						{
							title: '轻症疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "按本合同基本保险金额的50%给付，并豁免剩余 应交保费； 同一种轻症疾病仅给付一次，最多给付两次。  ",
										money: data.main.name
									}
								]
						},
						{
							title: '重大疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "按基本保额进行赔付，并豁免剩余应交保费； 同时本项责任、轻症责任均终止，其余责任继续有效； 豁免以后主险各期保费，现金价值降为零。",
										money: data.main.name
									}
								]
						},
						{
							title: '特定疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "初次确诊按基本保额的300%进行赔付； 已经申请并获得重大疾病保险金的，且相距超过365 天的，按基本保额的200%进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '高费用疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "初次确诊按基本保额的500%进行赔付； 已经申请并获得重大疾病保险金的，且相距超过365 天的，按基本保额的400%进行赔付。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "18周岁前，按已交保险费的200%赔付； 满18周岁，按基本保额的300%赔付  ",
										money: data.main.name
									}
								]
						}
					],
					382: [
						{
							title: '年金',
							isDetail: false,
							list: [
									{
										txt: "第五个保单周年日（含）起，保险期间届满前一日止，将按本合同基本保险金额的50%给付年金。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '满期生存金',
							isDetail: false,
							list: [
									{
										txt: "被保险人在本合同的保险期间届满时仍生存，将按已缴保险费的105%给付满期保险金，同时本合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "身故保险金的数额等于下列两者中的较大值： （1） 已交纳的本合同的累计保险费 ;（2）被保险人身故之日的本合同的现金价值；",
										money: data.main.name
									}
								]
						},
						{
							title: '额外给付重疾保险金',
							isDetail: false,
							list: [
									{
										txt: " 等待期90天后，若被保险人初患合同约定28种少儿重疾或38种成人重疾，则额外赔付重症保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '额外给付轻症保险金',
							isDetail: false,
							list: [
									{
										txt: "等待期90天后，若被保险人初患合同约定10种少儿轻症或10种成人轻症，则额外赔付轻症保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '保费豁免',
							isDetail: false,
							list: [
									{
										txt: "等待期后90天后，若投保人在缴费期内初患合同约定20种轻症/80种重疾/全残/身故，则均豁免确诊日后的应交保费，合同继续有效。"
									}
								]
						}
					],
					19390: [
						{
							title: '额外给付重疾保险金',
							isDetail: false,
							list: [
									{
										txt: "等待期90天后，若被保险人初患合同约定28种少儿重疾或38种成人重疾，则额外赔付轻症保险金。  ",
										money: data.main.name
									}
								]
						},
						{
							title: '重大疾病保险金',
							isDetail: false,
							list: [
									{
										txt: " 在等待期后，如果被保险人初次确诊本合同所列任何一种重大疾病，我们按合同约定给付保险金，轻症疾病保险责任与身故保险金责任终止，本合同继续有效 同一种重大疾病仅给付一次重大疾病保险金，重大疾病保险金最多给付2次，且2次重大疾病的确诊之日相距需大于365天。重大疾病保险金给付满2次后，本合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '恶性肿瘤关爱保险金',
							isDetail: false,
							list: [
									{
										txt: " 在等待期后，如果被保险人在80周岁前初次确诊本合同所列任何一种恶性肿瘤，我们按合同约定给付保险金，本项责任终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "如果被保险人身故，我们按本合同约定给付保险金。 如果被保险人在18周岁前身故，我们按本合同已交保费给付身故保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '豁免保费',
							isDetail: false,
							list: [
									{
										txt: "在等待期后，如果被保险人初次确诊患本合同所列任何一种重大疾病或所列任何一种轻症疾病，我们将豁免疾病确诊日后本合同保险期间内的各期保险费。",
										money: data.main.name
									}
								]
						}
					],
					19391: [
						{
							title: '额外给付重疾保险金',
							isDetail: false,
							list: [
									{
										txt: "等待期90天后，若被保险人初患合同约定28种少儿重疾或38种成人重疾，则额外赔付轻症保险金。  ",
										money: data.main.name
									}
								]
						},
						{
							title: '重大疾病保险金',
							isDetail: false,
							list: [
									{
										txt: " 在等待期后，如果被保险人初次确诊本合同所列任何一种重大疾病，我们按合同约定给付保险金，轻症疾病保险责任与身故保险金责任终止，本合同继续有效 同一种重大疾病仅给付一次重大疾病保险金，重大疾病保险金最多给付2次，且2次重大疾病的确诊之日相距需大于365天。重大疾病保险金给付满2次后，本合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '恶性肿瘤关爱保险金',
							isDetail: false,
							list: [
									{
										txt: " 在等待期后，如果被保险人在80周岁前初次确诊本合同所列任何一种恶性肿瘤，我们按合同约定给付保险金，本项责任终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: "如果被保险人身故，我们按本合同约定给付保险金。 如果被保险人在18周岁前身故，我们按本合同已交保费给付身故保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '豁免保费',
							isDetail: false,
							list: [
									{
										txt: "在等待期后，如果被保险人初次确诊患本合同所列任何一种重大疾病或所列任何一种轻症疾病，我们将豁免疾病确诊日后本合同保险期间内的各期保险费。",
										money: data.main.name
									}
								]
						}
					],
					288: [
						{
							title: '轻症疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "按基本保险金额的 20%给付轻症疾病保险金。每种轻症疾病只给付一次，给付后该种轻症保险金保险责任终止，累计给付以五次为限。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '重大疾病保险金',
							isDetail: true,
							list: [
									{
										txt: "按本合同基本保险金额给付重大疾病保险金。",
										money: data.main.name
									}
								]
						},
						{
							title: '身故、永久完全残疾、疾病终末期保险金',
							isDetail: false,
							list: [
									{
										txt: " 未满 18 周岁，无息全额退还本合同的已交保险费；已满 18 周岁，按本合同基本保险金额给付身故保险金。"
									}
								]
						},
						{
							title: '轻症疾病豁免保险费',
							isDetail: false,
							list: [
									{
										txt: " 豁免本合同项下该被保险人自轻症疾病确诊之日以后的各期保险费。（被豁免的保险费视为已交纳，同时本合同继续有效。）注：身故、永久完全残疾、疾病终末期、重大疾病保险金，仅给付其中一项"
									}
								]
						}
					],
					292: [
						{
							title: '满期保险金',
							isDetail: false,
							list: [
									{
										txt: " 本合同期满，将按已交保险费的120%给付满期保险金，同时合同终止。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '疾病身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: " 若被保险人因疾病导致身故或全残，将按已交保险费的160%赔付，同时合同终止。",
										money: data.main.name
									}
								]
						},
						{
							title: '意外身故或全残保险金',
							isDetail: false,
							list: [
									{
										txt: " 一般意外身故或全残保险金,按基本保险金额的2倍赔付，同时合同终止。",
										money: data.main.name
									},
									{
										txt: " 节假日意外身故或全残保险金,按基本保险金额的10倍赔付，不再给付“一般意外身故保险金”，同时合同终止。",
										money: data.main.name
									},
									{
										txt: " 重大自然灾害意外身故或全残保险金, 按基本保险金额的10倍赔付，不再给付“一般意外身故保险金”和“节假日意外身故保险金”，同时合同终止。",
										money: data.main.name
									},
									{
										txt: " 驾乘车意外身故或全残保险金,  按基本保险金额的10倍赔付，不再给付“一般意外身故保险金”、“节假日意外身故保险金”和“重大自然灾害意外身故保险金”，同时合同终止。",
										money: data.main.name
									},
									{
										txt: " 高速动车、普通动车意外身故或全残保险金, 按基本保险金额的25倍赔付，不再给付“一般意外身故保险金”、“节假日意外身故保险金”和“重大自然灾害意外身故保险金”，同时合同终止。",
										money: data.main.name
									},
									{
										txt: " 航空意外身故或全残保险金, 按基本保额的50倍赔付，不在给付“一般意外身故保险金”、“节假日意外身故保险金”和“重大自然灾害意外身故保险金”，合同终止。",
										money: data.main.name
									},
									{
										txt: " 指定公共交通工具意外身故或全残保险金,  按基本保额的10倍赔付，不再给付“一般意外身故保险金”、“节假日意外身故保险金”和“重大自然灾害意外身故保险金”，合同终止。",
										money: data.main.name
									},
									{
										txt: " 电梯意外身故或全残保险金, 将按基本保险金额的10倍赔付，不再给付“一般意外身故保险金”和“节假日意外身故保险金”，同时合同终止。",
										money: data.main.name
									},
									{
										txt: " 燃气意外身故或全残保险金, 我们不再给付“一般意外身故保险金”和“节假日意外身故保险金”，同时合同终止。",
										money: data.main.name
									},
								]
						}
					],
					369: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: " 50种轻度重疾，每次轻症给付基本保额30%，累计给付最高5次，最高累计给付基本保额150%。且两次轻症给 付无间隔等待期。     ",
										money: data.main.name
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: " 100种重疾，分4组3次赔付，赔付金额等于基本保险金额， 首次重疾保险金为基本保额100%，第二次重疾保险金为基本保额150%，第三次重疾保险金为基本保额200%。",
										money: data.main.name
									}
								]
						},
						{
							title: '保费豁免',
							isDetail: false,
							list: [
									{
										txt: " 只要轻症或重疾获得赔付，均豁免确诊日后的应交保费， 合同继续有效。  "
									}
								]
						},
						{
							title: '身故、永久完全残疾、疾病终末期保险金  ',
							isDetail: false,
							list: [
									{
										txt: " 豁免本合同项下该被保险人自轻症疾病确诊之日以后的各期保险费。（被豁免的保险费视为已交纳，同时本合同继续有效。）注：身故、永久完全残疾、疾病终末期、重大疾病保险金，仅给付其中一项"
									}
								]
						}
					],
					378: [
						{
							title: '生存保险金',
							isDetail: false,
							list: [
									{
										txt: "周岁（男60周岁女55周岁）开始，每年领取元养老金，保证可领 年。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: " 身故保险金的数额等于下列两者中的较大值：（1） 已交纳的本合同的累计保险费（2）被保险人身故之日的本合同的现金价值；",
										money: data.main.name
									}
								]
						},
						{
							title: '分红利益',
							isDetail: false,
							list: [
									{
										txt: "  领取方式：现金领取。累计生息：红利若不领取，储存在保险公司，按照保险公司当年公布的红利累积利率以年复利的方式计息，二次增值。   风险提示: 保单的红利水平是不保证的，在某些年度红利可能为零。"
									}
								]
						},
						{
							title: '养老社区',
							isDetail: false,
							list: [
									{
										txt: "  优先权：入住恒大养老社区；特许：自己的入住申请通过后，夫妻双方的父母，也同样可以享受优先入住养老社区的权利；特惠：配偶特有优惠，本人入住后，配偶同住一间房：免收房屋使用费，居家费用按照届时规定的标准减半，并免收房屋使用费。投保人本人父母或其配偶的父母所需缴纳的基础月费按相关收费标准的85%支付。"
									}
								]
						}
					],
					401: [
						{
							title: '年金',
							isDetail: false,
							list: [
									{
										txt: "自第10个保单周年日起，若被保险人未满60周岁，则每年给付基本保额的30%；若被保险人年满60周岁，则每年给付基本保额的60%。 ",
										money: data.main.name
									}
								]
						},
						{
							title: '特别年金',
							isDetail: false,
							list: [
									{
										txt: "自第5个保单周年日起至第9个保单周年日止，若被保险人于每个保单周年日零时仍生存，我们将于该保单周年日按总保费的6%给付一次特别年金。",
										money: data.main.name
									}
								]
						},
						{
							title: '自带投保人意外身故/全残豁免',
							isDetail: false,
							list: [
									{
										txt: "  若投保人在本合同交费期内因意外伤害导致身故，且同时满足下列两个条件的，将豁免本合同自投保人身故之日起的各期保险费，同时本合同继续有效：(一)投保人与被保险人不为同一人；(二)投保人身故时未满60周岁。"
									}
								]
						},
						{
							title: '身故保险金',
							isDetail: false,
							list: [
									{
										txt: " 身故保险金的数额等于下列两者中的较大值：（1） 已交纳的本合同的累计保险费（2）被保险人身故之日的本合同的现金价值；",
										money: data.main.name
									}
								]
						},
						{
							title: '养老社区',
							isDetail: false,
							list: [
									{
										txt: "  优先权：入住恒大养老社区；特许：自己的入住申请通过后，夫妻双方的父母，也同样可以享受优先入住养老社区的权利；特惠：配偶特有优惠，本人入住后，配偶同住一间房：免收房屋使用费，居家费用按照届时规定的标准减半，并免收房屋使用费。投保人本人父母或其配偶的父母所需缴纳的基础月费按相关收费标准的85%支付。"
									}
								]
						}
					],
					309: [
						{
							title: '航空意外身故、伤残',
							isDetail: false,
							list: [
									{
										txt: "在保险期间内,若被保险人以乘客身份(不包括被保险人本人作为航班的机组成员)搭乘航班时遭遇意外事故,且自意外事故发生之日起180日内身故的,保险公司给付身故保险金,本保险责任终止。若因该意外事故导致被保险人伤残的,保险公司按照《人身保险伤残评定标准》给付伤残保险金,累计达到保险金额时,本保险合同终止。 "
									}
								]
						},
						{
							title: '轨道交通（火车、地铁）',
							isDetail: false,
							list: [
									{
										txt: " 在保险期间内,若被保险人以乘客身份(不包括被保险人本人作为公共交通工具的驾驶员、操作人员或机组成员)搭乘轨道交通(火车、地铁、轻轨)工具遭受意外事故,且自该意外事故发生之日起180日内身故的,保险公司给付公共交通工具意外伤害保险金,本保险责任终止;若因该事故导致被保险人伤残的,保险公司按照《人身保险伤残评定标准》给付伤残保险金,累计达到保险金额时,本保险合同终止。"
									}
								]
						},
						{
							title: '轮船意外身故及伤残',
							isDetail: false,
							list: [
									{
										txt: "在保险期间内,若被保险人以乘客身份(不包括被保险人本人作为公共交通工具的驾驶员、操作人员或机组成员)乘坐轮船时遭受意外事故,且自该意外事故发生之日起180日内身故的,保险公司给付公共交通工具意外伤害保险金,本保险责任终止;若因该事故导致被保险人伤残的,保险公司按照《人身保险伤残评定标准》给付伤残保险金,累计达到保险金额时,本保险合同终止。"
									}
								]
						},
						{
							title: '公共汽车（出租车）意外',
							isDetail: false,
							list: [
									{
										txt: " 在保险期间内,若被保险人以乘客身份(不包括被保险人本人作为公共交通工具的驾驶员、操作人员或机组成员)乘坐公共汽车(出租车)时遭受意外事故,且自该意外事故发生之日起180日内身故的,保险公司给付公共交通工具意外伤害保险金。若因该事故导致被保险人伤残的,保险公司按照《人身保险伤残评定标准》给付伤残保险金,累计达到保险金额时,本保险合同终止。"
									}
								]
						},
						{
							title: '意外医疗',
							isDetail: false,
							list: [
									{
										txt: " 在保险期间内,若被保险人遭受意外伤害事故,并在意外事故发生之日起180日内在中华人民共和国境内(不包括港、澳、台地区)的二级以上(含二级)医院进行治疗的,被保险人在每次意外伤害中所支出的必要且合理的实际医疗费用,保险公司在扣除社会基本医疗保险或任何第三方(包括任何商业医疗保险)已经补偿或给付部分后,给付意外医疗保险金。若被保险人在中华人民共和国境外合法的公立医院进行治疗的,对于被保险人在事故发生地所在国家或地区的医疗机构进行治疗所支出的必要且合理的实际医疗费用,保险公司扣除任何第三方(包括任何商业医疗保险)已经补偿或给付部分后,给付意外医疗保险金,累计达到保险金额时,本附加保险责任终止。(免赔额100元,100%赔付)"
									}
								]
						},
						{
							title: '自驾车意外身故/伤残',
							isDetail: false,
							list: [
									{
										txt: "在保险期间内,若被保险人在驾驶或乘坐非营运四轮机动车(7座以下,含7座)时遭受意外伤害事故,并自该事故发生之日起180日内因该事故身故的,保险公司给付自驾车意外身故保险金,本保险责任终止;若因该事故导致被保险人伤残的,保险公司按照《人身保险伤残评定标准》给付伤残保险金,累计达到保险金额时,本保险合同终止。"
									}
								]
						},
						{
							title: '紧急拖车服务',
							isDetail: false,
							list: [
									{
										txt: " 在保险期间内,若被保险人在驾驶12座(含)以下非营运车辆期间,经鉴定因机械或电子故障、驾驶员错误而导致享权车辆不能行驶,保险公司协助安排将无法行驶的车辆拖至(单程50公里为限)最近的符合资质的维修商处进行修理。 "
									}
								]
						},
						{
							title: '路边快修服务',
							isDetail: false,
							list: [
									{
										txt: "在保险期间内,若被保险人在驾驶12座(含)以下非营运车辆期间,经鉴定因机械或电子故障、驾驶员错误而导致享权车辆不能行驶,保险公司协助安排汽车维修技师至被保险人现场;路边维修服务包括换胎、充电、送油、加水和其他小于30分钟的机械修理(全国范围现场路边维修)。 "
									}
								]
						},
						{
							title: '紧急换胎服务',
							isDetail: false,
							list: [
									{
										txt: "在保险期间内,若被保险人在驾驶12座(含)以下非营运车辆期间,经鉴定因机械或电子故障、驾驶员错误而导致享权车辆不能行驶且需要紧急换胎的,保险公司协助安排汽车维修技师至被保险人现场进行换胎服务。 "
									}
								]
						},
						{
							title: '修车期间酒店住宿',
							isDetail: false,
							list: [
									{
										txt: " 在保险期间内,若被保险人在驾驶12座(含)以下非营运车辆期间,经鉴定因机械或电子故障而抛锚导致不能行驶的享权车辆拖至资质修理厂处维修,而车辆当天也不能成功修复,且坏车地点和被保险人的居住地不在同一城市,保险公司将提供住宿,方便被保险人等候车辆维修完毕(服务覆盖人数上限为车辆合法限座人数)。保险公司将支付酒店房费,税费和早餐(如果其包含在房费中);电话费,房间服务等额外费用将由被保险人承担并必须在结账离开前支付。酒店住宿期限最多为3天且住宿酒店最高为4星级标准。 "
									}
								]
						},
						{
							title: '修车期间继续旅行',
							isDetail: false,
							list: [
									{
										txt: " 在保险期间内,若被保险人在驾驶12座(含)以下非营运车辆期间,经鉴定因机械或电子故障而抛锚导致不能行驶的享权车辆拖至资质修理厂处维修,而车辆当天也不能成功修复,且坏车地点和被保险人的居住地不在同一城市,保险公司将提供相应交通工具,方便被保险人回家或继续旅行(距离不超过从故障地点返回居住地且服务覆盖人数上限为车辆合法限座人数)。继续旅行距离小于1000公里,提供单程火车票;继续旅行距离大于1000公里,提供单程经济舱机票。如果出租车比火车更为便捷经济,则报销出租车。保险公司将承担取票过程中产生的相关费用(出租车,公共交通方式)如被保险人是从目的地返回出发地过程中发生的事件,同样提供相应的继续旅行服务。 "
									}
								]
						},
					],
					364: [
						{
							title: '轻症保障',
							isDetail: true,
							list: [
									{
										txt: "35种轻度重疾，每次轻症给付基本保额20%，累计 给付最高3次。 "
									}
								]
						},
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: " 80种重疾，赔付金额等于基本保险金额。 "
									}
								]
						},
						{
							title: '轻症保费豁免保障',
							isDetail: false,
							list: [
									{
										txt: " 只要轻症获得赔付，豁免确诊日后的应交保费，合同继续有效。"
									}
								]
						},
						{
							title: '身故保障',
							isDetail: false,
							list: [
									{
										txt: "等待期后，未满18周岁身故的，给付已交保费； 满18周岁身故的，给付保额，合同终止。"
									}
								]
						},
						{
							title: '特定严重疾病保障',
							isDetail: false,
							list: [
									{
										txt: " 2 类特定严重疾病，额外给付基本保额的 50%，保 障更暖心。"
									}
								]
						},
						{
							title: '长期失能护理保障',
							isDetail: false,
							list: [
									{
										txt: "每月定期按保额的1/120给付失能护理金，长达120个月，保障更贴心。    "
									}
								]
						}
					],
					365: [
						{
							title: '重疾保障',
							isDetail: true,
							list: [
									{
										txt: " 80种重疾，赔付金额等于基本保险金额。 "
									}
								]
						},
						{
							title: '身故保障',
							isDetail: false,
							list: [
									{
										txt: "等待期后，未满18周岁身故的，给付已交保费； 满18周岁身故的，给付保额，合同终止。"
									}
								]
						}
					]
				}
				aloneDetail.plansText = plans
//				alert(aloneDetail.pl_id)
				if(aloneDetail.level.indexOf(Number(aloneDetail.list.genre)) > -1 ){
		        	var data = {
						server: 'Proposal.getSingleProposal',
						data: JSON.stringify({
							pl_id: aloneDetail.pl_id,
							user_id: 65
						}),
						device: 'mobile'
					};
					mui.post("http://ts-www.luckyins.com/api/api/invoke", data, function(res) {
						if(res.code == 1) {
							aloneDetail.manual_content = res.data.manual_content
						} else { 
							mui.toast(res.msg)
						}
					});
		        }
			});
			window.addEventListener('design', function(event){
				var data = event.detail.data
				aloneDetail.manual_content[aloneDetail.levelNum].push(data)
			});
			
		//在线投保按钮
		document.querySelector('#goIns').addEventListener('tap', function() {
			//打开弹框
//						alert(JSON.stringify(goIns_data))
			mui.fire(parent_self,'show', {
				formID : 'member_plans_alone',
				goIns_data: aloneDetail.goIns_data
			});
        });	
       
        

	})
}(mui));

