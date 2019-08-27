"use strict";

app.controller("CodeController", CodeController);
function CodeController($scope, $rootScope, $ksHttp, $uibModal, $window, $stateParams) {
	$scope.codeGroupList = [];
	$scope.groupName = null;
	$scope.groupDesc = null;
	
	$scope.current_page = 1;
	$scope.total_code_list = 0;
	$scope.total_pages = 0;

	$scope.init = function() {
		$scope.getCodeGroupListCnt();
		$scope.getCodeGroupList();
	};
	
	$scope.getCodeGroupListCnt = function() {
		var params = {
				groupName : $scope.groupName,
				groupDesc : $scope.groupDesc
			};

		$ksHttp.post('CodeGroupListCnt', params).then(function(rs) {
			rs = JSON.parse(rs);
			
			if(rs && rs.length > 0){
				$scope.total_code_list = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_code_list/$scope.app.page_size);
			}
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getCodeGroupList = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			groupName : $scope.groupName,
			groupDesc : $scope.groupDesc,
			startPage : start_page,
			endPage : end_page
		}

		$ksHttp.post('CodeGroupList', params).then(function(rs) {
			$scope.codeGroupList = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.$watch('current_page', function(){
		$scope.getCodeGroupList();
	});
   
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
