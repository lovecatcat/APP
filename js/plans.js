mui.init();
var user_id;
var aloneDetail = new Vue({
	el: '#Js-alone',
	data: {
		list: {}, //全部信息
		pl_id: '', //
		main: {}, //主险信息
		children: {}, //附加险信息,
		adviser: '', //业务员信息
		imageDescribe: '', //产品特色图片
		tk: [121, 301, 334],
		gh: [256, 300, 349, 354, 16201],
		gy: [267, 16197],
		pa: [264],
		xt: [197, 332, 347],
		zy: [155, 302, 352, 16203, 16204, 16207, 16208],
		hd: [272, 276, 340, 348, 370, 16217],
		al: [309],
		fx: [335, 336, 337, 16220],
		zs: [16211, 16113, 16213, 16139],
		behalfTable: [256, 347, 354, 370, 16197, 16201, 272, 340, 16217], //主险利益演示表和附加险有关系的
		haveDesign: [348, 370, 347, 16197, 16217],
		haveDesign16197: false,
		haveLevel: false, //有中高低的
		levelNum: {},
		manual_content: {},
		plansText: {}, //文案
		goIns_data: [], // 在线投保数据
		clause_data: [], //条款数据
		sub_treasury_id: '',
		green_server: false, //是不是有绿通服务
	},
	computed: {  
        total: function () {  
           var total = 0;
            for(var i in this.children){
            	total += Number(this.children[i].year_fee)
            }
            total = total + Number(this.main.year_fee)
           return total.toFixed(2)
        }  
	},
	methods: {
		detail: function(id, name) {
			var data = {
				modalID: 'modal-bottom',
				formID: id == 0 ? this.list.genre : id,
				id: name
			}
			//打开弹框
			showPopu("member-plans-alone-modal.html", "member_plans_alone_modal", 'bottom', data);

		},
		company: function(genre) {
//			公司简介
			mui.openWindow({
				id: 'product_company',
				url: 'product-company.html',
				show: animateObj.aniDetal,
				extras: {
					product_id: genre,
					form_id: 'all',
					name: '公司介绍'
				}
			});

		},
		company_green: function(genre) {
//			绿通
			mui.openWindow({
				id: 'product_company',
				url: 'product-company.html',
				show: animateObj.aniDetal,
				extras: {
					product_id: genre,
					form_id: 'all',
					name: '绿通服务'
				}
			});

		},
		clause: function(id) {
//			条款
			var data = {
				modalID: 'modal-list',
				formID: "member_plans_alone",
				goIns_data: clause_data
			}
			//打开弹框
			showPopu("popup-content.html", "popup_content", 'center', data);

		},
		table: function(id) {
			var list = {};
			var manData = {
				appl_sex: this.list.appl_sex,
				appl_age: this.list.appl_age,
				assu_sex: this.list.assu_sex,
				assu_age: this.list.assu_age,
				pay_year: this.list.pay_year,
				year_fee: this.list.year_fee,
				safe_year: this.list.safe_year,
			}
			var design = this.manual_content[this.pl_id] ? this.manual_content[this.pl_id][this.levelNum[this.pl_id]] : null
			// 判断是不是需要附加险，是传全部，不是只传主险
			if(this.behalfTable.indexOf(Number(id)) > -1) {
				list = this.list
			} else {
				list = this.list.main
			}
			var data = {
				modalID: 'modal-bottom',
				formID: id, //险种id
				list: list,
				pay_year: aloneDetail.list.pay_year,
				safe_year: aloneDetail.list.safe_year,
				levelNum: this.levelNum[this.pl_id],
				manData: manData,
				design: design,
				flag: this.list.flag
			}
			//打开弹框
			showPopu("member-plans-alone-table.html", "member_plans_alone_table", 'bottom', data);

		},
		changeLevel: function(levelNum) { //切换中高低
			var manual_content = this.manual_content[this.pl_id]
			if(levelNum == 'min') {
				this.levelNum[this.pl_id] = 'min'
			} else if(levelNum == 'mid') {
				this.levelNum[this.pl_id] = 'mid'
			} else if(levelNum == 'max') {
				this.levelNum[this.pl_id] = 'max'
			}
			this.$forceUpdate()
		},
		design: function(id) {
			var data = {
				modalID: 'modal-form',
				formID: id, //险种id
				assu_age: aloneDetail.list.assu_age, //被保人年龄
				pl_id: aloneDetail.pl_id, //
				levelNum: this.levelNum[this.pl_id]
			}
			//打开弹框
			showPopu("member-plans-alone-design.html", "member_plans_alone_design", 'center', data);

		},
		designSave: function(id) {
			luckyAjax({
				data: {
					server: 'Proposal.writeManualContent',
					view: false,
					data: JSON.stringify({
						pl_id: aloneDetail.pl_id,
						manual_content: this.manual_content[this.pl_id]
					})
				},
				success: function(res) {
					if(res.code == 1) {
						mui.toast('保存成功')
					} else {
						mui.toast(res.msg)
					}
				}
			});

		},
		designDel: function(index) {
			var arr = []
			for(var i = 0; i < this.manual_content[this.pl_id][this.levelNum[this.pl_id]].length; i++) {
				if(index !== i) {
					arr.push(this.manual_content[this.pl_id][this.levelNum[this.pl_id]][i])
				}
			}
			this.manual_content[this.pl_id][this.levelNum[this.pl_id]] = arr
			this.$forceUpdate()
		}
	}
});

(function($) {
	$.plusReady(function() {
		var winH = window.innerHeight;
		if(winH == 0){
			winH = localStorage.getItem('winH')
		}
		
		var fotHeight = document.querySelector('#Js-footer').offsetHeight;
		document.querySelector('#Js-plansDetail').style.height = fotHeight + 'px';
//		document.querySelector('#Js-alone').style.height = winH + 'px';
		user_id = JSON.parse(plus.storage.getItem("userinfo")).id
		var parent_self = plus.webview.getWebviewById('member_plans_detail') //父级id
		//接收单个计划书数据alone
		plus.nativeUI.showWaiting();
		mui.fire(parent_self, 'alones');
		
		window.addEventListener('alone', function(event) {
			var data = event.detail.data
			aloneDetail.list = data
			aloneDetail.adviser = event.detail.adviser
			aloneDetail.pl_id = event.detail.pl_id
			aloneDetail.levelNum[aloneDetail.pl_id] = aloneDetail.levelNum[aloneDetail.pl_id] ? aloneDetail.levelNum[aloneDetail.pl_id] : 'mid'
			aloneDetail.haveLevel = false
			aloneDetail.haveDesign16197 = false
			aloneDetail.green_server = false
			aloneDetail.$forceUpdate()
			groupList(data)

			//规划
			if(aloneDetail.haveDesign.indexOf(Number(aloneDetail.list.genre)) > -1) {
				luckyAjax({
					data: {
						server: 'Proposal.getSingleProposal',
						view: false,
						data: JSON.stringify({
							pl_id: aloneDetail.pl_id,
							user_id: user_id
						})
					},
					success: function(res) {
						if(res.code == 1) {
							aloneDetail.manual_content[aloneDetail.pl_id] = res.data.manual_content ? res.data.manual_content : {}
						} else {
							mui.toast(res.msg)
						}
					}
				});
			}
			
			//通过总库id获取分库id
			luckyAjax({
				data: {
					server: 'Proposal.getProductInfo',
					device: 'mobile',
					view: false,
					data: JSON.stringify({
						code: '',
						id: aloneDetail.list.genre
						
					})
				},
				success: function(res) {
					if(res.code == 1) {
						aloneDetail.sub_treasury_id = res.data.child_id
//						alert(res.data.child_id)
					} else {
						mui.toast('加载失败')
					}
				}
			});
			//产品特色图片
			luckyAjax({
				data: {
					server: 'lifeProduct.getProductDescribe',
					view: false,
					data: JSON.stringify({
						product_id: aloneDetail.list.genre
					})
				},
				success: function(res) {
					plus.nativeUI.closeWaiting();
					if(res.code == 1) {
//						alert(JSON.stringify(res.data))
						aloneDetail.imageDescribe = res.data['LBG0009'].describe || res.data['LBG0002'].describe
						aloneDetail.green_server =  res.data.green_server.describe
						
					} else {
						mui.toast('加载失败')
					}
				}
			});
		});

		
		window.addEventListener('design', function(event) {
			var data = event.detail.data
			aloneDetail.manual_content[aloneDetail.pl_id][aloneDetail.levelNum[aloneDetail.pl_id]] = aloneDetail.manual_content[aloneDetail.pl_id][aloneDetail.levelNum[aloneDetail.pl_id]] ? aloneDetail.manual_content[aloneDetail.pl_id][aloneDetail.levelNum[aloneDetail.pl_id]] : []
			aloneDetail.manual_content[aloneDetail.pl_id][aloneDetail.levelNum[aloneDetail.pl_id]].push(data)
			aloneDetail.$forceUpdate()
		});

		//在线投保按钮
		document.querySelector('#goIns').addEventListener('tap', function() {
			//打开弹框
			mui.fire(parent_self, 'show', {
				formID: 'member_plans_alone',
				goIns_data: aloneDetail.goIns_data
			});
		});
		
	})
}(mui));