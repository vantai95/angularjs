"use strict";
app.controller("SettingController", SettingController);

function SettingController($scope, $rootScope, $ksHttp, $uibModal, $location, $state) {

	$scope.validate = function(){
		if($scope.userPw == '' || $scope.userPw == null){
			$rootScope.showAlert('비밀번호를 입력해주세요');
			return false;
		}
		
		return true;
	};
	
	$scope.getCheckPassword = function(){
		if($scope.validate()){
			var params = {
					userType : 'S',
					userId : $rootScope.current_user.userId,
					userPw : $scope.userPw
			};
			
			$ksHttp.post('CheckPassword', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status =  rs[0].result;
				
				if( status == 'succ'){
					$state.go("access.myinfo_modify");
				}else{
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$state.reload();
				}
			}, function(error){
				console.error(error);
			});
		}
	};
}