"use strict";

app.controller("AllowController", AllowController);
app.controller('ApproveController', ApproveController);
app.controller('ApproveController2', ApproveController2);
function AllowController($scope, $rootScope, $ksHttp, $uibModal, $window, $stateParams, $filter) {
	$scope.current_page = 1;
	$scope.total_allow = 0;
	$scope.total_pages = 0;
	$scope.select_teacher_list = null;
	$scope.seclec_company_list = null;
	$scope.select_lectur_list = null;
	$scope.shStartDt = null;
	$scope.shEndDt = null;
	$scope.select_approve_flag = '';
	
	$scope.init = function(){
		$scope.getTeacherListBox();
		$scope.getCustomerCompanyListBox();
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		
		var startDt = new Date();
		var endDt = new Date();		
		startDt.setDate(startDt.getDate() - 14);
		$scope.shStartDt = $filter('date')(startDt, "yyyy-MM-dd"); 
		$scope.shEndDt = $filter('date')(endDt, "yyyy-MM-dd");
		
		$scope.getAttendAbsenceListCnt();
		$scope.getAttendAbsenceList();
	};
	
	$scope.getTeacherListBox = function() {
		var params = {
		};
		$ksHttp.post('TeacherListBox', params).then(function(rs) {
			$scope.teacher_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getCustomerCompanyListBox = function() {
		var params = {
		};
		$ksHttp.post('CustomerCompanyListBox', params).then(function(rs) {
			$scope.company_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.myFunc = function(){
		var params = {
				tcCd : $scope.select_teacher_list,
				cpCd : $scope.seclec_company_list
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectur_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getAttendAbsenceListCnt = function() {
		var count_params = {
				shTcCd : $scope.select_teacher_list,
				shCpCd : $scope.seclec_company_list,
				shLtCd : $scope.select_lectur_list,
				approveFlag : $scope.select_approve_flag,
				shStartDt : $scope.shStartDt,
				shEndDt : $scope.shEndDt
			};
			
			$ksHttp.post('AttendAbsenceListCnt', count_params).then(function(rs) {
				rs = JSON.parse(rs);
				if(rs && rs.length > 0){
					$scope.total_allow = rs[0].totalcnt;
					$scope.total_pages = Math.ceil($scope.total_allow/$scope.app.page_size);
				}
			}, function(error) {
				console.error(error);
			});
	};
	
	$scope.getAttendAbsenceList = function(){
		var params = {
				shTcCd : $scope.select_teacher_list,
				shCpCd : $scope.seclec_company_list,
				shLtCd : $scope.select_lectur_list,
				approveFlag : $scope.select_approve_flag,
				shStartDt : $scope.shStartDt,
				shEndDt : $scope.shEndDt
		};
		
		$ksHttp.post('AttendAbsenceList', params).then(function(rs) {
			$scope.attend_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.exportEcel = function(){
		var config = {
				shTcCd : $scope.select_teacher_list,
				shCpCd : $scope.seclec_company_list,
				shLtCd : $scope.select_lectur_list,
				approveFlag : $scope.select_approve_flag,
				shStartDt : $scope.shStartDt,
				shEndDt : $scope.shEndDt
		};
		
		window.open('/excel/attend_absence.do?shTcCd='+ config.shTcCd + '&shCpCd=' + config.shCpCd + '&shLtCd=' + config.shLtCd +
				'&approveFlag=' + config.approveFlag + '&shStartDt=' + config.shStartDt + '&shEndDt=' + config.shEndDt);
    }
	
	$scope.$watch('current_page', function(){
		$scope.getAttendAbsenceList();
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
	
	$scope.setStartEndDt = function()
	{
		var current_lecture = null;
		if($scope.select_lectur_list)
		{
			current_lecture = $.grep($scope.lectur_list, function(x,i){return x.ltCd == $scope.select_lectur_list})[0];
			$scope.shStartDt = current_lecture.startDt;
			$scope.shEndDt = current_lecture.endDt;
		}
	}
	
	$scope.regApprove = function(item, approveFlag){
		item.changeApproveFlag = approveFlag;
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "reg_approve.html",
            controller: "ApproveController",
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
	
	$scope.showApproveCnts = function(item){
		
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "reg_approve2.html",
            controller: "ApproveController2",
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
}

function ApproveController ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	
	$scope.items = item;
	
	$scope.save = function(){		
		var params =  {
				saveType : 'A',
				acCd : $scope.items.acCd,
				atCd : $scope.items.atCd,
				approveFlag : $scope.items.changeApproveFlag,
				approveCnts : $scope.items.approveCnts,
				updUser : $rootScope.current_user.userId 
		};
		$ksHttp.post('AttendAbsenceSave', params).then(function(rs) {
			
			rs = JSON.parse(rs);
			var status = rs[0].result;
			var message = rs[0].message;
			
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			if(status == 'succ'){
				$scope.items.approveFlag = $scope.items.changeApproveFlag;
				$uibModalInstance.close();
			}
		}, function(error) {
			$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
			console.error(error);
		});
	};
	
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function ApproveController2 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	//console.log(item);
	$scope.items = {};
	$scope.items = item;

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}