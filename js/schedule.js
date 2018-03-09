;
(function(undefined) {
	var _global;
	//工具函数
	//配置合并
	function extend(def, opt, override) {
		for(var k in opt) {
			if(opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
				def[k] = opt[k]
			}
		}
		return def;
	}
	//日期格式化
	function formartDate(y, m, d, symbol) {
		symbol = symbol || '-';
		m = (m.toString())[1] ? m : '0' + m;
		d = (d.toString())[1] ? d : '0' + d;
		if(d=='-1'){ // 只返回年-月
			return y + symbol + m	
		}else{ // 只返回年-月-日
			return y + symbol + m + symbol + d	
		}
	}

	function Schedule(opt, initData) {
		var def = {},
			opt = extend(def, opt, true),
			curDate = opt.date ? new Date(opt.date) : new Date(),
			year = curDate.getFullYear(),
			month = curDate.getMonth(),
			day = curDate.getDate(),
			currentYear = curDate.getFullYear(),
			currentMonth = curDate.getMonth(),
			currentDay = curDate.getDate(),
			selectedDate = '',
			_this = this;
		_this.el = document.querySelector(opt.el) || document.querySelector('body');
//		var bindEvent = function() {
//			_this.el.addEventListener('tap', function(e) {
//				switch(e.target.id) {
//					case 'nextMonth':
//						_this.nextMonthFun();
//						break;
//					case 'nextYear':
//						_this.nextYearFun();
//						break;
//					case 'prevMonth':
//						_this.prevMonthFun();
//						break;
//					case 'prevYear':
//						_this.prevYearFun();
//						break;
//					default:
//						break;
//				};
//				if(e.target.className.indexOf('currentDate') > -1) {
//					opt.clickCb && opt.clickCb(year, month + 1, e.target.innerHTML);
//					selectedDate = e.target.title;
//					day = e.target.innerHTML;
//					render();
//				}
//			}, false)
//		};
		var init = function() {
			var scheduleHd = '<div class="schedule-hd BL-ub BL-ub-ac">' +
				'<div>' +
				//'<span class="arrow icon iconfont icon-116leftarrowheads" id="prevYear" ></span>' +
				'<span class="mui-icon-arrowleft BL-icon" id="prevMonth"></span>' +
				'</div>' +
				'<div class="BL-ub-f1 today">' + formartDate(year, month + 1, day, '-') + '</div>' +
				'<div>' +
				'<span class="mui-icon-arrowright BL-icon" id="nextMonth"></span>' +
				//'<span class="arrow icon iconfont icon-115rightarrowheads" id="nextYear"></span>' +
				'</div>' +
				'</div>'
			var scheduleWeek = '<ul class="week-ul ul-box">' +
				'<li class="dayoff">周日</li>' +
				'<li>周一</li>' +
				'<li>周二</li>' +
				'<li>周三</li>' +
				'<li>周四</li>' +
				'<li>周五</li>' +
				'<li class="dayoff">周六</li>' +
				'</ul>'
			var scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
			_this.el.innerHTML = scheduleHd + scheduleWeek + scheduleBd;
			//bindEvent();
			render(initData);
		};
		var render = function(data) {
			var fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
				startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
				total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7), //元素总个数
				lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
				eleTemp = [];
			
			for(var i = 0; i < total; i++) {
				if(i < startWeek) {
					//eleTemp.push('<li class="other-month"><span class="dayStyle">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>')
					eleTemp.push('<li class="other-month"><span class="dayStyle">&nbsp;</span></li>');
				} else if(i < (startWeek + fullDay)) {
					var allWeek = new Date(year, month, i + 1 - startWeek).getDay(); // 获取当月所有周几
					var nowDate = formartDate(year, month + 1, (i + 1 - startWeek), '-');
					//var addClass = '';
					//selectedDate == nowDate && (addClass = 'selected-style');
					//formartDate(currentYear, currentMonth + 1, currentDay, '-') == nowDate && (addClass = 'today-flag');
					//eleTemp.push('<li class="current-month" ><span title=' + nowDate + ' class="currentDate dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '</span></li>')
					var addClass = '';
					if(data && data.length > i - startWeek){ // 服务器数据：员工打卡状态
						switch(data[i - startWeek]['status']){
							case 1 : // 正常
								addClass = 'dayOn';
								break;
							case 2 : // 迟到
								addClass = 'dayLater';
								break;
							case 3 : // 早退
								addClass = 'dayLeave';
								break;
							case 4 : // 缺卡
								addClass = 'dayMiss';
								break;	
							case 5 : // 休息
								addClass = 'dayoff';
								break;	
							case 6 : // 今月剩余天数：未打卡(无状态)
								if(allWeek == 0 || allWeek == 6){ // 星期六，日字体颜色变灰
									addClass = 'dayoff';
								}else{
									addClass = '';	
								};
								break;			
						}
					}else{ // 服务器返回无数据
						if(allWeek == 0 || allWeek == 6){ // 星期六，日字体颜色变灰
							addClass = 'dayoff';
						};
					};
					eleTemp.push('<li class="current-month" ><span title=' + nowDate + ' class="dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '<i></i></span></li>');	
				} else {
					//eleTemp.push('<li class="other-month"><span class="dayStyle">' + (i + 1 - (startWeek + fullDay)) + '</span></li>')
					eleTemp.push('<li class="other-month"><span class="dayStyle">&nbsp;</span></li>');
				}
			}
			_this.el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
			_this.el.querySelector('.today').innerHTML = formartDate(year, month + 1, '-1', '-');
		};
		this.nextMonthFun = function(data) {
				if(month + 1 > 11) {
					year += 1;
					month = 0;
				} else {
					month += 1;
				}
				render(data);
				opt.nextMonthCb && opt.nextMonthCb(year, month + 1, day);
			},
//			this.nextYearFun = function() {
//				year += 1;
//				render(data);
//				opt.nextYeayCb && opt.nextYeayCb(year, month + 1, day);
//			},
			this.prevMonthFun = function(data) {
				if(month - 1 < 0) {
					year -= 1;
					month = 11;
				} else {
					month -= 1;
				}
				render(data);
				opt.prevMonthCb && opt.prevMonthCb(year, month + 1, day);
			},
//			this.prevYearFun = function() {
//				year -= 1;
//				render();
//				opt.prevYearCb && opt.prevYearCb(year, month + 1, day);
//			}
		init();
	}
	//将插件暴露给全局对象
	_global = (function() {
		return this || (0, eval)('this')
	}());
	if(typeof module !== 'undefined' && module.exports) {
		module.exports = Schedule;
	} else if(typeof define === "function" && define.amd) {
		define(function() {
			return Schedule;
		})
	} else {
		!('Schedule' in _global) && (_global.Schedule = Schedule);
	}

}());