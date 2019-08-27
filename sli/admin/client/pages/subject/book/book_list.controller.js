"use strict";
app.controller("BookListController", BookListController);
function BookListController($scope, $rootScope, $stateParams, $state, $uibModal, $filter, $ksHttp) {
  $scope.list_books = [];
  $scope.subjects = [];
  $scope.subject = null;
  $scope.total_books = 0;
  $scope.total_pages = 0;
  $scope.current_page = 1;
  
  $scope.init = function(){
    $scope.getSubjects();
    $scope.getBookCount();
    $scope.getListData();
  }

  $scope.getSubjects = function(){
	  var params = {			  
	  }
	  $ksHttp.post('SubjectMasterList', params)
	  	.then(function(rs){
	  		$scope.subjects = JSON.parse(rs);
	  	}, function(error){
	  		console.error(error);
	  	})
  };
  
  $scope.getBookCount = function() {
		var count_params = {
				sjCd: '',
				bookName: ''
				
			};

			$ksHttp.post('BookInfoListCnt', count_params).then(function(rs) {
				rs = JSON.parse(rs);				
				if(rs && rs.length > 0){
					$scope.total_books = rs[0].totalcnt;
					$scope.total_pages = Math.ceil($scope.total_books/$scope.app.page_size);
				}
			}, function(error) {
				console.error(error);
			});
	};
  
  $scope.getListData = function() {
	  var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
	  var end_page = $scope.current_page * $scope.app.page_size;
	  var params = {
		  sjCd: $scope.subject,
		  bookName: $scope.subject_name ? $scope.subject_name : null,
		  startPage: start_page,
		  endPage: end_page
			  
	  }
	  $ksHttp.post('BookInfoList', params)
	  	.then(function(rs){
	  		$scope.list_books = JSON.parse(rs);
	  		
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
