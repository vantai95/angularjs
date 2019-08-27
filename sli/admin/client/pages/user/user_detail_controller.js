'use strict';

app.controller('UserDetailController', UserDetailController);
app.controller('UserListController', UserListController);
app.controller('RefundPopupController', RefundPopupController);

function UserDetailController($scope, $stateParams, $http, $state, $ksHttp, $uibModal, $rootScope) {
	$scope.search_input = '';
	$scope.search_type = [{id: 'mobile', name: '연락처'},{id: 'userName', name: '이름'},{id: 'userId', name: '아이디'},]
	$scope.selected_type = null;
	$scope.students = [];
	$scope.student = null;
	$scope.student_id = $stateParams.id;
	$scope.customer_companies = [];
	$scope.selected_company = null;
	
	$scope.birthday_year = null;
	$scope.birthday_month = null;
	$scope.birthday_day = null;
	
	$scope.init = function() {
		if (!$stateParams.id) {
			$state.go("app.user.list");
		} else {
			$scope.getStudent();
			$scope.getStudentClassList();
			$scope.getAccountPayList();
		}
		$scope.getCustomerCompanies();
	};

	$scope.getStudent = function() {
		var params = {
			stCd : $scope.student_id
		};
		
		$ksHttp.post('StudentDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.student = rs[0];
				$scope.selected_company = {cpCd: $scope.student.cpCd, compNm: $scope.student.compNm};
				var date = new Date($scope.student.birthday);
				$scope.birthday_year = date.getFullYear();
				$scope.birthday_month = date.getMonth()+1;
				$scope.birthday_day = date.getDate();
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getStudentClassList = function() {
		var params = {
			stCd : $scope.student_id
		};
		
		$ksHttp.post('StudentClassList', params).then(function(rs) {
			$scope.student_class_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getAccountPayList = function() {
		var params = {
			stCd : $scope.student_id
		};
		
		$ksHttp.post('AccountPayList', params).then(function(rs) {
			$scope.account_pay_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getCustomerCompanies = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.foucusBirthday = function(key, val){
    	if(val == undefined || val == '' || val == null)
    		return;
    	
    	if(key == 'year' && val.length >= 4){
    		$('[ng-model="birthday_month"]').focus();
			$scope.birthday_year = val.substring(0, 4);
    	}

    	if(key == 'month' && val.length >= 2){
    		$('[ng-model="birthday_day"]').focus();
			$scope.birthday_month = val.substring(0, 2);
    	}
    	
    	if(key == 'day' && val.length >= 2){
			$scope.birthday_day = val.substring(0, 2);
    	}
    };
    
	$scope.saveUser = function(){
		if ($scope.validateUser()) {
			var params = {
					saveType : 'U',
					stCd: $scope.student.stCd,
					userName : $scope.student.userName,
					cpCd : $scope.selected_company.cpCd,
					deptNm : $scope.student.deptNm,
					birthday : $scope.birthday_year + '-' + $scope.birthday_month + '-' + $scope.birthday_day,
					gender : $scope.student.gender,
					mobile :  $scope.student.mobile,
					email :  $scope.student.email,
					userId : $scope.student.userId,
					updUser  : $rootScope.current_user.userId
			};
			
			$ksHttp.post('StudentSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				status == 'succ' ? $state.go("app.user.detail",{id:  $scope.student.stCd}) : $state.reload();
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		}
	};
	
	$scope.validateUser = function(){
		var obj = $scope.student;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim($scope.selected_company) == ''){
			$rootScope.showAlert('고객사명' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.userName) == ''){
			$rootScope.showAlert('이름' + required_msg.textbox);
			return false;
		}
				
		if($.trim(obj.mobile) == ''){
			$rootScope.showAlert('휴대폰번호' + required_msg.textbox);
			return false;
		}
		
		var regExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
		if(regExp.test(obj.mobile)){ 
			//return true; 
		} else { 
			$rootScope.showAlert('올바른 휴대폰번호를 입력해주세요.');
			return false;
		}
				
		if($.trim($scope.birthday_year) == '' || $.trim($scope.birthday_month) == '' || $.trim($scope.birthday_day) == ''){
			$rootScope.showAlert('생년월일' + required_msg.textbox);
			return false;
		}		
		if($.trim(obj.email) == ''){
			$rootScope.showAlert('이메일' + required_msg.textbox);
			return false;
		}
		return true;
	}
	
	$scope.searchUsers = function() {
		var params = {
			searchType : $scope.selected_type ? $scope.selected_type : 0,
			searchValue : $scope.search_input ? $scope.search_input : null
		};

		$ksHttp.post('StudentListPopup', params).then(function(rs) {
			$scope.students = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});

		var studentListPopup = $uibModal.open({
			templateUrl : 'popup',
			controller : 'UserListController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				students : function() {
					return $scope.students;
				}
			}
		
		});
		studentListPopup.result.then(function(result) {
	            // recieve returned data
				if(result.stCd != '' && result.stCd != null){
					 $state.go("app.user.detail", {id: result.stCd});
				}
	        }, function(err) {
	            console.info(err);
	        });
	};

	$scope.sendNewPassword = function() {
  	  	var params = {
  	  			"userId" : $scope.student.userId,
  	  			"userEmail" : $scope.student.email,
  	  			"result" : '',
  	  			"message" : ''
  	  		};

  	  	$ksHttp.post('NewPasswordS', params).then(function(rs) {
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
	
	$scope.outStudent = function(outType){
		var msg = "탈퇴시키시겠습니까?";
		var saveType = "D";
		if( "N" == outType ){			
			msg = "탈퇴취소 하시겠습니까?";
			saveType = "R";
		}
		
		$rootScope.showConfirm(msg, function() {
			var params = {
					saveType : saveType,
					userId : $scope.student.userId,
					updUser : $rootScope.current_user.userId
				};
			
			$ksHttp.post('StudentSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if(status == 'succ'){
					$scope.student.outYn = outType;
				}
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			});
		});
	}
	
	$scope.openRefundPopup = function(paCd)
	{
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: "RefundPopup.html",
			controller: "RefundPopupController",
			windowClass: "app-modal-window",
			scope: $scope,
			resolve : {
				pay : function() {
					return paCd;
				}
			}
		});
		
		modalInstance.result.then(function(result) {
			console.info(result);
		}, function(error){
			console.info(error);
		});
	};
};

function UserListController($scope, $uibModalInstance, $rootScope, $state, students) {
		$scope.students = students;
		 $scope.selected_item  = null;
		 $scope.selectItem = function(item){
		        $scope.selected_item = item;
		    };
	
		    $scope.selectStudents = function () {
		        $uibModalInstance.close($scope.selected_item);
		        $state.go("app.user.detail", $scope.student.stCd);
		        
		    };

		    $scope.cancel = function () {
		        $uibModalInstance.dismiss('cancel');
		    };
	

}


function RefundPopupController($scope, pay, $uibModalInstance, $rootScope, $state, $ksHttp)
{
	$scope.refund = {};
	var current_pay = pay;
	$scope.input_amount = true;
	$scope.refund.amount = 0;
	$scope.refund.type = "결제취소";
	$scope.refund.date = new Date();
	$scope.refund.staff = $rootScope.current_user.userId;
	
	$scope.init = function()
	{
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$scope.getAccountRefundDetail();
		$scope.getRefundType();
		$scope.getBank();
	};
	
	$scope.getAccountRefundDetail = function(){
		var params = {
				paCd : current_pay
		};
		
		$ksHttp.post('AccountRefundDetail', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.refund_detail = rs[0];
			
			//무통장일 경우는 무조건 '부분환불'로 체크 
			if( "VBANK" == $scope.refund_detail.payMeans || "DBANK" == $scope.refund_detail.payMeans){
				$scope.refund_detail.refundSort = "S";
				$("#refund_c").attr("disabled","disabled");
			}
			
			//결제취소된 경우 
			if( "CN" == $scope.refund_detail.payStatus){
				$("#refund_r").attr("disabled","disabled");
				$("#saveRefund").hide();
			}
			
			$scope.setRefundMoney($scope.refund_detail.refundSort);
			
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getRefundType = function(){
		var params = {
				groupId : "REFUND_TYPE"
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.refund_type = rs;
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getBank = function(){
		var params = {
				groupId : "BANK_CD"
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.bank = rs;
		}, function(error){
			console.log(error);
		});
	};
		
	$scope.cancel = function()
	{
		$uibModalInstance.dismiss("cancel");
	};
	
	$scope.setAmount = function()
	{
		$scope.input_amount = !$scope.input_amount;
		if($scope.input_amount == true)
		{
			$scope.refund.amount = 15000;
		}
		else if($scope.input_amount == false)
		{
			$scope.refund.amount = null;
		}
	};
	
	$scope.saveRefund = function()
	{	
		if("S" == $scope.refund_detail.refundSort ){
			if($scope.validateRefund()){				
				$rootScope.showConfirm("환불을 진행하시겠습니까?",function(){
					$scope.saveRefund2();					
				});
			}
			
		}else{
			//결제취소
			if($scope.validateRefund()){				
				$rootScope.showConfirm('결제를 취소 하시겠습니까?', function() {
					var params = {
							CST_PLATFORM : 'service',
							CST_MID : 'sli01',
							LGD_TID : $scope.refund_detail.cardResult,
						};
			
					$ksHttp.post('PaymentCancel', params).then(function(rs) {
						$scope.saveRefund2();
						//$rootScope.showMessage('success', '결제취소 되었습니다.');
					}, function(error) {
						console.log(error);
						$rootScope.showMessage('error', '[오류] '+error);
					});
				});
			}
		}
	}
	
	$scope.saveRefund2 = function(){
		
		var params = {
				saveType : 'U',
				prCd : $scope.refund_detail.prCd,
				refundType : $scope.refund_detail.refundType,
				refundCnts : $scope.refund_detail.refundCnts,
				refundSort : $scope.refund_detail.refundSort,
				refundMoney : $scope.refund_detail.refundMoney,
				bankCd : $scope.refund_detail.bankCd,
				bankAccount : $scope.refund_detail.bankAccount,
				depositDt : $scope.refund_detail.depositDt,
				updUser : $rootScope.current_user.userId
		};
		
		$ksHttp.post('AccountRefundSave', params).then(function(rs){
			rs = JSON.parse(rs)[0];
			if('succ' == rs.result ){
				$rootScope.showMessage("success", rs.message);
				$uibModalInstance.close();
				$state.reload();
			}else{
				$rootScope.showMessage("error", rs.message);
			}
		}, function(error){
			$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
		});
	}
	
	$scope.setRefundMoney = function(type){
		
		if("S" == type ){
			$("#refund_money").attr("readonly", false);
		}else if("C" == type ){
			$scope.refund_detail.refundMoney = $scope.refund_detail.payMoney;
			$("#refund_money").attr("readonly", true);
		}
	}
	
	$scope.validateRefund = function()
	{		
		if( '' == $scope.refund_detail.refundSort || undefined == $scope.refund_detail.refundSort){
			$rootScope.showAlert('환불유형을 선택해주세요.');
			return false;
		}
		if( '-' == $scope.refund_detail.refundMoney || '' == $.trim($scope.refund_detail.refundMoney)){
			$rootScope.showAlert('환불금액을 입력해주세요.');
			return false;
		}
		if("S" == $scope.refund_detail.refundSort){
			if( '' == $scope.refund_detail.bankCd || undefined == $scope.refund_detail.bankCd){
				$rootScope.showAlert('환불계좌은행을 선택해주세요.');
				return false;
			}
			if( '' == $scope.refund_detail.bankAccount ){
				$rootScope.showAlert('환불계좌번호를 입력해주세요.');
				return false;
			}
		}
		if( '-' == $scope.refund_detail.depositDt || '' == $scope.refund_detail.depositDt ){
			$rootScope.showAlert('입금일자를 선택해주세요.');
			return false;
		}
		
		return true;
	}
	
	$scope.date_picker = function(){
		$('body').on('focus',".date", function(){
			$('.date').datepicker({
				  format: 'yyyy-mm-dd',
					autoclose: true
	          });
		});
	}
	
};