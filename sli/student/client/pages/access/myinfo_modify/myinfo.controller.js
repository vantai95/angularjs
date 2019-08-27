"use strict";
app.controller("MyinfoController", MyinfoController);

function MyinfoController($scope, $rootScope, $ksHttp, $uibModal, $location, $state) {
	
	$scope.init = function(){
		$scope.getStudentDetail();
		$scope.getBankAccount();
	};
	
	$scope.foucusBirthday = function(key, val){
    	if(val == undefined || val == '' || val == null)
    		return;
    	
    	if(key == 'year' && val.length >= 4){
    		$('[ng-model="student_detail.birthday_month"]').focus();
			$scope.student_detail.birthday_year = val.substring(0, 4);
    	}

    	if(key == 'month' && val.length >= 2){
    		$('[ng-model="student_detail.birthday_day"]').focus();
			$scope.student_detail.birthday_month = val.substring(0, 2);
    	}
    	
    	if(key == 'day' && val.length >= 2){
			$scope.student_detail.birthday_day = val.substring(0, 2);
    	}
    };
	
	$scope.getStudentDetail = function(){
		var params = {
			stCd :  $rootScope.current_user.stCd	
		};
		
		$ksHttp.post('StudentDetail', params).then(function(rs){
			rs = JSON.parse(rs);
			console.log(rs);
			
			if (rs && rs.length > 0) {
				$scope.student_detail = rs[0];
				var birthday = $scope.student_detail.birthday.toString().split('-');
				if(birthday.length == 3){
					$scope.student_detail.birthday_year = birthday[0];
					$scope.student_detail.birthday_month = birthday[1];
					$scope.student_detail.birthday_day = birthday[2];
				}
				
				var email = $scope.student_detail.email.toString().split('@');
				
				if(email.length == 2){
					$scope.student_detail.email_user_name = email[0];
					$scope.student_detail.email_domain = email[1];
				}
			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getBankAccount = function(){
		var params = {
			groupId : 'BANK_CD'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.bank_accounts = JSON.parse(rs);
			console.log($scope.bank_accounts);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.validate = function(){
		if($scope.userPw != $scope.userPw_confirm){
			$rootScope.showAlert('비밀번호가 일치하지 않습니다.');
			return false;
		}
		if($scope.student_detail.birthday_year == '' || $scope.student_detail.birthday_year == undefined 
				|| $scope.student_detail.birthday_month == '' || $scope.student_detail.birthday_month == undefined
				|| $scope.student_detail.birthday_day == '' || $scope.student_detail.birthday_day == undefined){
			$rootScope.showAlert('생년월일을 입력해주세요.');
			return false;
		}
		var c_mon = Number($scope.student_detail.birthday_month);
		var c_day = Number($scope.student_detail.birthday_day);
		if( c_mon < 1 || 12 < c_mon || c_day < 1 || 31 < c_day ){
			$rootScope.showAlert('올바른 생년월일을 입력해주세요.');
			return false;
		}
		var c_year = Number($scope.student_detail.birthday_year);
		var to_year = new Date();
		if(c_year < 1900 || to_year.getFullYear() < c_year){
			$rootScope.showAlert('올바른 생년월일을 입력해주세요.');
			return false;
		}
		
		if($scope.student_detail.email_user_name == '' ||  $scope.student_detail.email_user_name == undefined
				|| $scope.student_detail.email_domain == '' ||  $scope.student_detail.email_domain == undefined){
			$rootScope.showAlert('이메일을 입력해주세요.');
			return false;
		}
		return true;
	};
	
	 $scope.updateStudentSave = function(){
		 $scope.birthday = $scope.student_detail.birthday_year + '-' +$scope.student_detail.birthday_month + '-' +$scope.student_detail.birthday_day
		 $scope.email = $scope.student_detail.email_user_name + '@' + $scope.student_detail.email_domain;
		 if($scope.validate()){
			 $rootScope.showConfirm('수정하시겠습니까?',  function(){
				 var params = {
						 saveType : 'US',
						 stCd : $rootScope.current_user.stCd,
						 userId : $rootScope.current_user.userId,
						 userPw : $scope.userPw,
						 gender : $scope.student_detail.gender,
						 birthday : $scope.birthday,
						 deptNm : $scope.student_detail.deptNm,
						 positionNm : $scope.student_detail.positionNm,
						 email : $scope.email,
						 bankCd : $scope.student_detail.bankCd,
						 bankAccount : $scope.student_detail.bankAccount
				 };
				 
				// console.log(params);
				$ksHttp.post('StudentSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.index.dashboard") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			 });
		 }
	 };
}