'use strict';

app.controller('MonthlyController', MonthlyController);
app.controller('MonthlyPopupController', MonthlyPopupController);

function MonthlyController($scope, $rootScope, $ksHttp, $uibModal)
{
	$scope.years= [];
	$scope.companies= [];
	$scope.list = [];
	$scope.filter={};
	$scope.total_sale = 0;
	$scope.total_teacher_fee = 0;
	$scope.total_expenditure = 0;
	$scope.total_rate_profit= 0;

	$scope.init = function()
	{
		$scope.getYear();
		$scope.getCompanies();
	};

	$scope.getYear= function(){
		var current_year = new Date().getFullYear();
	    for(var i = current_year; i >= current_year - 20; i--){
	        $scope.years.push(i);
	    }
	    $scope.filter.year = current_year;
		$scope.getMonthly();
	};
	
	$scope.getCompanies = function()
	{
		var params = {
			compType : '',
			compStatus : ''
		}
		$ksHttp.post('CustomerCompanyList', params).then(function(rs){
			rs= JSON.parse(rs);
			$scope.companies = rs;
		}, function(error){
			console.error(error);
		});
	};

	$scope.getMonthly= function() {
		var params = {
			selectYear : $scope.filter.year,
			cpCd : $scope.filter.cpCd
		}
		$ksHttp.post('YearMonthCal', params).then(function(rs){
			rs= JSON.parse(rs);
			if(rs && rs.length > 0){
				var data = {};
				$.each(rs, function(value, key) {
					var temp = data[key.cpCd];
					
					if(!temp) {
						temp = {compNm: key.compNm
								, selectYear : key.selectYear
								, cpCd : key.cpCd
								, sumSales: 0
								, sumTeacher: 0
								, sumExpend: 0
								, sumRateProfit: 0
								, sumOperateProfit : 0
								, completeYn: []
								, taxBillDt: []
								, sales: []
								, teacher: []
								, expend: []
								, operate_profit:[]
								, rate_profit:[] };
					}
					
					if(key.saveType == 'E') {
						temp.sales[key.selectMonth] = parseInt(key.totalMoney) + parseInt(key.totalVat);
						temp.sumSales += parseInt(key.totalMoney) + parseInt(key.totalVat);
						if(!temp.completeYn[key.selectMonth]) {
							temp.completeYn[key.selectMonth] = key.completeYn;
						}
						if(!temp.taxBillDt[key.selectMonth]) {
							temp.taxBillDt[key.selectMonth] = key.taxBillDt;
						}
					}
					else {
						temp.teacher[key.selectMonth] = parseInt(key.totalMoney) - parseInt(key.totalVat);
						temp.sumTeacher += parseInt(key.totalMoney) - parseInt(key.totalVat);
						if(!temp.expend[key.selectMonth]) {
							temp.expend[key.selectMonth] = parseInt(key.expendMoney);
							temp.sumExpend += parseInt(key.expendMoney);
						}
						if(!temp.completeYn[key.selectMonth]) {
							temp.completeYn[key.selectMonth] = key.completeYn;
						}
						if(!temp.taxBillDt[key.selectMonth]) {
							temp.taxBillDt[key.selectMonth] = key.taxBillDt;
						}
					}
					
					data[key.cpCd] = temp;
					
				});

				
				$.each(data, function(key, value) {
					for(var i = 1; i <= 12; i++) {
						var idx = i < 10 ? '0' + i : i;
						if(!data[key].sales[idx]) data[key].sales[idx] = 0;
						if(!data[key].teacher[idx]) data[key].teacher[idx] = 0;
						if(!data[key].expend[idx]) data[key].expend[idx] = 0;
						if(!data[key].completeYn[idx]) data[key].completeYn[idx] = 'N';
						if(!data[key].taxBillDt[idx]) {
							var date = new Date();
							data[key].taxBillDt[idx] = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
						}
							
						data[key].operate_profit[idx] = data[key].sales[idx] - data[key].teacher[idx] - data[key].expend[idx];
						if(data[key].sales[idx] > 0) {
							data[key].rate_profit[idx] = data[key].operate_profit[idx] * 100/data[key].sales[idx];
						}
						else {
							data[key].rate_profit[idx] = 0;
						}
						data[key].rate_profit[idx] = data[key].rate_profit[idx].toFixed(2||0);
//						data[key].sumOperateProfit += data[key].operate_profit[idx];
					}
					
				});
				$scope.list = data;
				
				$scope.getExpendList();
			}
			else {
				$scope.list = [];
				$scope.total_sale = 0;
				$scope.total_teacher_fee = 0;
				$scope.total_espenditure = 0;
				$scope.total_rate_profit= 0;
			}
			

		});
	};
	
	$scope.getExpendList = function() {
		var params2 = {
				selectYear : $scope.filter.year
				, cpCd : $scope.filter.cpCd
			}
			$ksHttp.post('CompExpendAllList', params2).then(function(rs2){
				rs2 = JSON.parse(rs2);
				for(var i = 0; i < rs2.length; i++) {
					console.log(rs2[i]);
					$scope.list[rs2[i].cpCd].expend[rs2[i].selectMonth] = rs2[i].expendMoney;
					$scope.list[rs2[i].cpCd].sumExpend += parseInt(rs2[i].expendMoney);
					
					$scope.list[rs2[i].cpCd].operate_profit[rs2[i].selectMonth] = $scope.list[rs2[i].cpCd].operate_profit[rs2[i].selectMonth] - $scope.list[rs2[i].cpCd].expend[rs2[i].selectMonth];
					if($scope.list[rs2[i].cpCd].sales[rs2[i].selectMonth] > 0) {
						$scope.list[rs2[i].cpCd].rate_profit[rs2[i].selectMonth] = $scope.list[rs2[i].cpCd].operate_profit[rs2[i].selectMonth] * 100/$scope.list[rs2[i].cpCd].sales[rs2[i].selectMonth];
					}
					else {
						$scope.list[rs2[i].cpCd].rate_profit[rs2[i].selectMonth] = 0;
					}
					$scope.list[rs2[i].cpCd].rate_profit[rs2[i].selectMonth] = $scope.list[rs2[i].cpCd].rate_profit[rs2[i].selectMonth].toFixed(2||0);

				}

				$.each($scope.list, function(key, value) {
					for(var i = 1; i <= 12; i++) {
						var idx = i < 10 ? '0' + i : i;
						
						$scope.list[key].sumOperateProfit += parseInt($scope.list[key].operate_profit[idx]);				

					}
					if($scope.list[key].sumSales > 0) {
						$scope.list[key].sumRateProfit = $scope.list[key].sumOperateProfit * 100 / $scope.list[key].sumSales;
					}
					else {
						$scope.list[key].sumRateProfit = 0;
					}

					$scope.total_sale += $scope.list[key].sumSales;
					$scope.total_teacher_fee += $scope.list[key].sumTeacher;
					$scope.total_expenditure += $scope.list[key].sumExpend;
				});

				if($scope.total_sale > 0) {
					$scope.total_rate_profit= ($scope.total_sale - $scope.total_teacher_fee - $scope.total_expenditure)*100/$scope.total_sale;
					$scope.total_rate_profit=$scope.total_rate_profit.toFixed(2||0);
				}
				else {
					$scope.total_rate_profit= 0;
				}
				
				$scope.getCompleteList();
			}, function(error){
				console.error(error);
			});		
	}
	
	$scope.getCompleteList = function() {
		var params = {
			selectYear : $scope.filter.year
			, cpCd : $scope.filter.cpCd
		}
		$ksHttp.post('MonthCompleteList', params).then(function(rs){
			rs = JSON.parse(rs);
			for(var i = 0; i < rs.length; i++) {
				$scope.list[rs[i].cpCd].completeYn[rs[i].selectMonth] = rs[i].completeYn;
				$scope.list[rs[i].cpCd].taxBillDt[rs[i].selectMonth] = rs[i].taxBillDt; 
			}

		});
	}
	
	$scope.repeatComplete = function() {
		$(".date").datepicker({
			format : "yyyy-mm-dd"
			, autoclose : true
		});
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$('body').on('focus','.date', function(){
			console.log($(this).val());
			$(this).datepicker('setDate', new Date($(this).val()));
		});
	}

	$scope.openMonthlyPopup = function(obj, month)
	{
		var tmp = {obj: obj, month: month}
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: "monthlyPopup.html",
			controller: "MonthlyPopupController",
			windowClass: "app-modal-window",
			scope: $scope,
			resolve : {
				item : tmp
			}
		});
		
		modalInstance.result.then(function(result) {
			$scope.getMonthly();
		}, function(error){
			console.info(error);
		});
	};
	
	$scope.complete= function(item, month){
		month = month < 10 ? '0' + month : month;
		$rootScope.showConfirm(item.compNm + ' ' + item.selectYear + '년도 ' + month + '월 정산을 완료하시겠습니까?', function() {
			var params = {
				cpCd : item.cpCd,
				selectYear : item.selectYear,
				selectMonth : month,
				salesMoney : item.sales[month],
				teacherMoney : item.teacher[month],
				expendMoney : item.expend[month],
				taxBillDt : item.taxBillDt[month],
				regUser : $rootScope.current_user.userId,
			}

			$ksHttp.post('MonthMoneyComplete', params).then(function(rs){
				$rootScope.showMessage('success','완료되었습니다.');
/*				rs= JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				if(status == 'succ') {
					$scope.getMonthly();
				}*/
				$scope.getMonthly();
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해 주세요.');
				console.error(error);
			});
			
		});
	};	
};

function MonthlyPopupController($scope, item, $ksHttp, $uibModalInstance, $rootScope, $state)
{
	$scope.obj = item.obj;
	console.log($scope.obj);
	$scope.month = item.month < 10 ? '0' + item.month : item.month;
	$scope.total_price = 0;
	
	$scope.filterPopup= {};
	$scope.expenditures= [];
	$scope.expenditure_new= {};
	$scope.expenditure_new.reason = '';
	$scope.expenditure_new.price = '';
	$scope.expenditure_new.date = '';
	
	$scope.init = function() {
		$scope.getExpenditure();
	};
	
	$scope.getExpenditure = function(){
		var params = {
				cpCd : $scope.obj.cpCd,
				selectYear : $scope.obj.selectYear,
				selectMonth : $scope.month
		}

		$ksHttp.post('CompExpendList', params).then(function(rs){
			console.log(rs);
			rs= JSON.parse(rs);
			$scope.expenditures = rs;
			for(var i = 0; i < $scope.expenditures.length; i++) {
				$scope.expenditures[i].modify = false;
			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.insertExpenditure= function(){
		console.log($scope.expenditure_new.reason);
		console.log($scope.expenditure_new.price);
		if($scope.expenditure_new.reason == '') {
			$rootScope.showAlert('사유를 입력해 주세요.');
			return;
		}
		
		if($scope.expenditure_new.price == '') {
			$rootScope.showAlert('지출액을 입력해 주세요');
			return;
		}
		
		if($scope.expenditure_new.date == '') {
			$rootScope.showAlert('일자를 입력해 주세요.');
			return;
		}
		$rootScope.showConfirm('등록하시겠습니까?', function() {
			var params = {
				saveType : 'I',
				seq : 0,
				cpCd : $scope.obj.cpCd,
				selectYear : $scope.obj.selectYear,
				selectMonth : $scope.month,
				expendCnts : $scope.expenditure_new.reason,
				expendMoney : $scope.expenditure_new.price,
				selectDt : $scope.expenditure_new.date,
				regUser : $rootScope.current_user.userId,
			}

			$ksHttp.post('InsertCompExpend', params).then(function(rs){
				rs= JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				if(status == 'succ') {
					$scope.getExpenditure();
					$scope.expenditure_new.reason = '';
					$scope.expenditure_new.price = '';
					$scope.expenditure_new.date = '';
				}
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해 주세요.');
				console.error(error);
			});
			
		});
	};

	$scope.deleteExpenditure= function(item){
		$rootScope.showConfirm('삭제하시겠습니까?', function() {
			var params = {
				saveType : 'D',
				seq : item.saeCd,
				cpCd : $scope.obj.cpCd,
				selectYear : $scope.obj.selectYear,
				selectMonth : $scope.month,
				expendCnts : '',
				expendMoney : 0,
				selectDt : '',
				regUser : $rootScope.current_user.userId,
			}

			$ksHttp.post('InsertCompExpend', params).then(function(rs){
				rs= JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				if(status == 'succ') {
					$scope.getExpenditure();
				}
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해 주세요.');
				console.error(error);
			});
			
		});
	};
	

	$scope.editExpenditure= function(item){
		if(item.expendCnts == '') {
			$rootScope.showAlert('사유를 입력해 주세요.');
			return;
		}
		
		if(item.expendMoney == '') {
			$rootScope.showAlert('지출액을 입력해 주세요');
			return;
		}
		
		if(item.selectDt == '') {
			$rootScope.showAlert('일자를 입력해 주세요.');
			return;
		}
		$rootScope.showConfirm('수정하시겠습니까?', function() {
			var params = {
				saveType : 'U',
				seq : item.saeCd,
				cpCd : $scope.obj.cpCd,
				selectYear : $scope.obj.selectYear,
				selectMonth : $scope.month,
				expendCnts : item.expendCnts,
				expendMoney : item.expendMoney,
				selectDt : item.selectDt,
				regUser : $rootScope.current_user.userId,
			}

			$ksHttp.post('InsertCompExpend', params).then(function(rs){
				rs= JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				if(status == 'succ') {
					$scope.getExpenditure();
				}
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해 주세요.');
				console.error(error);
			});
			
		});
	};
	
	
	$scope.cancel = function()
	{
		$uibModalInstance.close();
	};
	
	$scope.select = function()
	{
		console.log($scope.filterPopup);
	};
	
}
