"use strict";
app.controller("MyLectureController", MyLectureController);
app.controller("CustomModalController", CustomModalController);
function MyLectureController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout) { 
	
	$scope.openPopup = function(){
		console.log(1);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "popup",
            controller: "CustomModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            }
        });
        
        modalInstance.result.then(function(result) {
        }, function(err) {
            console.info(err);
        });
      
    };
}

function CustomModalController ($ksHttp, $scope, $rootScope , $uibModalInstance) {
	
}