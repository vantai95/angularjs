"use strict";

app.controller("StudentViewController", StudentViewController);
function StudentViewController($scope, $rootScope, $ksHttp, $uibModal, $state, $stateParams) {
	$scope.id =$stateParams.id;
	
	$scope.init = function(){
		if(!$stateParams.id){
            $state.go("app.student.student_help");
        } else{
            $scope.getSupportCenterDetail($stateParams.id);
        }
	};
	
	$scope.getSupportCenterDetail = function(id){
		var params = {
			scCd : id
		};
		
		$ksHttp.post('SupportCenterDetail', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.support_detail = rs[0];
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getUpdateSupportCenterSave = function(){
		
		if ($scope.validate()) {
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				
				var params = {
						saveType  : 'U',
						scCd : $scope.id, 
						inquiryTitle : $scope.support_detail.inquiryTitle,
						inquiryCnts : $scope.support_detail.inquiryCnts,
						updUser : $rootScope.current_user.userId
				};
				
				$ksHttp.post('SupportCenterSave', params).then(function(rs){
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status =  rs[0].result;
					
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.student.student_help") : $state.reload();
				}, function(error){
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				})
			});
		}
	};
	
	$scope.getDeleteSupportCenterSave = function(){
		$rootScope.showConfirm('삭제하시겠습니까?', function() {
			var params = {
					saveType  : 'D',
					scCd : $scope.id,
					updUser : $rootScope.current_user.userId
			};
			
			$ksHttp.post('SupportCenterSave', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				status == 'succ' ? $state.go("app.student.student_help") : $state.reload();
			}, function(error){
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});		
	};
	
	
	$scope.validate = function() {
		
		if( $scope.support_detail.inquiryTitle == undefined || $.trim($scope.support_detail.inquiryTitle) == ""){
			$rootScope.showAlert('제목을 입력해주세요.');
			return false;
		}
		if( $scope.support_detail.inquiryCnts == undefined || $.trim($scope.support_detail.inquiryCnts) == ""){
			$rootScope.showAlert('내용을 입력해주세요.');
			return false;
		}

		return true;
	};
}