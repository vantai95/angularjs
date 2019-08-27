"use strict";

app.controller("LectureController", LectureController);
function LectureController($scope, $rootScope, $ksHttp, $uibModal, $state) { 
	
	$scope.init = function(){
		$scope.getTitleCd();
		$scope.getLectureRegList();
	};
	
	$scope.getTitleCd = function(){
		var params = {
			groupId : 'TITLE_CD'	
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.title_cd = rs;
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getLectureRegList = function(titleCd){
		var params = {
			cpCd : $rootScope.current_user.cpCd,
			titleCd : titleCd
		};
		
		$ksHttp.post('LectureRegList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lecture_reg_list = rs;
			console.log(rs);
		}, function(error){
			console.error(error);
		});
	};
}