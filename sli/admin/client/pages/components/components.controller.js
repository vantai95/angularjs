"use strict";
app.controller("ComponentsController", ComponentsController);
app.controller("CustomModalController", CustomModalController);

function ComponentsController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout) {
    $scope.api_data = null;
    $scope.api_error = null;

    $scope.testApi = function(){
        var params = {
          startPage: 1,
          endPage: 20,
          userId: 'hong'
        };
  
        $ksHttp.post('AdminUserList', params, function(rs){
          console.log(rs);
          $timeout(function(){
            $scope.api_data = rs;
          });
        }, function(err){
          console.log(err);
          $timeout(function(){
            $scope.api_error = err;
          });
        });
    };

    $scope.data = [{id: 1, name: 'Name 1'},
                    {id: 2, name: 'Name 2'},
                    {id: 3, name: 'Name 3'},
                    {id: 4, name: 'Name 4'},
                    {id: 5, name: 'Name 5'}]

    $scope.showCustomModal = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "custom_modal.html",
            controller: "CustomModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
              items: function() {
                return $scope.data;
              }
            }
        });
        
        modalInstance.result.then(function(result) {
            // recieve returned data
            console.info(result);
        }, function(err) {
            console.info(err);
        });
    }
};

function CustomModalController ($scope, $uibModalInstance, items) {
    $scope.items = items;
    $scope.selected_item = null;

    $scope.selectItem = function(item){
        $scope.selected_item = item;
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected_item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};
