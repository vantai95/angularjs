"use strict";

app.controller("StudentHelpController", StudentHelpController);
function StudentHelpController($scope, $rootScope, $ksHttp, $uibModal, $state) {
	
	$scope.current_page = 1;
	$scope.total_support = 0;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.support_list = [];
	
	$scope.init = function(){
		$scope.getSupportCenterListCnt();
	};
	
	$scope.getSupportCenterListCnt = function(){
		var params = {
				userId : $rootScope.current_user.userId,
				studentYn : $rootScope.current_user.accessYn
				
		};
		$ksHttp.post('SupportCenterListCnt', params).then(function(rs){
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.total_support = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_support
						/ $scope.app.page_size);

			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getSupportCenterList = function(){
		
		var params = {
				userId : $rootScope.current_user.userId,
				studentYn : $rootScope.current_user.accessYn,
				startPage : $scope.startPage,
				endPage : $scope.endPage
		};
		
		$ksHttp.post('SupportCenterList', params).then(function(rs){
			rs = JSON.parse(rs);			
			if( $scope.support_list.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.support_list.push(rs[i]);
				}
			}else{
				$scope.support_list = rs;
			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.moveDetail = function(answerYn, scCd) {
		
		if( answerYn == 'Y'){
			$state.go("app.student.student_help_comment", {id: scCd});
		}else{
			$state.go("app.student.student_help_view", {id: scCd});
		}
	};
	
	$scope.$watch('current_page', function(){
		$scope.getSupportCenterList();
	});
	
	$scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};

	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages){
			$scope.current_page += 1;
			$scope.startPage = ($scope.current_page * $scope.app.page_size) - 9;
			$scope.endPage = $scope.current_page * $scope.app.page_size;
			
		}else{
			$scope.current_page = $scope.total_pages;
			$rootScope.showAlert('더 이상 목록이 존재하지 않습니다.');
			$(".btnMoreList").hide();
		}
	};
}
