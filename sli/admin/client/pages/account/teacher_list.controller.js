'use strict';
app.controller('TeacherListController', TeacherListController);

function TeacherListController($scope, $ksHttp, $uibModal, $filter, $rootScope){
	$scope.teacherFeeList = [];
	$scope.current_page = 1;
	$scope.total_companies = 0;
	$scope.total_pages = 0;
	
	$scope.init = function(){
		$scope.getTeacherFeeListCount();
		$scope.getTeacherFeeList();
	};
	
	$scope.getTeacherFeeListCount = function() {
		var count_params = {
			select_complete : $scope.select_complete
		};

		$ksHttp.post('TeacherFeeListCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);
				
			if(rs && rs.length > 0){
				$scope.total_list = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_list/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getTeacherFeeList = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			select_complete : $scope.select_complete,
			startPage : start_page,
			endPage : end_page
		}

		$ksHttp.post('TeacherFeeList', params).then(function(rs) {
			$scope.teacherFeeList = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
}

