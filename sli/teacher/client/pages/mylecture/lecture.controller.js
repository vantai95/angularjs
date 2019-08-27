'use strict';

app.controller('LectureController', LectureController);

function LectureController($ksHttp, $scope, $state, $stateParams) {
	$scope.lecture_list_box = [];
	$scope.notice_info_list = [];
	$scope.my_lecture_detail = {};
	$scope.ltCd = $stateParams.ltCd;

	$scope.init = function() {
		if(!$stateParams.ltCd){
            $state.go("app.mylecture.index");
        } else{
        	$scope.getLectureListBox();
    		$scope.getNoticeInfoList();
    		$scope.getMyLectureDetail();
        }
		
	};

	$scope.getNoticeInfoList = function() {
		var params = {
			notiSort : 'C',
			shLtCd : $scope.ltCd,
			startPage : 1,
			endPage : 20
		};

		$ksHttp.post('NoticeInfoList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.notice_info_list = rs;
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getLectureListBox = function() {
		var params = {
			tcCd : $scope.current_user.tcCd
		};

		$ksHttp.post('LectureListBox', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_list_box = rs;
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getMyLectureDetail = function() {
		var params = {
			ltCd : $scope.ltCd
		};

		$ksHttp.post('MyLectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.my_lecture_detail = rs[0];
			
			$scope.getNoticeInfoList();
		}, function(error) {
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