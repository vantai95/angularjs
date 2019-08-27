'use strict';

app.controller('LectureDetailController', LectureDetailController);


function LectureDetailController($scope, $filter, $rootScope, $ksHttp, $stateParams,$uibModal, $state) {
    $scope.lecture = null;
    $scope.lecture_id = $stateParams.id;
	$scope.tuition_fee_units = [];
	$scope.teacher_fee_units = [];
	$scope.schedule_week = [];
	$scope.lecture_books = [];
	$scope.imgFile = {
			seq : ''
			, curKey : ''
			, pathServer : ''
			, fileName : ''
			, originalName : ''
			, pathUrl : ''
			, is_del : 'N'
		}
    
    $scope.init = function(){
    	$scope.lecture_id = $stateParams.id;
		$scope.getTuitionFeeUnits();
		$scope.getTeacherFeeUnits();
        $scope.getLecture();
        $scope.getLectureScheduleList();
        $scope.getLectureBookList();
        $scope.getFile();
    };

	$scope.getTuitionFeeUnits = function() {
		var params = {
			groupId : 'TUITION_FEE_UNIT'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.tuition_fee_units = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getLectureScheduleList = function(){
		$ksHttp.post('LectureScheduleList', {shLtCd: $stateParams.id}).then(function(rs){
			rs = JSON.parse(rs);
			$scope.schedule_week = rs;
		
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getLectureBookList = function(){
		$ksHttp.post('LectureBookList', {shLtCd: $stateParams.id}).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lecture_books = rs;
		
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getTeacherFeeUnits = function() {
		var params = {
			groupId : 'TEACHER_FEE_UNIT'
		}
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.teacher_fee_units = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
    $scope.getLecture = function() {
    	var params = {
			ltCd: $scope.lecture_id
		};

		$ksHttp.post('LectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.lecture = rs[0];
			}
		}, function(error) {
			console.log(error);
		});
    };
    
	$scope.getFile = function() {
		var params = {
				curCd : $scope.lecture_id
				,curType : 'Lecture'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			for( var i=0; i< arr.length; i++ ){
				if(arr[i].curKey == "img" ){
					$scope.imgFile = {
						seq : arr[i].seq
						, curKey : arr[i].curKey
						, pathServer : arr[i].pathServer
						, fileName : arr[i].fileName
						, originalName : arr[i].originalName
						, pathUrl : arr[i].pathUrl
					}
					
				}
			}
		}, function(error) {
			
			console.log(error);
		});
	}	
    
	$scope.showMap = function() {
		if($('#map').css('display') == 'block') {
			$('#map').hide();
			return;
		}
		
		if($scope.lecture.addr == '') {
			$rootScope.showMessage('장소가 등록되지 않았습니다.');
			return;
		}
		var mapContainer = document.getElementById('map'), // 지도를 표시할 div
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
		 geocoder.addressSearch($scope.lecture.addr, function(results, status) {
             // 정상적으로 검색이 완료됐으면
						if (status === daum.maps.services.Status.OK) {

							var result = results[0]; //첫번째 결과의 값을 활용
	
							// 해당 주소에 대한 좌표를 받아서
							var coords = new daum.maps.LatLng(result.y, result.x);
							// 지도를 보여준다.
							$('#daum_map').show();
							mapContainer.style.display = "block";
							map.relayout();
							// 지도 중심을 변경한다.
							map.setCenter(coords);
							// 마커를 결과값으로 받은 위치로 옮긴다.
							marker.setPosition(coords)
						}
				});

	}
	
	$scope.deleteLecture = function(){
				
		$rootScope.showConfirm("삭제하시겠습니까?<br><br>※ 해당 강의에 수강등록된 학생이 있을 경우, 수강이력이 일괄 삭제 됩니다.", function() {
			var params = {
					saveType : 'D',
					ltCd: $scope.lecture_id,
					updUser: $rootScope.current_user.userId
				};
			
			$ksHttp.post('LectureDelete', params).then(function(rs) {
				rs = JSON.parse(rs)
				var message = rs[0].message;
				var status = rs[0].result;
				
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if( 'succ' == status ) $state.go("app.subject.lecture_list");				
			}, function(error) {
				console.log(error);
			});
		});
	}
}

function closeDaumPostcode() {
	$('#layer').hide();
	$('#daum_map').hide();
}
