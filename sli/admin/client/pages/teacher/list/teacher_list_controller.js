'use strict';

app.controller('teacherListController', TeacherListController);
function TeacherListController($ksHttp, $timeout, $scope, $rootScope, $http, $location, $stateParams){
	$scope.categories = [{id: "A", name: "전체"}, {id: "Y", name: "계약중"}, {id: "N", name:"계약종료"}];
	$scope.genders = [{id: "A", name: "전체"}, {id: "M", name: "남"}, {id: "F", name:"여"}];
	$scope.subjects = [];
    $scope.teachers = [];
    $scope.customer_companies = [];
    $scope.nationalities = [];
    $scope.lecture_areas = [];
    $scope.selected_category = 'A';
    $scope.selected_subject = null;
    $scope.selected_lecture_areas = null;
    $scope.selected_nationalities = null;
    $scope.selected_gender = 'A';
    $scope.user_name = null;
    $scope.current_page = 1;
	$scope.total_teachers = 0;
	$scope.total_pages = 0;
	$scope.subArea = {};
	$scope.subArea.select_sido = null;
	$scope.subArea.select_gugun = null;
	$scope.sido_list = [];
	$scope.gugun_list = [];
	$scope.order_type = '1';
	$scope.order_sort = '1';
    $scope.select_company = null;
	
    $scope.init = function(){
      $scope.getCustomerCompanies();
      $scope.getSubjects();
      $scope.getLectureAreas();
      $scope.getNationalities();
      $scope.getTeacherCount();
      $scope.getTeachers();
      $scope.getSidoList();
    };

    $scope.getCustomerCompanies = function(){
    	
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
    }
    
    $scope.getSubjects = function(){
		$ksHttp.post('SubjectMasterList', {}).then(function(rs) {
			$scope.subjects = $.parseJSON(rs);
		}, function(error) {
			console.error(error);
		});
    };
    
    $scope.getLectureAreas = function(){
    	var params = {
			groupId: 'LECTURE_AREA'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.lecture_areas = JSON.parse(rs);
			$('.select2').select2();
		}, function(error) {
			console.error(error);
		});
    };

    $scope.getNationalities = function(){
    	var params = {
			groupId : 'NATIONAL_TYPE'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.nationalities = JSON.parse(rs);
			$('.select2').select2();
		}, function(error) {
			console.error(error);
		});
    };
    
    $scope.mapLectureAreas = function(lectures){
    	if(lectures == '' || typeof(lectures) == 'undefined') {
    		return '';
    	}
    	var temp = [];
    	$.each($scope.lecture_areas, function(i, x){
    		if(lectures.indexOf(x.codeId) > -1){
    			temp.push(x.codeName1);
    		}
    	});
    	
    	return temp.join(', ');
    };

    $scope.buildTeacherParams = function(){
    	var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
    	return {
			contractYn: $scope.selected_category ? $scope.selected_category : null,
			subjectCd: $scope.selected_subject ? $scope.selected_subject : null,
			userName: $scope.user_name ? $scope.user_name : null,
			nationalType: $scope.selected_nationalities ? $scope.selected_nationalities.join(',') : '',
			gender: $scope.selected_gender ? $scope.selected_gender : null,
			lectureArea_01: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 0 ? $scope.selected_lecture_areas[0] : '',
			lectureArea_02: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 1 ? $scope.selected_lecture_areas[1] : '',
			lectureArea_03: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 2 ? $scope.selected_lecture_areas[2] : '',
			lectureArea_04: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 3 ? $scope.selected_lecture_areas[3] : '',
			lectureArea_05: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 4 ? $scope.selected_lecture_areas[4] : '',
			lectureArea_06: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 5 ? $scope.selected_lecture_areas[5] : '',
			lectureArea_07: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 6 ? $scope.selected_lecture_areas[6] : '',
			lectureArea_08: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 7 ? $scope.selected_lecture_areas[7] : '',
			lectureArea_09: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 8 ? $scope.selected_lecture_areas[8] : '',
			lectureArea_10: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 9 ? $scope.selected_lecture_areas[9] : '',
			lectureArea_11: $scope.selected_lecture_areas != null && $scope.selected_lecture_areas.length > 10 ? $scope.selected_lecture_areas[10] : '',
			gugunCd : $scope.subArea.select_gugun,			
			orderType : $scope.order_type,
			orderSort : $scope.order_sort,
			cpCd : $scope.select_company,
			startPage: start_page,
			endPage: end_page
		};
		
		if($scope.selected_lecture_areas && $scope.selected_lecture_areas.length > 0){
			$.each($scope.selected_lecture_areas, function(i, x){
				params['lectureArea_' + x] = x;
			});
		}
    }
    
    $scope.getTeacherCount = function() {
    	var params = $scope.buildTeacherParams();
		$ksHttp.post('TeacherUserListCnt', params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs && rs.length > 0){
				$scope.total_teachers = rs[0].totalcnt;
				$scope.total_pages = Math.ceil($scope.total_teachers/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.$watch('current_page', function(){
	      $scope.getTeachers();
	});
	
	$scope.setCurrentPage = function(page){
		$scope.current_page = page;
	}

    $scope.getTeachers = function(){
		var params = $scope.buildTeacherParams();
    	$ksHttp.post('TeacherUserList', params).then(function(rs) {
    		 $scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
    };


    $scope.exportExcel = function(){
      $("#tbTeachers").table2excel({
          filename: "Teacher List"
      });
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
	
	$scope.getSidoList = function()
    {
    	var paramMap = {
			groupId : 'SIDO'
		}
    	
		$ksHttp.post('CodeList', paramMap).then(function(rs) {
			$scope.sido_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
    }
    
    $scope.gugunList = function()
    {
    	var paramMap = {
    		sidoCd : $scope.subArea.select_sido
		}
		$ksHttp.post('GugunList', paramMap).then(function(rs) {
			$scope.gugun_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
    }
};

