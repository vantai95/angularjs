'use strict';

app.controller('AlertListController', AlertListController);

function AlertListController($ksHttp, $rootScope, $scope, $state, $stateParams)
{
	$scope.current_page = 1;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.total_leture = 0;
	
	$scope.alert = {};
	$scope.noticeInfoList = [];
	$scope.currentLectureNm = '';
	$scope.lectureList = [];
	$scope.ltCd = $stateParams.ltCd;
	
	$scope.init = function()
	{
		//do something
		if(!$stateParams.ltCd) {
            $state.go("app.mylecture.index");
		}
		else {
			$scope.getLectureList();			
		}
	}
	
	$scope.changeLecture = function(){
		$scope.current_page = 1;
		$scope.total_pages = 0;
		$scope.startPage = 1;
		$scope.endPage = 10;
		$scope.total_leture = 0;
		$scope.noticeInfoList = [];
		
		if( $scope.ltCd != null && $scope.ltCd != '' ){
			$scope.getNoticeInfoListCnt();
			$scope.getNoticeInfoList();
		}else{
			$scope.currentLectureNm = '-';
		}
	}
	
	$scope.getNoticeInfoListCnt = function(){
		var params = {
				notiSort : 'C',
				shLtCd : $scope.ltCd
		};
		
		$ksHttp.post('NoticeInfoListCnt', params).then(function(rs){
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.total_leture = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_leture
						/ $scope.app.page_size);

			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getNoticeInfoList = function()
	{
		var params = {
			notiSort : 'C',
			shLtCd : $scope.ltCd ? $scope.ltCd : null,
			startPage : $scope.startPage,
			endPage : $scope.endPage
		}
		$ksHttp.post('NoticeInfoList', params).then(function(rs){
			rs = JSON.parse(rs);
			if( $scope.noticeInfoList.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.noticeInfoList.push(rs[i]);
				}
			}else{
				$scope.noticeInfoList = rs;
			}
		}, function(error){
			console.error(error);
		});
	}
	
	$scope.getLectureList = function(){
		
		var params = {
				tcCd: $rootScope.current_user.tcCd
		}
		$ksHttp.post('LectureListBox', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lectureList = rs;
			$scope.ltCd = $stateParams.ltCd;
			
			$scope.getNoticeInfoListCnt();
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.$watch('current_page', function(){
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
	
	$scope.getNoticeAddViewCount = function(noti){		
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
	};
	
	$scope.$watch('ltCd', function(){
		
		if( $scope.ltCd == null || $scope.ltCd == ''){
			$scope.noticeInfoList = [];
		}else{
			if( $scope.lectureList != undefined ){
				var current_lecture = null;
				current_lecture = $.grep($scope.lectureList, function(x,i){return x.ltCd == $scope.ltCd})[0];
				if( current_lecture ) $scope.currentLectureNm = current_lecture.lectureNm;
				
				$scope.noticeInfoList = [];
			}
		}
	});
}