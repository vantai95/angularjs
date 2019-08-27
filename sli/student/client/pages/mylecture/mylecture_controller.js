"use strict";
app.controller("MyLectureController", MyLectureController);

function MyLectureController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout, $stateParams, $state) {
	$scope.lectures = [];
	$scope.lecture_detail = null;
	$scope.current_page = 1;
	$scope.total_companies = 0;
	$scope.total_pages = 0;
	$scope.notice_list = [];
	$scope.selected_lecture = $stateParams.ltCd;
	$scope.init = function(){
		if(!$scope.selected_lecture) {
			 $state.go("app.mylecture.index");
		}
		else {
			$scope.getLectureListBox();
		}
	};
	
	$scope.getLectureListBox = function() {
		var params = {
				stCd : $rootScope.current_user.stCd
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs){
			$scope.lectures = JSON.parse(rs);
			
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getMyLectureDetail = function(){
		var params = {
				stCd : $rootScope.current_user.stCd,
				ltCd : $scope.selected_lecture
		};
		$ksHttp.post('MyLectureDetail', params).then(function(rs){
			$scope.lecture_detail = JSON.parse(rs);
			console.log($scope.lecture_detail);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getNoticeInfoList = function(){
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
				notiSort : 'C',
				cpCd : $rootScope.current_user.cpCd,
				startPage : start_page,
				endPage : end_page 
		};
		
		$ksHttp.post('NoticeInfoList', params).then(function(rs){
			$scope.notice_list = JSON.parse(rs);
			
		}, function(error){
			console.error(error);
		});
		
	};
	
	
	
	$scope.$watch('selected_lecture', function(){
		if($scope.selected_lecture != null){
			$scope.getMyLectureDetail();
		}
	});
	
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
	
	$scope.showMap = function(items) {
		console.log(items);
		if($('#map_' + items.ltCd).css('display') == 'block') {
			$('#map_' + items.ltCd).hide();
			return;
		}
		
		if(items.addr == '' || typeof items.addr == undefined) {
			$rootScope.showMessage('error', '장소가 등록되지 않았습니다.');
			return;
		}
		var mapContainer = document.getElementById('map_' + items.ltCd), // 지도를 표시할 div
        mapOption = {
            center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
            level: 5 // 지도의 확대 레벨
        };

    //지도를 미리 생성
		var map = new daum.maps.Map(mapContainer, mapOption);
    //주소-좌표 변환 객체를 생성
		var geocoder = new daum.maps.services.Geocoder();
    //마커를 미리 생성
		var marker = new daum.maps.Marker({
			position: new daum.maps.LatLng(37.537187, 127.005476),
			map: map
		});
		 geocoder.addressSearch(items.addr, function(results, status) {
             // 정상적으로 검색이 완료됐으면
						if (status === daum.maps.services.Status.OK) {

							var result = results[0]; //첫번째 결과의 값을 활용
	
							// 해당 주소에 대한 좌표를 받아서
							var coords = new daum.maps.LatLng(result.y, result.x);
							// 지도를 보여준다.
							mapContainer.style.display = "block";
							map.relayout();
							// 지도 중심을 변경한다.
							map.setCenter(coords);
							// 마커를 결과값으로 받은 위치로 옮긴다.
							marker.setPosition(coords)
						}
				});

	}    
};