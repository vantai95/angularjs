'use strict';

app.controller('smsAutomessageController', SMSAutomessageController);




function SMSAutomessageController($scope, $http, $stateParams, $uibModal, $ksHttp, $state, $rootScope) {
	$scope.smsAutoMessages = [];
	$scope.frequentlyUsedPhrases = [];
	$scope.frequentlyUsedPhrase = {};
	$scope.can_input = true; 
	
	$scope.init = function()
	{
		$scope.getSMSAutoMessageList();
		$scope.getFrequentlyUsedPhrases();
	};
	
	$scope.getSMSAutoMessageList = function()
	{
		var params = {autoGroupYn: 'Y'};
		$ksHttp.post('SmsMessageList', params).then(function(rs){
			$scope.smsMessageList = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getFrequentlyUsedPhrases = function()
	{
		var params = {autoGroupYn: 'N'};
		$ksHttp.post('SmsMessageList', params).then(function(rs){
			$scope.frequentlyUsedPhrases = JSON.parse(rs);
			angular.forEach($scope.frequentlyUsedPhrases, function(value, key) {
				value.checked = true;
				});
			console.log($scope.frequentlyUsedPhrases);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.del = function(frequentlyUsedPhrase)
	{
		$rootScope.showConfirm("삭제하시겠습니까?", function(){
			var params = 
			{
					saveType: 'D',
					smCd: frequentlyUsedPhrase.smCd,
					udpUser: $rootScope.current_user.userId
			};
			$ksHttp.post("SaveSmsMessage", params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.reload();
			}, function(error){
				console.error(error);
			});
		})
	};
	
	$scope.saveSMS = function()
	{
		$rootScope.showConfirm("저장하시겠습니까?", function(){
			$scope.frequentlyUsedPhrase.saveType = 'I';
			$scope.frequentlyUsedPhrase.updUser = $rootScope.current_user.userId;
			$ksHttp.post('SaveSmsMessage', $scope.frequentlyUsedPhrase).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.reload();
			}, function(error){
				console.error(error);
			});
		});
	};
	
	$scope.changePhrase = function(current)
	{
		$rootScope.showConfirm("수정하시겠습니까?", function(){
			current.saveType = "U";
			current.updUser = $rootScope.current_user.userId;
			$ksHttp.post("SaveSmsMessage", current).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.reload();
			}, function(error){
				console.error(error);
			});
		});
	};
	
	$scope.saveChangeSMSMessage = function(smsMessage)
	{
		$rootScope.showConfirm("수정하시겠습니까?", function(){
			smsMessage.saveType = "U";
			smsMessage.updUser = $rootScope.current_user.userId;
			$ksHttp.post("SaveSmsMessage", smsMessage).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.reload();
			}, function(error){
				console.error(error);
			});
		});
	};
	
	$scope.saveUseYn = function(message)
	{
		var params = 
		{
				saveType: "C",
				smCd: message.smCd,
				useYn: message.useYn,
				updUser: $rootScope.current_user.userId
		};
		
		$ksHttp.post("SaveSmsMessage", params).then(function(rs){
			rs = JSON.parse(rs);
			var message = rs[0].message;
			var status = rs[0].result;
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			$state.reload();
		}, function(error){
			console.error(error);
		});
	}
};


