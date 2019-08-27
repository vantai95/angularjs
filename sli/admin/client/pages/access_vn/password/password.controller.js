'use strict';

app.controller('passwordController', PasswordController);

function PasswordController($scope, $rootScope, $state, $uibModal,$window) {
    $scope.user_info = null;

    $scope.getUserInfo = function () {
        // Call api to get user_info from server by user_name & email
        $scope.user_info = {username: 'test', email: 'test@gmail.com'};
    };

    $scope.submitPassword = function () {
        $scope.getUserInfo();

        if ($.trim($scope.username) != '' && $.trim($scope.password) != '' 
            && $.trim($scope.email) != '' && $scope.user_info) {
            $rootScope.showMessage('success', '등록된 이메일로 임시비밀번호가 발송되었습니다.!');
            $state.go('access.login');
        } else {
            $rootScope.showAlert('등록된 정보가 일치하지 않습니다.');
        }
    };
}