'use strict';

app.controller('LoginController', LoginController);

function LoginController($scope, $rootScope, $state, $ksHttp, $uibModal, $location, $sessionStorage) {
    $scope.login = function() {
  	  if($.trim($scope.username) == '') {
  		  $rootScope.showAlert("아이디를 입력해 주세요.");
  		  return;
  	  }
  	  
  	  if($.trim($scope.password) == '') {
  		  $rootScope.showAlert("비밀번호를 입력해 주세요.");
  		  return;
  	  }
  	  
  	  var params = {
  		"userType" : "T",
  		"account" : $scope.username,
  		"password" : $scope.password,
  		"externalLogin" : true,
  		"homeURL" : '/Sites/sli/teacher/client/index.html#!/app/index/dashboard',
		"company":"sli",
		"project":"teacher"
  	  };
  		
  	  $.ajax({
  			type : 'POST',
  			url : '/PublicApp/SignIn',
  			data : params,
  			dataType:"json",
  			success : function(data, textStatus, jqXHR) {
  				if(data.value.result == 'fail') {
  					$rootScope.showAlert(data.value.loginModel.message);
  				}
  				else {
  					$state.go("app.index.dashboard")
  					$sessionStorage.loginModel = data.value.loginModel; 
  				}
//  				$sessionStorage.loginModel = data.value. 
  			}, 
  			error : function(jqXHR, textStatus, errorThrown){
  				$rootScope.showMessage('error', '오류가 발생했습니다.');
  				console.log(jqXHR);
  				return false;
  			}
  		});
    };
}