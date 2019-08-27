"use strict";
app.controller("StudentController", StudentController);
app.controller("CustomModalController", CustomModalController);

function StudentController($scope, $rootScope, $ksHttp, $uibModal, $location,
		$timeout) {
	$scope.my_lecture_list = [];
	$scope.notice_info_list = [];
	$scope.survey_info = null;
	$scope.init = function() {
		$scope.getNoticeInfoList();
		$scope.getMyLectureList();
		$scope.CheckSurvInfo();
		$scope.getMyLectureList1();

	};
	
	$scope.getMyLectureScheduleList = function(){
		var params = {
				stCd : $rootScope.current_user.stCd,
				stateFlag : 'I'
		};
		$ksHttp.post('MyLectureScheduleList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.schedule_list = rs;
			
			$.each($scope.my_lecture_list, function(index, item){
				item.schedule = [];
				
				$.each($scope.schedule_list, function(scIndex, scItem){
					if( item.ltCd == scItem.ltCd ){ 
						item.schedule.push(scItem);
					}
				});
			});
			
		}, function(error){
			console.error(error);
		});
	};

	$scope.getNoticeInfoList = function() {
		var params = {
			cpCd : $rootScope.current_user.cpCd,
			notiSort : 'N',
			startPage : 1,
			endPage : 5
		};

		$ksHttp.post('NoticeInfoList', params).then(function(rs) {
			$scope.notice_info_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getMyLectureList = function() {
		var params = {
			stCd : $rootScope.current_user.stCd,
			stateFlag : 'I'
		};

		$ksHttp.post('MyLectureList', params).then(function(rs) {
			$scope.my_lecture_list = JSON.parse(rs);
			$scope.getMyLectureScheduleList();
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getMyLectureList1 = function() {
		var params = {
			stCd : $rootScope.current_user.stCd,
			stateFlag : 'F'
		};

		$ksHttp.post('MyLectureList', params).then(function(rs) {
			$scope.my_lecture_list1 = JSON.parse(rs);

		}, function(error) {
			console.error(error);
		});
	};

	$scope.CheckSurvInfo = function() {
		$ksHttp.post('CheckSurvInfo', {
			stCd : $rootScope.current_user.stCd
		}).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.survey_info = rs;
		}, function(error) {
			console.error(error);
		});
	};

	$scope.openPopup = function() {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup",
			controller : "CustomModalController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				survey_info : function() {
					return $scope.survey_info;
				}
			}
		});

		modalInstance.result.then(function(result) {
			console.log(result);
		}, function(err) {
			console.info(err);
		});
	};
	
	$scope.hideSurv = function() {
		$(".survBtn").hide();
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
	
	$scope.sendSMS = function(){
		
		
	    
		var params = {
				sendType : 'C',
				userType : 'S',
				userName : '전준형',
				destPhone : '01027584305'
		};
		
		$ksHttp.post('SendSMS', params).then(function(rs){
			$scope.data = JSON.parse(rs);
			if($scope.data[0].result == 'succ') {
				$rootScope.showMessage('success', $scope.data[0].message);
			} else {
				$rootScope.showMessage('error', $scope.data[0].message);
			}
		}, function(error){
			console.error(error);
		});
	};
};

function CustomModalController($ksHttp, $scope, $rootScope, $uibModalInstance, survey_info) {
	$scope.survey = survey_info[0];
	// console.log($scope.survey);
	$scope.data = [];

	$scope.init = function() {
		$scope.getSurvInfoDetail();
		$scope.getSurvInfoDetailItemList();
	};

	$scope.getSurvInfoDetail = function() {
		var params = {
			smCd : $scope.survey.smCd,
			ltCd : $scope.survey.ltCd
		};

		$ksHttp.post('SurvInfoDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			// console.log(rs);
			$scope.surv_detail = rs[0];
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getSurvInfoDetailItemList = function() {
		var params = {
			smCd : $scope.survey.smCd,
			useYn : 'Y'
		};

		$ksHttp.post('SurvInfoDetailItemList', params).then(
				function(rs) {
					rs = JSON.parse(rs);
					$scope.data_root=rs;
					$scope.surv_detail_items = rs;
					if ($scope.surv_detail_items
							&& $scope.surv_detail_items.length > 0) {
						var data = {};
						$.each($scope.surv_detail_items, function(value, key) {
							var temp = data[key.stCd];
							if (!temp) {
								temp = [];
							}

							temp.push(key);
							data[key.stCd] = temp;
						});
						$scope.surv_detail_items = data;
					}
					
					var cnt = 0;
					var tempStCd = "";
					$.each($scope.data_root, function(value, key) {
						if( key.stCd != tempStCd){
							tempStCd = key.stCd; 
							cnt++;
						}
						key.no = cnt;
					});
					
				}, function(error) {
					console.error(error);
				});
	};
	$scope.selected = {};
	$scope.select = function(item) {
		$scope.selected[item.stCd] = {ssCd: item.ssCd, cnts:''};
	};	

	$scope.save = function() {
		if ($scope.validate()) {
			$rootScope.showConfirm('등록하시겠습니까?',function(){
				var essay_arr=[];
				$.each($scope.data_root, function(value, key) {					
					if(key.survType == 'S'){
						if(key.cnts != undefined && key.cnts != ''){
							essay_arr.push({ssCd: key.ssCd, cnts: key.cnts});
						}
					}
				});
				
				var multi_str=[];
				$.each($scope.selected, function(value, key) {
					multi_str.push(key.ssCd);					
				});

				var params = {
					smCd :  $scope.survey.smCd,
					stCd :  $rootScope.current_user.stCd,
					multi_str : multi_str.toString(),
					essay_arr : essay_arr,
					essay_len : essay_arr.length
				}
				
				$ksHttp.post('SurvSaveAnswer', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$scope.hideSurv();
					$uibModalInstance.close('close');					
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				});
			});
		}
	};

	$scope.validate = function() {

		var bool = true;
		var cnt = 0;
		$.each($scope.data_root, function(value, key) {			
			if( bool ){
				cnt ++;
				if(key.survType == 'M'){				
					if( $scope.selected[key.stCd] == undefined ){					
						$rootScope.showAlert(key.no+'번 문항의 값을 선택해주세요.');
						bool = false;						
					}			
				}
			}
		});	
		
		return bool;
	};
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	
}