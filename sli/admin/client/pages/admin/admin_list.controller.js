"use strict";
app.controller("AdminListController", AdminListController);
app.controller("CustomModalController", CustomModalController);
function AdminListController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout) {
	$scope.total_users = 0;
	$scope.permission_groups = [];
	$scope.searchOrder = 0;
	$scope.total_pages = 0;
	$scope.current_page = 1;
	
	$scope.init = function(){
		$scope.getAdminList();
		$scope.getAdminListcnt();
	}
	
	$scope.searchOrders = [
	                      {key: 1, value:'그룹명순'},
	                      {key: 2, value:'등록일순'},
	                      {key: 3, value:'이름순'},
	                     ];
	$scope.searchOrder = $scope.searchOrders[0].key;
	
	$scope.getAdminList = function(){
		var params = {
				startPage: 1,
				endPage: 20,
				searchOrder : $scope.searchOrder
		};
		$ksHttp.post('AdminUserList', params).then(function(rs){
			$scope.permission_groups = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	}
	
	$scope.getAdminListcnt = function(){
		var params = {
				searchOrder : $scope.searchOrder
		};
		$ksHttp.post('AdminUserListCnt', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.total_users = rs[0].totalcnt;
		}, function(error){
			console.error(error);
		});
	}
	
	$scope.deleteUser = function(id){
		$rootScope.showConfirm('해당 관리자를 삭제 하시겠습니까?', function() {
			var params = {
					saveType : 'D',
					userId : id,
					updUser : $rootScope.current_user.userId
			};
			$ksHttp.post('AdminUserSave', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$scope.getAdminList();
			}, function(error){
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	}
	
	$scope.openPopup = function(user_id, ar_cd){
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "custom_modal.html",
            controller: "CustomModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            	user_id : function(){
            		return user_id;
            	}
        		,ar_cd : function(){
            		return ar_cd;
            	}
            }
        });
        
        modalInstance.result.then(function(result) {
        	$scope.getAdminList();
    		$scope.getAdminListcnt();
        }, function(err) {
            console.info(err);
        });
      
    };
    $scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};

	$scope.previousPageClick = function() {
		if ($scope.current_page > 1)
			$scope.current_page -= 1;
		else
			$scope.current_page = 1;
	};

	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages)
			$scope.current_page += 1;
		else
			$scope.current_page = $scope.total_pages;
	};
	
}
function CustomModalController ($ksHttp, $scope, $rootScope , $uibModalInstance, user_id, ar_cd) {
	$scope.user_id = user_id;
	$scope.selected_group = ar_cd;
	
    $ksHttp.post('AdminGroupList', {}).then(function(rs){
			$scope.permission_group = JSON.parse(rs);
			
		}, function(error){
			console.error(error);
		})
    
    $scope.ok = function () {
        var params = {
    			saveType : 'C',
        		userId: $scope.user_id,
        		arCd : $scope.selected_group,
        		updUser: $rootScope.current_user.userId
        }; 
        
        $ksHttp.post('AdminUserSave', params).then(function(rs){
        	rs = JSON.parse(rs);
			var message = rs[0].message;
			var status = rs[0].result;
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			$uibModalInstance.close({user_id: $scope.user_id});
        }, function(error){
        	$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
        	console.error(error);
        })
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};