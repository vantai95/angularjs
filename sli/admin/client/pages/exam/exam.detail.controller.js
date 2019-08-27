'use strict';

app.controller('ExamDetailController', ExamDetailController);
app.controller('TestPopUpDetailController', TestPopUpDetailController);

function ExamDetailController($ksHttp, $scope, $rootScope, $uibModal, $stateParams, $state){
	$scope.lvCd = $stateParams.lvCd;
	$scope.ltCd = $stateParams.ltCd;
	$scope.lvtests = {};
	$scope.lecture = {};
	$scope.user_list = [];
	$scope.cols = [];
	$scope.cols['TOEIC'] = 2;
	$scope.cols['TOEICS'] = 5;
	$scope.cols['OPIC'] = 5;
	$scope.cols['HSK'] = 3;
	$scope.cols['JLPT'] = 3;
	$scope.cols['FLEX'] = 3;
	$scope.cols['OPI'] = 5;
	$scope.cols['CILS'] = 5;
	$scope.cols['Business'] = 5;
	
	$scope.colName = [];
	$scope.colName['TOEIC'] = ['L/C', 'R/C'];
	$scope.colName['TOEICS'] = ['Pronunciation', 'Intonation and Stress', 'Grammar', 'Vocabulary and Cohesion', 'Relevance of content and Completeness of content'];
	$scope.colName['OPIC'] = ['Language control', 'Function,Global Tasks', 'Text Type', 'Contents Context', 'Comprehensibility'];
	$scope.colName['HSK'] = ['Listening', 'Reading', 'Writing'];
	$scope.colName['JLPT'] = ['Language Knowledge', 'Reading', 'Listening'];
	$scope.colName['FLEX'] = ['Listening & Reading', 'Reading', 'Speaking'];
	$scope.colName['OPI'] = ['Language control', 'Function,Global Tasks', 'Text Type', 'Contents Context', 'Comprehensibility'];
	$scope.colName['CILS'] = ['Speaking', 'Listening', 'Reading', 'Writing', 'Grammar'];
	$scope.colName['Business'] = ['Speaking', 'Listening', 'Pronunciation', 'Vocabulary', 'Grammar'];
	
	$scope.selected_type = {};
	
	$scope.init = function(){
		$scope.getLecture();
		$scope.getTestData();
	};

    $scope.getLecture = function() {
    	var params = {
			ltCd: $scope.ltCd
		};

		$ksHttp.post('LectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.lecture = rs[0];
			}
		}, function(error) {
			console.log(error);
		});
    };
	
	$scope.getTestData = function() {
		var params = {
			lvCd : $scope.lvCd
		}

		$ksHttp.post('TestForLecture', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lvtest = rs[0];
			//console.log(rs);
			$scope.selected_type.cols = $scope.cols[$scope.lvtest.tpCd];
			$scope.selected_type.colName = $scope.colName[$scope.lvtest.tpCd];
			$scope.getTestResult();
		}, function(error) {
			$rootScope.showMessage('error', '평가 정보 호출에 실패했습니다.');
			console.log(error);
		});
	}

	$scope.getTestResult = function() {
		var params = {
			lvCd : $scope.lvCd
			, ltCd : $scope.ltCd
		}

		$ksHttp.post('GetTestResult', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.user_list = rs;

			if($.isEmptyObject($scope.user_list)) {
				$rootScope.showAlert('등록된 수강생이 없습니다.');
			}
			else {
				for(var i = 0; i < $scope.user_list.length; i++) {
					$scope.user_list[i].score = [];
					if($scope.user_list[i].article1Level != '') $scope.user_list[i].score[0] = $scope.user_list[i].article1Score;
					else $scope.user_list[i].score[0] = '-';
					if($scope.user_list[i].article2Level != '') $scope.user_list[i].score[1] = $scope.user_list[i].article2Score;
					else $scope.user_list[i].score[1] = '-';
					if($scope.user_list[i].article3Level != '') $scope.user_list[i].score[2] = $scope.user_list[i].article3Score;
					else $scope.user_list[i].score[2] = '-';
					if($scope.user_list[i].article4Level != '') $scope.user_list[i].score[3] = $scope.user_list[i].article4Score;
					else $scope.user_list[i].score[3] = '-';
					if($scope.user_list[i].article5Level != '') $scope.user_list[i].score[4] = $scope.user_list[i].article5Score;
					else $scope.user_list[i].score[4] = '-';
				}
			}
		}, function(error) {
			$rootScope.showMessage('error', '평가결과 호출에 실패했습니다.');
		});
	}

	
	
	$scope.openTestResultLayerPopup = function(data) {
		var tmp = {user:data, test:$scope.lvtest};
		var lvTestResultLayerPopupInstance = $uibModal.open({
			templateUrl : 'popup2',
			controller : 'TestPopUpDetailController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item : tmp
			}
		});
		
		lvTestResultLayerPopupInstance.result.then(function(result) {
            // recieve returned data
			$scope.getTestData();
			
        }, function(err) {
    		$scope.getTestData();
        });
	};
	
	$scope.goList = function() {
		$state.go('app.exam.list');
	}
	
};

function TestPopUpDetailController($ksHttp, $scope, $rootScope , $uibModalInstance, $filter, $state, item){
	$scope.type = 'I';
	$scope.selected_user = item.user;
	$scope.selected_test = item.test;
	$scope.results = [];
	$scope.testName = '최종평가';
	
	$scope.tp_item1 = [];
	$scope.tp_item2 = [];
	$scope.tp_score1 = [];	
	$scope.tp_score2 = [];
	$scope.business = ['Lv1 20~23','Lv2 24~26','Lv3 27~29','Lv4 30~32','Lv5 33~35','Lv6 36~38','Lv7 39~41','Lv8 42~44','Lv9 45~47','Lv10 48~50','Lv11 51~53','Lv12 54~56'];
	$scope.toeic = ['LV.1 0~295','LV.2 300~395','LV.3 400~495','LV.4 500~595','LV.5 600~695','LV.6 700~795','LV.7 800~895','LV.8 900~990'];
	$scope.toeics = ['LV.1 0~30','LV.2 40~50','LV.3 60~70','LV.4 80~100','LV.5 110~120','LV.6 130~150','LV.7 160~180','LV.8 190~200'];
	$scope.opic = ['NL 1~5','NM 6~20','NH 21~40','IL 41~60','IM 61~70','IH 71~80','AL 81~100'];
	$scope.hsk = ['1급 0~30','2급 31~50','3급 51~70','4급 71~80','5급 81~90','6급 91~100'];
	$scope.jlpt = ['N5 0~30','N4 31~50','N3 51~70','N2 71~90','N1 91~100'];
	$scope.flex1 = ['3C 325~425','3B 426~525','3A 526~625','2C 626~700','2B 701~775','2A 776~850','1C 851~900','1B 901~950','1A 951~1000'];
	$scope.flex2 = ['3C 110~129','3B 130~149','3A 150~169','2C 170~184','2B 185~199','2A 200~214','1C 215~226','1B 227~238','1A 239~250'];
	$scope.opi = ['NL 1~4','NM 5~20','NH 21~30','IL 31~40','IM 41~50','IH 51~60','AL 61~70','AM 71~80','AH 81~90','S 91~100'];
	$scope.cils = ['A1 0~100','A2 0~100','B1 0~100','B2 0~100','C1 0~100','C2 0~100'];
	
	$scope.init_popup = function(){
		$scope.getTestResultPop();
		$scope.setLvType();
		if($scope.selected_test.testKind == 'MIDDLE') {
			$scope.testName = '중간평가 ' + $scope.selected_test.testNo + '차';
		}
		else {
			$scope.testName = '최종평가';
		}
	};

	$scope.getTestResultPop = function() {
		var params = {
			lvCd : $scope.lvCd
			, ltCd : $scope.ltCd
		}

		$ksHttp.post('GetTestResult', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.results = rs;

			if($.isEmptyObject($scope.results)) {
				$rootScope.showAlert('등록된 수강생이 없습니다.');
				$uibModalInstance.close();
			}

			if( null != $scope.selected_user){
				for( var i=0; i<rs.length; i++){
					if( rs[i].stCd == $scope.selected_user.stCd){
						$scope.selected_user = rs[i];
					}
				}
			}
		}, function(error) {
			$rootScope.showMessage('error', '평가결과 호출에 실패했습니다.');
			console.log(error);
			$uibModalInstance.close();
		});
	}

	$scope.setLvType = function(){
		
		var tmpType = [];
		var tmpType2 = [];
		if( "Business" == $scope.selected_test.tpCd){
			tmpType = $scope.business;
		}else if( "TOEIC" == $scope.selected_test.tpCd){
			tmpType = $scope.toeic;
		}else if( "TOEICS" == $scope.selected_test.tpCd){
			tmpType = $scope.toeics;
		}else if( "OPIC" == $scope.selected_test.tpCd){
			tmpType = $scope.opic;
		}else if( "HSK" == $scope.selected_test.tpCd){
			tmpType = $scope.hsk;
		}else if( "JLPT" == $scope.selected_test.tpCd){
			tmpType = $scope.jlpt;
		}else if( "FLEX" == $scope.selected_test.tpCd){
			tmpType = $scope.flex1;
			tmpType2 = $scope.flex2;
		}else if( "OPI" == $scope.selected_test.tpCd){
			tmpType = $scope.opi;
		}else if( "CILS" == $scope.selected_test.tpCd){
			tmpType = $scope.cils;
		}
		
		var arr = [];
		var arr2 = [];
		for( var i=0; i< tmpType.length; i++){
			arr = tmpType[i].split(" ");
			arr2 = arr[1].split("~");
			
			$scope.tp_item1.push(arr[0]);
			$scope.tp_score1.push({sNum : arr2[0], eNum : arr2[1]});
		}
		for( var i=0; i< tmpType2.length; i++){
			arr = tmpType2[i].split(" ");
			arr2 = arr[1].split("~");
			
			$scope.tp_item2.push(arr[0]);
			$scope.tp_score2.push({sNum : Number(arr2[0]), eNum : Number(arr2[1])});
		}		
		//console.log("1=> "+$scope.tp_item1);
		//console.log("2=> "+$scope.tp_score1);
	}
	
	$scope.setAutoSelect = function(num){
		
		var sUser = $scope.selected_user;
		var t_score = [sUser.article1Score, sUser.article2Score, sUser.article3Score, sUser.article4Score, sUser.article5Score];
		
		var readNum = Number(t_score[num]);
		var idx = 0;
		var maxScore = 0;
		for( var i=0; i< $scope.tp_score1.length; i++ ){
			maxScore = Number($scope.tp_score1[i].eNum);
			if( $scope.tp_score1[i].sNum <= readNum && readNum <= $scope.tp_score1[i].eNum ) {
				idx = i;
				break;
			}
		}
		if(("FLEX" == $scope.selected_test.tpCd) && (0 < num)){
			for( var i=0; i< $scope.tp_score2.length; i++ ){
				maxScore = Number($scope.tp_score2[i].eNum);
				if( $scope.tp_score2[i].sNum <= readNum && readNum <= $scope.tp_score2[i].eNum ) {
					idx = i;
					break;
				}
			}
		}
				
		if( maxScore < readNum ){
			$rootScope.showMessage('error', '최대값은 '+maxScore+"점 입니다.");			
			if( num == 0 ){
				$scope.selected_user.article1Score = maxScore;
				$scope.selected_user.article1Level = $scope.tp_item1[$scope.tp_item1.length-1];  
			}else if( num == 1 ){
				$scope.selected_user.article2Score = maxScore;
				if( "FLEX" == $scope.selected_test.tpCd){
					$scope.selected_user.article2Level = $scope.tp_item2[$scope.tp_item2.length-1];
				}else{
					$scope.selected_user.article2Level = $scope.tp_item1[$scope.tp_item1.length-1];
				}
			}else if( num == 2 ){
				$scope.selected_user.article3Score = maxScore;
				if( "FLEX" == $scope.selected_test.tpCd){
					$scope.selected_user.article3Level = $scope.tp_item2[$scope.tp_item2.length-1];
				}else{
					$scope.selected_user.article3Level = $scope.tp_item1[$scope.tp_item1.length-1];
				}
			}else if( num == 3 ){
				$scope.selected_user.article4Score = maxScore;
				$scope.selected_user.article4Level = $scope.tp_item1[$scope.tp_item1.length-1];
			}else if( num == 4 ){
				$scope.selected_user.article5Score = maxScore;
				$scope.selected_user.article5Level = $scope.tp_item1[$scope.tp_item1.length-1];
			}
		}else{

			if( num == 0 ){
				$scope.selected_user.article1Level = $scope.tp_item1[idx];
			}else if( num == 1 ){
				if( "FLEX" == $scope.selected_test.tpCd){
					$scope.selected_user.article2Level = $scope.tp_item2[idx];
				}else{
					$scope.selected_user.article2Level = $scope.tp_item1[idx];
				}
			}else if( num == 2 ){
				if( "FLEX" == $scope.selected_test.tpCd){
					$scope.selected_user.article3Level = $scope.tp_item2[idx];
				}else{
					$scope.selected_user.article3Level = $scope.tp_item1[idx];
				}
			}else if( num == 3 ){
				$scope.selected_user.article4Level = $scope.tp_item1[idx];
			}else if( num == 4 ){
				$scope.selected_user.article5Level = $scope.tp_item1[idx];
			}
		}
	}
	
	$scope.cancelSetting = function(){
		$rootScope.showConfirm('설정을 취소하시겠습니까?', function() {
			$uibModalInstance.close();
		});
	};
	
	$scope.setUserResult = function(user) {
		$scope.selected_user = user;
	}
	
	$scope.saveScore = function(){
		if( null == $scope.selected_user){
			$rootScope.showMessage('error', '수강생을 선택해 주세요.');
			return;
		}
		if( undefined == $scope.selected_user.stCd || "" == $scope.selected_user.stCd){
			$rootScope.showMessage('error', '수강생을 선택해 주세요.');
			return;
		}

		$rootScope.showConfirm($scope.selected_user.userName + '님의 성적을 저장하시겠습니까?', function() {
			if($scope.selected_test.tpCd == 'TOEIC') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'TOEICS') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' ||
					$scope.selected_user.article3Level == '' || $scope.selected_user.article4Level == '' || $scope.selected_user.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '' || $scope.selected_user.article4Score == '' || $scope.selected_user.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'OPIC') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || 
					$scope.selected_user.article3Level == '' || $scope.selected_user.article4Level == '' || $scope.selected_user.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '' || $scope.selected_user.article4Score == '' || $scope.selected_user.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'HSK') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || $scope.selected_user.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'JLPT') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || $scope.selected_user.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'FLEX') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || $scope.selected_user.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'OPI') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || 
					$scope.selected_user.article3Level == '' || $scope.selected_user.article4Level == '' || $scope.selected_user.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '' || $scope.selected_user.article4Score == '' || $scope.selected_user.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'CILS') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || 
					$scope.selected_user.article3Level == '' || $scope.selected_user.article4Level == '' || $scope.selected_user.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '' || $scope.selected_user.article4Score == '' || $scope.selected_user.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.selected_test.tpCd == 'Business') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || 
					$scope.selected_user.article3Level == '' || $scope.selected_user.article4Level == '' || $scope.selected_user.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '' || $scope.selected_user.article4Score == '' || $scope.selected_user.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			
			var totalScore = 0;
			var cnt = 0;
			var avgScore = 0;
			if($scope.selected_user.article1Score != '' && $scope.selected_user.article1Level != '') {
				totalScore += parseInt($scope.selected_user.article1Score);
				cnt++;
			}
			if($scope.selected_user.article2Score != '' && $scope.selected_user.article2Level != '') {
				totalScore += parseInt($scope.selected_user.article2Score);
				cnt++;
			}
			if($scope.selected_user.article3Score != '' && $scope.selected_user.article3Level != '') {
				totalScore += parseInt($scope.selected_user.article3Score);
				cnt++;
			}
			if($scope.selected_user.article4Score != '' && $scope.selected_user.article4Level != '') {
				totalScore += parseInt($scope.selected_user.article4Score);
				cnt++;
			}
			if($scope.selected_user.article5Score != '' && $scope.selected_user.article5Level != '') {
				totalScore += parseInt($scope.selected_user.article5Score);
				cnt++;
			}
			if($scope.selected_user.article6Score != '' && $scope.selected_user.article6Level != '') {
				totalScore += parseInt($scope.selected_user.article6Score);
				cnt++;
			}
			if($scope.selected_user.article7Score != '' && $scope.selected_user.article7Level != '') {
				totalScore += parseInt($scope.selected_user.article7Score);
				cnt++;
			}
			if($scope.selected_user.article8Score != '' && $scope.selected_user.article8Level != '') {
				totalScore += parseInt($scope.selected_user.article8Score);
				cnt++;
			}
			if($scope.selected_user.article9Score != '' && $scope.selected_user.article9Level != '') {
				totalScore += parseInt($scope.selected_user.article9Score);
				cnt++;
			}
			if($scope.selected_user.article10Score != '' && $scope.selected_user.article10Level != '') {
				totalScore += parseInt($scope.selected_user.article10Score);
				cnt++;
			}
			avgScore = Math.round(totalScore/cnt * 10) / 10;

			$scope.selected_user.totalScore = totalScore;
			$scope.selected_user.avgScore = avgScore;
			var params = {
				lagCd : $scope.selected_user.lagCd == '' ? '0' : $scope.selected_user.lagCd
				, saveType : $scope.selected_user.lagCd == '' ? 'I' : 'U'
				, lvCd : $scope.selected_test.lvCd
				, stCd : $scope.selected_user.stCd
				, article1Level : $scope.selected_user.article1Level
				, article2Level : $scope.selected_user.article2Level
				, article3Level : $scope.selected_user.article3Level
				, article4Level : $scope.selected_user.article4Level
				, article5Level : $scope.selected_user.article5Level
				, article6Level : $scope.selected_user.article6Level
				, article7Level : $scope.selected_user.article7Level
				, article8Level : $scope.selected_user.article8Level
				, article9Level : $scope.selected_user.article9Level
				, article10Level : $scope.selected_user.article10Level
				, article1Score : $scope.selected_user.article1Score == '' ? '0' : $scope.selected_user.article1Score
				, article2Score : $scope.selected_user.article2Score == '' ? '0' : $scope.selected_user.article2Score
				, article3Score : $scope.selected_user.article3Score == '' ? '0' : $scope.selected_user.article3Score
				, article4Score : $scope.selected_user.article4Score == '' ? '0' : $scope.selected_user.article4Score
				, article5Score : $scope.selected_user.article5Score == '' ? '0' : $scope.selected_user.article5Score
				, article6Score : $scope.selected_user.article6Score == '' ? '0' : $scope.selected_user.article6Score
				, article7Score : $scope.selected_user.article7Score == '' ? '0' : $scope.selected_user.article7Score
				, article8Score : $scope.selected_user.article8Score == '' ? '0' : $scope.selected_user.article8Score
				, article9Score : $scope.selected_user.article9Score == '' ? '0' : $scope.selected_user.article9Score
				, article10Score : $scope.selected_user.article10Score == '' ? '0' : $scope.selected_user.article10Score
				, totalScore : totalScore
				, avgScore : avgScore
				, cnts : $scope.selected_user.cnts
				, weakPoints : $scope.selected_user.weakPoints
				, actionPlan : $scope.selected_user.actionPlan				
				, regUser : $rootScope.current_user.userId
			}
			//console.log(params);

			$ksHttp.post('LevelTestResultSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				if(status == 'succ') {
					$rootScope.showMessage('success', message);
					$scope.getTestResultPop();
				}
				else {
					$rootScope.showMessage('error', message);
					$uibModalInstance.close();
					$state.reload();
				}
			}, function(error) {
				$rootScope.showMessage('error', '평가 결과 등록에 실패했습니다.');
				console.log(error);
			});
		});
	};
	
	 $scope.cancel = function () {
	        $uibModalInstance.dismiss('cancel');
	    };
};