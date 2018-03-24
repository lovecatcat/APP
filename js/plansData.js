	var plansData = []; //处理数据
	var plansDataList = {};
	
	var goIns_data = []; //在线投保数据
	var clause_data = []; //条框数据
	var totalMoney = 0; //总保费
	var groupList =  function(data,pl_id){
	
        var content = data;
        var main = content.main;
        var children = content.children;                   
        var safe_year ;
        var parent_id = content.genre
        var type = content.type
        var year_fee = 0 ;
        var base_money = 0;
        var children_fee = 0 ;
		           
        if(parent_id == 379){
            safe_year = '至100周岁'
        }else if(parent_id == 19384) {
            safe_year = '至105周岁'
        }else if(parent_id == 19388) {
            safe_year = '至25周岁'
        }else if(parent_id == 365 || parent_id == 364){
            safe_year = content.safe_year == 0 ? '终身' : '至70周岁';
        } else{
            safe_year = content.safe_year == 0 ? '终身' : content.safe_year;
        }
        if(parent_id == 290 || parent_id == 352 || parent_id == 360 || parent_id == 401 || parent_id == 19384){
            year_fee = content.year_fee;
        }else if(parent_id ==74 || parent_id == 377 || parent_id == 378){
            year_fee = main.list[1]["累计保费"]; 
        }else if(parent_id ==366){
            year_fee = main.list[1]["住院总保费"];
        }else{
            year_fee =  main.list[1]["年缴保费"];
        }

        if(parent_id ==280){
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
        }else if(parent_id ==379){
            base_money = main.list[1]["保险金额"];
        }else if(parent_id ==360){
            base_money = main.list[1]["保额"];
        }else if(parent_id ==318){
            base_money = main.list[1]["保险金额"];
        }else if(parent_id == 366){ //复星乐健一生住院保险
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
                var children_base_money,
                    children_safe_year = 1,
                    children_pay_year = 1,
                    children_year_fee ;
				num ++ ;
                if(tml.list[1]){
                	
                    children_year_fee = tml.list[1]["年缴保费"]
                }

                switch(index) 
                {
                    // 信泰
                    case '398':
                        //金掌柜
                        children_base_money = "—";
                        children_safe_year = "终身";
                        children_year_fee = tml.flag;
                        break;
                    case '374': //复星联合乐健一生门急诊保险
                        var fxflag = '';
                        if(tml.flag.slice(0, 1) === 'B'){
                            fxflag = '有社保'
                        }else{
                            fxflag = '无社保'
                        } 
                        children_base_money = fxflag + tml.flag.substr(1);
                        children_safe_year = '1年';
                        children_pay_year = '1年';
                        children_year_fee = tml.list[1]["门诊总保费"];
                        break;
                    case '370': //信泰附加投保人豁免保险费重大疾病保险
                        children_base_money = year_fee;
                        children_safe_year = "终身";
                        children_pay_year = content.pay_year-1;
                        break;
                    case '368': //复星联合附加康乐一生轻症保险
                        children_base_money = base_money;
                        children_safe_year = content.safe_year == 0 ? '终身' : '至70周岁';
                        children_pay_year = content.pay_year;
                        break;
                    case '367': //复星联合附加康乐一生投保人豁免保费重大疾病保险
                        if(children[368]){
                            children_base_money = year_fee + children[368].list[1]["年缴保费"];
                        }else{
                            children_base_money = year_fee;
                        }
                        children_safe_year = content.safe_year == 0 ? '终身' : '至70周岁';
                        children_pay_year = content.pay_year-1;
                        break;
                    case '362': //信泰百万健康重疾
                        children_base_money = base_money;
                        children_safe_year = tml.flag+'岁';
                        children_pay_year = content.pay_year;
                        break; 
                    //中国人保
                    case '354':
                        //品质
                        children_base_money = "—";  
                        children_safe_year = "终身";
                        children_year_fee = tml.flag;
                        break;
                    //中英
                    case '183':
                        children_base_money = tml.list[1]["基本保额"];
                        children_safe_year = tml.list[1]["保险期间"];
                        children_pay_year = tml.list[1]["缴费期间"];
                        break;
                    case '383':
                        children_base_money = tml.list[1]["基本保额"];
                        children_safe_year = content.safe_year;
                        children_pay_year = tml.list[1]["缴费期间"];
                        break;
                    case '281':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year;
                        children_pay_year = content.pay_year;
                        break;
                    case '235':
                        children_base_money = tml.flag+'份';
                
                        break;    
                    case '236':
                        children_base_money = tml.flag+'份';
                        break; 
                    case '237':
                        children_base_money = tml.flag+'份';
                        break;
                    case '189':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year;
                        children_pay_year = content.pay_year;
                        break;
                    case '242':
                        children_base_money =  tml.list[1]["基本保额"];
                        break;
                    case '245':
                        children_base_money =  tml.list[1]["基本保额"];
                        break;
                    case '277':
                        var flag ;
                        if(tml.list[1]["缴费期间"] == 5500){
                            flag = '至55周岁'
                        }else if(tml.list[1]["缴费期间"] == 6000){
                            flag = '至60周岁'
                        }else if(tml.list[1]["缴费期间"] == 6500){
                            flag = '至65周岁'
                        }else{
                            flag = tml.list[1]["缴费期间"]
                        }
                        children_base_money = tml.list[1]["基本保额"];
                        children_safe_year = flag;
                        children_pay_year = flag;
                        break;
                    case '4343':
                        var flag ;
                        if(tml.list[1]["缴费期间"] == 6500){
                            flag = '至65周岁'
                        }else if(tml.list[1]["缴费期间"] == 7500){
                            flag = '至75周岁'
                        }else{
                            flag = tml.list[1]["缴费期间"]
                        }
                        children_base_money = tml.list[1]["基本保额"];
                        children_safe_year = flag;
                        children_pay_year = flag;
                        break;
                    //工银
                     case '177':
                        children_base_money = content.base_money;
                        break;
                     case '147':
                        children_base_money = tml.flag;
                        
                        break;    
                    case '146':
                        children_base_money = tml.flag;
                        children_safe_year = tml.list[1]["保险期间"];
                        children_pay_year = tml.list[1]["缴费年限"];
                        break;  
                    case '148':
                        children_base_money = tml.list[1]["保险金额"];
                        children_safe_year = tml.list[1]["保险期间"];
                        children_pay_year = tml.list[1]["缴费年限"];
                        break;
                    case '284':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        break; 
                    case '285':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        break; 
                    case '196':
                        children_base_money = tml.list[1]["住院津贴保险金（日）"];
                        children_safe_year = tml.list[1]["保险期间"];
                        children_pay_year = tml.list[1]["缴费年限"];
                        break;  
                     case '349':
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
                    case '94':
                        children_base_money = parseInt(main.list[1]["年缴保费"]) * parseInt(content.pay_year);
                        children_safe_year = "至85岁";
                        children_pay_year = content.pay_year;
                        break;    
                    case '273':
                        children_base_money = tml.list['1']['年度医疗保险金额'];
                        break;
                    case '385':
                        children_base_money = (year_fee*content.pay_year).toFixed(0);
                        children_safe_year = '至85周岁';
                        children_pay_year = content.pay_year;
                        break;
                    case '386':
                    case '387':
                    case '388':
                        if(children[385]){
                            children_base_money = ((year_fee + Number(children[385].list[1]["年缴保费"]))*(content.pay_year-1)).toFixed(0);
                        }else{
                            children_base_money = (year_fee*(content.pay_year-1)).toFixed(0);
                        }
                        break;
                    case '19389':
                        children_base_money = tml.list[1]["基本保额"];
                        children_pay_year  = 10;
                        children_safe_year = '至25周岁';
                        break;
                    //泰康
                    case '380':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        break; 
                    case '121':
                        children_base_money = tml.list[1]["保险金额(元)"];
                        children_safe_year = tml.list[1]["保障期限(年)"];
                        children_pay_year = tml.list[1]["缴费年间(年)"];
                        children_year_fee = tml.list[1]["年缴保费(元)"];
                        break;
                    case '131':
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        children_year_fee = tml.list[1]["年缴保费(元)"]
                        break;
                    case '175':
                        children_base_money = '计划'+tml.flag;
                        children_safe_year = tml.list[1]["保障期间(年)"];
                        children_pay_year = tml.list[1]["缴费年间(年)"];
                        children_year_fee = tml.list[1]["年缴保费(元)"]
                        break;   
                    case '332':
                        children_base_money = tml.list[1]["一般意外身故/伤残保险金"];
                        children_safe_year = safe_year;
                        children_pay_year = content.pay_year;
                        break;  
                    case '333':
                        children_base_money = tml.list[1]["意外住院津贴日额"];
                        children_safe_year = safe_year;
                        children_pay_year = content.pay_year;
                        break;
                    case '10503': // 泰康健康优享住院费用医疗保险
                        if(tml.flag == 1){
                            children_base_money = '有社保';
                        }else{
                            children_base_money = '无社保';
                        }
                        break;
                    //恒大
                    case '289':
                        //豁免保费重大疾病保险
                        children_base_money = year_fee;
                        children_safe_year = content.pay_year-1;
                        children_pay_year = content.pay_year-1;
                        break;
                    case '291':
                        //金管家
                        children_base_money = "—";  
                        children_safe_year = "终身";
                        children_year_fee = tml.flag;
                        break;
                    case '293':
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
                    case '294':
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
                    case '295':
                        //恒祥住院
                        children_base_money = tml.list[1]["住院津贴保险金"] + '元/日';
                        break;
                    case '404':
                        //万年红
                        children_base_money = "—";
                        children_safe_year = "终身";
                        children_year_fee = 100;
                        break;
                    case '19385':
                        //万年红
                        children_base_money = "—";
                        children_safe_year = "至105周岁";
                        children_year_fee = 100;
                        break;
                    case '19392':
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
                        children_year_fee = tml.list[1]["年缴保费"]
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
        	