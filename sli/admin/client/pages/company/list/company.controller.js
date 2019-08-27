"use strict";

app.controller("CompanyController", CompanyController);
function CompanyController($scope, $rootScope, $ksHttp, $uibModal, $window, $stateParams) {
	$scope.member_modes = [];
	$scope.company_types = [];
	$scope.companies = [];
	$scope.member_mode = null;
	$scope.company_type = null;
	$scope.current_page = 1;
	$scope.total_companies = 0;
	$scope.total_pages = 0;

	$scope.init = function() {
		$scope.getMemberMode();
		$scope.getCompanyTypes();
		$scope.getCompanyCount();
		$scope.getCompanies();
	};

	$scope.getMemberMode = function() {
		var params = {
			groupId : 'COMP_STATUS'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.member_modes = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getCompanyTypes = function() {
		var params = {
			groupId : 'COMP_TYPE'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.company_types = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getCompanyCount = function() {
		var count_params = {
				compType : $scope.company_type,
				compStatus : $scope.member_mode
			};

			$ksHttp.post('CustomerCompanyCnt', count_params).then(function(rs) {
				rs = JSON.parse(rs);
				
				if(rs && rs.length > 0){
					$scope.total_companies = rs[0].totalCnt;
					$scope.total_pages = Math.ceil($scope.total_companies/$scope.app.page_size);
				}
			}, function(error) {
				console.error(error);
			});
	};

	$scope.getCompanies = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			compType : $scope.company_type,
			compStatus : $scope.member_mode,
			startPage : start_page,
			endPage : end_page
		}

		$ksHttp.post('CustomerCompanyList', params).then(function(rs) {
			$scope.companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.$watch('current_page', function(){
		$scope.getCompanies();
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
