"use strict";
app.controller("ServeySettingController", ServeySettingController);
app.controller("SurveyDetailModalController1", SurveyDetailModalController);

function ServeySettingController($scope, $rootScope, $state, $stateParams, $uibModal, $filter, $ksHttp) {
    $scope.newYn = '';
    $scope.filter = {};
	$scope.filter.cpCd = null;
	$scope.filter.ltCd = null;
	$scope.tempSurvInfo = {};
	
	$scope.survey = {};
	$scope.questions = [];
	$scope.deafult_questions = [{
									survTitle: '강사의 수업에 대한 열의/성의는 어느 정도 였습니까?',
									orderNo: 1,
									useYn: 'Y',
									survType: 'M',
									avgYn : 'Y',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
										{survNm: '4점 - 그렇다', survNo: 2},
										{survNm: '3점 - 보통이다', survNo: 3},
										{survNm: '2점 - 그렇지 않다', survNo: 4},
										{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								},
								{
									survTitle: '강사는 수업 목적에 맞춰 수업 내용을 체계적으로 전달하였습니까?',
									orderNo: 2,
									useYn: 'Y',
									survType: 'M',
									avgYn : 'Y',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '강사는 수업시간을 체계적으로 운영하였습니까?',
									orderNo: 3,
									useYn: 'Y',
									survType: 'M',
									avgYn : 'Y',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '수업내용이 학습자 실력향상에 도움이 되었습니까?',
									orderNo: 4,
									useYn: 'Y',
									survType: 'M',
									avgYn : 'Y',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '교재 및 수업자료는 본 과정에 맞게 구성되었습니까?',
									orderNo: 5,
									useYn: 'Y',
									survType: 'M',
									avgYn : 'Y',
									answers: [{survNm: '5점 - 매우 그렇다', survNo: 1},
												{survNm: '4점 - 그렇다', survNo: 2},
												{survNm: '3점 - 보통이다', survNo: 3},
												{survNm: '2점 - 그렇지 않다', survNo: 4},
												{survNm: '1점 - 전혀 그렇지 않다', survNo: 5}]
								
								},
								{
									survTitle: '수업 중 어느 부분이 가장 유익하고 도움이 되었습니까?',
									orderNo: 6,
									useYn: 'Y',
									survType: 'M',
									avgYn : 'N',
									answers: [{survNm: '유창성 및 발음', survNo: 1},
										{survNm: '정확성(문법/작문/독해', survNo: 2},
										{survNm: '이해도 및 청취력', survNo: 3},
										{survNm: '어휘력', survNo: 4},
										{survNm: '자신감', survNo: 5}]
								
								},
								{
									survTitle: '교육 과정에 대한 유익한 점 또는 개선과 관련된 의견을 자유롭게 작성해 주십시오.',
									orderNo: 7,
									useYn: 'Y',
									survType: 'S',
									avgYn : 'N',
									answers: [{survNm: '', survNo: 1}]
								
								}];
	$scope.question = {};

	$scope.init = function() {
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		
		if($stateParams.smCd == undefined || $stateParams.smCd == null || $stateParams.smCd == '' ){
			$scope.newYn = 'Y';
			$scope.getCompanies();
			$scope.getLectureListBox();
		}else{
			$scope.newYn = 'N';
			$scope.getSurvey();
		}		
		
		if($stateParams.smCd){
			$scope.getQuestions();
		}else{
			$scope.questions = angular.copy($scope.deafult_questions);
		}
	};

	$scope.getCompanies = function(){
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.companies = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getLectureListBox = function() {
		var params = {
				cpCd: $scope.filter.cpCd
		}
		
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectureListBox= JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.checkSurvInfo = function(){
		var params = {
				ltCd: $scope.filter.ltCd
		}
		$ksHttp.post('GetTargetSurvInfo', params).then(function(rs) {
			$scope.tempSurvInfo = JSON.parse(rs)[0];
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getQuestions = function() {
		$ksHttp.post('SurvInfoDetailItemList', {
			smCd : $stateParams.smCd
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
					temp.survType = x.survType;
					temp.avgYn = x.avgYn;
					if(!temp.answers)
						temp.answers = [];
					temp.answers.push({ssCd: x.ssCd, survNm: x.survNm, survNo: x.survNo, survType:x.survType});
					questions[x.stCd] = temp;
				});

				$.each(questions, function(stCd, x){
					//x.survType = (x.answers.length == 5 ? 3 : (x.answers.length == 4 ? 2 : 1));
					x.answers.sort(function(a,b) { return b.survNo < a.survNo; });
					$scope.questions.push(x);
					$scope.questions.sort(function(a,b) { return b.orderNo < a.orderNo; });
				});
			}
			else{
				$scope.questions = angular.copy($scope.deafult_questions);
			}
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getSurvey = function() {
		var params = {
			ltCd : $stateParams.id,
			smCd : $stateParams.smCd
		};
		$ksHttp.post('SurvInfoDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.survey = rs[0];
				$scope.setDefaultDt($scope.survey.survStartDt, $scope.survey.survEndDt);
			}
			
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.validateNewQuestion = function(){
		var obj = $scope.question;
		var required_msg = $scope.$parent.app.required_msg;

		if($.trim(obj.survTitle) == '' && !obj.survType){
			$rootScope.showAlert('문항, 답변항목을 입력해주세요');
			return false;
		}
		
		if($.trim(obj.survTitle) == ''){
			$rootScope.showAlert('문항' + required_msg.textbox);
			return false;
		}
		
		if(!obj.survType){
			$rootScope.showAlert('답변' + required_msg.dropdown);
			return false;
		}
		
		if((parseInt(obj.survType) == 1 && ($.trim(obj.itemSurvNm1) == '' || $.trim(obj.itemSurvNm2) == '' || $.trim(obj.itemSurvNm3) == '' || $.trim(obj.itemSurvNm4) == '' || $.trim(obj.itemSurvNm5) == '')) ||
			(parseInt(obj.survType) == 2 && ($.trim(obj.itemSurvNm1) == '' || $.trim(obj.itemSurvNm2) == '' || $.trim(obj.itemSurvNm3) == '' || $.trim(obj.itemSurvNm4) == ''))){
			$rootScope.showAlert('답변' + required_msg.textbox);
			return false;
		}
		
		if($.grep($scope.questions, function(x, i){ return x.survTitle == obj.survTitle;}).length > 0){
			$rootScope.showAlert('동일한 질문이 존재합니다.');
			return false;
		}
		
		return true;
	};
	
	$scope.addQuestion = function() {
		if($scope.validateNewQuestion()){
			var obj = $scope.question;
			var answers = [];
			answers.push({survNm: obj.itemSurvNm1, survNo: 1});
			
			if(obj.survType != 3){
				answers.push({survNm: obj.itemSurvNm2, survNo: 2});
				answers.push({survNm: obj.itemSurvNm3, survNo: 3});
				answers.push({survNm: obj.itemSurvNm4, survNo: 4});
			}
			
			if(obj.survType == 1){
				answers.push({survNm: obj.itemSurvNm5, survNo: 5});
			}
			
			$scope.questions.push({
				survTitle: obj.survTitle,
				orderNo: $scope.questions.length + 1,
				survType:(obj.survType == 3 ? 'S' : 'M'),
				isNew: true,
				answers: answers,
				useYn: 'Y',
				avgYn: 'N',
			});
			
			 $scope.question = {};
		}
	};

	$scope.deleteQuestion = function(question) {
		var idx = $.inArray(question, $scope.questions);
		$scope.questions.splice(idx, 1);
	};

	$scope.validate = function(){
		var obj = $scope.survey;
		var required_msg = $scope.$parent.app.required_msg;

		if( $scope.newYn == 'Y'){
			if( $scope.filter.ltCd == null || $scope.filter.ltCd == undefined || $scope.filter.ltCd == ''){
				$rootScope.showAlert('강의명을 선택해주세요.');
				return false;
			}
		}
		
		if($.trim(obj.survStartDt) == ''){
			$rootScope.showAlert('설문기간' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.survEndDt) == ''){
			$rootScope.showAlert('설문기간' + required_msg.dropdown);
			return false;
		}
		
		return true;
	};

	$scope.generateSurveyParams = function(){
		var obj = $scope.survey;
		var questions = [];
		
		if($scope.questions.length){
			$.each($scope.questions, function(i, x){
				var temp = x.answers.sort(function(a,b) { return b.survNo < a.survNo; });
				var answers = new Array('', '', '', '', '');
				$.each(temp, function(i,x){answers[i] = x.survNm});
				
				questions.push({
					survTitle: x.survTitle,
					orderNo: x.orderNo,
					survType: x.survType,
					itemSurvNm1: answers[0],
					itemSurvNm2: answers[1],
					itemSurvNm3: answers[2],
					itemSurvNm4: answers[3],
					itemSurvNm5: answers[4],
					useYn: x.useYn,
					avgYn: x.avgYn
				});
			});
		}
		
		
		return {
			master: {
				ltCd : $scope.newYn == 'Y' ? $scope.filter.ltCd : $stateParams.id,
				smCd : ($stateParams.smCd || ''),
				cpCd : obj.cpCd ? obj.cpCd : 0,
				survStartDt : obj.survStartDt ? obj.survStartDt : null,
				survEndDt : obj.survEndDt ? obj.survEndDt : null,
				regUser: $rootScope.current_user.userId,
				updUser: $rootScope.current_user.userId
			},
			subList: questions ? questions : []
		};
	};

	$scope.saveSurvey = function() {
		if($scope.validate()){
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateSurveyParams();

				params.master.saveType = ($stateParams.smCd ? 'U' : 'I');

				$ksHttp.post('SurvSaveMaster', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.survey.list") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
			});
		}
	};

	$scope.cancelUpdating = function() {
		$rootScope.showConfirm('등록을 취소하겠습니까', function() {
			$state.go("app.survey.list");
		});
	};
	
	$scope.showSurveyDetail = function(ltCd, smCd){
		var questions = $.grep($scope.questions, function(x, i){return x.useYn == 'Y';});
		$.each(questions, function(i, x){
			x.orderNo = i + 1;
		});
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "survey_detail_modal.html",
            controller: "SurveyDetailModalController1",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            	data: {survey: $scope.survey, questions: questions}
            }
        });
        
        modalInstance.result.then(function(result) {
        }, function(err) {
            console.info(err);
        });
    }
	
	$scope.deleteSurv = function(){
		$rootScope.showConfirm('삭제하겠습니까', function() {
			
			var params = {
					saveType : 'D',
					smCd : $stateParams.smCd
			}
			
			$ksHttp.post('SurvDelete', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				status == 'succ' ? $state.go("app.survey.list") : '';
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
	}
	
	$scope.setDefaultDt = function(strDt, endDt, other1 ){		
		var strArr, endArr, newStrDt, newEndDt, otherArr, otherDt;
		
		if( undefined != strDt && "" != strDt){
			strArr = strDt.split("-");
			newStrDt = new Date(strArr[0], Number(strArr[1])-1, strArr[2]);
			$(".dateStr").datepicker('setDate', newStrDt);			
		}
		
		if( undefined != endDt && "" != endDt){
			endArr = endDt.split("-");
			newEndDt = new Date(endArr[0], Number(endArr[1])-1, endArr[2]);
			$(".dateEnd").datepicker('setDate', newEndDt);
		}
	}
};

function SurveyDetailModalController ($scope, $uibModalInstance, data) {
    $scope.survey = data.survey;
    $scope.questions = data.questions;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};
