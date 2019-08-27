'use strict';
app.controller('studentQNADetailController', StudentQNADetailController);

function StudentQNADetailController($scope, $http, $stateParams, $uibModal, $ksHttp, $state, $rootScope) {
	$scope.current_page = 1;
	$scope.total_support_centers = 0;
	$scope.init = function() {
		if (!$stateParams.id || $stateParams.id == '') {
			$state.go("app.student_qna.list",{},{reload: true});
		} else {
			$scope.getSupportCenter();
		}
	};

	$scope.getSupportCenter = function()
    {
		var params = {
			scCd : $stateParams.id
		}
        $ksHttp.post('SupportCenterDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.support_center = rs[0];
		}, function(error) {
			console.error(error);
		});
	}

	$scope.saveSupportCenter = function()
	{
		var params = {
			saveType : 'A',
			scCd : $scope.support_center.scCd ? $scope.support_center.scCd : 0,
			answerCnts : $scope.support_center.answerCnts ? $scope.support_center.answerCnts : null,
			updUser : $rootScope.current_user.userId
		}
		$ksHttp.post('SupportCenterSave', params).then(function(rs) {
			rs = JSON.parse(rs);
			var status = rs[0].result;
			var message = rs[0].message;
			if(status == 'succ')
			{
				$rootScope.showAlert('등록되었습니다');
				$state.go("app.student_qna.view", {id: $stateParams.id});
			}
			else
			{
				$rootScope.showMessage($rootScope.getMessageType(status), message); 
				$state.reload();
			}
		}, function(error) {
			$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
			console.error(error);
		});
	};

	$scope.deleteSupportCenter = function()
	{
		var params = {
			saveType : 'D',
			scCd : $scope.support_center.scCd,
		}
		$rootScope.showConfirm('게시물을 삭제하겠습니까?', function(){
			$ksHttp.post('SupportCenterSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				if(status == 'succ')
				{
					$rootScope.showAlert(rs[0].message);
					$state.go("app.student_qna.list", {id: $stateParams.id});
				}
				else
				{
					$rootScope.showMessage($rootScope.getMessageType(status), message); 
					$state.reload();
				}
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	};

	$scope.apply_cancel = function(){
		$rootScope.showConfirm('답변 작성을 취소하겠습니까?', function(){
			$state.go('app.student_qna.view',{id: $stateParams.id});
		});
	};
};

