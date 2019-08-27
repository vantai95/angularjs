"use strict";

app.controller("StudentController", StudentController);
app.controller("CustomModalController", CustomModalController);
app.controller("SMSTeacherSortingPopupController", SMSTeacherSortingPopupController);
function StudentController($scope, $rootScope, $ksHttp, $uibModal, $window,
		$stateParams, $state) {
	$scope.student = {};
	$scope.lectures = [];
	$scope.customer_companies = [];
	$scope.teachers = [];
	$scope.lessons = [];
	$scope.classes = [];

	$scope.selected_lecture = null;
	$scope.selected_customer_company = null;
	$scope.selected_teacher = null;
	$scope.total_classes = 0;
	$scope.total_pages = 0;
	$scope.current_page = 1;

	$scope.init = function() {
		if ($stateParams.error && $stateParams.err_msg) {
			$rootScope.showAlert($stateParams.err_msg);
		}
		$scope.getTeachers();
		$scope.CustomerCompanies();
		$scope.getLectures();
		
		if( $stateParams.id != null && $stateParams.id != '' ){
			$scope.selected_lecture = $stateParams.id;
			$scope.getClasses();								
		}
	};

	$scope.getLectures = function() {
		var params = {
			tcCd : $scope.selected_teacher,
			cpCd : $scope.selected_customer_company
		}
		$ksHttp.post("LectureListBox", params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lectures = rs;
			
		}, function(error) {
			console.log(error);
		});
	};

	$scope.CustomerCompanies = function() {
		$ksHttp.post("CustomerCompanyListBox", {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getTeachers = function() {
		$ksHttp.post("TeacherListBox", {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getClasses = function() {
		
		if ($scope.selected_lecture == null || $scope.selected_lecture == '') {
			$rootScope.showMessage('error', '강의명을 선택해주세요 ');
			$scope.classes = [];
			return;
		}
		
		var start_page = $scope.current_page == 1 ? 1
				: ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			tcCd : $scope.selected_teacher,
			cpCd : $scope.selected_customer_company,
			ltCd : $scope.selected_lecture,
			startPage : start_page,
			endPage : end_page
		};

		$ksHttp.post('ClassInfoList', params).then(function(rs) {
			$scope.classes = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
		$scope.getClassesCount();
	};

	$scope.getClassesCount = function() {
		
		var count_params = {
			tcCd : $scope.selected_teacher,
			cpCd : $scope.selected_customer_company,
			ltCd : $scope.selected_lecture,
		};

		$ksHttp.post('ClassInfoListCnt', count_params).then(
				function(rs) {
					rs = JSON.parse(rs);
					if (rs && rs.length > 0) {
						$scope.total_classes = rs[0].totalcnt;
						$scope.total_pages = Math.ceil($scope.total_classes
								/ $scope.app.page_size);

					}
				}, function(error) {
					console.log(error);
				});
	};
	
	$scope.addNew = function() {
		if ($scope.selected_lecture == null || $scope.selected_lecture == '') {
			$rootScope.showMessage('error', '강의명을 선택해주세요 ');
			return;
		}
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "custom_modal.html",
			controller : "CustomModalController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				lecture : function() {
					return $scope.selected_lecture ;
				},
				customer_company : function() {
					return $scope.selected_customer_company;
				}

			}
		});

		modalInstance.result.then(function(result) {
			var message = result[0].message;
			var status = result[0].result;
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			$scope.getClasses();
			$scope.getClassesCount();
		}, function(err) {
			console.info(err);
		});
	};

	$scope.exportEcel = function() {
		if ($scope.selected_lecture == null || $scope.selected_lecture == '') {
			$rootScope.showMessage('error', '강의명을 선택해주세요 ');
			return;
		}
		
		var config = {
			tcCd : $scope.selected_teacher != null && $scope.selected_teacher != '' ? $scope.selected_teacher : '',
			cpCd : $scope.selected_customer_company != null && $scope.selected_customer_company != '' ? $scope.selected_customer_company : '',
			ltCd : $scope.selected_lecture != null && $scope.selected_lecture != '' ? $scope.selected_lecture : '',
		};

		window.open('/excel/student.do?cpCd='+ config.cpCd + '&tcCd=' + config.tcCd + '&ltCd=' + config.ltCd);
	}

	$scope.sendMessage = function() {
		if ($scope.selected_lecture == null || $scope.selected_lecture == '') {
			$rootScope.showMessage('error', '강의명을 선택해주세요.');
			return;
		}
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "smsTeacherSortingPopup.html",
			controller : "SMSTeacherSortingPopupController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				lecture : function() {
					return $scope.selected_lecture ;
				},
				customer_company : function() {
					return $scope.selected_customer_company;
				}
			}
		});

		modalInstance.result.then(function(result) {
		}, function(err) {
			console.info(err);
		});
	}

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
}

function CustomModalController($scope, $uibModalInstance, $rootScope, $ksHttp, $filter, lecture) {
	$scope.selected_lecture = lecture;
	$scope.selected_customer_company = '';
	$scope.user_name = '';
	$scope.register_users = [];
	$scope.register_users_cnt = 0;
	$scope.unregistered_users = [];
	$scope.register_all = 0;
	$scope.selected_register_users = [];
	$scope.selected_unregister_users = [];
	$scope.lecture_detail = {};
	$scope.search = {};
	$scope.search.user_name = '';

	$scope.init_register = function() {
		$scope.getLectureDetail();
	};
	
	$scope.checkAll = function () {
		   if ($scope.register_all) {
   		    $scope.register_all = false ;
   		   } else {
   		    $scope.register_all = true;
   		   }
   		   angular.forEach($scope.unregistered_users, function (unregistered_user) {
   			unregistered_user.is_register = $scope.register_all;
   		   });
	};
	
	 $scope.updateCheckall = function(){
         
		    var userTotal = $scope.unregistered_users.length;
		    var count = 0;
		    angular.forEach($scope.unregistered_users, function (item) {
		       if(item.is_register){
		         count++;
		       }
		    });

		    if(userTotal == count){
		       $scope.register_all = true;
		    }else{
		       $scope.register_all = false;
		    }
		  };
		  
		  $scope.checkAll1 = function () {
			   if ($scope.unregister_all) {
	   		    $scope.unregister_all = false ;
	   		   } else {
	   		    $scope.unregister_all = true;
	   		   }
	   		   angular.forEach($scope.register_users, function (register_users) {
	   			register_users.is_unregister = $scope.unregister_all;
	   		   });
		};
		
		 $scope.updateCheckall1 = function(){
	         
			    var userTotal = $scope.register_users.length;
			    var count = 0;
			    angular.forEach($scope.register_users, function (item) {
			       if(item.is_unregister){
			         count++;
			       }
			    });

			    if(userTotal == count){
			       $scope.unregister_all = true;
			    }else{
			       $scope.unregister_all = false;
			    }
			  };

	$scope.getLectureDetail = function() {
		$ksHttp.post('LectureDetail', {
			ltCd : $scope.selected_lecture
		}).then(function(rs) {
			$scope.lecture_detail = JSON.parse(rs)[0];
			$scope.selected_customer_company = $scope.lecture_detail.cpCd;
			
			$scope.getRegisterStudentsClass();
			$scope.getUnRegisterStudentsClass();
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getRegisterStudentsClass = function() {
		var params = {
			ltCd : $scope.selected_lecture,
			cpCd : $scope.selected_customer_company,
			classYn : 'Y'
		};
		
		$ksHttp.post('ClassStudentList', params).then(function(rs) {
			$scope.register_users = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});

	};

	$scope.getUnRegisterStudentsClass = function() {
		var params = {
			ltCd : $scope.selected_lecture,
			cpCd : $scope.selected_customer_company,
			classYn : 'N',
			userName : $scope.user_name
		};
		$ksHttp.post('ClassStudentList', params).then(function(rs) {
			$scope.unregistered_users = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.registerUsers = function() {
		$scope.register_all = false;
		$scope.selected_register_users = $filter('filter')(
				$scope.unregistered_users, {
					is_register : true
				});
		
		$scope.register_users = $scope.register_users
				.concat($scope.selected_register_users);

		$scope.unregistered_users = $.grep($scope.unregistered_users, function(
				value) {
			return $.inArray(value, $scope.selected_register_users) < 0;
		});
	};

	$scope.unRegisterUsers = function() {
		$scope.unregister_all = false;
		$scope.selected_unregister_users = $filter('filter')(
				$scope.register_users, {
					is_unregister : true
				});
		$scope.unregistered_users = $scope.unregistered_users
				.concat($scope.selected_unregister_users);
		
		
		$scope.register_users = $.grep($scope.register_users, function(value) {
			value.is_register = false;
			value.is_unregister = false;
			return $.inArray(value, $scope.selected_unregister_users) < 0;
		});
		
	};

	$scope.getData = function(array_object) {
		var students = array_object.map(function(student) {
			return student.stCd;
		});
		return students.toString();
	};

	$scope.submitChangeRegister = function() {
		
		var params = {
			ltCd : $scope.selected_lecture,
			cpCd : $scope.selected_customer_company,
			addUser : $scope.getData($scope.selected_register_users),
			delUser : $scope.getData($scope.selected_unregister_users),
			regUser : $rootScope.current_user.userId
		};
		$ksHttp.post('ClassStudentSave', params).then(function(rs) {
			rs = JSON.parse(rs);
			$uibModalInstance.close(rs);
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
		});

	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	var match = function (item, val) {
	    var regex = new RegExp(val, 'i');
	    return item.userName.toString().search(regex) == 0;
	  };
	  
	$scope.filterUsers = function(user) {
	    // No filter, so return everything
		//console.log($scope.search.user_name);
		//console.log(user);
	    if (!$scope.search.user_name) return true;
	    var matched = true;
	    
	    // Otherwise apply your matching logic
	    $scope.search.user_name.split(' ').forEach(function(token) {
	        matched = matched && match(user, token); 
	    });
	     
	    return matched;
	};
};

function SMSTeacherSortingPopupController($scope, $uibModalInstance, $state, $rootScope, $filter, $window, $ksHttp, lecture, customer_company) {
	$scope.selected_lecture = lecture;
	$scope.selected_customer_company = customer_company;
	$scope.register_users = [];

	$scope.sms_messages = [];
	$scope.count_areatext = 0;
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
		
		$scope.getRegisterStudentsClass();
	}
	
	$scope.getRegisterStudentsClass = function() {
				
		var params = {
			ltCd : $scope.selected_lecture
		};
		//수강 중단이 아닌사람만 하기위해 서비스 분리 
		$ksHttp.post('SendMessageUsers', params).then(function(rs) {
			$scope.register_users = JSON.parse(rs);
			if( null != $scope.register_users) $scope.register_users_cnt = $scope.register_users.length;
			
			angular.forEach($scope.register_users, function (item) {
		    	item.is_register = true;
		    });
		    $scope.register_all = true;
		}, function(error) {
			console.log(error);
		});

	};

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
		
		if(testYn == 'N'){
			if( $scope.register_users.length < 1){
				$rootScope.showAlert('발송할 대상이 존재하지 않습니다.');
				return false;
			}
		}
		
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
					var tmp_list = new Array();
				    angular.forEach($scope.register_users, function (item) {
				    	tmp_list.push(item.mobile);
				    });
					params.testYn = "N";
					params.sendUser = tmp_list.join(',');
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
