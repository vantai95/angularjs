'use strict';

app.controller('PayListController', PayListController);
app.controller('RefundPopupController', RefundPopupController);
app.controller('ClientInsertPopupController', ClientInsertPopupController);
app.controller("CustomModalController1", CustomModalController1);

function PayListController($scope, $ksHttp, $uibModal, $rootScope, $state)
{
	$scope.refund_list = [];
	$scope.pay_list	= [];
	$scope.pay_type = [];
	$scope.summary = {};
	$scope.summary.total_charge_amount = 0;
	$scope.summary.total_final_settle_amount = 0;
	$scope.select_teacher = null;
	$scope.select_company = null;
	$scope.select_shLtCd = null;
	$scope.shLectureNm = null;
	$scope.payStatus = null;
	
	$scope.total_refund = 0;
	$scope.total_pay = 0;
    $scope.total_pages = 0;
    $scope.current_page = 1;
	
	$scope.init = function()
	{
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$scope.getTeachers();
		$scope.getCompanies();
		$scope.getPayStatus();
		$scope.setDate();
		$scope.getPayList();
		$scope.getRefundList();
		$scope.getLectureList();
		$scope.getEducationList();
		$scope.getLectureListBox();
	};
	
	$scope.getLectureList = function()
	{
		var params = {};
		$ksHttp.post('LectureList', params).then(function(rs){
			$scope.lecture_list = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	}
	
	$scope.getTeachers = function()
	{
		var params = {
		};
		
		$ksHttp.post('TeacherListBox', params).then(function(rs){
			$scope.teachers = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getCompanies = function()
	{
		var params = {
		};
		
		$ksHttp.post('CustomerCompanyListBox', params).then(function(rs){
			$scope.companies = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.getPayStatus = function(){
		var params = {
				groupId : "PAY_STATUS"
		};
		
		$ksHttp.post('CodeList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.pay_type = rs;
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.setDate = function()
	{
		var end_date = new Date();
		var from_date = new Date(); 
		from_date.setDate(end_date.getDate() - 30);
		var end_month, end_day, from_month, from_day;
		end_month = end_date.getMonth() + 1;
		from_month = from_date.getMonth() + 1;
		if(end_date.getMonth() + 1 < 10)
		{
			end_month = '0' + (end_date.getMonth()+1);
		}
		if(from_date.getMonth() + 1 < 10)
		{
			from_month = '0' + (from_date.getMonth()+1);
		}
		end_day = end_date.getDate();
		from_day = from_date.getDate();
		if(end_date.getDate() < 10)
		{
			end_day = '0' + end_date.getDate();
		}
		if(from_date.getDate() < 10)
		{
			from_day = '0' + from_date.getDate();
		}
		$scope.end_date = end_date.getFullYear().toString() + '-' + end_month + '-' + end_day;
		$scope.start_date = from_date.getFullYear().toString() + '-' + from_month + '-' + from_day;
		$("#start_date").datepicker('setDate', new Date($scope.start_date));
		$("#end_date").datepicker('setDate', new Date($scope.end_date));
	};
	
	$scope.show = function(ltCd){
		
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "show.html",
            controller: "CustomModalController1",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
              item: function() {
                return ltCd;
              }
            }
        });
		
        modalInstance.result.then(function(result) {
            // recieve returned data
            console.info(result);
        }, function(err) {
            console.info(err);
        });
    
	}
	
	$scope.save = function(item){
		var params = {
				saveType : 'E',
				ltCd : item.ltCd,
				lastMoney : item.lastEducationMoney,
				regUser : $rootScope.current_user.userId
		};
		
		if(item.lastEducationMoney == '' || item.lastEducationMoney == null)
		{
			$rootScope.showAlert('금액을 입력해주세요.');
			return;
		}
		$rootScope.showConfirm('저장 하시겠습니까?', function() { 
			$ksHttp.post('CalLectureSave', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$scope.getEducationList();
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
		
	};
	
	$scope.getLectureListBox = function(){
		var parmas = {
		};
		
		$ksHttp.post('LectureListBox', parmas).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_list_box = rs;
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getEducationList = function(){
		var count_params = {
				shTcCd : $scope.select_teacher,
				shCpCdArea : $scope.select_company,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				shLtCd : $scope.select_shLtCd,
				shLectureNm : $scope.shLectureNm
		};
		
		$ksHttp.post('EducationList', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.educations = rs;
			$scope.total = 0;
			angular.forEach($scope.educations, function(value, key) {
				$scope.total += value.attCnt * value.tuitionFee;
				if(value.lastEducationMoney == '-') {
					value.lastEducationMoney = value.tuitionFee * value.attCnt;
				}
				});
		}, function(error) {
			console.log(error);
		});
		
		$ksHttp.post('EducationItemList', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.education_item = rs;
			$scope.total_itm = 0;
			angular.forEach($scope.education_item, function(value, key) {
				$scope.total_itm += value.totalMoney;
				});
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getPayListCnt = function() {
		var count_params = {
				shTcCd : $scope.select_teacher,
				shCpCd : $scope.select_company,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				shUserName : $scope.user_name,
			    shUserPhone: $scope.user_phone,
			    payStatus : $scope.payStatus
		};

		$ksHttp.post('AccountPayListCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs && rs.length > 0){
				$scope.total_pay = rs[0].totalcnt;
				$scope.total_pages = Math.ceil($scope.total_pay/$scope.app.page_size);
			}
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getPayList = function()
	{
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
	    var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
				shTcCd : $scope.select_teacher,
				shCpCd : $scope.select_company,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				startPage: start_page,
			    endPage: end_page,
			    shUserName : $scope.user_name,
			    shUserPhone: $scope.user_phone,
			    payStatus : $scope.payStatus
	 	};
		
		$ksHttp.post('AccountPayList', params).then(function(rs){
			$scope.pay_list = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.downExcel = function()
	{
		var config = {
				shTcCd : $scope.select_teacehr != null && $scope.select_teacher != '' ? $scope.select_teacher : '',
				shCpCd : $scope.select_company != null && $scope.select_company != '' ? $scope.select_company : '',
				shStartDt : $scope.start_date != null && $scope.start_date != '' ? $scope.start_date : '',
				shEndDt : $scope.end_date != null && $scope.end_date != '' ? $scope.end_date : '',
			    shUserName : $scope.user_name != null && $scope.user_name != '' ? $scope.user_name : '',
			    shUserPhone: $scope.user_phone != null && $scope.user_phone != '' ? $scope.user_phone : '',
			    payStatus : $scope.payStatus != null && $scope.payStatus != '' ? $scope.payStatus : '',
	 	};
		
		window.open('/excel/payment.do?shTcCd='+ config.shTcCd + '&shCpCd=' + config.shCpCd + '&shStartDt=' + config.shStartDt + '&shEndDt=' + config.shEndDt + 
											'&shUserName=' + config.shUserName + '&shUserPhone=' + config.shUserPhone + '&payStatus=' + config.payStatus);
	};
	
	$scope.downExcel2 = function()
	{
		var config = {
				shTcCd : $scope.select_teacehr != null && $scope.select_teacher != '' ? $scope.select_teacher : '',
				shCpCd : $scope.select_company != null && $scope.select_company != '' ? $scope.select_company : '',
				shStartDt : $scope.start_date != null && $scope.start_date != '' ? $scope.start_date : '',
				shEndDt : $scope.end_date != null && $scope.end_date != '' ? $scope.end_date : '',
			    shUserName : $scope.user_name != null && $scope.user_name != '' ? $scope.user_name : '',
			    shUserPhone: $scope.user_phone != null && $scope.user_phone != '' ? $scope.user_phone : '',
			    payStatus : $scope.payStatus != null && $scope.payStatus != '' ? $scope.payStatus : '',
	 	};
		
		window.open('/excel/refund.do?shTcCd='+ config.shTcCd + '&shCpCd=' + config.shCpCd + '&shStartDt=' + config.shStartDt + '&shEndDt=' + config.shEndDt + 
											'&shUserName=' + config.shUserName + '&shUserPhone=' + config.shUserPhone + '&payStatus=' + config.payStatus);
	};

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
	
	$scope.getRefundListCnt = function() {
		var count_params = {
				shTcCd : $scope.select_teacher,
				shCpCd : $scope.select_company,
				shUserName : $scope.user_name,
				shUserPhone : $scope.user_phone,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				payStatus : $scope.payStatus				
		};

		$ksHttp.post('AccountRefundListCnt', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs && rs.length > 0){
				$scope.total_refund = rs[0].totalcnt;
				$scope.total_pages = Math.ceil($scope.total_refund/$scope.app.page_size);
			}
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getRefundList = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
	    var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
				shTcCd : $scope.select_teacher,
				shCpCd : $scope.select_company,
				shUserName : $scope.user_name,
				shUserPhone : $scope.user_phone,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				payStatus : $scope.payStatus,
				startPage: start_page,
			    endPage: end_page
	 	};

		$ksHttp.post('AccountRefundList', params).then(function(rs){
			$scope.refund_list = JSON.parse(rs);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.$watch('current_page', function(){
		$scope.getRefundList();
		$scope.getPayList();	
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
	
	$scope.downloadExcel = function()
	{
		$("#RefundList").table2excel({
			filename: "Refund List"
		});
	};
	
	$scope.openClientInsertPopup = function()
	{
		
		 var modalInstance = $uibModal.open({
			 animation: true,
			 templateUrl: "ClientInsertPopup",
			 controller: "ClientInsertPopupController",
			 windowClass: "app-modal-window",
			 scope: $scope,
			 resolve: {
				 companies: function()
				 {
					 return $scope.companies;
				 },
				 pay : function()
				 {
					 return $scope.pay;
				 },
				 teachers : function()
				 {
					 return $scope.teachers;
				 },
				 lecture_list_boxs : function()
				 {
					 return $scope.lecture_list_box;
				 }
			 }
		 });
		 modalInstance.result.then(function(result){
			 console.info(result);
		 }, function(error){
			console.info(error); 
		 });
		 
	}
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
				$scope.getPayList();
				$scope.getRefundList();
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

function ClientInsertPopupController($scope, $timeout, $uibModalInstance, $filter, $state, $rootScope, companies, pay, teachers, lecture_list_boxs, $ksHttp)
{
	$scope.companie = companies;
	$scope.pay = pay;
	$scope.teacher = teachers;
	$scope.lecture_list_box = lecture_list_boxs;
	$scope.select_teacher = null;
	$scope.select_company = null;
	$scope.start_date = null;
	$scope.end_date = null;
	
	
	$scope.init = function(){
		$scope.getEducationList();
		$scope.date_picker();
	};

	$scope.date_picker = function(){
		$('body').on('focus',".date", function(){
			$('.date').datepicker({
				  format: 'yyyy-mm-dd',
					autoclose: true
	          });
		});
		  
	};
	$scope.getEducationList = function(){
		var count_params = {
				shTcCd : $scope.select_teacher,
				shCpCdArea : $scope.select_company,
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				shLtCd : $scope.select_shLtCd
		};
					
		$ksHttp.post('EducationItemList', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.educations = rs;
			$scope.total = 0;
			angular.forEach($scope.educations, function(value, key) {
				$scope.total += value.totalMoney;
				value.checked = true;
				});
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.deleted = function(caCd){
		var params = {
				saveType : 'D',
				caCd : caCd,
				updUser : $rootScope.current_user.userId
		};
		$rootScope.showConfirm('삭제하시겠습니까?', function(){
			$ksHttp.post('EducationItemSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				$scope.getEducationList();
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
	};
	
	 
	$scope.saveItem = function(item){
		
		var params = {
				saveType : 'U',
				caCd : item.caCd,
				ltCd : item.ltCd,
				itemCnts : item.itemCnts,
				freeYn : item.freeYn,
				cost : item.cost,
				qnty : item.qnty,
				totalMoney : item.totalMoney,
				selectDt : item.selectDt,
				regUser  : $rootScope.current_user.userId
		};
		if($scope.validateItemUpdate(item))
		{
			$ksHttp.post('EducationItemSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				$scope.getEducationList();
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		}
	};
	
	$scope.setTotalMoney = function(edu){
		if(edu.cost != '' && edu.qnty != '')
		{
			edu.totalMoney = edu.cost * edu.qnty;
		}
		else
		{
			edu.totalMoney = 0;
		}
	}
	
	$scope.create = function(ltCd){
		var params = {
				saveType : 'I',
				ltCd : ltCd,
				itemCnts : $scope.itemCnts,
				freeYn : $scope.freeYn,
				cost : $scope.cost,
				qnty : $scope.qnty,
				totalMoney : $scope.totalMoney,
				selectDt : $scope.selectDt,
				regUser  : $rootScope.current_user.userId
		};
		if($scope.validateItem())
		{
			$scope.itemCnts = null;
			$scope.freeYn = null;
			$scope.cost = null;
			$scope.qnty = null;
			$scope.totalMoney = null;
			$scope.selectDt = null;
			if(ltCd == '' || ltCd == null)
			{
				$rootScope.showAlert('강의명을(를) 선택후 조회를 해주세요.');
				return;
			}
			$ksHttp.post('EducationItemSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status),message);
				$scope.getEducationList();
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
			});
		}
	};
	
	$scope.validateItem = function()
	{
		if($scope.itemCnts == '' || $scope.itemCnts == null)
		{
			$rootScope.showAlert('사유' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.cost == '' || $scope.cost == null)
		{
			$rootScope.showAlert('단가' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.qnty == '' || $scope.qnty == null)
		{
			$rootScope.showAlert('수량' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.totalMoney == '' || $scope.totalMoney == null)
		{
			$rootScope.showAlert('금액' + '을(를) 입력해주세요');
			return false;
		}
		if($scope.selectDt == '' || $scope.selectDt == null)
		{
			$rootScope.showAlert('일자' + '을(를) 입력해주세요');
			return false;
		}
		return true;
	}
	
	$scope.validateItemUpdate = function(x)
	{
		if(x.itemCnts == '' || x.itemCnts == null)
		{
			$rootScope.showAlert('사유' + '을(를) 입력해주세요');
			return false;
		}
		if(x.cost == '' || x.cost == null)
		{
			$rootScope.showAlert('단가' + '을(를) 입력해주세요');
			return false;
		}
		if(x.qnty == '' || x.qnty == null)
		{
			$rootScope.showAlert('수량' + '을(를) 입력해주세요');
			return false;
		}
		if(x.totalMoney == '' || x.totalMoney == null)
		{
			$rootScope.showAlert('금액' + '을(를) 입력해주세요');
			return false;
		}
		if(x.selectDt == '' || x.selectDt == null)
		{
			$rootScope.showAlert('일자' + '을(를) 입력해주세요');
			return false;
		}
		return true;
	}
	
	$scope.cancel = function()
	{
		$uibModalInstance.dismiss('cancel');
	};

}

function CustomModalController1 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
	$scope.ltCd = item;
	var params = {
		ltCd : $scope.ltCd
	};
	
	$ksHttp.post('AttendDateList', params).then(function(rs){
		$scope.items = JSON.parse(rs);
	}, function(error){
		console.log(error);
	});
	
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}











