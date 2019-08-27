"use strict";
app.controller("LvTestController", LvTestController);

function LvTestController($scope, $rootScope, $ksHttp, $uibModal, $state, $location, $timeout, $stateParams, $filter) {
	$scope.selected_lecture = '';
	$scope.lecture = null;
	$scope.lecture1 = null;
	$scope.select_lecture = $stateParams.ltCd;
	$scope.info = {};
	
	$scope.init = function(){
		if(!$scope.select_lecture) {
			 $state.go("app.mylecture.index");
		}
		else {
			$scope.getLectureListBox();
			$scope.selected_lecture = $stateParams.ltCd;
			$scope.getLvTestResult();
			$scope.getMyLectureDetail();
		}
	}
	$scope.getLectureListBox = function() {
		var params = {
			stCd : $rootScope.current_user.stCd
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs){
			$scope.lectures = JSON.parse(rs);
			$scope.lecture1 = $filter('filter')($scope.lectures, {'ltCd':$scope.select_lecture})[0];
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.$watch('selected_lecture', function(){
		if($scope.selected_lecture != null){
			$scope.getLvTestResult();
		}
	});
	
	$scope.getLvTestResult = function(){
		if( $scope.selected_lecture != null && $scope.selected_lecture != undefined ){
			var params = {
					stCd:  $rootScope.current_user.stCd,
					ltCd: $scope.selected_lecture
			};
	
			$ksHttp.post('LvTestResult', params).then(function(rs){
				//console.log(rs);
				var tmp = JSON.parse(rs);
				if(tmp.length > 0) {
					$scope.info = tmp[0];
				}
				//console.log($scope.info);
			}, function(error){
				console.log(error);
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
			console.log(error);
		});
	};
	
};

