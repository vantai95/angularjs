'use strict';
app.controller('TeacherController', TeacherController);
app.controller("CustomModalController1", CustomModalController1);

function TeacherController($scope, $ksHttp, $uibModal, $filter, $rootScope, $state){
	$scope.name_instructors = [];
	$scope.mission_customers = [];
	$scope.lectures = [];
	$scope.org_data = [];
	
	$scope.select_teacher = null;
	$scope.select_company = null;
	$scope.start_date = null;
	$scope.end_date = null;
	$scope.select_shLtCd = null;
	$scope.shLectureNm = null;
	$scope.select_order = 't';
	$scope.search_order = 't';
	$scope.search_start_date = null;
	$scope.search_end_date = null;
	
	$scope.init = function(){
		$scope.setDate();
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$scope.getTeacher();
		$scope.getCompanies();
		$scope.getLectureListBox();
		$scope.search();
	};
	
	$scope.getTeacher = function(){
		var params = {
		};
		
		$ksHttp.post('TeacherListBox', params).then(function(rs){
			$scope.teachers = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getCompanies = function()
	{
		var params = {
		};
		
		$ksHttp.post('CustomerCompanyListBox', params).then(function(rs){
			$scope.companies = JSON.parse(rs);
			$('.select2').select2();
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getLectureListBox = function(){
		var parmas = {
				cpCd : $scope.select_company ? $scope.select_company.join(','): '',
				tcCd : $scope.select_teacher,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
			};
		
		$ksHttp.post('LectureListBox2', parmas).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_list_box = rs;
		}, function(error) {
			console.log(error);
		});
	};

	$scope.setDate = function()
	{
		var end_date = new Date();
		var from_date = new Date(); 
		from_date.setDate(end_date.getDate() - 30);
		var end_month, end_day, from_month, from_day;
		end_month = end_date.getMonth() + 1;
		from_month = from_date.getMonth() + 1;
		if(end_date.getMonth() + 1 < 10)
		{
			end_month = '0' + (end_date.getMonth()+1);
		}
		if(from_date.getMonth() + 1 < 10)
		{
			from_month = '0' + (from_date.getMonth()+1);
		}
		end_day = end_date.getDate();
		from_day = from_date.getDate();
		if(end_date.getDate() < 10)
		{
			end_day = '0' + end_date.getDate();
		}
		if(from_date.getDate() < 10)
		{
			from_day = '0' + from_date.getDate();
		}
		$scope.end_date = end_date.getFullYear().toString() + '-' + end_month + '-' + end_day;
		$scope.start_date = from_date.getFullYear().toString() + '-' + from_month + '-' + from_day;
		$("#start_date").datepicker('setDate', new Date($scope.start_date));
		$("#end_date").datepicker('setDate', new Date($scope.end_date));
	};
	
	$scope.search = function(){
		var count_params = {
				shTcCd : $scope.select_teacher,
				shCpCdArea : $scope.select_company ? $scope.select_company.join(','): '',
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				shLtCd : $scope.select_shLtCd,
				shLectureNm : $scope.shLectureNm,
				completeTcYn : $scope.select_complete,
				shOrder : $scope.select_order
		};
		$scope.teacher_fee_list = [];
		$ksHttp.post('CalTeacherFeeListByTeacher', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.search_start_date = $scope.start_date;
			$scope.search_end_date = $scope.end_date;
			$scope.org_data = angular.copy(rs);
			if(rs && rs.length > 0){
				var data = {};
				$scope.search_order = $scope.select_order;
				if($scope.select_order == 't') {
					$.each(rs, function(value, key) {
						var temp = data[key.tcCd];
						
						if(!temp){
							temp = {total: 0, amTotal: 0, tempTotal:0, last_total: 0, name : []};
						}
						
						key.unit_money = 0;
						if(key.teacherFeeUnit == '01') {
							key.unit_money = key.teacherFee * studentCnt;
						}
						else if(key.teacherFeeUnit == '02') {
							key.unit_money = key.totalMin * key.teacherFee;
						}
						else if(key.teacherFeeUnit == '03') {
							var div = parseInt(key.totalMin / 60);
							var mod = key.totalMin % 60;
							var tmpPrice = key.teacherFee / 60;

							key.unit_money = div * key.teacherFee + mod * tmpPrice;
						}
						else if(key.teacherFeeUnit == '04') {
							key.unit_money = key.teacherFee * key.attCnt;
						}
						else if(key.teacherFeeUnit == '05') {
							key.unit_money = key.teacherFee;
						}
						else if(key.teacherFeeUnit == '06') {
							var div = parseInt(key.totalMin / 30);
							var mod = key.totalMin % 30;
							var tmpPrice = key.teacherFee / 30;

							key.unit_money = div * key.teacherFee + mod * tmpPrice;
						}
						else if(key.teacherFeeUnit == '07') {
							var div = parseInt(key.totalMin / 90);
							var mod = key.totalMin % 90;
							var tmpPrice = key.teacherFee / 90;

							key.unit_money = div * key.teacherFee + mod * tmpPrice;
						}
						else {
							key.unit_money = key.teacherFee * key.attCnt;
						}

						if(key.lastTcMoneyYn == 'Y') {
							temp.last_total += parseInt(key.lastTcMoney);
						} 
						else {
							temp.last_total += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);												
						}
						
						temp.total += key.unit_money;
//						temp.total += key.attCnt * key.teacherFee;
						temp.amTotal += parseInt(key.tempMoney);
						temp.tempTotal += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);
						temp.teacher = key.teacherNm;
						key.checked = true;
						temp.name.push(key);
						data[key.tcCd] = temp;
					});
					$scope.teacher_fee_list = data;
				}
				else if($scope.select_order == 'c') {
					$.each(rs, function(value, key) {
						var temp = data[key.cpCd];
						
						if(!temp){
							temp = {total: 0, amTotal: 0, tempTotal:0, last_total: 0, name : []};
						}
						
						key.unit_money = 0;
						if(key.teacherFeeUnit == '01') {
							key.unit_money = key.teacherFee * studentCnt;
						}
						else if(key.teacherFeeUnit == '02') {
							key.unit_money = key.totalMin * key.teacherFee;
						}
						else if(key.teacherFeeUnit == '03') {
							var div = parseInt(key.totalMin / 60);
							var mod = key.totalMin % 60;
							var tmpPrice = key.teacherFee / 60;

							key.unit_money = div * key.teacherFee + mod * tmpPrice;
						}
						else if(key.teacherFeeUnit == '04') {
							key.unit_money = key.teacherFee * key.attCnt;
						}
						else if(key.teacherFeeUnit == '05') {
							key.unit_money = key.teacherFee;
						}
						else if(key.teacherFeeUnit == '06') {
							var div = parseInt(key.totalMin / 30);
							var mod = key.totalMin % 30;
							var tmpPrice = key.teacherFee / 30;

							key.unit_money = div * key.teacherFee + mod * tmpPrice;
						}
						else if(key.teacherFeeUnit == '07') {
							var div = parseInt(key.totalMin / 90);
							var mod = key.totalMin % 90;
							var tmpPrice = key.teacherFee / 90;

							key.unit_money = div * key.teacherFee + mod * tmpPrice;
						}
						else {
							key.unit_money = key.teacherFee * key.attCnt;
						}

						if(key.lastTcMoneyYn == 'Y') {
							temp.last_total += parseInt(key.lastTcMoney);
						} 
						else {
							temp.last_total += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);												
						}
						
						temp.total += key.unit_money;
//						temp.total += key.attCnt * key.teacherFee;
						temp.amTotal += parseInt(key.tempMoney);
						temp.tempTotal += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);
						temp.teacher = key.teacherNm;
						key.checked = true;
						temp.name.push(key);
						data[key.cpCd] = temp;
					});
					$scope.teacher_fee_list = data;
				}
			}
			else {
				$scope.teacher_fee_list = [];
			}
		}, function(error) {
			console.log(error);
		});
	};
	
	var lastMonth = new Date();
	lastMonth.setMonth(-1);
	$scope.beginLastMonth = $filter('date')(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),'yyyyMMdd');
	
	var current = new Date();
	$scope.endLastMonth = new Date(current.getFullYear(), current.getMonth(), 1);
	$scope.endLastMonth = $filter('date')($scope.endLastMonth.setDate(0),'yyyyMMdd');
	
	$scope.changeTarget = function(idx) 
	{
		var all = true;
		$('[id^=target_' + idx + '_]').each(function(idx2, e){
			if(!$(this).is(':checked')) {
				all = false;
			}
		});
		
		console.log(all);
		$('#target_' + idx).prop('checked', all);
	}
	
	$scope.changeAllTarget = function(idx)
	{
		var all = $('#target_' + idx).is(':checked');
		
		$('[id^=target_' + idx + '_]').each(function(idx2, e){
			$(this).prop('checked', all);
		});
	}
	
	$scope.saveAllTarget = function()
	{
		$('input[name="target[]"').prop('checked', true);
		$scope.saveTarget();
	}
	
	$scope.saveTarget = function()
	{
		var cpCd = new Array();
		var tcCd = new Array();
		var ltCd = new Array();
		$('input[name="target[]"').each(function(idx, e) {
			var val = $(this).val();
			if($(this).is(':checked')) {
				$.each($scope.org_data, function(value, key) {
					if(val == key.ltCd) {
						cpCd.push(key.cpCd);
						tcCd.push(key.tcCd);
						ltCd.push(key.ltCd);
					}
				});
//				$.each()
			}
		});
		
		var cpCd_ = cpCd.reduce(function(a,b){
			if (a.indexOf(b) < 0 ) a.push(b);
			return a;
		  },[]);
		
		var tcCd_ = tcCd.reduce(function(a,b){
			if (a.indexOf(b) < 0 ) a.push(b);
			return a;
		  },[]);
		
		$rootScope.showConfirm('정산등록 하시겠습니까?', function() {
			if(ltCd.length <= 0) {
				$rootScope.showMessage('error', '정산등록할 항목을 선택해 주세요.');
				return;
			}

			var params = {
				saveType : 'I',
				startDt : $scope.search_start_date,
				endDt : $scope.search_end_date,
				cpCnt : cpCd_.length,
				tcCnt : tcCd_.length,
				ltCds : ltCd.join(','),
				regUser : $rootScope.current_user.userId
			};

			$ksHttp.post('InsertTeacherFeeList', params).then(function(rs) {
				rs = JSON.parse(rs);
				
				$state.go("app.account.teacher_view", {ptCd: rs[0].newCd});				
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
	}

	$scope.show = function(x){
		
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "show.html",
            controller: "CustomModalController1",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
              item: function() {
                return x;
              }
            }
        });
		
        modalInstance.result.then(function(result) {
            // recieve returned data
            console.info(result);
        }, function(err) {
            console.info(err);
        });
    
	}
	
	$scope.cancel = function() {
		$state.go('app.account.teacher_list');
	}
}

function CustomModalController1 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.item = item;
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

