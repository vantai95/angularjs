"use strict";

app.controller("StudentController", StudentController);
function StudentController($scope, $rootScope, $ksHttp, $uibModal, $state) {
	
	$scope.init = function(){
		$scope.getType();
	};
	
	$scope.getType = function(){
		var params = {
			groupId : 'INQUIRY_TYPE'	
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.type_inquiry = rs;
			console.log(rs);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getSupportCenterSave = function(){
		
		if ($scope.validate()) {
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = {
						saveType : 'I',
						inquiryType : $scope.select_type,
						inquiryTitle : $scope.inquiryTitle,
						inquiryCnts : $scope.inquiryCnts,
						regUser : $rootScope.current_user.userId
					};
					
				$ksHttp.post('SupportCenterSave', params).then(function(rs){
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var result =  rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(result), message);
					status == 'succ' ?  $state.reload() : $state.go("app.student.student_help") ;
				}, function(error){
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}		
	};
	
	$scope.validate = function() {
		
		if( $scope.select_type == undefined ){
			$rootScope.showAlert('구분을 선택해주세요.');
			return false;
		}
		if( $scope.inquiryTitle == undefined || $.trim($scope.inquiryTitle) == ""){
			$rootScope.showAlert('제목을 입력해주세요.');
			return false;
		}
		if( $scope.inquiryCnts == undefined || $.trim($scope.inquiryCnts) == ""){
			$rootScope.showAlert('내용을 입력해주세요.');
			return false;
		}
		return true;
	};
}