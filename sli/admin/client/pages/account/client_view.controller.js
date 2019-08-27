'use strict';

app.controller('ClientViewController', ClientViewController);
app.controller('LastController', LastController);
app.controller('LastController2', LastController2);
app.controller('CustomModalController1', CustomModalController1);
app.controller('ClientInsertPopupController', ClientInsertPopupController);

function ClientViewController($scope, $ksHttp, $uibModal, $rootScope, $state, $stateParams)
{
	$scope.refund_list = [];
	$scope.pay_list	= [];
	$scope.summary = {};
	$scope.summary.total_charge_amount = 0;
	$scope.summary.total_final_settle_amount = 0;
	$scope.select_teacher = null;
	$scope.select_company = null;
	$scope.select_shLtCd = null;
	$scope.shLectureNm = null;
	$scope.select_ptcd = $stateParams.ptCd;
	$scope.select_complete = '';

	$scope.info = null;
	
	$scope.total = 0;
	$scope.last_total = 0;
    $scope.total_pages = 0;
    $scope.current_page = 1;
    
    $scope.start_date = null;
    $scope.end_date = null;
	$scope.init = function()
	{
		$scope.select_ptcd = $stateParams.ptCd;
		
		$scope.getInfo();
		$scope.search();
	};
	
	$scope.getInfo = function() {
		var count_params = {
			ptCd : $scope.select_ptcd,
		};

		$ksHttp.post('SelectClientFeeInfo2', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.info = rs[0];
		}, function(error) {
			console.log(error);
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
//			$scope.getEducationList();
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
        	$scope.search();
//			$scope.getEducationList();
        }, function(err) {
            console.info(err);
        });
    
	}

	$scope.openClientInsertPopup = function(x)
	{
		 var modalInstance = $uibModal.open({
			 animation: true,
			 templateUrl: "ClientInsertPopup",
			 controller: "ClientInsertPopupController",
			 windowClass: "app-modal-window",
			 scope: $scope,
			 resolve: {
				 item : x
			 }
		 });
		 modalInstance.result.then(function(result){
			 $scope.search();
		 }, function(error){
//			 $scope.getEducationList();
			console.info(error); 
		 });
		 
	}
	
	$scope.getLectureListBox = function(){
		var parmas = {
			cpCd : $scope.select_company ? $scope.select_company.join(','): '',
			tcCd : $scope.select_teacher,
			shStartDt : $scope.start_date,
			shEndDt : $scope.end_date,
		};
		
		$ksHttp.post('LectureListBox', parmas).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_list_box = rs;
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.search = function(){
		var count_params = {
			ptCd : $scope.select_ptcd,
		};
		
		$ksHttp.post('SelectClientFeeInfo', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.educations = rs;
			$scope.unit_total = 0;
			$scope.last_total = 0;
			$scope.vat_total = 0;
			angular.forEach($scope.educations, function(value, key) {
				value.show_add = false;

				value.unit_money = 0;
				if(value.tuitionFeeUnit == '01') {
					value.unit_money = value.tuitionFee * value.studentCnt;
				}
				else if(value.tuitionFeeUnit == '02') {
					value.unit_money = value.totalMin * value.tuitionFee;
				}
				else if(value.tuitionFeeUnit == '03') {
					var div = parseInt(value.totalMin / 60);
					var mod = value.totalMin % 60;
					var tmpPrice = value.tuitionFee / 60;

					value.unit_money = div * value.tuitionFee + mod * tmpPrice;
				}
				else if(value.tuitionFeeUnit == '04') {
					value.unit_money = value.tuitionFee * value.attCnt;
				}
				else if(value.tuitionFeeUnit == '05') {
					value.unit_money = value.tuitionFee;
				}
				else if(value.tuitionFeeUnit == '06') {
					value.unit_money = value.tuitionFee;
				}
				else {
					value.unit_money = value.tuitionFee * value.attCnt;
				}
				
				value.addPrice = [];
				value.add_total = 0;
				value.add_vat = 0;
				
				if(value.completeYn == 'Y') {
					value.unit_money = value.cTotalFee;
					value.schedules = value.cSchedule.split('|');
				}
				else {
					value.schedules = value.schedule.split('|');
				}

				if(value.lastYn == 'N') {
					$scope.unit_total += value.unit_money;
					value.lastMoney = value.unit_money;
				}
				$scope.last_total += parseInt(value.lastMoney);
				value.total = parseInt(value.lastMoney);
				if(value.freeYn == 'N') {
					value.add_vat = parseInt(value.lastMoney * 0.1);
					$scope.vat_total += value.add_vat;
				}
			});

			$ksHttp.post('EducationItemList', count_params).then(function(rs) {
				rs = JSON.parse(rs);
				$scope.education_item = rs;
				$scope.total_itm = 0;
				angular.forEach($scope.education_item, function(value, key) {
					$scope.total_itm += value.totalMoney;
					
					for(var i = 0; i < $scope.educations.length; i++) {
						if($scope.educations[i].ltCd == value.ltCd) {
							$scope.educations[i].addPrice.push(value);
							$scope.educations[i].add_total += value.totalMoney;
							$scope.educations[i].total += value.totalMoney;
							$scope.last_total += value.totalMoney;
							if(value.freeYn == 'N') {
								$scope.educations[i].add_vat += parseInt(value.totalMoney * 0.1);
								$scope.vat_total += parseInt(value.totalMoney * 0.1);
							}
							break;
						}
					}
				});
			}, function(error) {
				console.log(error);
			});
			
		}, function(error) {
			console.log(error);
		});
	};
	
	 $scope.exportEcel = function(){
			
		window.open('/excel/calcclient.do?ptCd='+ $scope.select_ptcd);
			
	}
	
	$scope.$watch('current_page', function(){
	});
 
	$scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};

	$scope.previousPageClick = function() {
		if ($scope.current_page > 1)
			$scope.current_page -= 1;
		else
			$scope.current_page = 1;
	};

	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages)
			$scope.current_page += 1;
		else
			$scope.current_page = $scope.total_pages;
	};
	
	$scope.downloadExcel = function()
	{
		$("#RefundList").table2excel({
			filename: "Refund List"
		});
	};
	
	$scope.complete = function(item)
	{
		$rootScope.showConfirm('청구료 정산을 완료하시겠습니까?', function() {
			var params = {
				saveType : 'E',
				ptCd : item.ptCd,
				cpCd : item.cpCd,
				ltCd : item.ltCd,
				total : item.unit_money,
				vat : item.add_vat,
				teacherFee : item.tuitionFee,
				lectureStartDt : item.startDt,
				lectureEndDt : item.endDt,
				lectureSchedule : item.schedule,
				lectureCnt : item.attCnt,
				lectureUnit : item.tuitionFeeUnitNm,
				lectureDay : item.scheduleDtAll,
				updUser : $rootScope.current_user.userId
			};

			$ksHttp.post('LectureComplete', params).then(function(rs) {
				rs = JSON.parse(rs);
				$scope.search();
			}, function(error) {
				console.log(error);
			});
			
		});
	}
	
	$scope.completeAll = function()
	{
		var ltCd = new Array();
		for(var i = 0; i < $scope.educations.length; i++) {
			if($scope.educations[i].completeYn != 'Y') {
				ltCd.push($scope.educations[i].ltCd);
			}
		}

		$rootScope.showConfirm('전체수업의 정산을 완료하시겠습니까?', function() {
			if(ltCd.length <= 0) {
				$rootScope.showAlert('정산 완료할 청구료가 없습니다.');
				return;
			}

			var totalCnt = ltCd.length;
			for(var i = 0; i < $scope.educations.length; i++) {
				if($scope.educations[i].completeYn != 'Y') {
					var params = {
							saveType : 'E',
							ptCd : $scope.educations[i].ptCd,
							cpCd : $scope.educations[i].cpCd,
							ltCd : $scope.educations[i].ltCd,
							total : $scope.educations[i].unit_money,
							vat : $scope.educations[i].add_vat,
							teacherFee : $scope.educations[i].tuitionFee,
							lectureStartDt : $scope.educations[i].startDt,
							lectureEndDt : $scope.educations[i].endDt,
							lectureSchedule : $scope.educations[i].schedule,
							lectureCnt : $scope.educations[i].attCnt,
							lectureUnit : $scope.educations[i].tuitionFeeUnitNm,
							lectureDay : $scope.educations[i].scheduleDtAll,
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
		$state.go('app.account.client_list');
	}
	
	$scope.delete_item = function() {
		$rootScope.showConfirm('청구료 정산을 삭제하시겠습니까?', function() {
			var params = {
				saveType : 'E',
				ptCd : $scope.select_ptcd,
				updUser : $rootScope.current_user.userId
			};

			$ksHttp.post('LectureCalcDelete', params).then(function(rs) {
				rs = JSON.parse(rs);
				$state.go('app.account.client_list');
			}, function(error) {
				console.log(error);
			});
			
		});
		
	}
}

function CustomModalController1 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.item = item;
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


function LastController ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.items = {};
	$scope.items.lastMoney = (item.lastYn == 'Y' ? item.lastMoney : item.tuitionFee * item.attCnt);
	$scope.items.lastRemark = item.lastRemark;

	$scope.save = function(){
		var params = {
				saveType : 'E',
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
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
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

function ClientInsertPopupController($scope, $timeout, $uibModalInstance, $filter, $state, $rootScope, item, $ksHttp)
{
	$scope.item = item;
	console.log(item);
	$scope.init = function(){
		$scope.getEducationList();
		$scope.date_picker();
	};

	$scope.date_picker = function(){
		$('body').on('focus',".date", function(){
			$('.date').datepicker({
				  format: 'yyyy-mm-dd',
					autoclose: true
	          });
		});
		  
	};

	$scope.getEducationList = function(){
		var count_params = {
			ptCd : item.ptCd,
			ltCd : item.ltCd
		};
					
		$ksHttp.post('EducationItemList', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.educations = rs;
			$scope.total = 0;
			angular.forEach($scope.educations, function(value, key) {
				$scope.total += value.totalMoney;
				value.checked = true;
				});
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.deleted = function(caCd){
		var params = {
				saveType : 'D',
				caCd : caCd,
				updUser : $rootScope.current_user.userId
		};
		$rootScope.showConfirm('삭제하시겠습니까?', function(){
			$ksHttp.post('EducationItemSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				$scope.getEducationList();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
	};
	
	 
	$scope.saveItem = function(item){
		
		var params = {
				saveType : 'U',
				caCd : item.caCd,
				ptCd : item.ptCd,
				ltCd : item.ltCd,
				itemCnts : item.itemCnts,
				freeYn : item.freeYn,
				cost : item.cost,
				qnty : item.qnty,
				totalMoney : item.totalMoney,
				selectDt : item.selectDt,
				regUser  : $rootScope.current_user.userId
		};
		if($scope.validateItemUpdate(item))
		{
			$ksHttp.post('EducationItemSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				$scope.getEducationList();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		}
	};
	
	$scope.setTotalMoney = function(edu){
		if(edu.cost != '' && edu.qnty != '')
		{
			edu.totalMoney = edu.cost * edu.qnty;
		}
		else
		{
			edu.totalMoney = 0;
		}
	}
	
	$scope.create = function(ltCd){
		var params = {
				saveType : 'I',
				caCd : '',
				ptCd : item.ptCd,
				ltCd : item.ltCd,
				itemCnts : $scope.itemCnts,
				freeYn : $scope.freeYn,
				cost : $scope.cost,
				qnty : $scope.qnty,
				totalMoney : $scope.totalMoney,
				selectDt : $scope.selectDt,
				regUser  : $rootScope.current_user.userId
		};
		if($scope.validateItem())
		{
			$scope.itemCnts = null;
			$scope.freeYn = null;
			$scope.cost = null;
			$scope.qnty = null;
			$scope.totalMoney = null;
			$scope.selectDt = null;
			$ksHttp.post('EducationItemSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				$scope.getEducationList();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			});
		}
	};
	
	$scope.validateItem = function()
	{
		if($scope.itemCnts == '' || $scope.itemCnts == null)
		{
			$rootScope.showAlert('사유' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.cost == '' || $scope.cost == null)
		{
			$rootScope.showAlert('단가' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.qnty == '' || $scope.qnty == null)
		{
			$rootScope.showAlert('수량' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.totalMoney == '' || $scope.totalMoney == null)
		{
			$rootScope.showAlert('금액' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.selectDt == '' || $scope.selectDt == null)
		{
			$rootScope.showAlert('일자' + '을(를) 입력해주세요');
			return false;
		}
		return true;
	}
	
	$scope.validateItemUpdate = function(x)
	{
		if(x.itemCnts == '' || x.itemCnts == null)
		{
			$rootScope.showAlert('사유' + '을(를) 입력해주세요');
			return false;
		}
		if(x.cost == '' || x.cost == null)
		{
			$rootScope.showAlert('단가' + '을(를) 입력해주세요');
			return false;
		}
		if(x.qnty == '' || x.qnty == null)
		{
			$rootScope.showAlert('수량' + '을(를) 입력해주세요');
			return false;
		}
		if(x.totalMoney == '' || x.totalMoney == null)
		{
			$rootScope.showAlert('금액' + '을(를) 입력해주세요');
			return false;
		}
		if(x.selectDt == '' || x.selectDt == null)
		{
			$rootScope.showAlert('일자' + '을(를) 입력해주세요');
			return false;
		}
		return true;
	}
	
	$scope.cancel = function()
	{
		$uibModalInstance.close();
	};

}






