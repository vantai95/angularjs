"use strict";

app.controller("CodeInsertController", CodeInsertController);

function CodeInsertController($scope, $rootScope, $state, $stateParams, $ksHttp, $uibModal) {
	$scope.saveType = "";
	$scope.groupInfo = {};
	$scope.groupInfo.groupId = '';
	$scope.groupInfo.groupName = '';
	$scope.groupInfo.groupDesc = '';
	$scope.codeList = [];
		
	$scope.init = function() {
		if ($stateParams.id) {
			$scope.groupInfo.groupId = $stateParams.id;
			$scope.getCodeGroup();
			$scope.getSubCode();
			$scope.saveType = "U";
		}else{
			$scope.setSubCode();
			$scope.saveType = "I";
		}
	};

	$scope.setSubCode = function(){
		var obj1 = {codeId: '', codeName1:'', codeName2:'', codeName3:'',codeName4:'', displayOrder:1};
		var obj2 = {codeId: '', codeName1:'', codeName2:'', codeName3:'',codeName4:'', displayOrder:2};
		var obj3 = {codeId: '', codeName1:'', codeName2:'', codeName3:'',codeName4:'', displayOrder:3};
		
		$scope.codeList = [obj1, obj2, obj3];
	}
	
	$scope.getCodeGroup = function(){
		var params = {
			groupId : $stateParams.id
		};
		
		$ksHttp.post('CodeGroupDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			
			if (rs && rs.length > 0) {
				$scope.groupInfo = rs[0];
			}
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getSubCode = function(){
		var params = {
				groupId : $stateParams.id
		};
		
		$ksHttp.post('CodeSubList', params).then(function(rs) {
			$scope.codeList = JSON.parse(rs);			
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.fnAddCode = function(){
		
		var lastNo = ($scope.codeList[$scope.codeList.length-1].displayOrder) +1;		
		var obj = {codeId: '', codeName1:'', codeName2:'', codeName3:'',codeName4:'', displayOrder:lastNo};		
		$scope.codeList.push(obj);	
	}
	
	$scope.fnDelete = function(index){
		
		$scope.codeList.splice(index, 1);		
	}
	
	$scope.fnSave = function(){
		if ($scope.validate()) {
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				
				var subCodeList = [];
				for( var i=0; i<$scope.codeList.length; i++){
					if( $scope.codeList[i].codeId != ''){
						$scope.codeList[i].displayOrder = i+1;
						subCodeList.push($scope.codeList[i]);
					}
				}
				
				var params = {
					saveType : $scope.saveType,
					groupId : $scope.groupInfo.groupId,
					groupName : $scope.groupInfo.groupName,
					groupDesc : $scope.groupInfo.groupDesc,
					subCodeList : subCodeList,
					subCodeLen : subCodeList.length,
					regUser : $rootScope.current_user.userId
				}
				
				$ksHttp.post('CodeGroupSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					if(status == 'succ'){
						if( $scope.saveType == 'I'){
							$state.reload();
						}else{
							$state.go("app.code.list");
						}
					}
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
			});
		}
	}
	
	$scope.validate = function() {
		
		if($.trim($scope.groupInfo.groupId) == ''){
			$rootScope.showAlert('그룹코드를 입력해주세요.');
			return false;
		}
		
		var regType1 = /^[_A-Za-z0-9]*$/;
		if (!regType1.test($scope.groupInfo.groupId)) {
			$rootScope.showAlert('그룹코드는 영문, 숫자만 사용가능합니다.');
			return false;
		}
		
		if($.trim($scope.groupInfo.groupName) == ''){
			$rootScope.showAlert('그룹코드명을 입력해주세요.');
			return false;
		}
		
		for( var i=0; i< $scope.codeList.length; i++ ){
			
			if( ($.trim($scope.codeList[i].codeId) == '' && $.trim($scope.codeList[i].codeName1) != '')
				|| ($.trim($scope.codeList[i].codeId) != '' && $.trim($scope.codeList[i].codeName1) == '' )){
				
				$rootScope.showAlert('코드값, 코드명1을 입력해주세요.');
				return false;
			}
			
			if( $scope.codeList[i].codeId != '' ){				
				if (!regType1.test($scope.codeList[i].codeId)) {
					$rootScope.showAlert('코드값은 영문, 숫자만 사용가능합니다.');
					return false;
				}
			}
		}
		return true;
	}
	
	$scope.upItem = function(index){
		
		var contents = $scope.codeList;
	    var newPos = index - 1;
	   	    
	    const newContents = JSON.parse(JSON.stringify(contents));
	    if (newPos < 1 ) newPos = 0;
	    
	    newContents.splice(index, 1);
	    newContents.splice(newPos, 0, $scope.codeList[index]);
	    
	    $scope.codeList = newContents; 
	    
	    $scope.setDisplayOrder();
	}
	
	$scope.downItem = function(index){
		
		var contents = $scope.codeList;
	    var newPos = index + 1;
	   	    
	    const newContents = JSON.parse(JSON.stringify(contents));
	    if (newPos >= contents.length) newPos = contents.length;
	    
	    newContents.splice(index, 1);
	    newContents.splice(newPos, 0, $scope.codeList[index]);
	    
	    $scope.codeList = newContents; 
	    
	    $scope.setDisplayOrder();
	}
	
	$scope.setDisplayOrder = function(){
		for( var i=0; i < $scope.codeList.length; i++){
			$scope.codeList[i].displayOrder = i+1;
		}
	}	
	
};

