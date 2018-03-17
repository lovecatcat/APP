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

	function Schedule(opt) {
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
			firstSign = '',
			secondSign = '',
			oldFirstDay='',
			oldSecondDay ='',
			isTapMask = true, // 是否点击遮罩层：默认是
			_this = this;
		_this.cancle = opt.cancle;
		_this.ok = opt.ok;
		_this.wrapEl = document.querySelector(opt.el);	
		_this.el = document.createElement('div');
		_this.el.classList.add('member-duty-dater');
		
		var mask = mui.createMask(function(){ //callback为用户点击蒙版时自动执行的回调；
			if(_this.cancle && isTapMask){
				_this.cancle();
			};
			_this.hide();
		});
		var newWrapper = document.createElement('div');
		newWrapper.style.position = 'fixed';
		newWrapper.style.left = '50%';
		newWrapper.style.top = '50%';
		newWrapper.style.transform = 'translate(-50%,-50%)';
		newWrapper.style.zIndex = '1001';
		newWrapper.style.width = '100%';
		newWrapper.classList.add('BL-hide');
		newWrapper.appendChild(_this.el);
		document.querySelector('body').appendChild(newWrapper);
		
		var bindEvent = function() {
			_this.el.addEventListener('tap', function(e) {
				switch(e.target.id) {
					case 'nextMonth':
						_this.nextMonthFun();
						break;
					case 'nextYear':
						_this.nextYearFun();
						break;
					case 'prevMonth':
						_this.prevMonthFun();
						break;
					case 'prevYear':
						_this.prevYearFun();
						break;
					default:
						break;
				};
			}, false)
		};
		var init = function() {
			var scheduleHd = '<div class="schedule-hd BL-ub BL-ub-ac">' +
				'<div class="BL-ub BL-ub-ac">' +
				'<span class="mui-icon-back BL-icon" id="prevYear" ></span>' +
				'<span class="mui-icon-arrowleft BL-icon" id="prevMonth"></span>' +
				'</div>' +
				'<div class="BL-ub-f1 today">' + formartDate(year, month + 1, '-1', '-') + '</div>' +
				'<div class="BL-ub BL-ub-ac">' +
				'<span class="mui-icon-arrowright BL-icon" id="nextMonth"></span>' +
				'<span class="mui-icon-forward BL-icon" id="nextYear"></span>' +
				'</div>' +
				'</div>'
			var scheduleWeek = '<ul class="week-ul ul-box">' +
				'<li>周日</li>' +
				'<li>周一</li>' +
				'<li>周二</li>' +
				'<li>周三</li>' +
				'<li>周四</li>' +
				'<li>周五</li>' +
				'<li>周六</li>' +
				'</ul>'
			var scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
			_this.el.innerHTML = scheduleHd + scheduleWeek + scheduleBd;
			bindEvent();
			render();
			
			mui('body').on('tap', '.current-month', function(){ // 手动选取区间
				oldFirstDay='',oldSecondDay='';
				if(firstSign == ''){
					mui('.current-month').each(function(){
						this.children[0].classList.remove('daySelect');
					});
					firstSign = this.getAttribute('data-date');
					this.children[0].classList.add('daySelect');	
				}else if(secondSign == ''){
					if(_this.ok){
						console.log('ok')
						_this.ok();
					}
					isTapMask = false;
					secondSign = this.getAttribute('data-date');
					contrast(firstSign, secondSign);
					mask.close();
					_this.hide();
				}
			})
		};
		
		var contrast = function(firstSign, secondSign){
			if(new Date(firstSign).getTime()>new Date(secondSign).getTime()){
				_this.wrapEl.children[0].innerText = secondSign;
				_this.wrapEl.children[1].innerText = firstSign;
			}else if(new Date(firstSign).getTime()<new Date(secondSign).getTime()){
				_this.wrapEl.children[0].innerText = firstSign;	
				_this.wrapEl.children[1].innerText = secondSign;
			}else{
				_this.wrapEl.children[0].innerText = firstSign;	
				_this.wrapEl.children[1].innerText = secondSign;
			}
		};
		
		var render = function() {
			var fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
				startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
				total = (fullDay + startWeek) % 14 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (14 - (fullDay + startWeek) % 14), //元素总个数
				lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
				eleTemp = [],nextYear,prevYear,nextMonth,prevMonth; 	
			
			for(var i = 0; i < total; i++) {
				if(i < startWeek) {
					eleTemp.push('<li class="other-month"><span class="dayStyle">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>');
				} else if(i < (startWeek + fullDay)) {
					var allWeek = new Date(year, month, i + 1 - startWeek).getDay(); // 获取当月所有周几
					var nowDate = formartDate(year, month + 1, (i + 1 - startWeek), '-');
					var addClass = '';
					if(allWeek == 0 || allWeek == 6){ // 当前月份星期六，日字体颜色变红
							addClass = 'dayoff-red';
					};
					
					eleTemp.push('<li data-date="'+ formartDate(year, month+1, (i + 1 - startWeek), '-') +'" class="current-month"><span title=' + nowDate + ' class="dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '<i></i></span></li>');	
				} else {
					eleTemp.push('<li class="other-month"><span class="dayStyle">' + (i + 1 - (startWeek + fullDay)) + '</span></li>');
				}
			}
			_this.el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
			_this.el.querySelector('.today').innerHTML = formartDate(year, month + 1, '-1', '-');
			
			//console.log(oldFirstDay)
			_this.renderSelect(oldFirstDay, oldSecondDay);
			
		};
		
		this.renderSelect = function(fday, sday){
			if(firstSign != '' || secondSign != '' ){
				mui('.current-month').each(function(){
					var _date = this.getAttribute('data-date');
					//var thisDay = new Date(this.getAttribute('data-date'));
					if(_date == firstSign){
						this.children[0].classList.add('daySelect');
					}else if(_date == secondSign){
						this.children[0].classList.add('daySelect');
					};
				})
			};
			
			if(firstSign != '' && secondSign != '' ){
				var firstDay = new Date(firstSign).getTime();
				var secondDay = new Date(secondSign).getTime();
				
				mui('.current-month').each(function(){
					var thisDay = new Date(this.getAttribute('data-date')).getTime();
					
					if(firstDay > secondDay){
						if(firstDay >= thisDay && secondDay <= thisDay){
							this.children[0].classList.add('daySelect');	
						}
					};
					
					if(firstDay < secondDay){
						if(firstDay <= thisDay && secondDay >= thisDay){
							this.children[0].classList.add('daySelect');	
						}
					};
				})
			};
			
			if(fday!='' && sday!=''){ // 若存在区间时间，则默认显示区间时间状态
				oldFirstDay = new Date(fday).getTime();
				oldSecondDay = new Date(sday).getTime();
				
				mui('.current-month').each(function(){
					var thisDay = new Date(this.getAttribute('data-date')).getTime();
					
					if(oldFirstDay > oldSecondDay){
						if(oldFirstDay >= thisDay && oldSecondDay <= thisDay){
							this.children[0].classList.add('daySelect');	
						}
					};
					
					if(oldFirstDay < oldSecondDay){
						if(oldFirstDay <= thisDay && oldSecondDay >= thisDay){
							this.children[0].classList.add('daySelect');	
						}
					};
				})
			};
			
		},
		this.show = function(){
			isTapMask = true;
			firstSign = '',secondSign = '';
			mask.show();//显示遮罩
			newWrapper.classList.remove('BL-hide');	
		},
		this.hide = function(){
			firstSign = '',secondSign = '';
			newWrapper.classList.add('BL-hide');	
			mui('.current-month').each(function(){
				this.children[0].classList.remove('daySelect');
			});
		},
		this.nextMonthFun = function() {
				if(month + 1 > 11) {
					year += 1;
					month = 0;
				} else {
					month += 1;
				}
				render();
		},
		this.nextYearFun = function() {
				year += 1;
				render();
		},
		this.prevMonthFun = function() {
				if(month - 1 < 0) {
					year -= 1;
					month = 11;
				} else {
					month -= 1;
				}
				render();
		},
		this.prevYearFun = function() {
				year -= 1;
				render();
		}
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