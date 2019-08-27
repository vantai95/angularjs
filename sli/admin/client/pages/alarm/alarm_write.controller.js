'use strict';

app.controller('AlarmWriteController', AlarmWriteController);

function AlarmWriteController($scope, $rootScope, $ksHttp, $uibModal, $window, $state, $stateParams) {
	$scope.lectures = [];
	$scope.customer_companies = [];
	$scope.teachers = [];
	$scope.alarms = [];
	$scope.alarm = {showDtYn: 'N'};
	$scope.alarm.tcCd = null;
	$scope.alarm.cpCd = null;
	$scope.alarm.ltCd = null;
	$scope.alarm.notiType = null;
	$scope.alarm.showRegNm = null;
	$scope.alarm.notiTitle = null;
	$scope.alarm.notiContents = null;
	$scope.alarm.showYn = null;
	$scope.alarm.showDtYn = null;
	$scope.alarm.showStartDt = null;
	$scope.alarm.showEndDt = null;
	$scope.alarm.ntCd = null;
	

	$scope.init = function() {

		if ($stateParams.id) {
			$scope.alarm_id = $stateParams.id;
			$scope.getAlarm($scope.alarm_id);
		}
		else{
			$scope.alarm.reqUser= $rootScope.current_user.userId;
		}
		$scope.getCustomerCompany();
		$scope.getTeacher();
		$scope.getNotiType();
		$scope.changeOption();
		$(".date").datepicker({
			format : "yy-mm-dd",
			autoclose: true
		});
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
	};

	$scope.getNotiType = function() {
		$ksHttp.post('CodeList', {
			groupId : 'NOTI_TYPE'
		}).then(function(rs) {
			$scope.noti_types = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getCustomerCompany = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getTeacher = function() {
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.changeOption = function() {
		var params = {
			tcCd : $scope.alarm.tcCd,
			cpCd : $scope.alarm.cpCd
		};
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectures = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.validate = function(){
		var obj = $scope.alarm;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.notiType) == ''){
			$rootScope.showAlert('구분' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.showRegNm) == ''){
			$rootScope.showAlert('작성자' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.tcCd) == ''){
			$rootScope.showAlert('강사명' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.cpCd) == ''){
			$rootScope.showAlert('고객사명' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.ltCd) == ''){
			$rootScope.showAlert('강의명' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.notiTitle) == ''){
			$rootScope.showAlert('제목' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.notiContents) == ''){
			$rootScope.showAlert('내용' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.showDtYn) == 'Y' && ($.trim(obj.showStartDt) == '' || $.trim(obj.showEndDt) == '')){
			$rootScope.showAlert('노출설정' + required_msg.textbox);
			return false;
		}
		
		return true;
	};
	
	$scope.generateParams = function() {
		return {
			notiSort : 'C',
			tcCd : $scope.alarm.tcCd,
			ltCd : $scope.alarm.ltCd,
			cpCd : $scope.alarm.cpCd,
			notiType : $scope.alarm.notiType,
			showRegNm : $scope.alarm.showRegNm,
			notiTitle : $scope.alarm.notiTitle,
			notiContents : $scope.alarm.notiContents,
			showYn : $scope.alarm.showYn == null ? "N" : $scope.alarm.showYn,
			showDtYn : $scope.alarm.showDtYn,
			showStartDt : $scope.alarm.showStartDt,
			showEndDt : $scope.alarm.showEndDt
		}

	}

	$scope.saveAlarm = function() {
		if($scope.validate()){
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params= $scope.generateParams();
				params.saveType= 'I';
				params.regUser = $scope.alarm.reqUser;
				$ksHttp.post('NoticeInfoSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go('app.alarm.list') : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
				
			}, function(error) {
				$rootScope.showMessage('danger', error);
				console.log(error);
			});
		}
		
	};
	
	$scope.getAlarm= function(id){
		$ksHttp.post('NoticeInfoDetail', {ntCd: id}).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.alarm = rs[0];			
			$scope.alarm.showStartDt = !$scope.alarm.showStartDt ? '' : moment($scope.alarm.showStartDt, 'YY-MM-DD').format('YYYY-MM-DD');
			$scope.alarm.showEndDt = !$scope.alarm.showEndDt ? '' : moment($scope.alarm.showEndDt, 'YY-MM-DD').format('YYYY-MM-DD');
			
			$scope.setDefaultDt($scope.alarm.showStartDt, $scope.alarm.showEndDt);
			
		}, function(error) {
			console.log(error);
		});
		
	};

	$scope.updateAlarm = function() {
		if($scope.validate()){
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params= $scope.generateParams();
				params.saveType= 'U';
				params.updUser= $rootScope.current_user.userId;
				params.ntCd= $scope.alarm.ntCd;

				$ksHttp.post('NoticeInfoSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go('app.alarm.list') : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
			});
		}
	};
	
	$scope.cancelUpdating = function() {
		var msg = $scope.lecture_id ? '편집을 취소 하시겠습니까?' : '등록을 취소 하시겠습니까?';
		$rootScope.showConfirm(msg, function() {
			$state.go("app.alarm.list");
		});
	};
	
	$scope.setDefaultDt = function(strDt, endDt ){		
		var strArr, endArr, newStrDt, newEndDt;
		
		if( undefined != strDt && "" != strDt){
			strArr = strDt.split("-");
			newStrDt = new Date(strArr[0], Number(strArr[1])-1, strArr[2]);
			$(".dateStr").datepicker('setDate', newStrDt);			
		}
		
		if( undefined != endDt && "" != endDt){
			endArr = endDt.split("-");
			newEndDt = new Date(endArr[0], Number(endArr[1])-1, endArr[2]);
			$(".dateEnd").datepicker('setDate', newEndDt);
		}		
	}
};