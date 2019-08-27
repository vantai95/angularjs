'use strict';

app.controller('MySettingController', MySettingController);

function MySettingController($scope,$state, $rootScope, $ksHttp, $stateParams) {
	
	$scope.userPw = null;
	$scope.userId = null;
	$scope.userType = null;
	console.log('MySettingController');
	$scope.init = function() {
		if ($rootScope.current_user) {
			$scope.userId = $rootScope.current_user.userId;
		}
	}

	$scope.validate = function() {

		if ($.trim($scope.userPw) == '') {
			$rootScope.showAlert('비밀번호를 입력해주세요.');
			return false;
		}
		return true;
	};

	$scope.checkPassword = function() {
		if ($scope.validate()) {
			var params = {
				userType : 'T',
				userId : $scope.userId,
				userPw : $scope.userPw
			};

			$ksHttp.post('CheckPassword', params).then(function(rs) {
				rs = JSON.parse(rs);
				//console.log(rs);
				if(rs != null && rs[0].result == 'fail'){
					$rootScope.showAlert(rs[0].message);
				}
				else{
					$state.go("access.myinfo_modify");
				}
			}, function(error) {
				console.error(error);
			}); 
				
		};
	}

}