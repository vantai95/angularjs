'use strict';

app.controller('teacherCertificationController', TeacherCertificationController);
app.controller('teacherCertificationPoupController', TeacherCertificationPoupController);



function TeacherCertificationController($scope, $rootScope, $ksHttp, $uibModal) {
    console.info('teacherCertificationController');

    $scope.openPopup = function(){
        var modalInstance = $uibModal.open({
            templateUrl	: 'popup',
            controller	: 'teacherCertificationPoupController',
            windowClass: 'app-modal-window',
            scope		: $scope,
            resolve		: {
                items: function() {
                    return $scope.modalItems;
                }
            }
        });
        
        modalInstance.result.then(function (result) {
           console.info(result);
        }, function (err) {
          console.info(err)
       });
    }
    $scope.openPopup2 = function(){
        var modalInstance = $uibModal.open({
            templateUrl	: 'popup2',
            controller	: 'teacherCertificationPoupController',
            windowClass: 'app-modal-window',
            scope		: $scope,
            resolve		: {
                items: function() {
                    return $scope.modalItems;
                }
            }
        });
        
        modalInstance.result.then(function (result) {
           console.info(result);
        }, function (err) {
          console.info(err)
       });
    }
    $scope.openPopup3 = function(){
        var modalInstance = $uibModal.open({
            templateUrl	: 'popup3',
            controller	: 'teacherCertificationPoupController',
            windowClass: 'app-modal-window',
            scope		: $scope,
            resolve		: {
                items: function() {
                    return $scope.modalItems;
                }
            }
        });
        
        modalInstance.result.then(function (result) {
           console.info(result);
        }, function (err) {
          console.info(err)
       });
    }
}

function TeacherCertificationPoupController(){
    console.info('TeacherCertificationPoupController');
}