"use strict";

app.controller("NoticesController", NoticesController);

function NoticesController($scope, $rootScope, $state, $stateParams, $ksHttp, $uibModal) {
	$scope.companies = [];
	$scope.notices = [];
	$scope.company = null;
	$scope.notice = null;
	$scope.notice_id = $stateParams.id;
	$scope.current_page = 1;
	$scope.total_notices = 0;
	$scope.total_pages = 0;

	$scope.init = function() {
		if($scope.notice_id){
			// notice show page
			$scope.getNotice();
		}else{
			// notice index page
			$scope.getCustomers();
			$scope.getNoticeCount();
			$scope.getNotices();
		}
	};
    
    $scope.getNotice = function() {
		var params = {
			ntCd : $scope.notice_id
		};
		
		$ksHttp.post('NoticeInfoDetail', params).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.notice = rs[0];
			}
		}, function(error) {
			console.error(error);
		});
	};
    
    $scope.deleteNotice = function() {
		var params = {
			saveType: 'D',
			ntCd : $scope.notice_id
		};
		
		$rootScope.showConfirm('삭제하시겠습니까?', function(){
			$ksHttp.post('NoticeInfoSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.go("app.notice.list");
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	};

	$scope.getCustomers = function() {
		$ksHttp.post('CustomerCompanyList', {}).then(function(rs) {
			$scope.companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getNoticeCount = function() {
		var count_params = {
			notiSort: 'N',
			shCpCd: $scope.company
		};

		$ksHttp.post('NoticeInfoListCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			
			if(rs && rs.length > 0){
				$scope.total_notices = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_notices/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getNotices = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			notiSort: 'N',
			shCpCd: $scope.company,
			startPage : start_page,
			endPage : end_page
		}

		$ksHttp.post('NoticeInfoList', params).then(function(rs) {
			$scope.notices = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.$watch('current_page', function(){
		$scope.getNotices();
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
};

