'use strict';
app.controller('ClientListController', ClientListController);

function ClientListController($scope, $ksHttp, $uibModal, $filter, $rootScope){
	$scope.teacherFeeList = [];
	$scope.current_page = 1;
	$scope.total_companies = 0;
	$scope.total_pages = 0;
	
	$scope.init = function(){
		$scope.getClientFeeListCount();
		$scope.getClientFeeList();
	};
	
	$scope.getClientFeeListCount = function() {
		var count_params = {
			select_complete : $scope.select_complete
		};

		$ksHttp.post('ClientFeeListCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);
				
			if(rs && rs.length > 0){
				$scope.total_list = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_list/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getClientFeeList = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			select_complete : $scope.select_complete,
			startPage : start_page,
			endPage : end_page
		}

		$ksHttp.post('ClientFeeList', params).then(function(rs) {
			$scope.teacherFeeList = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
}

