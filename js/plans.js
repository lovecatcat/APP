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
		imageDescribe: '',
		image_url: '', //险种信息
		tk: [121, 301, 334],
		gh: [256, 300, 349, 354, 16201],
		gy: [267, 16197],
		pa: [264],
		xt: [197, 332, 347],
		zy: [155, 302, 352, 16203, 16204],
		hd: [272, 276, 340, 348, 370],
		al: [309],
		fx: [335, 336, 337],
		behalfTable: [256, 347, 352, 354, 370, 16197, 16201], //主险利益演示表和附加险有关系的
		haveDesign: [354, 16197, 348, 370],
		haveLevel: [370, 348, 347], //有中高低的
		levelNum: 'mid',
		manual_content: {},
		plansText: {}, //文案
		goIns_data: [], // 在线投保数据
		clause_data: [] //条款数据
	},
	methods: {
		detail: function(id) {
			var data = {
				modalID: 'modal-bottom',
				formID: this.list.genre
			}
			//打开弹框
			showPopu("member-plans-alone-modal.html", "member_plans_alone_modal", 'bottom', data);

		},
		company: function(genre) {
			 mui.openWindow({
				id: 'product_company',
				url: 'product-company.html',
				show: animateObj.aniDetal,
				extras: {
					list: this.image_url
				}
			});

		},
		clause: function(id) {
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
				levelNum: this.levelNum
			}
			//打开弹框
			showPopu("member-plans-alone-table.html", "member_plans_alone_table", 'bottom', data);

		},
		changeLevel: function(levelNum) { //切换中高低
			var manual_content = this.manual_content
			if(levelNum == 'min') {
				this.levelNum = 'min'
			} else if(levelNum == 'mid') {
				this.levelNum = 'mid'
			} else if(levelNum == 'max') {
				this.levelNum = 'max'
			}
		},
		design: function(id) {
			var data = {
				modalID: 'modal-form',
				formID: id, //险种id
				assu_age: aloneDetail.list.assu_age, //被保人年龄
				pl_id: aloneDetail.pl_id, //
				levelNum: this.levelNum
			}
			//打开弹框
			showPopu("member-plans-alone-design.html", "member_plans_alone_design", 'center', data);

		},
		designSave: function(id) {
			//			alert(JSON.stringify(this.manual_content))
			luckyAjax({
				data: {
					server: 'Proposal.writeManualContent',
					device: 'mobile',
					data: JSON.stringify({
						pl_id: aloneDetail.pl_id,
						manual_content: this.manual_content
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
			for(var i = 0; i < this.manual_content[this.levelNum].length; i++) {
				if(index !== i) {
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
		user_id = JSON.parse(plus.storage.getItem("userinfo")).id
		var parent_self = plus.webview.getWebviewById('member_plans_detail') //父级id
		//接收单个计划书数据alone
		window.addEventListener('alone', function(event) {
			var data = event.detail.data
//			alert(JSON.stringify(data))
			aloneDetail.list = data
			aloneDetail.adviser = event.detail.adviser
			aloneDetail.pl_id = event.detail.pl_id
			groupList(data)
			
//			aloneDetail.plansText = plans
			//				alert(aloneDetail.pl_id)
			if(aloneDetail.haveLevel.indexOf(Number(aloneDetail.list.genre)) > -1) {
				luckyAjax({
					data: {
						server: 'Proposal.getSingleProposal',
						device: 'mobile',
						data: JSON.stringify({
							pl_id: aloneDetail.pl_id,
							user_id: user_id
						})
					},
					success: function(res) {
						if(res.code == 1) {
							aloneDetail.manual_content = res.data.manual_content
						} else {
							mui.toast(res.msg)
						}
					}
				});
			}
			//公司图片
			luckyAjax({
				data: {
					server: 'Proposal.getProductInfo',
					device: 'mobile',
					data: JSON.stringify({
						code: '',
						id: aloneDetail.list.genre
					})
				},
				success: function(res) {
					if(res.code == 1) {
						aloneDetail.image_url = res.data.image_url
					} else {
						mui.toast('加载失败')
					}
				}
			});
			//产品特色图片
			luckyAjax({
				data: {
					server: 'lifeProduct.getProductDescribe',
					device: 'mobile',
					data: JSON.stringify({
						product_id: aloneDetail.list.genre
					})
				},
				success: function(res) {
					if(res.code == 1) {
						aloneDetail.imageDescribe = res.data['LBG0009'].describe
					} else {
						mui.toast('加载失败')
					}
				}
			});
		});
		window.addEventListener('design', function(event) {
			var data = event.detail.data
			aloneDetail.manual_content[aloneDetail.levelNum].push(data)
		});

		//在线投保按钮
		document.querySelector('#goIns').addEventListener('tap', function() {
			//打开弹框
			//						alert(JSON.stringify(goIns_data))
			mui.fire(parent_self, 'show', {
				formID: 'member_plans_alone',
				goIns_data: aloneDetail.goIns_data
			});
		});
		
	})
}(mui));