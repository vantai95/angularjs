'use strict';

app.controller('GuaranteeController', GuaranteeController);

function GuaranteeController($scope, $http, $stateParams, $uibModal, $ksHttp,
		$state, $filter, $rootScope) {
	$scope.enrich_schedules = [];
	$scope.customer_companies = [];
	$scope.teachers = [];
	$scope.lectures = [];
	$scope.filter = {};
	$scope.filter.cpCd = null;
	$scope.filter.tcCd = null;

	$scope.current_page = 1;
	$scope.total_enrich_schedules = 0;
	$scope.total_pages = 0;
	$scope.filter.ltCd = null;
	$scope.filter.startDate = null;
	$scope.filter.endDate = null;

	$scope.init = function() {

		var startDt = new Date();
		var endDt = new Date();		
		startDt.setDate(startDt.getDate() - 14);
		$scope.filter.startDate = $filter('date')(startDt, "yyyy-MM-dd"); 
		$scope.filter.endDate = $filter('date')(endDt, "yyyy-MM-dd");
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		
		$scope.getCustomerCompanies();
		$scope.getTeachers();
		$scope.getLectures();
		$scope.getEnrichScheduleCount();		
	};

	$scope.getLectures = function() {
		var params = {
			cpCd : $scope.filter.cpCd,
			tcCd : $scope.filter.tcCd
		};
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectures = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.saveLectureSchedule = function(obj) {
		
		$rootScope.showConfirm('출석확정을 하시겠습니까?', function() {
			var params = {
					saveType : 'EC',
					lsCd : obj.lsCd,
					enrichCancelState : 'S'
			};
			
			$ksHttp.post('LectureScheduleSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				if(rs[0].result == 'succ') {
					$rootScope.showMessage('success', rs[0].message);
					obj.enrichCancelState = 'S';
				}
				else {
					$rootScope.showMessage('error', rs[0].message);
				}
				
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	};

	
	$scope.exportEcel = function(){
		var filter = $scope.filter;

		var config = {
			cpCd : typeof(filter.cpCd) != 'undefined' && filter.cpCd != null ? filter.cpCd : '',
			tcCd : typeof(filter.tcCd) != 'undefined' && filter.tcCd != null ? filter.tcCd : '',
			ltCd : typeof(filter.ltCd) != 'undefined' && filter.ltCd != null ? filter.ltCd : '',
			shStartDt : typeof(filter.startDate) != 'undefined' && filter.startDate != null ? filter.startDate : '',
			shEndDt : typeof(filter.endDate) != 'undefined' && filter.endDate != null ? filter.endDate : '',
		};

		window.open('/excel/guarantee.do?cpCd='+ config.cpCd + '&tcCd=' + config.tcCd + '&ltCd=' + config.ltCd + '&shStartDt=' + config.shStartDt + '&shEndDt=' + config.shEndDt);
    };
    
	$scope.getCustomerCompanies = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getTeachers = function() {
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.buildEnrichScheduleParams = function() {
		var filter = $scope.filter;
		var start_page = $scope.current_page == 1 ? 1
				: ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;

		return {
			cpCd : filter.cpCd,
			tcCd : filter.tcCd,
			ltCd : filter.ltCd,
			shStartDt : filter.startDate,
			shEndDt : filter.endDate,
			startPage : start_page,
			endPage : end_page
		};
	};

	$scope.getEnrichSchedule = function() {
		var params = $scope.buildEnrichScheduleParams();
		$ksHttp.post("EnrichScheduleList", params).then(function(rs) {
			$scope.enrich_schedules = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getEnrichScheduleCount = function() {
		var params = $scope.buildEnrichScheduleParams();
		$ksHttp.post('EnrichScheduleListCnt', params).then(
				function(rs) {
					rs = JSON.parse(rs);
					if (rs && rs.length > 0) {						
						$scope.total_enrich_schedules = rs[0].totalcnt;
						$scope.total_pages = Math
								.ceil($scope.total_enrich_schedules
										/ $scope.app.page_size);
					}
				}, function(error) {
					console.error(error);
				});
	};

	$scope.$watch('current_page', function() {
		$scope.getEnrichSchedule();
	});

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
	
	$scope.setStartEndDt = function()
	{
		var current_lecture = null;
		if($scope.filter.ltCd)
		{
			current_lecture = $.grep($scope.lectures, function(x,i){return x.ltCd == $scope.filter.ltCd})[0];
			$scope.filter.startDate = current_lecture.startDt;
			$scope.filter.endDate = current_lecture.endDt;
		}
	}

};

