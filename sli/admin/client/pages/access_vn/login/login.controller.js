"use strict";
app.controller("LoginController", LoginController);

function LoginController($scope, $rootScope, $state, $ksHttp, $uibModal, $location) {
  $scope.user_info = null;

  $scope.getUserInfo = function() {
    // Call api to get user info from server
    $scope.user_info = {username: 'test', password: '123456'};
  };

  $scope.login = function() {
    $scope.getUserInfo();
    
    if ($.trim($scope.username) != '' && $.trim($scope.password) != '' && $scope.user_info){
      $state.go("app.company.list");
    }else {
      $rootScope.showAlert("등록된 아이디 또는 비밀번호와 일치하지 않습니다");
    }
  };
};

