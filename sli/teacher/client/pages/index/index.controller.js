"use strict";
app.controller("TeacherController", TeacherController);

function TeacherController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout) {
	$scope.init = function(){
		$scope.getNoticeInfoList();
		$scope.getMyLectureList();
	};
	
	$scope.getNoticeInfoList = function() {
		var params = {
				notiSort : 'N',
				startPage : 1,
				endPage : 5
		};
		
		$ksHttp.post('NoticeInfoList', params).then(function(rs){
			$scope.notice_info_list = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getMyLectureList = function() {
		var params = {
				tcCd : $rootScope.current_user.tcCd,
				stateFlag : 'I'
		};
		
		$ksHttp.post('MyLectureList', params).then(function(rs){
			$scope.my_lecture_list = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.showMap = function(items) {
		console.log(items.addr);
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
}