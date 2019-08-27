'use strict';

app.controller('DataListController', DataListController);

function DataListController($scope, $rootScope, $ksHttp, $uibModal,$window, $stateParams) {
	$scope.lectureListBox= [];
	$scope.customerCompanyListBox= [];
	$scope.dataInfoList= [];
	$scope.dataInfo= {};
	$scope.current_page= 1;	
	
	$scope.dataInfo.shCpCd = null; 
	$scope.dataInfo.shLtCd = null;
	$scope.dataInfo.chk = false;
	
	$scope.init = function() {
		$scope.getCustomerCompanyListBox();
		$scope.getLectureListBox();
		$scope.getDataInfoCount();
	};
	
	$scope.getDataInfoList = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params ={
				shCpCd: $scope.dataInfo.shCpCd,
				shLtCd: $scope.dataInfo.shLtCd,
				startPage : start_page,
				endPage : end_page,
				exceptYn : $scope.dataInfo.chk == true ? 'Y' : 'N'
		};
		
		$ksHttp.post('DataInfoList', params).then(function(rs) {
			$scope.dataInfoList = JSON.parse(rs);
		}, function(err) {
			console.log(err);
		});
	};
	
	$scope.getDataInfoCount = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params ={
				shCpCd: $scope.dataInfo.shCpCd,
				shLtCd: $scope.dataInfo.shLtCd,
				startPage : start_page,
				endPage : end_page,
				exceptYn : $scope.dataInfo.chk == true ? 'Y' : 'N'
		};
		
		$ksHttp.post('DataInfoListCnt', params).then(function(rs) {
			rs = JSON.parse(rs)

			if(rs && rs.length > 0){
				$scope.total_cnt = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_cnt/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.$watch('current_page', function(){
		$scope.getDataInfoList();
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
	
	$scope.getCustomerCompanyListBox = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customerCompanyListBox= JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getLectureListBox = function() {
		var params = {
				cpCd: $scope.dataInfo.shCpCd
		}
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectureListBox= JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.changeChk = function(){
		if( $scope.dataInfo.chk ){
			$scope.dataInfo.shLtCd = null;
		}
	}
};