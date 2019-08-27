'use strict';
app.controller('studentQNAController', StudentQNAController);

function StudentQNAController($scope, $http, $stateParams, $uibModal, $ksHttp, $state, $rootScope) {
	$scope.current_page = 1;
	$scope.total_support_centers = 0;
	$scope.init = function() {
		$scope.getType();
		$scope.getSupportCenters();
		$scope.getSupportCenterCount();
	};

	$scope.getType = function(){
		var params = {
			groupId : 'INQUIRY_TYPE'	
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.type_inquiry = rs;
		}, function(error){
			console.error(error);
		});
	};

	$scope.getSupportCenters = function()
    {
    	var old = [];
    	if($scope.support_centers != null && $scope.support_centers.length > 0)
		{
    		old = $scope.support_centers;
		}
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			shInquiryType : $scope.selected_shInquiryType ? $scope.selected_shInquiryType : '',
			shAnswerYn : $scope.selected_shAnswerYn ? $scope.selected_shAnswerYn : '',
			shUserName : $scope.selected_shUserName ? $scope.selected_shUserName : '',
			shInquiryTitle : $scope.selected_shInquiryTitle ? $scope.selected_shInquiryTitle : '',
			startPage : start_page,
			endPage : end_page
		}
        $ksHttp.post('SupportCenterList', params).then(function(rs) {
			$scope.support_centers = JSON.parse(rs);
			if(old.length > 0)
			{
				$scope.support_centers = old;
			}
			$scope.result_support_centers = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	}
	
	$scope.lookup = function() {
		$scope.getSupportCenters();
		$scope.getSupportCenterCount();
		$state.go("app.student_qna.list");
	};

	$scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};

	$scope.previousPageClick = function() {
		if ($scope.current_page > 1)
			$scope.current_page -= 1;
		else
			$scope.current_page = 1;
	};

	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages)
			$scope.current_page += 1;
		else
			$scope.current_page = $scope.total_pages;
	};

	$scope.getSupportCenterCount = function() {
		var count_params = {
				shInquiryType : $scope.selected_shInquiryType ? $scope.selected_shInquiryType : '',
				shAnswerYn : $scope.selected_shAnswerYn ? $scope.selected_shAnswerYn : '',
				shUserName : $scope.selected_shUserName ? $scope.selected_shUserName : '',
				shInquiryTitle : $scope.selected_shInquiryTitle ? $scope.selected_shInquiryTitle : ''
			}

			$ksHttp.post('SupportCenterListCnt', count_params).then(function(rs) {
				rs = JSON.parse(rs);
				if(rs && rs.length > 0){
					$scope.total_support_centers = rs[0].totalCnt;
					$scope.total_pages = Math.ceil($scope.total_support_centers/$scope.app.page_size);
					
				}
			}, function(error) {
				console.error(error);
			});
	};
};

