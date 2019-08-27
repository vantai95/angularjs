'use strict';

app.controller('StudentController', StudentController);
app.controller('PoupControllerSt', PoupControllerSt);

function StudentController($ksHttp, $scope, $state, $uibModal, $rootScope, $stateParams) {
	$scope.ltCd = $stateParams.ltCd;
	$scope.lecture_list_box = [];
	$scope.class_info_list = [];

	$scope.init = function() {
		if(!$stateParams.ltCd){
            $state.go("app.mylecture.index");
        } else{
			$scope.getLectureListBox();
			$scope.getClassInfoList();
        }
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

	$scope.getClassInfoList = function() {
		var params = {
			ltCd : $scope.ltCd
		};

		$ksHttp.post('ClassInfoList', params).then(function(rs) {
			//console.log(rs);
			rs = JSON.parse(rs);
			$scope.class_info_list = rs;
		}, function(error) {
			console.error(error);
		});
	};

	$scope.openPopup = function(class_info) {
		$scope.class_info = class_info;
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup.html",
			controller : "PoupControllerSt",
			windowClass : "app-modal-window",
			scope : $scope
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				console.log('ok');
			}
		}, function(err) {
			console.info(err);
		});
	};

};

function PoupControllerSt($scope, $uibModalInstance, $rootScope, $window, $ksHttp) {

	$scope.attend_student_list=[];
	$scope.lvtest_info = null;
	$scope.lvtest_detail = null;
	
	/**성취도평가 s*/
	$scope.test_list = [];
	$scope.test_lv_info = null;
	$scope.lvCd = '';
	/**성취도평가 e*/
	
	$scope.initPopup = function() {
		
		$scope.getAttendStudentList();
		$scope.getLvTestInfo();
		$scope.getLvTestResult();
		
		$scope.getTestList();
	};
	
	$scope.changeClassInfo = function(class_info){
		$scope.class_info = class_info;
		$scope.lvtest_info = null;
		$scope.lvtest_detail = null;
		$scope.test_list = [];
		$scope.test_lv_info = null;
		$scope.lvCd = '';
		
		$scope.getAttendStudentList();
		$scope.getLvTestInfo();
		$scope.getLvTestResult();
		
		$scope.getTestList();
	};
	
	$scope.getAttendStudentList = function() {
		var params = {
			shLtCd : $scope.class_info.ltCd,
			shStCd : $scope.class_info.stCd
		};
//		console.log(params);

		$ksHttp.post('AttendStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.attend_student_list= rs;
//			console.log(rs);
		}, function(error) {
			console.error(error);
		});
	};
	$scope.setTableAttendStudent = function(attend_student){
		var lectureType=attend_student.lectureType;
		var attState=attend_student.attState;
		if(lectureType =='02') return '<span class="gray text-xs">휴강</span>';
		if(lectureType =='03') return '<span class="gray text-xs">보강</span>';
		if(lectureType =='04') return '<span class="gray text-xs">보장성</span>';		
		if(attState =='02') return '<img src="assets/img/attend_check_disabled.png">';
		if(attState =='05') return '<img src="assets/img/attend_check_disabled.png">';
		if(attState =='01' || attState == '03' || attState =='04') return '<img src="assets/img/attend_check.png">';		
		return '<img src="assets/img/attend_check_disabled.png">';
	};

	//레벨테스트 
	$scope.getLvTestInfo = function() {
		var params = {
			ltCd : $scope.class_info.ltCd
		};

		$ksHttp.post('GetLevelTest', params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs.length > 0) {
				$scope.lvtest_info = rs[0];
			}
			else {
//				$scope.lvtest_info.tpCd;
			}
		}, function(error) {
			console.error(error);
		});
	};

	//레벨테스트 
	$scope.getLvTestResult = function() {
		var params = {
			ltCd : $scope.class_info.ltCd,
			stCd : $scope.class_info.stCd
		};

		$ksHttp.post('GetLevelTestResult', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lvtest_detail =rs[0]; 
		}, function(error) {
			console.error(error);
		});
	};
	
	//성취도평가 
	$scope.changeTest = function() {
		for(var i = 0; i < $scope.test_list.length; i++) {
			if($scope.test_list[i].lvCd == $scope.lvCd) {
				$scope.test_lv_info = $scope.test_list[i];
				break;
			}
		}
		$scope.getTestResult();
	}
	
	//성취도평가 - 평가목록 
	$scope.getTestList = function() {
		var params = {
			ltCd : $scope.class_info.ltCd
		};

		$ksHttp.post('TestList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.test_list = rs;
			if($scope.test_list.length > 0) {
				$scope.lvCd = $scope.test_list[0].lvCd;
				$scope.test_lv_info = $scope.test_list[0];
				$scope.getTestResult();
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	//성취도평가
	$scope.getTestResult = function(){
		if( $scope.class_info.ltCd != null && $scope.class_info.ltCd != undefined ){
			var params = {
				stCd: $scope.class_info.stCd,
				ltCd: $scope.class_info.ltCd,
				lvCd: $scope.lvCd
			};
			
			$ksHttp.post('GetTestResult', params).then(function(rs){
				//console.log(rs);
				var tmp = JSON.parse(rs);
				if(tmp.length > 0) {
					$scope.test_detail = tmp[0];
				}
			}, function(error){
				console.error(error);
			});
		}
	};
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};