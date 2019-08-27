'use strict';

app.controller('AlertListController', AlertListController);

function AlertListController($ksHttp, $scope, $state, $rootScope, $stateParams){
	
	$scope.current_page = 1;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.total_leture = 0;
	$scope.select_lecture = $stateParams.ltCd;
	$scope.notice_info_list = [];
	$scope.currentLectureNm = '';
	
	$scope.init = function(){
		if(!$scope.select_lecture) {
			 $state.go("app.mylecture.index");
		}
		else {
			$scope.selected_lecture = $stateParams.ltCd;
			$scope.getLectureListBox();
			$scope.getNoticeInfoListCnt();
		}
	};
	
	$scope.changeLecture = function(){
		$scope.current_page = 1;
		$scope.total_pages = 0;
		$scope.startPage = 1;
		$scope.endPage = 10;
		$scope.total_leture = 0;
		$scope.notice_info_list = [];
		
		if( $scope.select_lecture != null && $scope.select_lecture != '' ){
			$scope.getNoticeInfoListCnt();
			$scope.getNoticeInfoList();
		}else{
			$scope.currentLectureNm = '-';
		}
	}
	
	$scope.getLectureListBox = function(){
		var params = {
				stCd: $rootScope.current_user.stCd
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lectureList = rs;
			
			var current_lecture = null;
			current_lecture = $.grep($scope.lectureList, function(x,i){return x.ltCd == $scope.select_lecture})[0];
			$scope.currentLectureNm = current_lecture.lectureNm;
			
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getNoticeInfoListCnt = function(){
		var params = {
				notiSort : 'C',
				cpCd:  $rootScope.current_user.cpCd,
				shLtCd : $scope.select_lecture
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
	
	$scope.getNoticeInfoList = function(){
		
		var params = {
				notiSort : 'C',
				cpCd:  $rootScope.current_user.cpCd,
				shLtCd : $scope.select_lecture ,
				startPage : $scope.startPage,
				endPage : $scope.endPage
		};
		
		$ksHttp.post('NoticeInfoList', params).then(function(rs){
			rs = JSON.parse(rs);
			if( $scope.notice_info_list.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.notice_info_list.push(rs[i]);
				}
			}else{
				$scope.notice_info_list = rs;
			}
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
		
	$scope.$watch('select_lecture', function(){
		
		if( $scope.select_lecture == null ){
			$scope.notice_info_list = [];
		}else{
			if( $scope.lectureList != undefined ){
				var current_lecture = null;
				current_lecture = $.grep($scope.lectureList, function(x,i){return x.ltCd == $scope.select_lecture})[0];
				if( current_lecture ) $scope.currentLectureNm = current_lecture.lectureNm;
				
				$scope.notice_info_list = [];
			}
		}
	});
}