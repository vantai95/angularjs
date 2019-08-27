"use strict";
app.controller("VideoListController", VideoListController);
function VideoListController($scope, $rootScope, $stateParams, $state, $uibModal, $filter, $ksHttp) {
  $scope.filter = {};
  $scope.filter.cpCd = null;
  $scope.filter.ltCd = null;
  
  $scope.list_video = [];
  $scope.subjects = [];
  $scope.subject = null;
  $scope.total_video = 0;
  $scope.total_pages = 0;
  $scope.current_page = 1;
  
  $scope.init = function(){
	$scope.getCustomerCompanies();
	$scope.getLectures();
    $scope.getVideoCount();
    $scope.getListData();
  }

  $scope.getCustomerCompanies = function() {
	  $ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
		  $scope.customer_companies = JSON.parse(rs);
	  }, function(error) {
		  console.error(error);
	  });
  };
  
  $scope.getLectures = function() {
	  var params = {
			  cpCd : $scope.filter.cpCd
	  };
	  $ksHttp.post('LectureListBox', params).then(function(rs) {
		  $scope.lectures = JSON.parse(rs);
	  }, function(error) {
		  console.error(error);
	  });
  };

  $scope.getVideoCount = function() {
		var count_params = {
				cpCd: $scope.filter.cpCd,
				ltCd: $scope.filter.ltCd			
		};
		
		$ksHttp.post('LectureVideoCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);				
			if(rs && rs.length > 0){
				$scope.total_video = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_video/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
  };
  
  $scope.getListData = function() {
	  var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
	  var end_page = $scope.current_page * $scope.app.page_size;
	  var params = {
			  cpCd: $scope.filter.cpCd,
			  ltCd: $scope.filter.ltCd,
			  startPage: start_page,
			  endPage: end_page			  
	  }
	  $ksHttp.post('LectureVideoList', params)
	  	.then(function(rs){
	  		$scope.list_video = JSON.parse(rs);
	  		
	  	}, function(error){
	  		console.error(error);
	  	})
  };
  
  $scope.$watch('current_page', function(){
		$scope.getListData();
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
