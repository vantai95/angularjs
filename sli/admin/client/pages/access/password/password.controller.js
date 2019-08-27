'use strict';

app.controller('passwordController', PasswordController);

function PasswordController($scope, $rootScope, $state, $uibModal,$window, $ksHttp) {
	$scope.userId = '';
	$scope.userEmail = '';
	
    $scope.submitPassword = function () {
  	  	var params = {
  			"userId" : $scope.userId,
  			"userEmail" : $scope.userEmail,
  			"result" : '',
  			"message" : '',
    		"company":"sli",
    		"project":"admin",
    		"packageName":"kr.co.sliedu.admin"
  		};
	  	
  	  	$ksHttp.post('NewPassword', params).then(function(rs) {
			  console.log(rs);
			  $scope.userId = '';
			  $scope.userEmail = '';
			  if(rs.result == 'succ') {
				  $rootScope.showAlert(rs.message);
				  $state.go("access.login")
			  }
			  else {
				  $rootScope.showAlert(rs.message);
//				  $rootScope.showMessage('error', rs.message);
			  }
		  }, function(error) {
				console.error(error);
		  });
    	
    };
}