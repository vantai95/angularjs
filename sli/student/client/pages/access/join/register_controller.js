"use strict";
app.controller("RegisterStudentController", RegisterStudentController);

function RegisterStudentController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout, $stateParams, $state) {
	
	$scope.checked_all = false;
	$scope.checked_SLI = $stateParams.checked_SLI;
	$scope.checked_info = $stateParams.checked_info;
	$scope.checked_instruction = $stateParams.cheked_event;
	$scope.user_name = $stateParams.user_name;
	$scope.mobile = $stateParams.mobile;
	$scope.check_student = null;
	$scope.student_info = {};
	$scope.bank_accounts = [];
	$scope.selected_account = null;
	$scope.check_id = false;
	$scope.check_comp_info = null;
	
	$scope.init = function(){
		
		var is_continue = $scope.checked_SLI && $scope.checked_info;		
		if(!is_continue){
			$state.go('access.join_agreement');
		}
		if(is_continue && (($scope.user_name == '' && $scope.mobile == '') || ($scope.user_name == undefined && $scope.mobile == undefined) )) {
			$state.go('access.join_certification');
		}		
		if(is_continue && $scope.user_name != '' && $scope.mobile != '' && $scope.user_name != undefined && $scope.mobile != undefined ) {
			$state.go('access.join_form');
			$scope.getBankAccount();
		}		
	};
	
	$scope.checkJoinInfo = function(){
		
		if( $scope.user_name == undefined ){
			$rootScope.showAlert('이름을 입력해주세요.');
			return;
		}
		if( $scope.mobile == undefined ){
			$rootScope.showAlert('휴대폰번호를 입력해주세요.');
			return;
		}
		if( $scope.mobile.trim() == '' ){
			$rootScope.showAlert('휴대폰번호를 입력해주세요.');
			return;
		}
		var regNumber = /^[0-9,-]*$/;
	    if(!regNumber.test($scope.mobile))
	    {
	        $rootScope.showAlert('휴대폰번호를 정확히 입력해주세요.');
	        return;
	    }
	    var phone= $scope.mobile.replace('-', '');
	    if(phone.length < 10)
	    {
	        $rootScope.showAlert('휴대폰번호를 정확히 입력해주세요.');
	        return;
	    }
	    
		var params = {
				checkType : 'mobile',
				userName : $scope.user_name,
				mobile : $scope.mobile,
	    		company:"sli",
	    		project:"student",
	    		packageName:"kr.co.sliedu.student"
		};
		
		$ksHttp.post('CheckJoinInfo', params).then(function(rs){
			$scope.check_student = JSON.parse(rs);
			if($scope.check_student[0].result == 'succ') {
				$rootScope.showMessage($rootScope.getMessageType('succ'), '회원가입이 가능합니다. 다음 단계로 진행해주세요.');
				$(".mobile_tx").attr("readonly","readonly");
			} else {
				$rootScope.showAlert('이미 회원가입되어있습니다. 로그인 정보를 잊은 경우 아이디, 비밀번호 찾기를  진행해주세요');
			}
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.selectSLI = function(){
		$scope.checked_SLI = !$scope.checked_SLI;
	};
	
	$scope.checkStudent = function(){
		
		if( $scope.student_info.user_id.trim() == '' ){
			$rootScope.showAlert('아이디를 입력해주세요.');
			return;
		}
		if( $scope.student_info.user_id.length < 4 ){
			$rootScope.showAlert('4자리 이상 입력해주세요.');
			return;
		}
		
		var params = {
			checkType: 'id',
			userId: $scope.student_info.user_id,
    		company:"sli",
    		project:"student",
    		packageName:"kr.co.sliedu.student"
				
		};
		
		$ksHttp.post('CheckJoinInfo', params).then(function(rs){
			$scope.check_student = JSON.parse(rs);
			if($scope.check_student[0].result == 'succ'){
				$rootScope.showAlert('사용 가능한 아이디 입니다');
				$scope.check_id = true;
			}else{
				$rootScope.showAlert('사용중인 아이디 입니다');
				$scope.check_id = false;
			}
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.selectInfo = function(){
		$scope.checked_info = !$scope.checked_info;
	};
	
	$scope.selectInstruction = function(){
		$scope.checked_instruction = !$scope.checked_instruction;
	};
	
	$scope.selectAll = function(){
		$scope.checked_all = !$scope.checked_all;
		$scope.checked_SLI = $scope.checked_all;
		$scope.checked_info = $scope.checked_all;
		$scope.checked_instruction = $scope.checked_all;
	};
	
	$scope.getBankAccount = function(){
		var params = {
			groupId : 'BANK_CD'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.bank_accounts = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.$watch('[checked_SLI, checked_info, checked_instruction]', function(){
		if($scope.checked_SLI && $scope.checked_info && $scope.checked_instruction){
			$scope.checked_all = true;
		}
		else{
			$scope.checked_all = false;
		}
	});
	
	$scope.phoneCheck = function() {
		$scope.mobile = $scope.mobile.replace(/[^0-9]/g,"");		
	}
	
    $scope.foucusBirthday = function(key, val){
    	if(val == undefined || val == '' || val == null)
    		return;
    	
    	if(key == 'year' && val.length >= 4){
    		$('[ng-model="student_info.birtday_month"]').focus();
    		$scope.student_info.birtday_year = val.substring(0, 4);
    	}

    	if(key == 'month' && val.length >= 2){
    		$('[ng-model="student_info.birtday_day"]').focus();
    		$scope.student_info.birtday_month = val.substring(0, 2);
    	}
    	
    	if(key == 'day' && val.length >= 2){
			$scope.student_info.birtday_day = val.substring(0, 2);
    	}
    };
   
	$scope.generateParamStudent = function(){
		return {
			  	saveType : 'I',
			  	userName : $scope.user_name,
			  	mobile : $scope.mobile,
			  	userId : $scope.student_info.user_id,
			  	userPw : $scope.student_info.password,
			  	gender : $scope.student_info.gender,
			  	birthday : $scope.student_info.birtday_year + '-' + $scope.student_info.birtday_month + '-' + $scope.student_info.birtday_day,
			  	deptNm : $scope.student_info.department,
			  	positionNm : $scope.student_info.position,
			  	email : $scope.student_info.early_email + '@' + $scope.student_info.last_email,
			  	bankCd : $scope.selected_account,
			  	bankAccount : $scope.student_info.bank_account,
			  	agreeEvtYn : $scope.checked_instruction ? 'Y' : 'N',
			  	cpCd : $stateParams.cpCd,
	    		company:"sli",
	    		project:"student",
	    		packageName:"kr.co.sliedu.student"

		}
	};
	
	$scope.validate = function(){
		
		if( !$scope.check_id ){
			$rootScope.showAlert('아이디 중복 확인을 체크해주세요');
			return false;
		}
		
		var obj = $scope.student_info;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim($scope.user_name) == ''){
			$rootScope.showAlert('이름' + required_msg.textbox);
			return false;
		}
		
		if($.trim($scope.mobile) == ''){
			$rootScope.showAlert('휴대폰번호' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.user_id) == ''){
			$rootScope.showAlert('아이디' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.password) == ''){
			$rootScope.showAlert('비밀번호'+ required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.confirm_password) == '' || obj.confirm_password != obj.password){
			$rootScope.showAlert('비밀번호가 일치하지 않습니다');
			return false;
		}
		
		if($.trim(obj.gender) == ''){
			$rootScope.showAlert('성별' + required_msg.textbox);
			return false;
		}
				
		var b_year = $.trim(obj.birtday_year);
		var b_mon = $.trim(obj.birtday_month);
		var b_day = $.trim(obj.birtday_day);
		if(b_year == '' || b_year == undefined 
				|| b_mon == '' || b_mon == undefined
				|| b_day == '' || b_day == undefined){
			$rootScope.showAlert('생년월일'+ required_msg.textbox);
			return false;
		}
		var c_mon = Number(b_mon);
		var c_day = Number(b_day);
		if( c_mon < 1 || 12 < c_mon || c_day < 1 || 31 < c_day ){
			$rootScope.showAlert('올바른 생년월일'+ required_msg.textbox);			
			return false;
		}
		var c_year = Number(b_year);
		var to_year = new Date();
		if(c_year < 1900 || to_year.getFullYear() < c_year){
			$rootScope.showAlert('올바른 생년월일'+ required_msg.textbox);
			return false;
		}
		
		if(obj.early_email == '' ||  obj.early_email == undefined
				|| obj.last_email == '' ||  obj.last_email == undefined){
			$rootScope.showAlert('이메일을 입력해주세요.');
			return false;
		}
		
		return true;
	};
	
	$scope.registerStudent = function(){
		if ($scope.validate()) {
			$rootScope.showConfirm('가입하시겠습니까?', function() {
				var params = $scope.generateParamStudent();
				$ksHttp.post('StudentSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("access.login") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				});
			});
		}
	};
	
	$scope.resetCheckId = function(){
		$scope.check_id = false;
	};
	
	$scope.checkCompKey = function(){
		if( "" == $scope.comp_key || null == $scope.comp_key){
			$rootScope.showAlert('가입코드를 입력해주세요.');
			return;
		}
		var params = {
				compKey: $scope.comp_key,
	    		company:"sli",
	    		project:"student",
	    		packageName:"kr.co.sliedu.student"
		};
		
		$ksHttp.post('CheckCompInfo', params).then(function(rs){
			rs = JSON.parse(rs)[0];
			var message = rs.message;
			var status = rs.result;
			
			$scope.check_comp_info = rs;
			if(status == 'succ'){
				$(".comp_key_tx").attr("readonly","readonly");
				$rootScope.showMessage($rootScope.getMessageType(status), message);
			}else{
				$rootScope.showMessage($rootScope.getMessageType(status), message);
			}
		}, function(error){
			console.log(error);
		});
	}
};