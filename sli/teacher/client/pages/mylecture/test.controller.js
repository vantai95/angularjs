'use strict';

app.controller('TestController', TestController);
app.controller('PoupController', PoupController);

function TestController($ksHttp, $scope, $state, $uibModal, $rootScope, $stateParams) {
	$scope.ltCd = $stateParams.ltCd;
	$scope.lecture_list_box = [];
	$scope.test_list = [];
	$scope.info = {};
	$scope.lvCd = '';
	$scope.selected_test = {};
	$scope.lvtest_list = [];

	$scope.init = function() {
		if(!$stateParams.ltCd){
            $state.go("app.mylecture.index");
        } else{
			$scope.getLectureListBox();
			$scope.getTestList();
			$scope.getMyLectureDetail();
        }
	};

	$scope.changeLecture = function(){
		$scope.getTestList();
		$scope.getMyLectureDetail();
	}
	
	$scope.getLectureListBox = function() {
		var params = {
			tcCd : $scope.current_user.tcCd
		};

		$ksHttp.post('LectureListBox', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_list_box = rs;
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.changeTest = function() {
		for(var i = 0; i < $scope.test_list.length; i++) {
			if($scope.test_list[i].lvCd == $scope.lvCd) {
				$scope.lvtest_info = $scope.test_list[i];
				break;
			}
		}
//		$scope.lvtest_info = item;
		$scope.getTestResult();
	}

	$scope.getTestList = function() {
		var params = {
			ltCd : $scope.ltCd
		};

		$ksHttp.post('TestList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.test_list = rs;
			if($scope.test_list.length > 0) {
				$scope.lvCd = $scope.test_list[0].lvCd;
				$scope.lvtest_info = $scope.test_list[0];
				$scope.getTestResult();
			}
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getTestResult = function() {
		var params = {
			ltCd : $scope.ltCd,
			lvCd : $scope.lvCd
		};

		$ksHttp.post('GetTestResult', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lvtest_list = rs;
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getMyLectureDetail = function() {
		var params = {
			ltCd : $scope.ltCd
		};

		$ksHttp.post('MyLectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.info = rs[0];
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.openPopup = function(info) {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup",
			controller : "PoupController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				item : info
			}
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				//console.log('ok');
				$scope.getTestResult();
			}
		}, function(err) {
			$state.reload();
			console.info(err);
		});
	};

};

function PoupController($scope, $uibModalInstance, $rootScope, $window, $ksHttp, $state, item) {
	$scope.selected_stCd = item.stCd;
	$scope.user_list = [];
	$scope.selected_lvtest = {};
	
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
	
	$scope.initPopup = function() {
		var cnt = 0;
		var div = Math.ceil($scope.lvtest_list.length / 5);
		for(var i = 0; i < div; i++) {
			$scope.user_list[i] = [];
		}
		for(var i= 0; i < $scope.lvtest_list.length; i++) {
			$scope.user_list[cnt].push($scope.lvtest_list[i]);
			var mod = i % 5;
			if(mod == 4) {
				cnt++;
			}
			
			if($scope.lvtest_list[i].stCd == $scope.selected_stCd) {
				$scope.selected_lvtest = $scope.lvtest_list[i];
				$scope.setLvType();
			}
		}
		
	};
	
	$scope.setLvType = function(){
		
		var tmpType = [];
		var tmpType2 = [];
		if( "Business" == $scope.lvtest_info.tpCd){
			tmpType = $scope.business;
		}else if( "TOEIC" == $scope.lvtest_info.tpCd){
			tmpType = $scope.toeic;
		}else if( "TOEICS" == $scope.lvtest_info.tpCd){
			tmpType = $scope.toeics;
		}else if( "OPIC" == $scope.lvtest_info.tpCd){
			tmpType = $scope.opic;
		}else if( "HSK" == $scope.lvtest_info.tpCd){
			tmpType = $scope.hsk;
		}else if( "JLPT" == $scope.lvtest_info.tpCd){
			tmpType = $scope.jlpt;
		}else if( "FLEX" == $scope.lvtest_info.tpCd){
			tmpType = $scope.flex1;
			tmpType2 = $scope.flex2;
		}else if( "OPI" == $scope.lvtest_info.tpCd){
			tmpType = $scope.opi;
		}else if( "CILS" == $scope.lvtest_info.tpCd){
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
		
		var sUser = $scope.selected_lvtest;
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
		if(("FLEX" == $scope.lvtest_info.tpCd) && (0 < num)){
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
				$scope.selected_lvtest.article1Score = maxScore;
				$scope.selected_lvtest.article1Level = $scope.tp_item1[$scope.tp_item1.length-1];  
			}else if( num == 1 ){
				$scope.selected_lvtest.article2Score = maxScore;
				if( "FLEX" == $scope.lvtest_info.tpCd){
					$scope.selected_lvtest.article2Level = $scope.tp_item2[$scope.tp_item2.length-1];
				}else{
					$scope.selected_lvtest.article2Level = $scope.tp_item1[$scope.tp_item1.length-1];
				}
			}else if( num == 2 ){
				$scope.selected_lvtest.article3Score = maxScore;
				if( "FLEX" == $scope.lvtest_info.tpCd){
					$scope.selected_lvtest.article3Level = $scope.tp_item2[$scope.tp_item2.length-1];
				}else{
					$scope.selected_lvtest.article3Level = $scope.tp_item1[$scope.tp_item1.length-1];
				}
			}else if( num == 3 ){
				$scope.selected_lvtest.article4Score = maxScore;
				$scope.selected_lvtest.article4Level = $scope.tp_item1[$scope.tp_item1.length-1];
			}else if( num == 4 ){
				$scope.selected_lvtest.article5Score = maxScore;
				$scope.selected_lvtest.article5Level = $scope.tp_item1[$scope.tp_item1.length-1];
			}
		}else{

			if( num == 0 ){
				$scope.selected_lvtest.article1Level = $scope.tp_item1[idx];
			}else if( num == 1 ){
				if( "FLEX" == $scope.lvtest_info.tpCd){
					$scope.selected_lvtest.article2Level = $scope.tp_item2[idx];
				}else{
					$scope.selected_lvtest.article2Level = $scope.tp_item1[idx];
				}
			}else if( num == 2 ){
				if( "FLEX" == $scope.lvtest_info.tpCd){
					$scope.selected_lvtest.article3Level = $scope.tp_item2[idx];
				}else{
					$scope.selected_lvtest.article3Level = $scope.tp_item1[idx];
				}
			}else if( num == 3 ){
				$scope.selected_lvtest.article4Level = $scope.tp_item1[idx];
			}else if( num == 4 ){
				$scope.selected_lvtest.article5Level = $scope.tp_item1[idx];
			}
		}
	}
	
	$scope.changeUser = function(item){
		$scope.selected_stCd = item.stCd;
		$scope.selected_lvtest = item;
	};
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.save = function() {
		$rootScope.showConfirm($scope.selected_lvtest.userName + '님의 성적을 저장하시겠습니까?', function() {
			if($scope.lvtest_info.tpCd == 'TOEIC') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'TOEICS') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' ||
					$scope.selected_lvtest.article3Level == '' || $scope.selected_lvtest.article4Level == '' || $scope.selected_lvtest.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '' || $scope.selected_lvtest.article4Score == '' || $scope.selected_lvtest.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'OPIC') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || 
					$scope.selected_lvtest.article3Level == '' || $scope.selected_lvtest.article4Level == '' || $scope.selected_lvtest.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '' || $scope.selected_lvtest.article4Score == '' || $scope.selected_lvtest.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'HSK') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || $scope.selected_lvtest.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'JLPT') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || $scope.selected_lvtest.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'FLEX') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || $scope.selected_lvtest.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'OPI') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || 
					$scope.selected_lvtest.article3Level == '' || $scope.selected_lvtest.article4Level == '' || $scope.selected_lvtest.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '' || $scope.selected_lvtest.article4Score == '' || $scope.selected_lvtest.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'CILS') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || 
					$scope.selected_lvtest.article3Level == '' || $scope.selected_lvtest.article4Level == '' || $scope.selected_lvtest.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '' || $scope.selected_lvtest.article4Score == '' || $scope.selected_lvtest.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest_info.tpCd == 'Business') {
				if($scope.selected_lvtest.article1Level == '' || $scope.selected_lvtest.article2Level == '' || 
					$scope.selected_lvtest.article3Level == '' || $scope.selected_lvtest.article4Level == '' || $scope.selected_lvtest.article5Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_lvtest.article1Score == '' || $scope.selected_lvtest.article2Score == '' || $scope.selected_lvtest.article3Score == '' || $scope.selected_lvtest.article4Score == '' || $scope.selected_lvtest.article5Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			
			var totalScore = 0;
			var cnt = 0;
			var avgScore = 0;
			if($scope.selected_lvtest.article1Score != '' && $scope.selected_lvtest.article1Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article1Score);
				cnt++;
			}
			if($scope.selected_lvtest.article2Score != '' && $scope.selected_lvtest.article2Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article2Score);
				cnt++;
			}
			if($scope.selected_lvtest.article3Score != '' && $scope.selected_lvtest.article3Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article3Score);
				cnt++;
			}
			if($scope.selected_lvtest.article4Score != '' && $scope.selected_lvtest.article4Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article4Score);
				cnt++;
			}
			if($scope.selected_lvtest.article5Score != '' && $scope.selected_lvtest.article5Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article5Score);
				cnt++;
			}
			if($scope.selected_lvtest.article6Score != '' && $scope.selected_lvtest.article6Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article6Score);
				cnt++;
			}
			if($scope.selected_lvtest.article7Score != '' && $scope.selected_lvtest.article7Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article7Score);
				cnt++;
			}
			if($scope.selected_lvtest.article8Score != '' && $scope.selected_lvtest.article8Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article8Score);
				cnt++;
			}
			if($scope.selected_lvtest.article9Score != '' && $scope.selected_lvtest.article9Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article9Score);
				cnt++;
			}
			if($scope.selected_lvtest.article10Score != '' && $scope.selected_lvtest.article10Level != '') {
				totalScore += parseInt($scope.selected_lvtest.article10Score);
				cnt++;
			}
			avgScore = Math.round(totalScore/cnt * 10) / 10;
	
			$scope.selected_lvtest.totalScore = totalScore;
			$scope.selected_lvtest.avgScore = avgScore;
			
			var params = {
				saveType : $scope.selected_lvtest.lagCd == '' ? 'I' : 'U'
				, lagCd : $scope.selected_lvtest.lagCd == '' ? '0' : $scope.selected_lvtest.lagCd
				, lvCd : $scope.lvtest_info.lvCd
				, stCd : $scope.selected_stCd
				, article1Level : $scope.selected_lvtest.article1Level
				, article2Level : $scope.selected_lvtest.article2Level
				, article3Level : $scope.selected_lvtest.article3Level
				, article4Level : $scope.selected_lvtest.article4Level
				, article5Level : $scope.selected_lvtest.article5Level
				, article6Level : $scope.selected_lvtest.article6Level
				, article7Level : $scope.selected_lvtest.article7Level
				, article8Level : $scope.selected_lvtest.article8Level
				, article9Level : $scope.selected_lvtest.article9Level
				, article10Level : $scope.selected_lvtest.article10Level
				, article1Score : $scope.selected_lvtest.article1Score == '' ? '0' : $scope.selected_lvtest.article1Score
				, article2Score : $scope.selected_lvtest.article2Score == '' ? '0' : $scope.selected_lvtest.article2Score
				, article3Score : $scope.selected_lvtest.article3Score == '' ? '0' : $scope.selected_lvtest.article3Score
				, article4Score : $scope.selected_lvtest.article4Score == '' ? '0' : $scope.selected_lvtest.article4Score
				, article5Score : $scope.selected_lvtest.article5Score == '' ? '0' : $scope.selected_lvtest.article5Score
				, article6Score : $scope.selected_lvtest.article6Score == '' ? '0' : $scope.selected_lvtest.article6Score
				, article7Score : $scope.selected_lvtest.article7Score == '' ? '0' : $scope.selected_lvtest.article7Score
				, article8Score : $scope.selected_lvtest.article8Score == '' ? '0' : $scope.selected_lvtest.article8Score
				, article9Score : $scope.selected_lvtest.article9Score == '' ? '0' : $scope.selected_lvtest.article9Score
				, article10Score : $scope.selected_lvtest.article10Score == '' ? '0' : $scope.selected_lvtest.article10Score
				, totalScore : totalScore
				, avgScore : avgScore
				, cnts : $scope.selected_lvtest.cnts
				, weakPoints : $scope.selected_lvtest.weakPoints
				, actionPlan : $scope.selected_lvtest.actionPlan
				, regUser : $rootScope.current_user.userId
			};
	
			$ksHttp.post('LevelTestResultSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				if(status == 'succ') {
					if( "I" == params.saveType){ //중복저장 방지
						var params2 = {
							ltCd : $scope.ltCd,
							lvCd : $scope.lvCd
						};
						$ksHttp.post('GetTestResult', params2).then(function(rs) {
							rs = JSON.parse(rs);
							$scope.lvtest_list = rs;
							$scope.initPopup();
						}, function(error) {
							console.log(error);
						});
					}
						
					$rootScope.showMessage('success', message);
				}
				else {
					$rootScope.showMessage('error', message);
					$uibModalInstance.close();
					$state.reload();
				}
			}, function(error) {
				$rootScope.showMessage('error', '등록오류-관리자에게 문의해주세요.');
				console.log(error);
			});
		});
	}
};