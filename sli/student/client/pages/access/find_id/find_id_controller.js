"use strict";
app.controller("FindIdController", FindIdController);

function FindIdController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout, $stateParams, $state) {
	$scope.userName = '';
	$scope.userPhone = '';
	$scope.code = '';
	$scope.getAuthCode = false;
	
	$scope.sendSMS = function(){
		
		if( $scope.userName == undefined ){
			$rootScope.showAlert('이름을 입력해주세요.');
			return;
		}
		if($scope.userName.trim() == '') {
			$rootScope.showAlert('이름을 입력해주세요.');
			return;
		}
		if( $scope.userPhone == undefined ){
			$rootScope.showAlert('휴대폰번호를 입력해주세요.');
			return;
		}
		if( $scope.userPhone.trim() == '' ){
			$rootScope.showAlert('휴대폰번호를 입력해주세요.');
			return;
		}
		var regNumber = /^[0-9]*$/;
	    if(!regNumber.test($scope.userPhone))
	    {
	        $rootScope.showAlert('휴대폰번호를 정확히 입력해주세요.');
	        return;
	    }
	    var phone= $scope.userPhone.replace('-', '');
	    if(phone.length < 10)
	    {
	        $rootScope.showAlert('휴대폰번호를 정확히 입력해주세요.');
	        return;
	    }
	    
		var params = {
				sendType : 'C',
				userType : 'S',
				userName : $scope.userName,
				destPhone : phone,
				sourceTel : '025417158',
	    		company:"sli",
	    		project:"student",
	    		packageName:"kr.co.sliedu.student"

		};
		
		$ksHttp.post('SendSMS', params).then(function(rs){
			$scope.data = JSON.parse(rs);
			if($scope.data[0].result == 'succ') {
				$scope.getAuthCode = true;
				$rootScope.showMessage('success', $scope.data[0].message);
			} else {
				$rootScope.showMessage('error', $scope.data[0].message);
			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.phoneCheck = function() {
		$scope.userPhone = $scope.userPhone.replace(/[^0-9]/g,"");		
	}

	$scope.findId = function() {
		if( $scope.userName == undefined ){
			$rootScope.showAlert('이름을 입력해주세요.');
			return;
		}
		if($scope.userName.trim() == '') {
			$rootScope.showAlert('이름을 입력해주세요.');
			return;
		}
		if( $scope.userPhone == undefined ){
			$rootScope.showAlert('휴대폰번호를 입력해주세요.');
			return;
		}
		if( $scope.userPhone.trim() == '' ){
			$rootScope.showAlert('휴대폰번호를 입력해주세요.');
			return;
		}
		var regNumber = /^[0-9]*$/;
	    if(!regNumber.test($scope.userPhone))
	    {
	        $rootScope.showAlert('휴대폰번호를 정확히 입력해주세요.');
	        return;
	    }
	    var phone= $scope.userPhone.replace('-', '');
	    if(phone.length < 10)
	    {
	        $rootScope.showAlert('휴대폰번호를 정확히 입력해주세요.');
	        return;
	    }
	    
	    if($scope.code == undefined) {
	    	$rootScope.showAlert('인증번호를 입력해주세요.');
	    	return;
	    }
	    if($scope.code == '') {
	    	$rootScope.showAlert('인증번호를 입력해주세요.');
	    	return;
	    }

	    var params = {
				userType : 'S',
				userName : $scope.userName,
				destPhone : phone,
				setCode : $scope.code,
	    		company:"sli",
	    		project:"student",
	    		packageName:"kr.co.sliedu.student"

		};
		
		$ksHttp.post('FindId', params).then(function(rs){
			$scope.data = JSON.parse(rs);
			if($scope.data[0].result == 'succ') {
				$rootScope.showAlert($scope.data[0].message);
			} else {
				$rootScope.showMessage('error', $scope.data[0].message);
			}
		}, function(error){
			console.error(error);
		});
		
	}
};