'use strict';
app.controller('TeacherViewController', TeacherViewController);
app.controller("CustomModalController", CustomModalController);
app.controller("CustomModalController1", CustomModalController1);
app.controller('LastController', LastController);
app.controller('LastController2', LastController2);

function TeacherViewController($scope, $ksHttp, $uibModal, $filter, $rootScope, $stateParams, $state){
	$scope.name_instructors = [];
	$scope.mission_customers = [];
	$scope.info = null;
	
	$scope.select_ptcd = $stateParams.ptCd;
	
	$scope.select_order = 't';
	$scope.search_order = 't';
	
	$scope.init = function(){
		$scope.select_ptcd = $stateParams.ptCd;
		$scope.getInfo();
		$scope.search();
	};

	$scope.getInfo = function() {
		var count_params = {
			ptCd : $scope.select_ptcd,
		};

		$ksHttp.post('SelectTeacherFeeInfo2', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.info = rs[0];
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.search = function(){
		var count_params = {
			ptCd : $scope.select_ptcd,
			shOrder : $scope.select_order
		};
		$scope.teacher_fee_list = [];
		$ksHttp.post('SelectTeacherFeeInfo', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			console.log(rs);
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
							key.unit_money = key.teacherFee * key.studentCnt;
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

						if(key.lastMoneyYn == 'Y') {
							temp.last_total += parseInt(key.lastMoney);
						} 
						else {
							temp.last_total += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);												
						}
						
						if(key.completeYn == 'Y') {
							key.schedules = key.cSchedule.split('|');

							temp.total += key.cTotalFee;
							temp.amTotal += parseInt(key.tempMoney);
							temp.tempTotal += (key.cTotalFee)- (key.cTotalVat) + parseInt(key.tempMoney);
							temp.teacher = key.teacherNm;
							key.checked = true;
						}
						else {
							key.schedules = key.schedule.split('|');

							temp.total += key.unit_money;
							temp.amTotal += parseInt(key.tempMoney);
							temp.tempTotal += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);
							temp.teacher = key.teacherNm;
							key.checked = true;
						}

						
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
							key.unit_money = key.teacherFee * key.studentCnt;
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

						if(key.lastMoneyYn == 'Y') {
							temp.last_total += parseInt(key.lastMoney);
						} 
						else {
							temp.last_total += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);												
						}
						key.schedules = key.schedule.split('|');

						if(key.completeYn == 'Y') {
							key.schedules = key.cSchedule.split('|');

							temp.total += key.cTotalFee;
							temp.amTotal += parseInt(key.tempMoney);
							temp.tempTotal += (key.cTotalFee)- (key.cTotalVat) + parseInt(key.tempMoney);
							temp.teacher = key.teacherNm;
							key.checked = true;
						}
						else {
							key.schedules = key.schedule.split('|');

							temp.total += key.unit_money;
							temp.amTotal += parseInt(key.tempMoney);
							temp.tempTotal += (key.unit_money)- (key.unit_money * 0.033) + parseInt(key.tempMoney);
							temp.teacher = key.teacherNm;
							key.checked = true;
						}

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
	
	$scope.edit = function(item){
		var params = {
				saveType : 'T',
				ltCd : item.ltCd,
				lastMoney : item.lastTcMoney,
				regUser  : $rootScope.current_user.userId
		};
		$ksHttp.post('CalLectureSave', params).then(function(rs) {
			$scope.search();
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
	};
	
	 $scope.exportEcel = function(){
		
		window.open('/excel/calcteacher.do?ptCd='+ $scope.select_ptcd + '&shOrder=' + $scope.select_order);
		
    }
	
	$scope.openPopup = function(x){
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "custom_modal.html",
            controller: "CustomModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            	item : x
              
            }
        });
		
        modalInstance.result.then(function(result) {
            // recieve returned data
            console.info(result);
            $scope.search();
        }, function(err) {
            $scope.search();
            console.info(err);
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
	
	$scope.showLast = function(item){
		
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "complete.html",
            controller: "LastController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
              item: item
            }
        });
		
        modalInstance.result.then(function(result) {
			$scope.search();
        }, function(err) {
            console.info(err);
        });
	}

	$scope.showLast2 = function(item){
		
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "complete2.html",
            controller: "LastController2",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
              item: item
            }
        });
		
        modalInstance.result.then(function(result) {
//			$scope.getEducationList();
        }, function(err) {
            console.info(err);
        });
    
	}
	
	$scope.complete = function(item)
	{
		var total = item.lastMoneyYn == 'Y' ? item.lastMoney : (item.unit_money);
		var vat = item.unit_money * 0.033;
		
		var msg = "";
		if( item.lastMoneyYn == 'Y'){
			msg = "해당수업의 강사료 정산을 완료하시겠습니까?";
		}else{
			msg = "해당수업의 강사료 정산을 완료하시겠습니까?<br>※ 확정되지 않은 금액은 0원으로 처리 됩니다.";
		}
		
		$rootScope.showConfirm(msg, function() {
			var params = {
					saveType : 'T',
					ptCd : item.ptCd,
					cpCd : item.cpCd,
					ltCd : item.ltCd,
					total : item.unit_money,
					vat : Math.round(vat),
					teacherFee : item.teacherFee,
					lectureStartDt : item.startDt,
					lectureEndDt : item.endDt,
					lectureSchedule : item.schedule,
					lectureCnt : item.attCnt,
					lectureUnit : item.teacherFeeUnitNm,
					lectureDay : item.scheduleDtAll,
					updUser : $rootScope.current_user.userId
			};

			$ksHttp.post('LectureComplete', params).then(function(rs) {
				rs = JSON.parse(rs);
				console.log(rs);
				$scope.search();
			}, function(error) {
				console.log(error);
			});
			
		});
	}
	
	$scope.completeAll = function(items)
	{
		var ltCd = new Array();
		for(var i = 0; i < items.name.length; i++) {
			if(items.name[i].completeYn != 'Y') {
				ltCd.push(items.name[i].ltCd);
			}
		}

		$rootScope.showConfirm('전체수업의 강사료 정산을 완료하시겠습니까?<br>※ 확정되지 않은 금액은 0원으로 처리 됩니다.', function() {
			if(ltCd.length <= 0) {
				$rootScope.showAlert('정산 완료할 강사료가 없습니다.');
				return;
			}

			var totalCnt = ltCd.length;
			for(var i = 0; i < items.name.length; i++) {
				if(items.name[i].completeYn != 'Y') {
					var total = items.name[i].lastMoneyYn == 'Y' ? items.name[i].lastMoney : (items.unit_money);
					var vat = items.name[i].unit_money * 0.033;
					var params = {
							saveType : 'T',
							ptCd : items.name[i].ptCd,
							cpCd : items.name[i].cpCd,
							ltCd : items.name[i].ltCd,
							total : items.name[i].unit_money,
							vat : Math.round(vat),
							teacherFee : items.name[i].teacherFee,
							lectureStartDt : items.name[i].startDt,
							lectureEndDt : items.name[i].endDt,
							lectureSchedule : items.name[i].schedule,
							lectureCnt : items.name[i].attCnt,
							lectureUnit : items.name[i].teacherFeeUnitNm,
							lectureDay : items.name[i].scheduleDtAll,
							updUser : $rootScope.current_user.userId
					};

					$ksHttp.post('LectureComplete', params).then(function(rs) {
						rs = JSON.parse(rs);
						totalCnt--;
						if(totalCnt <= 0) {
							$scope.search();
						}
					}, function(error) {
						console.log(error);
					});
				}
			}
		});
	}

	$scope.cancel = function() {
		$state.go('app.account.teacher_list');
	}

	$scope.delete_item = function() {
		$rootScope.showConfirm('강사료 정산을 삭제하시겠습니까?', function() {
			var params = {
				saveType : 'T',
				ptCd : $scope.select_ptcd,
				updUser : $rootScope.current_user.userId
			};

			$ksHttp.post('LectureCalcDelete', params).then(function(rs) {
				rs = JSON.parse(rs);
				$state.go('app.account.teacher_list');
			}, function(error) {
				console.log(error);
			});
			
		});
		
	}

	var lastMonth = new Date();
	lastMonth.setMonth(-1);
	$scope.beginLastMonth = $filter('date')(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),'yyyyMMdd');
	
	var current = new Date();
	$scope.endLastMonth = new Date(current.getFullYear(), current.getMonth(), 1);
	$scope.endLastMonth = $filter('date')($scope.endLastMonth.setDate(0),'yyyyMMdd');
}

function CustomModalController1 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.item = item;
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function CustomModalController ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.selected = item;
	$scope.shStartDt = null;
	$scope.shEndDt = null;
	$scope.itemCnts = null;
	$scope.addMoney = null;
	$scope.minusMoney = null;
	$scope.occurDt = null;
	
	$scope.init = function() {
		$scope.getTeacherFeeItemList();
		$scope.date_picker();
	}

	$scope.date_picker = function(){
		$('body').on('focus',".date", function(){
			$('.date').datepicker({
				  format: 'yyyy-mm-dd',
					autoclose: true
	          });
		});
		  
	};

	$scope.getTeacherFeeItemList = function(){
		var params = {
			ptCd : $scope.selected.ptCd,
			ltCd : $scope.selected.ltCd,
		};
		
		$ksHttp.post('CalTeacherFeeItemList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.teacher_fee_tem = rs;
			console.log($scope.teacher_fee_tem)
			$scope.total = 0;
			angular.forEach($scope.teacher_fee_tem, function(value, key) {
				$scope.total += value.addMoney - value.minusMoney;
				value.checked = true;
			});
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.saveItem = function(item){
		if(item.itemCnts == '' || item.itemCnts == null)
		{
			$rootScope.showAlert('사유를 입력해주세요');
			return false;
		}
		if((item.addMoney == '' || item.addMoney == null) && (item.minusMoeny == '' || item.minusMoney == null))
		{
			$rootScope.showAlert('가산액 또는 차감액을 입력해주세요');
			return false;
		}
		if(item.occurDt == '' || item.occurDt == null)
		{
			$rootScope.showAlert('일자를 입력해주세요');
			return false;
		}

		var params = {
				saveType : 'U',
				cbCd : item.cbCd,
				ltCd : $scope.selected.ltCd,
				itemCnts : item.itemCnts,
				addMoney : item.addMoney,
				minusMoney : item.minusMoney,
				occurDt : item.occurDt,
				regUser  : $rootScope.current_user.userId
		};
		$ksHttp.post('CalTeacherFeeItemSave', params).then(function(rs) {
			$scope.getTeacherFeeItemList();
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
	};
	
	$scope.deleted = function(cbCd){
		var params = {
				saveType : 'D',
				cbCd : cbCd,
				ltCd : $scope.selected.ltCd,
				updUser : $rootScope.current_user.userId
		};
		
		$ksHttp.post('CalTeacherFeeItemSave', params).then(function(rs) {
			$scope.getTeacherFeeItemList();
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
	};
	
    $scope.create = function () {
		if($scope.itemCnts == '' || $scope.itemCnts == null)
		{
			$rootScope.showAlert('사유를 입력해주세요');
			return false;
		}
		if(($scope.addMoney == '' || $scope.addMoney == null) && ($scope.minusMoeny == '' || $scope.minusMoney == null))
		{
			$rootScope.showAlert('가산액 또는 차감액을 입력해주세요');
			return false;
		}
		if($scope.occurDt == '' || $scope.occurDt == null)
		{
			$rootScope.showAlert('일자를 입력해주세요');
			return false;
		}

    	var params = {
    			  saveType : 'I',
				  ptCd : $scope.selected.ptCd,
				  ltCd : $scope.selected.ltCd,
				  itemCnts : $scope.itemCnts,
				  addMoney : $scope.addMoney == '' || $scope.addMoney == null ? 0 : $scope.addMoney,
				  minusMoney : $scope.minusMoeny == '' || $scope.minusMoney == null ? 0 : $scope.minusMoney,
				  occurDt : $scope.occurDt,
				  regUser: $rootScope.current_user.userId    
		};
    	
    	$ksHttp.post('CalTeacherFeeItemSave', params).then(function(rs) {
    		$scope.itemCnts = null;
    		$scope.addMoney = null;
    		$scope.minusMoney = null;
    		$scope.occurDt = null;
			$scope.getTeacherFeeItemList();
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
};

function LastController ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.items = {};
	$scope.items.lastMoneyYn = item.lastMoneyYn; 
	$scope.items.lastMoney = 0;
	if( item.lastTcMoneyYn == 'Y'){
		$scope.items.lastMoney = item.lastMoney;
	}else{
		$scope.items.lastMoney = (item.unit_money)- (item.unit_money * 0.033) + item.tempMoney
	}
	$scope.items.lastRemark = item.lastRemark;

	$scope.save = function(){
		var params = {
				saveType : 'T',
				ptCd : item.ptCd,
				ltCd : item.ltCd,
				lastMoney : $scope.items.lastMoney,
				lastRemark : $scope.items.lastRemark,
				regUser : $rootScope.current_user.userId
		};		
		if($scope.items.lastMoney == '' || $scope.items.lastMoney == null)
		{
			$rootScope.showAlert('금액을 입력해주세요.');
			return;
		}
		if($scope.items.lastRemark == '' || $scope.items.lastRemark == null) {
			$rootScope.showAlert('수정사유를 입력해주세요.');
			return;
		}
		$rootScope.showConfirm('저장 하시겠습니까?', function() { 
			$ksHttp.post('CalLectureSave', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$uibModalInstance.close();
				$scope.search();
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			});
		});
		
	};
	
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function LastController2 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	console.log(item);
	$scope.items = {};
	$scope.items.lastRemark = item.lastRemark;

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

