"use strict";

app.controller("LectureDetailController", LectureDetailController);
function LectureDetailController($scope, $rootScope, $ksHttp, $uibModal, $state, $stateParams) {

	$scope.id = $stateParams.id;
	$scope.init = function(){
		if(!$stateParams.id){
            $state.go("app.lecture.list");
        } else{
            $scope.getLectureRegDetail();
            $scope.getLectureBookList();
            
        }
	};
	
	$scope.getLectureRegDetail = function(){
		var params = {
				ltCd : $scope.id
		};
		
		$ksHttp.post('LectureRegDetail', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lecture_detail = rs[0];
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getLectureBookList = function(){
		var params = {
				ltCd : $scope.id
		};
		
		$ksHttp.post('LectureBookList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lucture_book = rs;
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getPayMeans = function(){
		var params = {
			groupId : 'PAY_MEANS'	
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.pay_means = rs;
		}, function(error){
			console.error(error);
		});
		
	};
	
	$scope.openPopup = function(){
		$rootScope.showConfirm('수강신청을 진행하시겠습니까?', function() {
			var params = {
					saveType : 'I',
					ltCd : $scope.id,
					cpCd : $scope.selected_customer_company,
					stCd : $rootScope.current_user.stCd,
					regUser : $rootScope.current_user.userId
				};
				$ksHttp.post('ClassStudentSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					console.log(rs);
					if(rs[0].result == 'succ') {
						$rootScope.showAlert(rs[0].message);
					}
					else {
						$rootScope.showAlert(rs[0].message);
					}
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
		})

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
}

