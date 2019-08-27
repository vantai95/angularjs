"use strict";

app.controller("AdminRegistController", AdminRegistController);
function AdminRegistController($scope, $rootScope, $ksHttp, $uibModal, $window, $stateParams, $state) {
	$scope.admin = {};
	$scope.admin.userName = null;
	$scope.admin.compNo = 0;
	$scope.admin.userId = 0;
	$scope.admin.userPw = null;
	$scope.admin.belongNm = null;
	$scope.admin.deptNm = null;
	$scope.admin.teamNm = null;
	$scope.admin.positionNm = null;
	$scope.admin.mobile = null;
	$scope.admin.email = null;
	$scope.admin.arCd = 0;
	$scope.admin.accessYn = null;
	$scope.permission_group = [];
	$scope.init = function(){
		if ($stateParams.id) {
			$scope.admin_id = $stateParams.id;
			$scope.getAdmin($scope.admin_id);
		}
		$scope.getPermissionGroup();
	}
	
	$scope.getPermissionGroup = function(){
		var params = {};
		$ksHttp.post('AdminGroupList', params).then(function(rs){
			$scope.permission_group = JSON.parse(rs);
		}, function(error){
			console.error(error);
		})
	}
	
	$scope.getAdmin = function(id){
		if(id){
			var params = {
				userId: id
			}
			$ksHttp.post('AdminUserDetail', params).then(function(rs){
				rs = JSON.parse(rs)
				$scope.update_admin = rs[0];
			}, function(error){
				console.error(error);
			})
		}
	}
	
	$scope.validate = function() {
		var adm = $scope.admin;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(adm.userName) == ''){
			$rootScope.showAlert('이름' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(adm.compNo) == ''){
			$rootScope.showAlert('사번' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(adm.userId) == ''){
			$rootScope.showAlert('아이디' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(adm.userPw) == ''){
			$rootScope.showAlert('비밀번호' + required_msg.textbox);
			return false;
		}
		
		if($.trim(adm.belongNm) == ''){
			$rootScope.showAlert('소속' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(adm.deptNm) == ''){
			$rootScope.showAlert('부서' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(adm.positionNm) == ''){
			$rootScope.showAlert('직급' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(adm.teamNm) == ''){
			$rootScope.showAlert('팀' + required_msg.textbox);
			return false;
		}
		
		if($.trim(adm.mobile) == ''){
			$rootScope.showAlert('휴대폰번호' + required_msg.textbox);
			return false;
		}

		if($.trim(adm.email) == ''){
			$rootScope.showAlert('이메일' + required_msg.textbox);
			return false;
		}
		
		if($.trim(adm.arCd) == ''){
			$rootScope.showAlert('권한그룹' + required_msg.textbox);
			return false;
		}
		
		if($.trim(adm.accessYn) == ''){
			$rootScope.showAlert('접속권한' + required_msg.textbox);
			return false;
		}
		
		return true;
	};
	
	$scope.generateAdminParams = function(){
		return {
			saveType : 'I',
			userName: $scope.admin.userName,
			compNo: $scope.admin.compNo,
			userId: $scope.admin.userId,
			userPw: $scope.admin.userPw,
			belongNm: $scope.admin.belongNm,
			deptNm: $scope.admin.deptNm,
			teamNm: $scope.admin.teamNm,
			positionNm: $scope.admin.positionNm,
			mobile: $scope.admin.mobile,
			email: $scope.admin.email,
			arCd: $scope.admin.arCd,
			accessYn: $scope.admin.accessYn,
			regUser : $rootScope.current_user.userId 
		};
	};
	
	$scope.saveAdmin = function() {
		if ($scope.validate()) {
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateAdminParams();
				$ksHttp.post('AdminUserSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.admin.list") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
	}
	
	$scope.generateAdminParamUpdate = function(){
		return {
			saveType : 'U',
			userName: $scope.update_admin.userName,
			compNo: $scope.update_admin.compNo,
			userId: $scope.update_admin.userId,
			userPw: $scope.update_admin.userPw,
			belongNm: $scope.update_admin.belongNm,
			deptNm: $scope.update_admin.deptNm,
			teamNm: $scope.update_admin.teamNm,
			positionNm: $scope.update_admin.positionNm,
			mobile: $scope.update_admin.mobile,
			email: $scope.update_admin.email,
			arCd: $scope.update_admin.arCd,
			accessYn: $scope.update_admin.accessYn,
			regUser : $rootScope.current_user.userId 
		};
	};
	
	$scope.updateOk = function() {
	
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params = $scope.generateAdminParamUpdate();
				$ksHttp.post('AdminUserSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go("app.admin.list") : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
	}
	
	$scope.cancelCreate = function() {
		var msg = "관리자 등록을 취소하겠습니까 ?";
		$rootScope.showConfirm(msg, function() {
			$state.go("app.admin.list");
		});
	}
	
	$scope.sendNewPassword = function() {
		
  	  	var params = {
  	  			"userId" : $scope.update_admin.userId,
  	  			"userEmail" : $scope.update_admin.email,
  	  			"result" : '',
  	  			"message" : ''
  	  		};

  	  	$ksHttp.post('NewPassword', params).then(function(rs) {
			  console.log(rs);
			  if(rs.result == 'succ') {
				  $rootScope.showAlert(rs.message);
//				  $state.go("access.login")
			  }
			  else {
				  $rootScope.showAlert(rs.message);
//				  $rootScope.showMessage('error', rs.message);
			  }
		  }, function(error) {
				console.error(error);
		  });
	}
}