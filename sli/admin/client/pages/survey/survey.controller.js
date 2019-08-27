"use strict";
app.controller("ServeyController", ServeyController);
app.controller("SurveyDetailModalController", SurveyDetailModalController);

function ServeyController($scope, $rootScope, $state, $uibModal, $filter, $ksHttp) {
    $scope.surveys = [];
    $scope.teachers = [];
    $scope.companies = [];
    $scope.lectureListBox= [];
    $scope.total_surveys = 0;
    $scope.total_pages = 0;
    $scope.current_page = 1;
    	
	$scope.filter = {};
	$scope.filter.cpCd = null;
	$scope.filter.tcCd = null;
	$scope.filter.ltCd = null;
	
	$scope.init = function(){
		$scope.getSurveyCount();
		$scope.getTeachers();
		$scope.getCompanies();
		$scope.getLectureListBox();
	};
	
	$scope.getTeachers = function(){
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getCompanies = function(){
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.companies = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getLectureListBox = function() {
		var params = {
				cpCd: $scope.filter.cpCd,
				tcCd: $scope.filter.tcCd
		}
		
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectureListBox= JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.search = function() {
	    $scope.total_pages = 0;
	    $scope.current_page = 1;

	    $scope.getSurveyCount();
		$scope.getSurveys();
	}
	$scope.getSurveyCount = function() {
		var count_params = {
			shTcCd :  $scope.filter.tcCd,
    		shCpCd :  $scope.filter.cpCd,
    		shLtCd :  $scope.filter.ltCd
		};

		$ksHttp.post('SurvInfoListCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs && rs.length > 0){
				$scope.total_surveys = rs[0].totalcnt;
				$scope.total_pages = Math.ceil($scope.total_surveys/$scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getSurveys = function(){
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
	    var end_page = $scope.current_page * $scope.app.page_size;
	    var params = {
	    		shTcCd :  $scope.filter.tcCd,
	    		shCpCd :  $scope.filter.cpCd,
	    		shLtCd :  $scope.filter.ltCd,
			    startPage: start_page,
			    endPage: end_page
	    };
	    
	    $ksHttp.post('SurvInfoList', params).then(function(rs){
	  		$scope.surveys = JSON.parse(rs);
	  	}, function(error){
	  		console.error(error);
	  	});
	  };
	  
	  $scope.$watch('current_page', function(){
		$scope.getSurveys();
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
	
	$scope.showSurveyDetail = function(ltCd,smCd){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "survey_detail_modal.html",
            controller: "SurveyDetailModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            	params: {id: ltCd, smCd: smCd}
            }
        });
        
        modalInstance.result.then(function(result) {
        }, function(err) {
            console.info(err);
        });
    }
};


function SurveyDetailModalController ($ksHttp, $scope, $uibModalInstance, params ,$stateParams) {
	$scope.survey = {};
	$scope.questions = [];
	$scope.deafult_questions = [{
									survTitle: '강사의 수업에 대한 열의/성의는 어느 정도 였습니까?',
									orderNo: 1,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
										{survNm: '4점 - 그렇다', survNo: 2},
										{survNm: '3점 - 보통이다', survNo: 3},
										{survNm: '2점 - 그렇지 않다', survNo: 4},
										{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								},
								{
									survTitle: '강사는 수업 목적에 맞춰 수업 내용을 체계적으로 전달하였습니까?',
									orderNo: 2,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '강사는 수업시간을 체계적으로 운영하였습니까?',
									orderNo: 3,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '수업내용이 학습자 실력향상에 도움이 되었습니까?',
									orderNo: 4,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '교재 및 수업자료는 본 과정에 맞게 구성되었습니까?',
									orderNo: 5,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '수업 중 어느 부분이 가장 유익하고 도움이 되었습니까?',
									orderNo: 6,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '유창성 및 발음', survNo: 1},
										{survNm: '정확성(문법/작문/독해', survNo: 2},
										{survNm: '이해도 및 청취력', survNo: 3},
										{survNm: '어휘력', survNo: 4},
										{survNm: '자신감', survNo: 5}]
								
								},
								{
									survTitle: '강사는 수업 목적에 맞춰 수업 내용을 체계적으로 전달하였습니까?',
									orderNo: 7,
									useYn: 'N',
									survType: 'M',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
										{survNm: '4점 - 그렇다', survNo: 2},
										{survNm: '3점 - 보통이다', survNo: 3},
										{survNm: '2점 - 그렇지 않다', survNo: 4},
										{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								}];
	$scope.question = {};

	$scope.init = function() {
		$scope.getSurvey();
		
		if(params.smCd){
			$scope.getQuestions();
		}else{
			$scope.questions = angular.copy($scope.deafult_questions);
		}
	};

	$scope.getQuestions = function() {
		$ksHttp.post('SurvInfoDetailItemList', {
			smCd : params.smCd
			, useYn : 'Y'
		}).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs.length > 0){
				var questions = {};
				$.each(rs, function(i, x){
					var temp = questions[x.stCd];
					if(!temp){
						temp = {};
					}
						
					temp.stCd = x.stCd;
					temp.survTitle = x.survTitle;
					temp.orderNo = x.orderNo;
					temp.useYn = x.useYn;
					
					if(!temp.answers)
						temp.answers = [];
					temp.answers.push({ssCd: x.ssCd, survNm: x.survNm, survNo: x.survNo});
					questions[x.stCd] = temp;
				});
				
				$.each(questions, function(stCd, x){
					x.survType = (x.answers.length == 5 ? 3 : (x.answers.length == 4 ? 2 : 1));
					x.answers.sort(function(a,b) { return b.survNo < a.survNo; });
					$scope.questions.push(x);
					$scope.questions.sort(function(a,b) { return b.orderNo < a.orderNo; });
				});
			}
			else{
				$scope.questions = angular.copy($scope.deafult_questions);
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getSurvey = function() {
		var param = {
			ltCd : params.id,
			smCd : params.smCd
		};
		
		$ksHttp.post('SurvInfoDetail', param).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.survey = rs[0];
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.cancel = function () {
	       $uibModalInstance.dismiss('cancel');
	   };
};