"use strict";
app.controller("ListController", ListController);

app.controller('PoupController', PoupController);
app.controller("CustomModalControllerPayment", CustomModalControllerPayment);
app.controller('PoupController2', PoupController2);

function ListController($scope, $rootScope, $filter, $ksHttp, $uibModal,
		$location, $timeout) {
	$scope.my_pays = [];
	$scope.total_my_pay = 0
	$scope.current_page = 1;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.shStartDt = '';
	$scope.shEndDt = '';
	$scope.orderCd_current = null;
	$scope.userInfo = null;
	$scope.selectBankType = 'op_1';
	
	$scope.init = function() {
		$scope.setSearchDate(3);
		$scope.getMyPayListCnt();
		$scope.getPayMeans();
		$scope.getUserInfo();
	};
	
	$scope.getUserInfo = function(){		
		$ksHttp.post('StudentDetail', {stCd : $rootScope.current_user.stCd}).then(function(rs){
			rs = JSON.parse(rs);
			$scope.userInfo = rs[0];						
		}, function(error){
			console.log(error);
		});
	}

	$scope.getPayMeans = function(){
		var params = {
			groupId : 'PAY_MEANS'	
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.pay_means = rs;
		}, function(error){
			console.log(error);
		});
		
	};
	$scope.getSearch = function() {
		$scope.my_pays = [];
		$scope.getMyPayListCnt();
		$scope.getMyPayList();
	}
	$scope.getMyPayList = function() {
		var params = {
			stCd : $rootScope.current_user.stCd,
			shStartDt : $scope.shStartDt,
			shEndDt : $scope.shEndDt,
			startPage : $scope.startPage,
			endPage : $scope.endPage
		};

		$ksHttp.post('MyPayList', params).then(function(rs) {
			rs = JSON.parse(rs);
			if( $scope.my_pays.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.my_pays.push(rs[i]);
				}				
			}else{
				$scope.my_pays = rs;
			}
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getMyPayListCnt = function() {
		var params = {
			stCd : $rootScope.current_user.stCd,
			shStartDt : $scope.shStartDt,
			shEndDt : $scope.shEndDt
		};

		$ksHttp.post('MyPayListCnt', params).then(
				function(rs) {
					rs = JSON.parse(rs)
					// console.log(rs);
					if (rs && rs.length > 0) {
						$scope.total_my_pay = rs[0].totalcnt;
						$scope.total_pages = Math.ceil($scope.total_my_pay / $scope.app.page_size);
					}
				}, function(error) {
					console.log(error);
				});
	};

	$scope.openPopup = function(paCd) {
		$scope.paCd_current = paCd;
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup",
			controller : "PoupController",
			windowClass : "app-modal-window",
			scope : $scope

		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				console.log(result);
				$rootScope.showAlert(result[0].message);
			}
		}, function(err) {
			console.info(err);
		});
	};

	$scope.openPopup2 = function(item) {
		var modalInstance = $uibModal.open({
	        animation: true,
	        templateUrl: "popup2",
	        controller: "CustomModalControllerPayment",
	        windowClass: "app-modal-window",
	        scope: $scope,
	        resolve: {
	        	lecture_detail : function() {
					return item ;
				},
				pay_means : function() {
					return $scope.pay_means ;
				}
	        }
	    });
	    
	    modalInstance.result.then(function(result) {
	    }, function(err) {
	        console.info(err);
	    });		
	}
	$scope.setSearchDate = function(month) {
		
		var startDt = new Date();
		var endDt = new Date();		
		startDt.setMonth(startDt.getMonth() - month);
		$scope.shStartDt = $filter('date')(startDt, "yyyy-MM-dd"); 
		$scope.shEndDt = $filter('date')(endDt, "yyyy-MM-dd");		
		$(".dateStr").datepicker('setDate', startDt);		
		$(".dateEnd").datepicker('setDate', endDt);		
		
		$(".dt_3").removeClass("btn-primary");
		$(".dt_6").removeClass("btn-primary");
		$(".dt_12").removeClass("btn-primary");
		$(".dt_3").addClass("bg-white");
		$(".dt_6").addClass("bg-white");
		$(".dt_12").addClass("bg-white");
		
		$(".dt_"+month).addClass("btn-primary");
	};
	
	$scope.$watch('current_page', function() {
		$scope.getMyPayList();
	});
	
	$scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};
	
	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages){
			$scope.current_page += 1;
			$scope.startPage = ($scope.current_page * $scope.app.page_size) - 9;
			$scope.endPage = $scope.current_page * $scope.app.page_size;
			
		}else{
			$scope.current_page = $scope.total_pages;
			$rootScope.showAlert('더 이상 목록이 존재하지 않습니다.');
			$(".btnMoreList").hide();
		}
	};
	
	/*
	$scope.paymentCancel = function(item) {
		$rootScope.showConfirm('결제를 취소 하시겠습니까?', function() {
			var params = {
					CST_PLATFORM : 'service',
					CST_MID : 'sli01',
					LGD_TID : item.cardResult,
				};
	
			$ksHttp.post('PaymentCancel', params).then(function(rs) {
				console.log(rs);
				if(rs.result == 'succ') {
					var params = {
							paCd: item.paCd
					};
						
					$ksHttp.post('AccountRefundSave2', params).then(function(rs) {
						rs = JSON.parse(rs);
						$scope.my_pays = [];
						$scope.getMyPayListCnt();
						$scope.getMyPayList();
						$rootScope.showMessage('success', '환불요청 되었습니다.');
					}, function(error) {
						$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					});
					
				}
				else {
					$rootScope.showMessage('error', '[오류] 결제 취소에 실패하였습니다. 관리자에게 문의해 주세요.');
				}
	//			rs = JSON.parse(rs);
			}, function(error) {
				console.log(error);
			});
		})
	}*/
};

function PoupController($scope, $uibModalInstance, $ksHttp, $rootScope) {
	$scope.refund_info = null;
	$scope.refundType = null;
	$scope.refundCnts = null;
	$scope.bankCd = null;
	$scope.bankAccount = null;
	$scope.popupInit = function() {
		if ($scope.paCd_current != null){
			$scope.selectBankType = 'op_1';
			$scope.bankCd = $scope.userInfo.bankCd;
			$scope.bankAccount = $scope.userInfo.bankAccount;
			$('.chk-bank').prop('readonly', true);
			$('.chk-bank').attr("disabled", true);
			$scope.getRefundPopInfo();
			$scope.getRefundType();
			$scope.getBankcd();
		}
	};

	$scope.getRefundPopInfo = function() {
		var params = {
			paCd : $scope.paCd_current
		};

		$ksHttp.post('RefundPopInfo', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs) {
				$scope.refund_info = rs[0];
			}
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getRefundType = function() {
		var params = {
			groupId : 'REFUND_TYPE'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.refund_types = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getBankcd = function() {
		var params = {
			groupId : 'BANK_CD'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.bankcds = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.save = function() {
		
		if( null == $scope.refundType ){
			$rootScope.showAlert('환불사유를 선택해주세요. ');
			return;
		}
		if( null == $scope.refundCnts ){
			$rootScope.showAlert('환불사유를 입력해주세요.');
			return;
		}
		
		$rootScope.showConfirm('환불신청 하시겠습니까?', function() {
			var params = {
				saveType : 'I',
				paCd : $scope.paCd_current,
				stCd : $scope.current_user.stCd,
				refundType : $scope.refundType,
				refundCnts : $scope.refundCnts,
				bankCd :  $scope.bankCd,
				bankAccount : $scope.bankAccount,
				regUser : $scope.current_user.userId,
			};
			
			$ksHttp.post('AccountRefundSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				if( 'succ' == rs[0].result ){
					$uibModalInstance.close(rs);
					$scope.getSearch();
				}
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');				
			});
		});
	};
	
	$scope.changeBankType = function(){
		if( "op_1" == $scope.selectBankType){
			//내 계좌
			$scope.bankCd = $scope.userInfo.bankCd;
			$scope.bankAccount = $scope.userInfo.bankAccount;
			$('.chk-bank').prop('readonly', true);
			$('.chk-bank').attr("disabled", true);
		}else{
			//직접입력
			$scope.bankCd = null;
			$scope.bankAccount = '';
			$('.chk-bank').prop('readonly', false);
			$('.chk-bank').attr("disabled", false);
		}
	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
};

function CustomModalControllerPayment ($ksHttp, $scope, $rootScope , $uibModal, $uibModalInstance, lecture_detail, pay_means) {
	$scope.lecture_detail = lecture_detail;
	$scope.pay_mean = pay_means;
	$scope.checkAll = false;
	$scope.check = false;
	$scope.check1 = false;
	
	$scope.init = function() {
		var now = new Date();
		var nowDate = now.getFullYear() + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + (now.getDate() < 10 ? '0' : '') + now.getDate() + 
					(now.getHours() < 10 ? '0' : '') + now.getHours() + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds(); 
					
		$('input[name=LGD_PRODUCTINFO]').val($scope.lecture_detail.lectureNm);
		$('input[name=LGD_BUYER]').val($rootScope.current_user.userName);
		$('input[name=LGD_AMOUNT]').val($scope.lecture_detail.payMoney);
		$('input[name=LGD_CUSTOM_FIRSTPAY]').val('SC0010');
		$('input[name=LGD_OID]').val($scope.lecture_detail.orderCd);
	}
	
	$scope.checkAll1 = function(){
		$scope.checkAll = !$scope.checkAll;
			$scope.check = $scope.checkAll;
			$scope.check1 = $scope.checkAll;
	};
	
	$scope.selectCheck = function(){
		$scope.check = !$scope.check;
	};
	
	$scope.selectCheck1 = function(){
		$scope.check1 = !$scope.check1;
	};
	
	$scope.$watch('[check,check1]', function(){
		if($scope.check && $scope.check1){
			$scope.checkAll = true;
		}
		else {
			$scope.checkAll = false;
		}
	});
	
	$scope.validate = function(){
		if($scope.check == false && $scope.check1 == false){
			$rootScope.showAlert('구매정보와 환불정책을 동의해주세요');
			return false;
		}
		return true;
	};
	
	$scope.selected = 'CARD';
    $scope.select= function(index) {
    	var tmp = 'SC0010';
    	if(index == 'CARD') tmp = 'SC0010';
    	else if(index == 'DBANK') tmp = 'SC0030';
    	else if(index == 'VBANK') tmp = 'SC0040';
    	else if(index == 'PHONE') tmp = 'SC0060';
    	
    	$('input[name=LGD_CUSTOM_USABLEPAY]').val(tmp);
       $scope.selected = index; 
    };
	
	$scope.getPayment = function(){
		console.log($('#LGD_PAYINFO_M'));
		console.log($('#LGD_PAYINFO'));
		if(!$scope.check) {
			$rootScope.showAlert('구매정보 확인 및 결제진행에 동의해 주세요.');
			return;
		}
		if(!$scope.check1) {
			$rootScope.showAlert('환불정책에 동의해 주세요.');
			return;
		}
		console.log(document.getElementById('LGD_PAYINFO_M'));

		$rootScope.showConfirm('결제하시겠습니까?', function() {
			var filter = "win16|win32|win64|mac";
			if (navigator.platform && filter.indexOf(navigator.platform.toLowerCase()) >= 0) {
				makeoid();
				var params = {
						CST_MID : $('form[name=frm_payment] input[name=CST_MID]').val(),
						CST_PLATFORM : $('form[name=frm_payment] input[name=CST_PLATFORM]').val(),
						LGD_BUYER : $('form[name=frm_payment] input[name=LGD_BUYER]').val(),
						LGD_PRODUCTINFO : $('form[name=frm_payment] input[name=LGD_PRODUCTINFO]').val(),
						LGD_AMOUNT : $('form[name=frm_payment] input[name=LGD_AMOUNT]').val(),
						LGD_BUYEREMAIL :  $('form[name=frm_payment] input[name=LGD_BUYEREMAIL]').val(),
						LGD_OID : $('form[name=frm_payment] input[name=LGD_OID]').val(),
						LGD_TIMESTAMP : $('form[name=frm_payment] input[name=LGD_TIMESTAMP]').val(),
						LGD_CUSTOM_USABLEPAY : $('form[name=frm_payment] input[name=LGD_CUSTOM_USABLEPAY]').val(),
						LGD_WINDOW_TYPE : $('form[name=frm_payment] input[name=LGD_WINDOW_TYPE]').val(),
						LGD_CUSTOM_SWITCHINGTYPE : $('form[name=frm_payment] input[name=LGD_CUSTOM_SWITCHINGTYPE]').val(),
					};
					
					$ksHttp.post('Payment', params).then(function(rs) {
						if(rs.result == 'succ') {
							console.log(rs);
							$('#LGD_PAYINFO #CST_MID').val(rs.data.CST_MID);
							$('#LGD_PAYINFO #CST_PLATFORM').val(rs.data.CST_PLATFORM);
							$('#LGD_PAYINFO #LGD_AMOUNT').val(rs.data.LGD_AMOUNT);
							$('#LGD_PAYINFO #LGD_BUYER').val(rs.data.LGD_BUYER);
							$('#LGD_PAYINFO #LGD_BUYEREMAIL').val(rs.data.LGD_BUYEREMAIL);
							$('#LGD_PAYINFO #LGD_CASNOTEURL').val(rs.data.LGD_CASNOTEURL);
							$('#LGD_PAYINFO #LGD_CUSTOM_PROCESSTYPE').val(rs.data.LGD_CUSTOM_PROCESSTYPE);
							$('#LGD_PAYINFO #LGD_CUSTOM_SKIN').val(rs.data.LGD_CUSTOM_SKIN);
							$('#LGD_PAYINFO #LGD_CUSTOM_SWITCHINGTYPE').val(rs.data.LGD_CUSTOM_SWITCHINGTYPE);
							$('#LGD_PAYINFO #LGD_CUSTOM_USABLEPAY').val(rs.data.LGD_CUSTOM_USABLEPAY);
							$('#LGD_PAYINFO #LGD_DOMAIN_URL').val(rs.data.LGD_DOMAIN_URL);
							$('#LGD_PAYINFO #LGD_HASHDATA').val(rs.data.LGD_HASHDATA);
							$('#LGD_PAYINFO #LGD_MID').val(rs.data.LGD_MID);
							$('#LGD_PAYINFO #LGD_OID').val(rs.data.LGD_OID);
							$('#LGD_PAYINFO #LGD_OSTYPE_CHECK').val(rs.data.LGD_OSTYPE_CHECK);
							$('#LGD_PAYINFO #LGD_PAYKEY').val(rs.data.LGD_PAYKEY);
							$('#LGD_PAYINFO #LGD_PRODUCTINFO').val(rs.data.LGD_PRODUCTINFO);
							$('#LGD_PAYINFO #LGD_RESPCODE').val(rs.data.LGD_RESPCODE);
							$('#LGD_PAYINFO #LGD_RESPMSG').val(rs.data.LGD_RESPMSG);
							$('#LGD_PAYINFO #LGD_RETURNURL').val(rs.data.LGD_RETURNURL);
							$('#LGD_PAYINFO #LGD_TIMESTAMP').val(rs.data.LGD_TIMESTAMP);
							$('#LGD_PAYINFO #LGD_VERSION').val(rs.data.LGD_VERSION);
							$('#LGD_PAYINFO #LGD_WINDOW_TYPE').val(rs.data.LGD_WINDOW_TYPE);
							$('#LGD_PAYINFO #LGD_WINDOW_VER').val(rs.data.LGD_WINDOW_VER);
							
							lgdwin = openXpay(document.getElementById('LGD_PAYINFO'), rs.data.CST_PLATFORM, rs.data.LGD_WINDOW_TYPE, null, "", "");
						}
						else {
							$rootScope.showAlert('결제에 실패했습니다. 관리자에게 문의해주세요.');
						}
					}, function(error) {
						$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
						console.log(error);
					});
			}
			else {
				console.log(document.getElementById('LGD_PAYINFO_M'));
				var params = {
						CST_MID : $('form[name=frm_payment] input[name=CST_MID]').val(),
						CST_PLATFORM : $('form[name=frm_payment] input[name=CST_PLATFORM]').val(),
						LGD_BUYER : $('form[name=frm_payment] input[name=LGD_BUYER]').val(),
						LGD_PRODUCTINFO : $('form[name=frm_payment] input[name=LGD_PRODUCTINFO]').val(),
						LGD_AMOUNT : $('form[name=frm_payment] input[name=LGD_AMOUNT]').val(),
						LGD_BUYEREMAIL :  $('form[name=frm_payment] input[name=LGD_BUYEREMAIL]').val(),
						LGD_OID : $('form[name=frm_payment] input[name=LGD_OID]').val(),
						LGD_TIMESTAMP : $('form[name=frm_payment] input[name=LGD_TIMESTAMP]').val(),
						LGD_CUSTOM_FIRSTPAY : $('form[name=frm_payment] input[name=LGD_CUSTOM_USABLEPAY]').val(),
					};
					
					$ksHttp.post('MPayment', params).then(function(rs) {
						console.log(document.getElementById('LGD_PAYINFO_M'));
						if(rs.result == 'succ') {
							$('#LGD_PAYINFO_M #LGD_CUSTOM_PROCESSTYPE').val(rs.data.LGD_CUSTOM_PROCESSTYPE);
							$('#LGD_PAYINFO_M #LGD_MID').val(rs.data.LGD_MID);
							$('#LGD_PAYINFO_M #CST_PLATFORM').val(rs.data.CST_PLATFORM);
							$('#LGD_PAYINFO_M #LGD_CASNOTEURL').val(rs.data.LGD_CASNOTEURL);
							$('#LGD_PAYINFO_M #LGD_BUYER').val(rs.data.LGD_BUYER);
							$('#LGD_PAYINFO_M #LGD_CUSTOM_SKIN').val(rs.data.LGD_CUSTOM_SKIN);
							$('#LGD_PAYINFO_M #LGD_CUSTOM_PROCESSTYPE').val(rs.data.LGD_CUSTOM_PROCESSTYPE);
							$('#LGD_PAYINFO_M #LGD_CUSTOM_SKIN').val(rs.data.LGD_CUSTOM_SKIN);
							$('#LGD_PAYINFO_M #CST_MID').val(rs.data.CST_MID);
							$('#LGD_PAYINFO_M #LGD_KVPMISPAUTOAPPYN').val(rs.data.LGD_KVPMISPAUTOAPPYN);
							$('#LGD_PAYINFO_M #LGD_OID').val(rs.data.LGD_OID);
							$('#LGD_PAYINFO_M #LGD_MTRANSFERWAPURL').val(rs.data.LGD_MTRANSFERWAPURL);
							$('#LGD_PAYINFO_M #LGD_VERSION').val(rs.data.LGD_VERSION);
							$('#LGD_PAYINFO_M #LGD_PCVIEWYN').val(rs.data.LGD_PCVIEWYN);
							$('#LGD_PAYINFO_M #LGD_TIMESTAMP').val(rs.data.LGD_TIMESTAMP);
							$('#LGD_PAYINFO_M #CST_WINDOW_TYPE').val(rs.data.CST_WINDOW_TYPE);
							$('#LGD_PAYINFO_M #LGD_RETURNURL').val(rs.data.LGD_RETURNURL);
							$('#LGD_PAYINFO_M #LGD_PAYKEY').val(rs.data.LGD_PAYKEY);
							$('#LGD_PAYINFO_M #LGD_AMOUNT').val(rs.data.LGD_AMOUNT);
							$('#LGD_PAYINFO_M #LGD_MTRANSFERAUTOAPPYN').val(rs.data.LGD_MTRANSFERAUTOAPPYN);
							$('#LGD_PAYINFO_M #LGD_RESPMSG').val(rs.data.LGD_RESPMSG);
							$('#LGD_PAYINFO_M #LGD_CUSTOM_FIRSTPAY').val(rs.data.LGD_CUSTOM_FIRSTPAY);
							$('#LGD_PAYINFO_M #LGD_MPILOTTEAPPCARDWAPURL').val(rs.data.LGD_MPILOTTEAPPCARDWAPURL);
							$('#LGD_PAYINFO_M #LGD_PRODUCTINFO').val(rs.data.LGD_PRODUCTINFO);
							$('#LGD_PAYINFO_M #LGD_MTRANSFERCANCELURL').val(rs.data.LGD_MTRANSFERCANCELURL);
							$('#LGD_PAYINFO_M #LGD_HASHDATA').val(rs.data.LGD_HASHDATA);
							$('#LGD_PAYINFO_M #LGD_KVPMISPWAPURL').val(rs.data.LGD_KVPMISPWAPURL);
							$('#LGD_PAYINFO_M #LGD_KVPMISPCANCELURL').val(rs.data.LGD_KVPMISPCANCELURL);
							$('#LGD_PAYINFO_M #LGD_RESPCODE').val(rs.data.LGD_RESPCODE);
							$('#LGD_PAYINFO_M #LGD_CUSTOM_SWITCHINGTYPE').val(rs.data.LGD_CUSTOM_SWITCHINGTYPE);
							$('#LGD_PAYINFO_M #LGD_BUYEREMAIL').val(rs.data.LGD_BUYEREMAIL);
							var LGD_window_type = 'submit';
console.log(document.getElementById('LGD_PAYINFO_M'));
							lgdwin = open_paymentwindow(document.getElementById('LGD_PAYINFO_M'), rs.data.CST_PLATFORM, LGD_window_type);
						}
						else {
							$rootScope.showAlert('결제에 실패했습니다. 관리자에게 문의해주세요.');
						}
					}, function(error) {
						$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
						console.log(error);
					});				
			}

//			$('form[name=frm_payment]').submit();
		});
	};
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.openPopup3 = function(item) {
		var modalInstance = $uibModal.open({
	        animation: true,
	        templateUrl: "popup3",
	        controller: "PoupController2",
	        windowClass: "app-modal-window",
	        scope: $scope,
	        resolve: {
	        }
	    });
	    
	    modalInstance.result.then(function(result) {
	    }, function(err) {
	        console.info(err);
	    });		
	}
}

function PoupController2($scope, $uibModalInstance, $ksHttp, $rootScope) {


	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};

function LPad(digit, size, attatch) {
    var add = "";
    digit = digit.toString();

    if (digit.length < size) {
        var len = size - digit.length;
        for (var i = 0; i < len; i++) {
            add += attatch;
        }
    }
    return add + digit;
}

function makeoid() {
	var now = new Date();
	var years = now.getFullYear();
	var months = LPad(now.getMonth() + 1, 2, "0");
	var dates = LPad(now.getDate(), 2, "0");
	var hours = LPad(now.getHours(), 2, "0");
	var minutes = LPad(now.getMinutes(), 2, "0");
	var seconds = LPad(now.getSeconds(), 2, "0");
	var timeValue = years + months + dates + hours + minutes + seconds; 
//	$("input[name=LGD_OID]").val("test_" + timeValue);
	$("form[name=LGD_PAYINFO] input[name=LGD_TIMESTAMP]").val(timeValue);
	$("form[name=LGD_PAYINFO_M] input[name=LGD_TIMESTAMP]").val(timeValue);
}