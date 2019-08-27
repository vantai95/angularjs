"use strict";

app.controller("NoticeInsertController", NoticeInsertController);

function NoticeInsertController($scope, $rootScope, $state, $stateParams, $ksHttp, $uibModal) {
	$scope.notice_types = [];
	$scope.companies = [];
	$scope.accountings = [];
	$scope.notice_type = null;
	$scope.company = null;
	$scope.notice = { showYn: 'N'};
	$scope.notice_id = null;
	
	$scope.notice.notiType = null;
	$scope.notice.showRegNm = null;
	$scope.notice.cpCd = null;
	$scope.notice.notiTitle = null;
	$scope.notice.notiContents = [];
	$scope.notice.showDtYn = null;
	$scope.notice.showStartDt = null;
	$scope.notice.showEndDt = null;

	$scope.init = function() {
		if ($stateParams.id) {
			$scope.notice_id = $stateParams.id;
			$scope.getNotice();
		}
		$(".date").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");

		$scope.getNoticeTypes();
		$scope.getCompamies();
	};

	 $scope.getNotice = function() {
		var params = {
			ntCd : $scope.notice_id
		};
		
		$ksHttp.post('NoticeInfoDetail', params).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.notice = rs[0];
				$scope.notice.showStartDt = !$scope.notice.showStartDt ? '' : moment($scope.notice.showStartDt, 'YY-MM-DD').format('YYYY-MM-DD');
				$scope.notice.showEndDt = !$scope.notice.showEndDt ? '' : moment($scope.notice.showEndDt, 'YY-MM-DD').format('YYYY-MM-DD');
				
				$scope.setDefaultDt($scope.notice.showStartDt, $scope.notice.showEndDt);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getNoticeTypes = function() {
		var params = {
			groupId : 'NOTI_TYPE'
		};
		
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.notice_types = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getCompamies = function() {
		$ksHttp.post('CustomerCompanyList', {}).then(function(rs) {
			$scope.companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.validate = function(){
		var obj = $scope.notice;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.notiType) == ''){
			$rootScope.showAlert('구분' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.showRegNm) == ''){
			$rootScope.showAlert('작성자' + required_msg.textbox);
			return false;
		}
		
		if (!$stateParams.id) {
			if($.trim(obj.cpCd) == ''){
				$rootScope.showAlert('고객사' + required_msg.dropdown);
				return false;
			}
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
	
	$scope.generateNoticeParams = function(){
		return {
			notiSort: 'N',
			notiType: $scope.notice.notiType,
			showRegNm: $scope.notice.showRegNm,
			cpCd: $scope.notice.cpCd,
			notiTitle: $scope.notice.notiTitle,
			notiContents: $scope.notice.notiContents,
			showYn: $scope.notice.showYn,
			showDtYn: $scope.notice.showDtYn,
			showStartDt: $scope.notice.showStartDt,
			showEndDt: $scope.notice.showEndDt
		};
	};

	$scope.saveNotice = function() {
		if($scope.validate()){
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateNoticeParams();
				params.saveType = 'I';
				params.regUser = $rootScope.current_user.userId;
				$ksHttp.post('NoticeInfoSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.notice.list") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
		
	};

	$scope.updateNotice = function() {
		if($scope.validate()){
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params = $scope.generateNoticeParams();
				params.ntCd = $scope.notice_id;
				params.saveType = 'U';
				params.updUser = $rootScope.current_user.userId;
				$ksHttp.post('NoticeInfoSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.notice.list") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
		
	};
	
	$scope.cancelUpdating = function() {
		var msg = $scope.notice_id ? '편집을 취소 하시겠습니까?' : '등록을 취소 하시겠습니까?';
		$rootScope.showConfirm(msg, function() {
			$state.go("app.notice.list");
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

