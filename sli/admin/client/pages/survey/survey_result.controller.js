"use strict";
app.controller("ServeyResultController", ServeyResultController);

function ServeyResultController($scope, $rootScope, $state, $stateParams, $uibModal, $filter, $ksHttp) {
	if(!$stateParams.smCd){
        $state.go("app.survey.list");
	}
	var params= {smCd: $stateParams.smCd};
	$scope.surv_stats_info= {};
	$scope.surv_stats_titles = [];
	$scope.surv_stats_multi= {};
	$scope.surv_stats_essay = {};
	
	$scope.init =  function(){
		$scope.getSurvStatsInfo();
		$scope.getSurvStatsTitleList();
		$scope.getSurvStatsMulti();
		$scope.getSurvStatsEssay();
	};
	
	$scope.getSurvStatsInfo = function() {
		$ksHttp.post('SurvStatsInfo', params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs && rs.length > 0){
				$scope.surv_stats_info= rs[0];
			}
		}, function(error){
			console.error(error);
		});
	};

	$scope.getSurvStatsTitleList= function(){
		$ksHttp.post('SurvStatsTitleList', params).then(function(rs) {
			$scope.surv_stats_titles= JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};

	$scope.getSurvStatsMulti = function()  {
		$ksHttp.post('SurvStatsMulti', params).then(function(rs) {
			rs = JSON.parse(rs);
			console.log(rs);
			if(rs && rs.length > 0){
				var data = {};
				$.each(rs, function(i, x){
					var temp = data[x.orderNo];
					if(!temp){
						temp = {total: 0, answers: []};
					}
					temp.total += x.selectCnt;
					temp.answers.push(x);
					data[x.orderNo] = temp;
				});
				$scope.surv_stats_multi = data;
			}
		}, function(error){
			console.error(error);
		});
	};

	$scope.getSurvStatsEssay = function() {
		$ksHttp.post('SurvStatsEssay', params).then(function(rs) {
			rs = JSON.parse(rs);
			console.log(rs);
			if (rs && rs.length > 0) {
				var data = {};
				$.each(rs, function(i, x) {
					var temp = data[x.orderNo];

					if (!temp) {
						temp = []
					}
					temp.push(x);
					data[x.orderNo] = temp;
				});
				$scope.surv_stats_essay = data;
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.exportWeb = function(printSectionId) {
	      var innerContents = document.getElementById('printSectionId').innerHTML;
	      var popupWinindow = window.open('', '_blank', 'width=600,height=700');
	      popupWinindow.document.open();
	      popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
	      popupWinindow.document.close();
     };
	
	$scope.exportEcel = function(){
		window.open('/excel/survey.do?smCd='+ params.smCd);
    };
}