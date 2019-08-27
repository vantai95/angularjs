"use strict";
app.controller("TestController", TestController);

function TestController($scope, $rootScope, $ksHttp, $uibModal, $state, $location, $timeout, $stateParams, $filter) {
	$scope.selected_lecture = '';
	$scope.lecture = null;
	$scope.select_lecture = $stateParams.ltCd;
	$scope.test_list = [];
	$scope.lvCd = '';
	
	$scope.init = function(){
		if(!$scope.select_lecture) {
			 $state.go("app.mylecture.index");
		}
		else {
			$scope.getLectureListBox();
			$scope.selected_lecture = $stateParams.ltCd;
//			$scope.getTestResult();
			$scope.getMyLectureDetail();
			$scope.getTestList();
		}
	}

	$scope.changeTest = function() {
		for(var i = 0; i < $scope.test_list.length; i++) {
			if($scope.test_list[i].lvCd == $scope.lvCd) {
				$scope.lvtest_info = $scope.test_list[i];
				break;
			}
		}
//		$scope.lvtest_info = item;
		$scope.getTestResult();
	}
	
	$scope.getTestList = function() {
		var params = {
			ltCd : $scope.selected_lecture
		};

		$ksHttp.post('TestList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.test_list = rs;
			if($scope.test_list.length > 0) {
				$scope.lvCd = $scope.test_list[0].lvCd;
				$scope.lvtest_info = $scope.test_list[0];
				$scope.getTestResult();
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getLectureListBox = function() {
		var params = {
			stCd : $rootScope.current_user.stCd
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs){
			$scope.lectures = JSON.parse(rs);
			$scope.lecture1 = $filter('filter')($scope.lectures, {'ltCd':$scope.select_lecture})[0];
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.$watch('selected_lecture', function(){
		if($scope.selected_lecture != null){
			$scope.getMyLectureDetail();
			$scope.getTestList();
		}
	});
	
	$scope.getTestResult = function(){
		if( $scope.selected_lecture != null && $scope.selected_lecture != undefined ){
			var params = {
				stCd:  $rootScope.current_user.stCd,
				ltCd: $scope.selected_lecture,
				lvCd: $scope.lvCd
			};
	
			$ksHttp.post('TestResult', params).then(function(rs){
				//console.log(rs);
				var tmp = JSON.parse(rs);
				if(tmp.length > 0) {
					$scope.info = tmp[0];
				}
				//console.log($scope.info);
			}, function(error){
				console.error(error);
			});
		}
	};
	
	$scope.getMyLectureDetail = function(){
		var params = {
				stCd : $rootScope.current_user.stCd,
				ltCd : $scope.selected_lecture
		};
		$ksHttp.post('MyLectureDetail', params).then(function(rs){
			var tmp = JSON.parse(rs);
			$scope.lecture_detail = tmp[0];
			//console.log($scope.lecture_detail);
		}, function(error){
			console.error(error);
		});
	};
};

