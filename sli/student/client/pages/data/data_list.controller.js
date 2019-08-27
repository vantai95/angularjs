'use strict';

app.controller('DataListController', DataListController);

function DataListController($ksHttp, $scope, $state, $rootScope) {
	$scope.lectureListBox= [];
	$scope.dataInfoList= [];
	$scope.dataInfo= {};
	$scope.dataInfo.shCpCd = $rootScope.current_user.cpCd; 
	$scope.dataInfo.shLtCd = null;
		
	$scope.current_page = 1;
	$scope.total_cnt = 0;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.dataInfo.chk = false;
	
	$scope.init = function() {
		
		$scope.getLectureListBox();
		$scope.getDataInfoCount();
	};
	
	$scope.getLectureListBox = function() {
		var params = {
			stCd : $rootScope.current_user.stCd 
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lectureListBox = rs;
		}, function(error) {
			console.error(error);
		});
	};	
	
	$scope.searchList = function(){
		$scope.dataInfoList = [];
		$scope.current_page = 1;
		$scope.total_cnt = 0;
		$scope.total_pages = 0;
		$scope.startPage = 1;
		$scope.endPage = 10;
		
		$scope.getDataInfoCount();
		$scope.getDataInfoList();
	}

	$scope.buildDataInfoParams = function() {
		return {
			shCpCd : $scope.dataInfo.shCpCd,
			shLtCd : $scope.dataInfo.shLtCd,			
			startPage : $scope.startPage,
			endPage : $scope.endPage,
			exceptYn : $scope.dataInfo.chk == true ? 'Y' : 'N'
		};
	};

	$scope.getDataInfoList = function() {
		var params = $scope.buildDataInfoParams();
		
		$ksHttp.post('DataInfoList', params).then(function(rs) {
			rs = JSON.parse(rs);
			if( $scope.dataInfoList.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.dataInfoList.push(rs[i]);
					//$scope.notice_infoes.push(rs[i]);
				}				
			}else{
				$scope.dataInfoList = rs;
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getDataInfoCount = function() {
		var params = $scope.buildDataInfoParams();
		
		$ksHttp.post('DataInfoListCnt', params).then(function(rs) {
			rs = JSON.parse(rs)

			if(rs && rs.length > 0){
				$scope.total_cnt = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_cnt/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.$watch('current_page', function() {
		$scope.getDataInfoList();
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
	
	$scope.changeChk = function(){
		if( $scope.dataInfo.chk ){
			$scope.dataInfo.shLtCd = null;
		}
	}
};