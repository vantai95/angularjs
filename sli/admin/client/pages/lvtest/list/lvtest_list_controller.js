'use strict';

app.controller('levelTestListController', LevelTestListController);
app.controller('LevelTestPopUpController', LevelTestPopUpController);
app.controller('LevelTestPopUp2Controller', LevelTestPopUp2Controller);

function LevelTestListController($ksHttp, $scope, $rootScope, $uibModal){
	$scope.lvtests = [];
	$scope.lectures = [];
	$scope.customers = [];
	$scope.selected_lecture = null;
	$scope.customer_missons = [];
	$scope.selected_customer = null;
	$scope.total_lvtests = 0;
	$scope.total_pages = 0;
	$scope.current_page = 1;
	
	
	$scope.init = function() {
		$scope.getListLectures();
		$scope.getListCustomers();
		$scope.getListLVTestCnt();
	};
	
	$scope.search = function() {
		$scope.total_pages = 0;
		$scope.current_page = 1;
		
		$scope.getListLVTestCnt();
	}
	$scope.getListLectures = function(){
		var params = {};
						
		$ksHttp.post('TeacherListBox', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lectures = rs;
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getListCustomers = function(){
		var params = {};
		
		$ksHttp.post('CustomerCompanyListBox', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.customers = rs;
		}, function(error) {
			console.log(error);
		});
	}

	$scope.getListLVTestCnt = function(){
		var params = {
			lecture : $scope.selected_lecture,
			customer : $scope.selected_customer
		}

		$ksHttp.post('LectureForLevelTestCnt', params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs && rs.length > 0){
				$scope.total_lvtests = rs[0].totalcnt;
				$scope.total_pages = Math.ceil($scope.total_lvtests/$scope.app.page_size);
				$scope.getListLVTest();
			}
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getListLVTest = function(){
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			lecture : $scope.selected_lecture,
			customer : $scope.selected_customer,
			startPage: start_page,
			endPage: end_page
		}

		$ksHttp.post('LectureForLevelTest', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lvtests = rs;
		}, function(error) {
			console.log(error);
		});
	};
	
	
	
	$scope.$watch('current_page', function(){
		$scope.getListLVTest();
		
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
	
	$scope.openLevelTestSettingLayerPopup = function(data) {
		var tmpData = {item: data, type : 'I'};
		
		var lvtestSettingPopupInstance = $uibModal.open({
			templateUrl : 'popup',
			controller : 'LevelTestPopUpController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item: tmpData
			}
		});
		
		lvtestSettingPopupInstance.result.then(function(result) {
            // recieve returned data
			$scope.getListLVTest();
			
		}, function(err) {
			$scope.getListLVTest();
		});
	};

	$scope.openLevelTestSettingLayerPopup2 = function(data) {
		var tmpData = {item: data, type : 'U'};
		
		var lvtestSettingPopupInstance = $uibModal.open({
			templateUrl : 'popup',
			controller : 'LevelTestPopUpController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item: tmpData
			}
		});
		
		lvtestSettingPopupInstance.result.then(function(result) {
            // recieve returned data
			$scope.getListLVTest();
			
		}, function(err) {
			$scope.getListLVTest();
		});
	};
	
	$scope.openLevelTestResultLayerPopup = function(data) {
		
		var lvTestResultLayerPopupInstance = $uibModal.open({
			templateUrl : 'popup2',
			controller : 'LevelTestPopUp2Controller',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item : data
			}
		});
		
		lvTestResultLayerPopupInstance.result.then(function(result) {
            // recieve returned data
			$scope.getListLVTest();
			
		}, function(err) {
			console.log(err);
			$scope.getListLVTest();
		});
	};

};

function LevelTestPopUpController($ksHttp, $scope, $rootScope , $uibModalInstance, $filter, item){
	$scope.lvtest = item.item;
	$scope.type = item.type;
	$scope.selected_rating = '0';
	$scope.selected_method = '0';
	$scope.from_evaluation_schedule = '';
	$scope.to_evaluation_schedule = '';
	$scope.selected_tpcd = 'Business';
	$scope.grade_open_type = 'Y';
	$scope.info = {};
	$scope.article_1 = '';
	$scope.article_2 = '';
	$scope.article_3 = '';
	$scope.article_4 = '';
	$scope.article_5 = '';
	$scope.article_6 = '';
	$scope.article_7 = '';
	$scope.article_8 = '';
	$scope.article_9 = '';
	$scope.article_10 = '';

	$scope.init_popup = function(){
		$scope.setDate();
		if($scope.lvtest.testCnt > 0) {
			$scope.type = 'N';
		}
		
		if($scope.type != 'I') {
			$scope.getLevelTestData();
		}
	};
	
	$scope.setDate = function(){
		$scope.from_evaluation_schedule = $filter('date')(new Date(), "yyyy-MM-dd"); 
		$scope.to_evaluation_schedule = $filter('date')(new Date(), "yyyy-MM-dd"); 
	};
	
	$scope.$watch('[from_evaluation_schedule, to_evaluation_schedule]', function(){
		if($scope.from_evaluation_schedule > $scope.to_evaluation_schedule){
			
				$scope.to_evaluation_schedule = $scope.from_evaluation_schedule;
		}
		
	});
	
	$scope.getLevelTestData = function() {
		var params = {
			lvCd : $scope.lvtest.lvCd
		}

		$ksHttp.post('GetLevelTest', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.info = rs[0];
			$scope.selected_tpcd = $scope.info.tpCd;
			$scope.selected_method = $scope.info.evaMethod;
			$scope.from_evaluation_schedule = $scope.info.apprStartDt;
			$scope.to_evaluation_schedule = $scope.info.apprEndDt;
			$scope.grade_open_type = $scope.info.gradeOpenType;
			$scope.article_1 = $scope.info.article1;
			$scope.article_2 = $scope.info.article2;
			$scope.article_3 = $scope.info.article3;
			$scope.article_4 = $scope.info.article4;
			$scope.article_5 = $scope.info.article5;
			$scope.article_6 = $scope.info.article6;
			$scope.article_7 = $scope.info.article7;
			$scope.article_8 = $scope.info.article8;
			$scope.article_9 = $scope.info.article9;
			$scope.article_10 = $scope.info.article10;
			if($scope.info.gradeOpenType == 'S') {
				$scope.grade_open_dt = $scope.info.gradeOpenDt;
			}
			$scope.selected_method = $scope.info.evaMethod;
			
			$scope.setDefaultDt($scope.from_evaluation_schedule, $scope.to_evaluation_schedule, $scope.grade_open_dt);
			
		}, function(error) {
			$rootScope.showMessage('error', '레벨테스트 정보 호출에 실패했습니다.');
			console.log(error);
			$uibModalInstance.close();
		});
	}

	$scope.cancelSetting = function(){
		$rootScope.showConfirm('설정을 취소하시겠습니까?', function() {
			$uibModalInstance.close();
		});
	};
	
	$scope.submitSetting = function(){
		if($scope.from_evaluation_schedule == '') {
			$rootScope.showMessage('error', '평가시작일을 입력해 주세요.');
			return;
		}
		if($scope.to_evaluation_schedule == '') {
			$rootScope.showMessage('error', '평가시작일을 입력해 주세요.');
			return;
		}
		if($scope.grade_open_type == 'S' && $scope.grade_open_dt == '') {
			$rootScope.showMessage('error', '성적공개일을 입력해 주세요.');
			return;
		}
		if($scope.type == 'I') {
			$rootScope.showConfirm('저장하시겠습니까?', function() {
				var params = {
						lvCd : 0,
						saveType : $scope.type,
						ltCd : $scope.lvtest.ltCd,
						tpCd : $scope.selected_tpcd,
						testKind : 'FIRST',
						testNo : '0',
						apprStartDt : $scope.from_evaluation_schedule,
						apprEndDt : $scope.to_evaluation_schedule,
						gradeOpenType : $scope.grade_open_type,
						gradeOpenDt : $scope.grade_open_type == 'S' ? $scope.grade_open_dt : null,
						evMethod : $scope.selected_method,
						article_1 : '',
						article_2 : '',
						article_3 : '',
						article_4 : '',
						article_5 : '',
						article_6 : '',
						article_7 : '',
						article_8 : '',
						article_9 : '',
						article_10 : '',
						regUser : $rootScope.current_user.userId
				}
	
				$ksHttp.post('LevelTestSave', params).then(function(rs) {
					//console.log(rs);
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$uibModalInstance.close();
				}, function(error) {
					$rootScope.showMessage('error', '레벨테스트 등록에 실패했습니다.');
					console.log(error);
				});
				
			});
		}
		else if($scope.type == 'U') {
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params = {
						lvCd : $scope.lvtest.lvCd,
						saveType : $scope.type,
						ltCd : $scope.lvtest.ltCd,
						tpCd : $scope.selected_tpcd,
						testKind : 'FIRST',
						testNo : '0',
						apprStartDt : $scope.from_evaluation_schedule,
						apprEndDt : $scope.to_evaluation_schedule,
						gradeOpenType : $scope.grade_open_type,
						gradeOpenDt : $scope.grade_open_type == 'S' ? $scope.grade_open_dt : null,
						evMethod : $scope.selected_method,
						article_1 : $scope.article_1,
						article_2 : $scope.article_2,
						article_3 : $scope.article_3,
						article_4 : $scope.article_4,
						article_5 : $scope.article_5,
						article_6 : $scope.article_6,
						article_7 : $scope.article_7,
						article_8 : $scope.article_8,
						article_9 : $scope.article_9,
						article_10 : $scope.article_10,
						regUser : $rootScope.current_user.userId
				}
	
				$ksHttp.post('LevelTestSave', params).then(function(rs) {
					//console.log(rs);
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$uibModalInstance.close();
				}, function(error) {
					$rootScope.showMessage('error', '레벨테스트 수정에 실패했습니다.');
					console.log(error);
				});
				
			});
		}
		else if($scope.type == 'N') {
			$rootScope.showAlert('성적이 등록되서 수정이 불가능합니다.');
		}
	};
	
	 $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
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
		
		if( undefined != other1 && "" != other1){
			otherArr = other1.split("-");
			otherDt = new Date(otherArr[0], Number(otherArr[1])-1, otherArr[2]);
			$(".dateOther").datepicker('setDate', otherDt);
		}
	}
};

function LevelTestPopUp2Controller($ksHttp, $scope, $rootScope , $uibModalInstance, $filter, $state, item){
	$scope.lvtest = item;
	$scope.type = 'I';
	$scope.info = [];
	$scope.selected_user = {};
	
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
		if($scope.lvtest.lvCd == '' || $scope.lvtest.lvCd == null) {
			$scope.showMessage('error', '레벨테스트가 설정되지 않았습니다. 레벨테스트를 먼저 설정해 주세요.');
			$uibModalInstance.close();
			return;
		}
		
		$scope.getLevelTestData();
	};

	$scope.getLevelTestData = function() {
		var params = {
			lvCd : $scope.lvtest.lvCd
		}

		$ksHttp.post('GetLevelTest', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.info = rs[0];
			$scope.getLevelTestResult();
			$scope.setLvType();
		}, function(error) {
			$rootScope.showMessage('error', '레벨테스트 정보 호출에 실패했습니다.');
			console.log(error);
			$uibModalInstance.close();
		});
	}
	
	$scope.getLevelTestResult = function() {
		var params = {
			ltCd : $scope.lvtest.ltCd
		}

		$ksHttp.post('GetLevelTestResult', params).then(function(rs) {
			rs = JSON.parse(rs);
			//console.log(rs);
			if(rs.length <= 0) {
				$rootScope.showMessage('error', '등록된 수강생이 없습니다.');
				$uibModalInstance.close();
			}
			$scope.results = rs;
			
			if( null != $scope.selected_user){
				for( var i=0; i<rs.length; i++){
					if( rs[i].stCd == $scope.selected_user.stCd){
						$scope.selected_user = rs[i];
					}
				}
			}
		}, function(error) {
			$rootScope.showMessage('error', '레벨테스트 결과 호출에 실패했습니다.');
			console.log(error);
			$uibModalInstance.close();
		});
	}

	$scope.setLvType = function(){
		
		var tmpType = [];
		var tmpType2 = [];
		if( "Business" == $scope.info.tpCd){
			tmpType = $scope.business;
		}else if( "TOEIC" == $scope.info.tpCd){
			tmpType = $scope.toeic;
		}else if( "TOEICS" == $scope.info.tpCd){
			tmpType = $scope.toeics;
		}else if( "OPIC" == $scope.info.tpCd){
			tmpType = $scope.opic;
		}else if( "HSK" == $scope.info.tpCd){
			tmpType = $scope.hsk;
		}else if( "JLPT" == $scope.info.tpCd){
			tmpType = $scope.jlpt;
		}else if( "FLEX" == $scope.info.tpCd){
			tmpType = $scope.flex1;
			tmpType2 = $scope.flex2;
		}else if( "OPI" == $scope.info.tpCd){
			tmpType = $scope.opi;
		}else if( "CILS" == $scope.info.tpCd){
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
		if(("FLEX" == $scope.info.tpCd) && (0 < num)){
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
				if( "FLEX" == $scope.info.tpCd){
					$scope.selected_user.article2Level = $scope.tp_item2[$scope.tp_item2.length-1];
				}else{
					$scope.selected_user.article2Level = $scope.tp_item1[$scope.tp_item1.length-1];
				}
			}else if( num == 2 ){
				$scope.selected_user.article3Score = maxScore;
				if( "FLEX" == $scope.info.tpCd){
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
				if( "FLEX" == $scope.info.tpCd){
					$scope.selected_user.article2Level = $scope.tp_item2[idx];
				}else{
					$scope.selected_user.article2Level = $scope.tp_item1[idx];
				}
			}else if( num == 2 ){
				if( "FLEX" == $scope.info.tpCd){
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
			if($scope.lvtest.tpCd == 'TOEIC') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest.tpCd == 'TOEICS') {
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
			else if($scope.lvtest.tpCd == 'OPIC') {
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
			else if($scope.lvtest.tpCd == 'HSK') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || $scope.selected_user.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest.tpCd == 'JLPT') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || $scope.selected_user.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest.tpCd == 'FLEX') {
				if($scope.selected_user.article1Level == '' || $scope.selected_user.article2Level == '' || $scope.selected_user.article3Level == '') {
					$rootScope.showMessage('error', '평가레벨을 선택해 주세요.');
					return;
				}
				if($scope.selected_user.article1Score == '' || $scope.selected_user.article2Score == '' || $scope.selected_user.article3Score == '') {
					$rootScope.showMessage('error', '평가점수를 입력해 주세요.');
					return;
				}
			}
			else if($scope.lvtest.tpCd == 'OPI') {
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
			else if($scope.lvtest.tpCd == 'CILS') {
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
			else if($scope.lvtest.tpCd == 'Business') {
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
				, lvCd : $scope.lvtest.lvCd
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
					$scope.getLevelTestResult();
				}
				else {
					$rootScope.showMessage('error', message);
					$uibModalInstance.close();
					$state.reload();
				}
			}, function(error) {
				$rootScope.showMessage('error', '레벨테스트 결과 등록에 실패했습니다.');
				console.log(error);
			});
		});
	};
	
	 $scope.cancel = function () {
	        $uibModalInstance.dismiss('cancel');
	    };
};

