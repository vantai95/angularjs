'use strict';

app.controller('AlarmListController', AlarmListController);

function AlarmListController($scope, $rootScope, $ksHttp, $uibModal,$window, $stateParams) {
	$scope.lectureListBox= [];
	$scope.customerCompanyListBox= [];
	$scope.teacherListBox= [];
	$scope.noticeInfoList= [];
	$scope.current_page= 1;
	$scope.noticeInfo= {};
	$scope.filter = {};
	$scope.noticeInfo.shTcCd = null;
	$scope.noticeInfo.shCpCd = null; 
	$scope.noticeInfo.shLtCd = null;
	$scope.filter.cpCd = null;
	$scope.filter.tcCd = null;
	
	$scope.init = function() {
		$scope.getCustomerCompanyListBox();
		$scope.getTeacherListBox();
		$scope.getLectureListBox();
		$scope.getNoticeInfoCount();
	};
	
	$scope.getNoticeInfoList = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params ={
				notiSort: 'C',
				shTcCd: $scope.noticeInfo.shTcCd,
				shCpCd: $scope.noticeInfo.shCpCd,
				shLtCd: $scope.noticeInfo.shLtCd,
				startPage : start_page,
				endPage : end_page
		};
		
		$ksHttp.post('NoticeInfoList', params).then(function(rs) {
			$scope.noticeInfoList = JSON.parse(rs);
		}, function(err) {
			console.log(err);
		});
	};
	
	$scope.getNoticeInfoCount = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params ={
				notiSort: 'C',
				shTcCd: $scope.noticeInfo.shTcCd,
				shCpCd: $scope.noticeInfo.shCpCd,
				shLtCd: $scope.noticeInfo.shLtCd,
				startPage : start_page,
				endPage : end_page
		};
		
		$ksHttp.post('NoticeInfoListCnt', params).then(function(rs) {
			rs = JSON.parse(rs)

			if(rs && rs.length > 0){
				$scope.total_noticeInfo = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_noticeInfo/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.$watch('current_page', function(){
		$scope.getNoticeInfoList();
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

	$scope.getTeacherListBox = function() {
		
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teacherListBox = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getLectureListBox = function() {
		var params = {
				cpCd: $scope.filter.cpCd,
				tcCd: $scope.filter.tcCd
		}
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectureListBox= JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
};