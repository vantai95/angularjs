'use strict';

app.controller('teacherCertificationController', TeacherCertificationController);

TeacherCertificationPoupController.$inject = ['$scope', '$modalInstance', 'items'];
app.controller('teacherCertificationPoupController', TeacherCertificationPoupController);

//필요시 버전 참조 http://angular-ui.github.io/bootstrap/versioned-docs/0.14.3/
var modalConfig = {
    backdrop: 'static',
    animation: false, // false : popup 노출 시 애니메이션 효과 없음
    windowClass: 'app-modal-window',
    controller: 'teacherCertificationPoupController'
};
          

function TeacherCertificationController($scope, $rootScope, $ksHttp,$modal) {
    console.info('teacherCertificationController');
    
    function fnOpenPopup(tempUrl, wClass, ctrl, popupItems){
        var config = angular.copy(modalConfig);
        
        if(typeof ctrl != "undefined" && ctrl != null){
            config.controller = ctrl;
        }
        
        if(typeof wClass != "undefined" && wClass != null){            
            config.windowClass = wClass;
        }
        
        config.templateUrl = tempUrl;        
        config.scope = $scope;
        config.resolve = {
            items: function() {
                return popupItems;
            }
        };
        
        var modalInstance = $modal.open(config);
        
        modalInstance.result.then(function (result) {
           console.info(result);
        }).catch(function (err) {
          console.info(err)
       });
    }
    
    $scope.openPopup = function(){
        // templateUrl, windowClass, controller, popupItems
        fnOpenPopup('popup', 'app-modal-window');
    }
    
    $scope.openPopup2 = function(){        
        // templateUrl, windowClass, controller, popupItems
        fnOpenPopup('popup2', 'app-modal-window');
    }
    
    $scope.openPopup3 = function(){
        // templateUrl, windowClass, controller, popupItems
        fnOpenPopup('popup3', 'app-modal-window');
    }
    $scope.openPopup4 = function(){
        // templateUrl, windowClass, controller, popupItems
        fnOpenPopup('popup4', 'app-modal-window');
    }
    $scope.openPopup5 = function(){
        // templateUrl, windowClass, controller, popupItems
        fnOpenPopup('popup5', 'app-modal-window');
    }
}

function TeacherCertificationPoupController($scope, $modalInstance, items){
    console.info('TeacherCertificationPoupController');

    $scope.cancel = function () {
      console.info('click => cancel');
      $modalInstance.dismiss('popup close cancel');
    };
}