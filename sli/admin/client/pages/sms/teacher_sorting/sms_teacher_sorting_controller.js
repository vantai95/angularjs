'use strict';

app.controller('smsTeacherSortingPopupController',
		SMSTeacherSortingPopupController);
app.controller('smsTeacherSortingController', SMSTeacherSortingController);

function SMSTeacherSortingController($scope, $http, $stateParams, $uibModal, $filter,
		$ksHttp, $state, $rootScope) {
	$scope.sms = {};
	$scope.type = "강사";
	$scope.selected_sms = [];
	$scope.sending_sms = [];
	$scope.sms.condition = "고객사";
	$scope.sms.lectureYn = 'A';
	$scope.sms.nationalType = null;
	$scope.sms.certifyYn = 'A';
	$scope.list_mobile = '';

	$scope.init = function() {
		if ($scope.type == "강사") {
			$scope.getTeacherSMSList();
		} else if ($scope.type == "수강생") {
			$scope.getStudentSMSList();
		}
		$scope.getCustomerCompanyList();
		$scope.getSendingList();
		$scope.getLectureAreas();
	};

	$scope.checkAll = function () {
		   if ($scope.check_all) {
		    $scope.check_all = false ;
		   } else {
		    $scope.check_all = true;
		   }
		   angular.forEach($scope.sms_list, function (sms_list) {
			   sms_list.selected = $scope.check_all;
		   });
	};
	
	$scope.updateCheckall = function(){
        
	    var smsTotal = $scope.sms_list.length;
	    var count = 0;
	    angular.forEach($scope.sms_list, function (item) {
	       if(item.selected){
	         count++;
	       }
	    });

	    if(smsTotal == count){
	       $scope.check_all = true;
	    }else{
	       $scope.check_all = false;
	    }
	  };
	  
	  $scope.checkAll1 = function () {
		   if ($scope.select_all_right) {
		    $scope.select_all_right = false ;
		   } else {
		    $scope.select_all_right = true;
		   }
		   angular.forEach($scope.sending_sms, function (sending_sms) {
			   sending_sms.selected = $scope.select_all_right;
		   });
	};
	
	$scope.updateCheckall1 = function(){
       
	    var sendTotal = $scope.sending_sms.length;
	    var count = 0;
	    angular.forEach($scope.sending_sms, function (item) {
	       if(item.selected){
	         count++;
	       }
	    });

	    if(sendTotal == count){
	       $scope.select_all_right = true;
	    }else{
	       $scope.select_all_right = false;
	    }
	  };

	
	$scope.getCustomerCompanyList = function() {
		var params = {
			key : '',
			value : ''
		};
		$ksHttp.post("CustomerCompanyList", params).then(function(rs) {
			$scope.customer_company_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getLectureAreas = function() {
		var params = {
			groupId : 'LECTURE_AREA'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.lecture_areas = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getSendingList = function() {
		$scope.sending_sms = [];
	};

	$scope.setOtherDefault = function() {
		if ($scope.sms.condition == '고객사') {
			$scope.sms.lectureArea = null;
		} else if ($scope.sms.condition == '강지역') {
			$scope.sms.shSmsCpcd = null;
		}
	}

	$scope.setCharAt = function(str, index, chr) {
		if (index > str.length - 1)
			return str;
		return str.substr(0, index) + chr + str.substr(index + 1);
	}

	$scope.getTeacherSMSList = function() {
		$scope.sending_sms = [];
		var shSmsCpcdString = '';

		angular.forEach($scope.sms.shSmsCpcd, function(ele) {
			shSmsCpcdString += (ele + ",");
		});

		if (shSmsCpcdString.charAt(shSmsCpcdString.length - 1) == ',') {
			shSmsCpcdString = $scope.setCharAt(shSmsCpcdString,
					shSmsCpcdString.length - 1, '');
		}

		var params = {
			lectureYn : $scope.sms.lectureYn,
			nationalType : $scope.sms.nationalType,
			shSmsCpcd : shSmsCpcdString
		};

		angular.forEach($scope.sms.lectureArea, function(ele) {
			params['lectureArea_' + ele] = ele;
		});

		$ksHttp.post("TeacherSmsList", params).then(function(rs) {
			$scope.sms_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	}

	$scope.getStudentSMSList = function() {
		$scope.sending_sms = [];
		if ($scope.sms.shSmsCpcd && $scope.sms.shSmsCpcd != '') {
			var shSmsCpcdString = '';
			angular.forEach($scope.sms.shSmsCpcd, function(ele) {
				shSmsCpcdString += (ele + ",");
			});

			if (shSmsCpcdString.charAt(shSmsCpcdString.length - 1) == ',') {
				shSmsCpcdString = $scope.setCharAt(shSmsCpcdString,
						shSmsCpcdString.length - 1, '');
			}
		}

		var params = {
			lectureYn : $scope.sms.lectureYn,
			certifyYn : $scope.sms.certifyYn,
			shSmsCpcd : shSmsCpcdString || ''
		};
		
		$ksHttp.post("StudentSmsList", params).then(function(rs) {
			$scope.sms_list = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	}

	$scope.SearchSMS = function() {
		if ($scope.type == "강사") {
			$scope.getTeacherSMSList();
		} else if ($scope.type == "수강생") {
			$scope.getStudentSMSList();
		}

	}

	$scope.addSendingSMS = function() {
		$scope.check_all = false;
		var old = [];
		angular.forEach($scope.sms_list, function(ele) {
			if (ele.selected == true) {
				ele.selected = false;
				old.push(ele);
			}
		});
		for (var i = 0; i < old.length; i++) {
			for (var j = 0; j < $scope.sms_list.length; j++) {
				if (old[i] == $scope.sms_list[j]) {
					$scope.sms_list.splice(j, 1);
				}
			}
		}
		angular.forEach(old, function(ele) {
			$scope.sending_sms.push(ele);
		});
		$scope.a = [];
		$.each($scope.sending_sms, function(key, value){
			
			$scope.a.push(value.mobile)  ;
			
		});
		
		$scope.list_mobile = $scope.a.toString();
	};

	$scope.downExcel = function() {
		$("#search_result_sms").table2excel({
			filename : "sms"
		});
	}

	$scope.deleteSelection = function() {
		$scope.select_all_right = false;
		$scope.selected_sendsms = $filter('filter')(
				$scope.sending_sms, {
					selected : true
				});
		angular.forEach($scope.selected_sendsms, function(ele) {
			var index = $scope.sending_sms.indexOf(ele);
			$scope.sending_sms.splice(index,1);
			ele.selected = false;
			$scope.sms_list.push(ele);
		});
	};

	$scope.openPopup = function() {
		if($scope.sending_sms == null || $scope.sending_sms == ''){
			$rootScope.showAlert("선택된 회원이 없습니다.");
		}
		else {
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : "smsTeacherSortingPopup.html",
				controller : "smsTeacherSortingPopupController",
				windowClass : "app-modal-window",
				scope : $scope,
				resolve : {
					list_mobile : function() {
						return $scope.list_mobile;
					}
				}
			});

			modalInstance.result.then(function(rs) {
			  $rootScope.showMessage($rootScope.getMessageType(rs[0].result), rs[0].message);
			  rs[0].result == 'succ' ? $state.reload() : $state.go("app.sms.teacher_sorting");
				
			}, function(err) {	
				console.info(err);
			});
		}
		}
};

function SMSTeacherSortingPopupController($scope, $uibModalInstance, $state,
		$rootScope, $filter, $window, $ksHttp, list_mobile) {
	$scope.sms_messages = [];
	$scope.count_areatext = 0;
	$scope.list_mobile = list_mobile;
	$scope.sms_new = {
		reserveYn : 'N'
	};
	$scope.sms_new.smsType = null;
	$scope.sms_new.sendTitle = null;
	$scope.sms_new.sendText = null;
	$scope.sms_new.reserveYn = 'N';
	$scope.sms_new.sendDt = null; 
	$scope.sms_new.hour = 0;
	$scope.sms_new.minute = 0;
	replyTel : $scope.sms_new.replyTel = null;
	
	$scope.initPopup = function() {
		$(".date").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$scope.getSmsMessages();
		$scope.setTime();
	}
	
	$scope.setTime= function(){
		$scope.sms_new.sendDt= $filter('date')(new Date(), 'yyyy-MM-dd');
		$scope.sms_new.hour= new Date().getHours();
		$scope.sms_new.minute= new Date().getMinutes(); 
	}

	$scope.getSmsMessages = function() {
		$ksHttp.post('SmsMessageList', {
			autoGroupYn : 'N'
		}).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.sms_messages = rs;
		}, function(error) {
			console.error(error);
		});
	}

	$scope.changeSmsType = function() {
		$scope.sms_new.sendTitle = "";
		$scope.sms_new.sendText = "";
		angular.forEach($scope.sms_messages, function(value, key) {
			if (value.cnts == $scope.sms_new.smsType) {
				$scope.sms_new.sendTitle = value.title;
				$scope.sms_new.sendText = value.sendText;
			}
		});
		$scope.changeAreaText($scope.sms_new.sendText);
	}

	$scope.changeAreaText = function(str) {
		var m = encodeURIComponent(str).match(/%[89ABab]/g);
		$scope.count_areatext = str.length + (m ? m.length : 0);
	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.generateParams = function() {
		return {
			saveType : 'I',
			smsType : $scope.sms_new.smsType,
			replyTel : $scope.sms_new.replyTel,
			sendTitle : $scope.sms_new.sendTitle,
			sendText : $scope.sms_new.sendText,
			sendDt : $scope.sms_new.sendDt,
			sendTime : $scope.sms_new.hour + ":" + $scope.sms_new.minute,
			reserveYn : $scope.sms_new.reserveYn,
			regUser : $rootScope.current_user.userId,
			smtCd : null
		};
	};

	$scope.validate = function(testYn) {
		var required_msg = $scope.$parent.app.required_msg;
		
		if ($.trim($scope.sms_new.sendTitle) == '') {
			$rootScope.showAlert('제목' + required_msg.dropdown);
			return false;
		}

		if ($.trim($scope.sms_new.replyTel) == '') {
			$rootScope.showAlert('회신번호' + required_msg.textbox);
			return false;
		}
		
		if ($.trim($scope.sms_new.sendText) == '') {
			$rootScope.showAlert('내용' + required_msg.textbox);
			return false;
		}
		
		if($.trim($scope.sms_new.reserveYn) == ''){
			$rootScope.showAlert('발송구분' + required_msg.textbox);
			return false;
		}
		
		if($scope.count_areatext > 2000) {
			$rootScope.showAlert('2,000byte 까지만 전송 가능합니다.');
			return false;
		}
		
		if ($.trim($scope.sms_new.reserveYn) == 'Y') {
			if ($.trim($scope.sms_new.sendDt) == ''
					|| $.trim($scope.sms_new.hour) == ''
					|| $.trim($scope.sms_new.minute) == '') {
				$rootScope.showAlert('예약발송' + required_msg.textbox);
				return false;
			}
		}
		if(testYn == 'Y' && $.trim($scope.send_mobile)==''){
			$rootScope.showAlert('수신번호'
					+ $scope.$parent.app.required_msg.textbox);
			return false;
		}
		return true;
	};

	$scope.save = function(testYn) {
		var altMsg = "저장하시겠습니까?";
		if( testYn == 'Y'){
			altMsg = "테스트발송 하시겠습니까?"
		}
		
		if ($scope.validate(testYn)) {
		
			$rootScope.showConfirm(altMsg, function() {
				var params = $scope.generateParams();
				
				if (testYn == 'Y') {
					params.testYn = "Y";
					params.sendUser = $scope.send_mobile;
					params.sendDt = $filter('date')(new Date(), 'yyyy-MM-dd');
					var tmp_hour = new Date().getHours();
					var tmp_min = new Date().getMinutes();
					params.sendTime = tmp_hour + ":" + tmp_min;
				} else {
					params.testYn = "N";
					params.sendUser = $scope.list_mobile;
				}
				
				$ksHttp.post('SendMessage', params).then(function(rs) {
				rs = JSON.parse(rs);
					
					$rootScope.showMessage($rootScope.getMessageType(rs[0].result), rs[0].message);
					if(rs[0].result == 'succ'){
			    	   if (testYn == 'N') {
			    		   $uibModalInstance.close(rs);
			    	   }
					}
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});

		}
	};

};

