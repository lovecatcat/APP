	var plansData = []; //处理数据
	var plansDataList = {};
	
	var goIns_data = []; //在线投保数据
	var clause_data = []; //条框数据
	var totalMoney = 0; //总保费
	var groupList =  function(data,pl_id){
	
        var content = data;
        var main = content.main;
        var children = content.children;     
        var describes = main.describes
        var safe_year ;
        var parent_id = content.genre
        var type = content.type
        var year_fee = 0 ;
        var base_money = 0;
        var children_fee = 0 ;
		           
		var listMain = {}
		mui.each(describes, function(index, item) {
			listMain[item.title] = main.list[1][index]
		})  
		           
        if(parent_id == 349){
            safe_year = '至100周岁'
        }else if(parent_id == 16197) {
            safe_year = '至105周岁'
        }else if(parent_id == 16201) {
            safe_year = '至25周岁'
        }else if(parent_id == 336 || parent_id == 335){
            safe_year = content.safe_year == 0 ? '终身' : '至70周岁';
        } else{
            safe_year = content.safe_year == 0 ? '终身' : content.safe_year;
        }
        
        if(parent_id == 290 || parent_id == 352 || parent_id == 360 || parent_id == 370 || parent_id == 16197){
            year_fee = content.year_fee;
        }else if(parent_id == 347 || parent_id == 348){
            year_fee = listMain["累计保费"]; 
        }else if(parent_id == 337){
            year_fee = listMain["住院总保费"];
        }else{
            year_fee =  listMain["年缴保费"];
        }

        if(parent_id == 264){
            if(content.flag == 100){
                base_money = '有社保100万';
            }else if(content.flag == 300){
                base_money = '有社保300万';
            }else if(content.flag == 1100){
                base_money = '无社保100万'
            }else {
                base_money = '无社保300万'
            }
        }else if(parent_id ==309){
            if(content.flag == 1){
                base_money = '计划一'
            }else if(content.flag == 2){
                base_money = '计划二'
            }else{
                base_money = '计划三'
            }
        }else if(parent_id == 349){
            base_money = listMain["保险金额"];
        }else if(parent_id ==360){
            base_money = listMain["保额"];
        }else if(parent_id ==301){
            base_money = listMain["保险金额"];
        }else if(parent_id == 337){ //复星乐健一生住院保险
            var fxflag = '';
            if(content.flag.slice(0, 1) === 'B'){
                fxflag = '有社保'
            }else{
                fxflag = '无社保'
            } 
            base_money = fxflag + content.flag.substr(1)
        }else{
            base_money = content.base_money
        };
        totalMoney += Number(year_fee);
		if(!pl_id){
			plansData = [];
			plansDataList.mainList = {
	        	applicant:content.applicant,
	        	assured:content.assured,
	     		name: main.name,
				genre: content.genre,
				safe_year : safe_year,
				pay_year : content.pay_year,
				base_money: base_money,
				year_fee: year_fee
		         		
		    };
			goIns_data = [];
			clause_data = [];
			goIns_data.push({name: main.name, genre: content.genre});
			clause_data.push({name: main.name, genre: content.genre});
		}else{
			 plansDataList.mainList = {
			 	pl_id: pl_id,
	        	applicant:content.applicant,
	        	assured:content.assured,
	     		name: main.name,
				genre: content.genre,
				safe_year : safe_year,
				pay_year : content.pay_year,
				base_money: base_money,
				year_fee: year_fee
		    };
			goIns_data.push({name: main.name, genre: content.genre});
		}
		
        //如果有附加险就渲染			 	
        if(children){
        	var num = 0;
        	plansDataList.childrenList = [];
            mui.each(children,function(index, tml) {
            	
            	var list = {}
				mui.each(describes, function(index, item) {
					list[item.title] = main.list[1][index]
				})  
                var children_base_money,
                    children_safe_year = 1,
                    children_pay_year = 1,
                    children_year_fee ;
				num ++ ;
                if(list){
                    children_year_fee = list["年缴保费"]
                }

                switch(index) 
                {
                    // 信泰
                    case '341': //信泰附加投保人豁免保险费重大疾病保险
                        children_base_money = year_fee;
                        children_safe_year = "终身";
                        children_pay_year = content.pay_year-1;
                        break;
                    case '333': //信泰百万健康重疾
                        children_base_money = base_money;
                        children_safe_year = tml.flag+'岁';
                        children_pay_year = content.pay_year;
                        break; 
                        //复星
                    case '344': //复星联合乐健一生门急诊保险
                        var fxflag = '';
                        if(tml.flag.slice(0, 1) === 'B'){
                            fxflag = '有社保'
                        }else{
                            fxflag = '无社保'
                        } 
                        children_base_money = fxflag + tml.flag.substr(1);
                        children_safe_year = '1年';
                        children_pay_year = '1年';
                        children_year_fee = list["门诊总保费"];
                        break;
                   
                    case '339': //复星联合附加康乐一生轻症保险
                        children_base_money = base_money;
                        children_safe_year = content.safe_year == 0 ? '终身' : '至70周岁';
                        children_pay_year = content.pay_year;
                        break;
                    case '338': //复星联合附加康乐一生投保人豁免保费重大疾病保险
                        if(children[339]){
                            children_base_money = year_fee + children[339].list[1]["年缴保费"];
                        }else{
                            children_base_money = year_fee;
                        }
                        children_safe_year = content.safe_year == 0 ? '终身' : '至70周岁';
                        children_pay_year = content.pay_year-1;
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
                        children_safe_year = list["保险期间"];
                        children_pay_year = list["缴费期间"];
                        break;
                     case '175':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year;
                        children_pay_year = content.pay_year;
                        break;
                         case '222':
                        children_base_money = tml.flag+'份';
                        break;
                           case '227':
                        children_base_money =  list["基本保额"];
                        break;
                         case '230':
                        children_base_money =  list["基本保额"];
                        break;
                           case '261':
                        var flag ;
                        if(list["缴费期间"] == 5500){
                            flag = '至55周岁'
                        }else if(list["缴费期间"] == 6000){
                            flag = '至60周岁'
                        }else if(list["缴费期间"] == 6500){
                            flag = '至65周岁'
                        }else{
                            flag = list["缴费期间"]
                        }
                        children_base_money = list["基本保额"];
                        children_safe_year = flag;
                        children_pay_year = flag;
                        break;
                           case '265':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year;
                        children_pay_year = content.pay_year;
                        break;
                    case '353':
                        children_base_money = list["基本保额"];
                        children_safe_year = content.safe_year;
                        children_pay_year = list["缴费期间"];
                        break;
                    case '235': //xia
                        children_base_money = tml.flag+'份';
                        break;    
                    case '236': //xia
                        children_base_money = tml.flag+'份';
                        break; 
                    case '4304':
                        var flag ;
                        if(list["缴费期间"] == 6500){
                            flag = '至65周岁'
                        }else if(list["缴费期间"] == 7500){
                            flag = '至75周岁'
                        }else{
                            flag = list["缴费期间"]
                        }
                        children_base_money = list["基本保额"];
                        children_safe_year = flag;
                        children_pay_year = flag;
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
                    case '268':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        break; 
                    case '269':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
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
                     case '349': //xia
                        children_base_money = "—";
                        children_safe_year = "100岁";
                        children_pay_year = tml.flag == 0 ? '—':'1年';
                        children_year_fee = tml.flag;
                        break;                    
                    //国华
                    case '11':
                        children_base_money = "—";
                        children_safe_year = "终身";
                        children_pay_year = "—";
                        children_year_fee = 0;
                        break;
                    case '87':
                        children_base_money = parseInt(listMain["年缴保费"]) * parseInt(content.pay_year);
                        children_safe_year = "至85岁";
                        children_pay_year = content.pay_year;
                        break;    
                    case '273':
                        children_base_money = tml.list['1']['年度医疗保险金额'];
                        break;
                    case '355':
                        children_base_money = (year_fee*content.pay_year).toFixed(0);
                        children_safe_year = '至85周岁';
                        children_pay_year = content.pay_year;
                        break;
                    case '356':
                    case '357':
                    case '358':
                        if(children[355]){
                            children_base_money = ((year_fee + Number(children[355].list[1]["年缴保费"]))*(content.pay_year-1)).toFixed(0);
                        }else{
                            children_base_money = (year_fee*(content.pay_year-1)).toFixed(0);
                        }
                        break;
                    case '16202':
                        children_base_money = list["基本保额"];
                        children_pay_year  = 10;
                        children_safe_year = '至25周岁';
                        break;
                    //泰康
                    
                    case '112':
                        children_base_money = list["保险金额(元)"];
                        children_safe_year = list["保障期限(年)"];
                        children_pay_year = list["缴费年间(年)"];
                        children_year_fee = list["年缴保费(元)"];
                        break;
                    case '122':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        children_year_fee = list["年缴保费(元)"]
                        break;
                    case '165':
                        children_base_money = '计划'+tml.flag;
                        children_safe_year = list["保障期间(年)"];
                        children_pay_year = list["缴费年间(年)"];
                        children_year_fee = list["年缴保费(元)"]
                        break;   
                    case '304':
                        children_base_money = list["一般意外身故/伤残保险金"];
                        children_safe_year = safe_year;
                        children_pay_year = content.pay_year;
                        break;  
                    case '305':
                        children_base_money = list["意外住院津贴日额"];
                        children_safe_year = safe_year;
                        children_pay_year = content.pay_year;
                        break;
                    case '10455': // 泰康健康优享住院费用医疗保险
                        if(tml.flag == 1){
                            children_base_money = '有社保';
                        }else{
                            children_base_money = '无社保';
                        }
                        break;
                    case '350':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        break; 
                    //恒大
                    case '273':
                        //豁免保费重大疾病保险
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
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
                        if(flag.slice(0,1) === '1'){
                            hdFufee2 = '有社保'
                        }else{
                            hdFufee2 = '无社保'
                        }
                        if(flag == 150 || flag == 250){
                            children_base_money = hdFufee2+"50万";
                        }else if(flag == 1100 || flag == 2100){
                            children_base_money = hdFufee2+"100万";
                        }else if(flag == 1150 || flag == 2150){
                            children_base_money = hdFufee2+"150万";
                        }
                        
                        break;
                    case '278':
                         //恒顺意外
                         var flag = tml.flag.toString();
                            if(flag==52000 || flag==53000 || flag==54000 || flag==55000 || flag==56000 || flag==57000 || flag==58000 || flag==59000 ||flag==510000 || flag==515000 || flag==520000 || flag==530000 || flag==540000 || flag==550000){
                                children_base_money = flag.substring(1);
                            }else if(flag==62000 || flag==63000 || flag==64000 || flag==65000 || flag==66000 || flag==67000 || flag==68000 || flag==69000 ||flag==610000 || flag==615000 || flag==620000 || flag==630000 || flag==640000 || flag==650000){
                                children_base_money = flag.substring(1);
                            }else{
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
                        if(tml.flag.toString().slice(0,1) === '1'){
                            hdFufee2 = '有社保'
                        }else{
                            hdFufee2 = '无社保'
                        }
                        if(tml.flag == "15000" || tml.flag == "25000"){
                            hdFufee = "5千";
                        }else if(tml.flag == "110000" || tml.flag == "210000"){
                            hdFufee = "1万";
                        }
                        children_base_money = hdFufee2 +hdFufee;
                        children_year_fee = list["年缴保费"]
                        break;
                }
               	 
                totalMoney += Number(children_year_fee);
           
                plansDataList.childrenList.push ({
	         		name: tml.name,
					genre: index,
					safe_year : children_safe_year,
					pay_year : children_pay_year,
					base_money: children_base_money,
					year_fee: children_year_fee
	         		
	         	});
				clause_data.push({name: tml.name, genre: index});
	         	
            });
                        
        }
        plansData.push(plansDataList)
        plansDataList = {}
//		alert(JSON.stringify(plansData))
//		alert(pl_id)
		if(!pl_id){ 
			//单个计划书
			aloneDetail.main = plansData[0].mainList // 主险
			aloneDetail.children = plansData[0].childrenList //附加
			aloneDetail.goIns_data = goIns_data
			aloneDetail.clause_data = clause_data
//			alert(JSON.stringify(aloneDetail.children))
		}else{
			//汇总页面
			plansTotal.plansData = plansData
			plansTotal.goIns_data = goIns_data
			document.querySelector('#totalMoney').innerText = totalMoney;  //总保费
//			alert(JSON.stringify(plansTotal.plansData))
//			alert(JSON.stringify(plansTotal.plansData))
//			alert(JSON.stringify(plansTotal.totalMoney))
		}
		
				
};
        	