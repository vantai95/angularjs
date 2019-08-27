'use strict';

app.controller('TeacherCalculateController', TeacherCertificationController);
function TeacherCertificationController($scope, $rootScope, $ksHttp, $uibModal) {
    
	$scope.current_page = 1;
	$scope.total_cnt = 0;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.calculate_list = [];
	
	$scope.stdDt = "";
	$scope.endDt = "";
	
    $scope.init = function(){
    	var dt = new Date();
    	var strDt = "";
    	strDt = dt.getFullYear() + "-";
    	if(dt.getMonth() + 1 < 10)
		{
    		strDt += '0' + (dt.getMonth()+1);
		}else{
			strDt += dt.getMonth()+1;
		}
    	$scope.stdDt = strDt;
    	$scope.endDt = strDt;
    	
//    	$scope.getCalculateListCnt();
    	$scope.search();
    }
    
    $scope.search = function(){
    	$scope.total_cnt = 0;
    	$scope.current_page = 1;
    	$scope.calculate_list = [];
    	$scope.getCalculateListCnt();
    	$scope.getCalculateList();
    }
    
    $scope.getCalculateListCnt = function(){
    	var params ={
        		tcCd: $rootScope.current_user.tcCd,
        		stdDt : $scope.stdDt,
        		endDt : $scope.endDt
        	}
    	
    	$ksHttp.post('CalculateListCnt', params).then(function(rs) {
			rs = JSON.parse(rs)
			if (rs && rs.length > 0) {
				$scope.total_cnt = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_cnt / $scope.app.page_size);				
			}
		}, function(error) {
			$rootScope.showMessage('error', '오류입니다.');
		});
    }
    
    $scope.getCalculateList = function(){
    	var params ={
    		tcCd: $rootScope.current_user.tcCd,
    		stdDt : $scope.stdDt,
    		endDt : $scope.endDt,
    		startPage : $scope.startPage,
			endPage : $scope.endPage
    	}
    	
    	$ksHttp.post('CalculateList', params).then(function(rs){
    		rs = JSON.parse(rs);
   			$scope.calculate_list = rs;
    	}, function(error){
    		$rootScope.showMessage('error', '오류입니다.');
    	});
    }
        
    $scope.$watch('current_page', function() {
    	$scope.getCalculateList();
	});

	$scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};

	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages){
			$scope.current_page += 1;
			$scope.startPage = ($scope.current_page * $scope.app.page_size) - 9;
			$scope.endPage = $scope.current_page * $scope.app.page_size;
			
		}else{
			$scope.current_page = $scope.total_pages;
			$rootScope.showAlert('더 이상 목록이 존재하지 않습니다.');
			$(".btnMoreList").hide();
		}
	};
}
