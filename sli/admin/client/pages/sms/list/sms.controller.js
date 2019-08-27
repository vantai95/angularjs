"use strict";

app.controller("SMSController", SMSController);
app.controller('SMSTeacherSortingPopupController', SMSTeacherSortingPopupController);

function SMSController($scope, $rootScope, $ksHttp, $uibModal, $window,
		$stateParams, $state) {
	$scope.sms = [];
	$scope.current_page = 1;
	$scope.total_sms = 0;
	$scope.total_pages = 0;

	$scope.init = function() {
		$scope.getSMSCnt();
	}

	$scope.getSMSCnt = function() {
		$ksHttp.post('SendMessageList', {}).then(
				function(rs) {
					rs = JSON.parse(rs);
					if (rs && rs.length > 0) {
						$scope.total_sms = rs.length;
						$scope.total_pages = Math.ceil($scope.total_sms
								/ $scope.app.page_size);
					}

				}, function(error) {
					console.log(error);
				});
	};

	$scope.getSMS = function() {
		var start_page = $scope.current_page == 1 ? 1
				: ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			startPage : start_page,
			endPage : end_page
		}
		
		$ksHttp.post('SendMessageList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.sms = rs;
		}, function(error) {
			console.log(error);
		});
	}

	$scope.cancel = function(smtCd, sendDt, sendTime) {
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		var time = date.getHours()+':'+date.getMinutes();
		$scope.today = year + '-' + month + '-' + day;
		$rootScope.showConfirm('삭제하시겠습니까 ?', function() {
			var params = {
				smtCd : smtCd,
				saveType : 'D',
				sendDt : $scope.today,
				sendTime : time,
				sendUser : '',
				updUser : $rootScope.current_user.userId
			};

			$ksHttp.post('SendMessage', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if( status == 'succ') $state.reload();
			}, function(error) {
				console.log(error);
			});
		});
	}

	$scope.$watch('current_page', function() {
		$scope.getSMS();
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

	$scope.openPopup = function(x) {
		$scope.sms_current_id = x.smtCd;
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "smsTeacherSortingPopup.html",
			controller : "SMSTeacherSortingPopupController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				items : function() {
					return $scope.data;
				}
			}
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$state.reload();
			}
		}, function(err) {
			console.info(err);
		});
	};
}


function SMSTeacherSortingPopupController($scope, $uibModalInstance, $state,
		$rootScope, $filter, $window, $ksHttp) {

	$scope.sms_messages = [];
	$scope.count_areatext = 0;
	$scope.sms_current = {};
	$scope.sms_current.smtCd = 0;
	$scope.sms_current.smsType = null;
	$scope.sms_current.sendTitle = null;
	$scope.sms_current.sendText = null;
	$scope.sms_current.reserveYn = null;
	$scope.sms_current.sendDt = null;
	$scope.sms_current.hour = null;
	$scope.sms_current.minute = null;
	$scope.sms_current.replyTel = null;
	
	$scope.initPopup = function() {
		$(".date").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$scope.getSmsMessages();
		if($scope.sms_current_id){
			$scope.getSmsCurrent();
		}
	}

	$scope.getSmsCurrent = function() {
		$ksHttp.post('SendMessageDetail', {smtCd : $scope.sms_current_id}).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.sms_current = rs[0];
			$scope.sms_current.hour= parseInt($scope.sms_current.sendTime.split(':')[0]);
			$scope.sms_current.minute= parseInt($scope.sms_current.sendTime.split(':')[1]);
			$scope.changeAreaText($scope.sms_current.sendText);
			
			$scope.setDefaultDt($scope.sms_current.sendDt, "");
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getSmsMessages = function() {
		$ksHttp.post('SmsMessageList', {
			autoGroupYn : 'N'
		}).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.sms_messages = rs;
		}, function(error) {
			console.log(error);
		});
	}

	$scope.changeSmsType = function() {
		$scope.sms_current.sendTitle = "";
		$scope.sms_current.sendText = "";
		angular.forEach($scope.sms_messages, function(value, key) {
			if (value.cnts == $scope.sms_current.smsType) {
				$scope.sms_current.sendTitle = value.title;
				$scope.sms_current.sendText = value.sendText;
			}
		});
		$scope.changeAreaText($scope.sms_current.sendText);
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
			smtCd: $scope.sms_current.smtCd,
			saveType : 'U',
			smsType : $scope.sms_current.smsType,
			replyTel : $scope.sms_current.replyTel,
			sendTitle : $scope.sms_current.sendTitle,
			sendText : $scope.sms_current.sendText,
			sendDt : $scope.sms_current.sendDt,
			sendTime : $scope.sms_current.hour + ":" + $scope.sms_current.minute,
			reserveYn : $scope.sms_current.reserveYn,
			regUser : $rootScope.current_user.userId
		};
	};

	$scope.validate = function(testYn) {
		var required_msg = $scope.$parent.app.required_msg;

		if ($.trim($scope.sms_current.sendTitle) == '') {
			$rootScope.showAlert('제목' + required_msg.dropdown);
			return false;
		}

		if ($.trim($scope.sms_current.replyTel) == '') {
			$rootScope.showAlert('회신번호' + required_msg.textbox);
			return false;
		}
		
		if ($.trim($scope.sms_current.sendText) == '') {
			$rootScope.showAlert('내용' + required_msg.textbox);
			return false;
		}
		
		if($.trim($scope.sms_current.reserveYn) == ''){
			$rootScope.showAlert('발송구분' + required_msg.textbox);
			return false;
		}

		if($scope.count_areatext > 2000) {
			$rootScope.showAlert('2,00byte 까지만 전송 가능합니다.');
			return false;
		}
		
		if ($.trim($scope.sms_current.reserveYn) == 'Y') {
			if ($.trim($scope.sms_current.sendDt) == ''
					|| $.trim($scope.sms_current.hour) == ''
					|| $.trim($scope.sms_current.minute) == '') {
				$rootScope.showAlert('예약발송' + required_msg.textbox);
				return false;
			}
		}
		if(testYn == 'Y' && $.trim($scope.sms_current.sendMobiles)==''){
			$rootScope.showAlert('수신번호'
					+ $scope.$parent.app.required_msg.textbox);
			return false;
		}
		return true;
	};

	$scope.save = function(testYn) {
		if ($scope.validate(testYn)) {
			$rootScope.showConfirm('저장하시겠습니까?', function() {
				var params = $scope.generateParams();
				if (testYn == 'Y') {
					params.testYn = 'Y';
					params.sendUser = $scope.sms_current.sendMobiles;
					params.sendDt = $filter('date')(new Date(), 'yyyy-MM-dd');
					var tmp_hour = new Date().getHours();
					var tmp_min = new Date().getMinutes();
					params.sendTime = tmp_hour + ":" + tmp_min;
				} else {
					params.testYn = 'N';
					params.sendUser = '';
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
					console.log(error);
				});
			});

		}
	};

	$scope.setDefaultDt = function(strDt, endDt){
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
	}
};