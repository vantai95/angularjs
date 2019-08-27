'use strict';

app.controller('NoticeListController', NoticeListController);

function NoticeListController($ksHttp, $scope, $state, $rootScope) {
	$scope.filter={ shType:'T'};
	$scope.notice_infoes = [];
	$scope.current_page = 1;
	$scope.total_notice_info = 0;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	
	$scope.init = function() {
		$scope.getLectureCount();
	};
	
	$scope.searchNotice = function(){
		$scope.notice_infoes = [];
		$scope.current_page = 1;
		$scope.total_notice_info = 0;
		$scope.total_pages = 0;
		$scope.startPage = 1;
		$scope.endPage = 10;
		
		$scope.getLectureCount();
		$scope.getNoticeInfoList();
	}

	$scope.buildNoticeInfoParams = function() {
		return {
			cpCd : $rootScope.current_user.cpCd,			
			shType : $scope.filter.shType,
			shText : $scope.filter.shText,
			notiSort : 'N',
			startPage : $scope.startPage,
			endPage : $scope.endPage
		};
	};

	$scope.getNoticeInfoList = function() {
		var params = $scope.buildNoticeInfoParams();
		$ksHttp.post('NoticeInfoList', params).then(function(rs) {
			rs = JSON.parse(rs);
			if( $scope.notice_infoes.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.notice_infoes.push(rs[i]);
				}				
			}else{
				$scope.notice_infoes = rs;
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getLectureCount = function() {
		var params = $scope.buildNoticeInfoParams();
		$ksHttp.post('NoticeInfoListCnt', params).then(
				function(rs) {
					rs = JSON.parse(rs)

					if (rs && rs.length > 0) {
						$scope.total_notice_info = rs[0].totalCnt;
						$scope.total_pages = Math.ceil($scope.total_notice_info
								/ $scope.app.page_size);
					}
				}, function(error) {
					console.error(error);
				});
	};

	$scope.$watch('current_page', function() {
		$scope.getNoticeInfoList();
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
	
	$scope.getNoticeAddViewCount = function(noti) {
		if( noti.bool == undefined ){
			noti.bool = false;
			var params = {
					ntCd : noti.ntCd
			};
			
			$ksHttp.post('NoticeAddViewCount', params).then(function(rs){
				rs = JSON.parse(rs);
			}, function(error){
				console.error(error);
			});
		}		
	}
};