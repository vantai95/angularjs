'use strict';

app.controller('lecture_listController', Lecture_listController);
function Lecture_listController($scope, $filter, $stateParams, $rootScope, $ksHttp, $uibModal) {
	$scope.dateCur = $filter('date')(new Date(), "yyMMdd");
	$scope.customer_companies = [];
	$scope.teachers = []; 
	$scope.dropdown_lectures = [];
	$scope.subjects = [];
	$scope.filter = {stateY: true, stateN: true, stateW: true};
	$scope.is_all_states_checked = true;
	$scope.lectures = [];
	$scope.current_page = 1;
	$scope.total_lectures = 0;
	$scope.total_pages = 0;
	
	$scope.init = function() {
		$scope.getCustomerCompanies();
		$scope.getTeachers();
		$scope.getDropdownLectures();
		$scope.getSubjects();
		$scope.getLectureCount();
		$scope.getLectures();
	};
	
	$scope.getDropdownLectures = function() {
		var paramLecSort ={
				groupId : 'LECTURE_SORT'
		}
		$ksHttp.post('CodeList', paramLecSort).then(function(rs) {
			$scope.dropdown_lectures = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getCustomerCompanies = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getTeachers  = function() {
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getSubjects = function() {
		$ksHttp.post('SubjectMasterList', {}).then(function(rs) {
			$scope.subjects = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.checkAllStates = function() {
		$scope.filter.stateY = $scope.filter.stateN = $scope.filter.stateW = $scope.is_all_states_checked;
	};
	
	$scope.changeState = function() {
		$scope.is_all_states_checked = $scope.filter.stateY && $scope.filter.stateN && $scope.filter.stateW;
	};
	
	$scope.buildLectureParams = function(){
		var filter = $scope.filter;
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		
		return {
				stateY: filter.stateY ? 'Y' : '',
				stateN: filter.stateN ? 'Y' : '',
				stateW: filter.stateW ? 'Y' : '',
				cpCd: filter.company,
				tcCd: filter.teacher,
				sjCd: filter.subject,
				lectureSort: filter.lecture,
				startPage : start_page,
				endPage : end_page
		};
	};
	
	$scope.getLectures = function() {
		var params = $scope.buildLectureParams();
		$ksHttp.post('LectureList', params).then(function(rs) {
			$scope.lectures = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getLectureCount = function() {
		var params = $scope.buildLectureParams();
		$ksHttp.post('LectureListCnt', params).then(function(rs) {
			rs = JSON.parse(rs)

			if(rs && rs.length > 0){
				$scope.total_lectures = rs[0].totalcnt;
				$scope.total_pages = Math.ceil($scope.total_lectures/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.$watch('current_page', function(){
		$scope.getLectures();
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

	$scope.fnDownload =function(){
		var filter = $scope.filter;
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;

		var config = {
				stateY: filter.stateY ? 'Y' : '',
				stateN: filter.stateN ? 'Y' : '',
				stateW: filter.stateW ? 'Y' : '',
				cpCd: typeof(filter.company) != 'undefined' && filter.company != null ? filter.company : '',
				tcCd: typeof(filter.teacher) != 'undefined' && filter.teacher != null ? filter.teacher : '',
				sjCd: typeof(filter.subject) != 'undefined' && filter.subject != null ? filter.subject : '',
				lectureSort: typeof(filter.lecture) != 'undefined' && filter.lecture != null ? filter.lecture : '',
		};

		window.open('/excel/lecture.do?stateY='+ config.stateY + '&stateN=' + config.stateN + '&stateW=' + config.stateW +
											'&cpCd=' + config.cpCd + '&tcCd=' + config.tcCd + '&sjCd=' + config.sjCd + '&lectureSort=' + config.lectureSort);
	}
	
};

