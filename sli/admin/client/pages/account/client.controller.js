'use strict';

app.controller('ClientController', ClientController);
app.controller('CustomModalController1', CustomModalController1);

function ClientController($scope, $ksHttp, $uibModal, $rootScope, $state)
{
	$scope.refund_list = [];
	$scope.pay_list	= [];
	$scope.summary = {};
	$scope.summary.total_charge_amount = 0;
	$scope.summary.total_final_settle_amount = 0;
	$scope.select_teacher = null;
	$scope.select_company = null;
	$scope.select_shLtCd = null;
	$scope.shLectureNm = null;
	$scope.select_complete = '';
	$scope.org_data = [];
	
	$scope.total = 0;
	$scope.last_total = 0;
    $scope.total_pages = 0;
    $scope.current_page = 1;
    
    $scope.start_date = null;
    $scope.end_date = null;
    $scope.search_start_date = null;
    $scope.search_end_date = null;
	$scope.init = function()
	{
		$scope.setDate();
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$scope.getTeachers();
		$scope.getCompanies();
//		$scope.getLectureList();
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
			$('.select2').select2();
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.setDate = function()
	{
		var end_date = new Date();
		var from_date = new Date(); 
		from_date.setDate(end_date.getDate() - 30);
		console.log(from_date);
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
		console.log(from_date);
		$scope.end_date = end_date.getFullYear().toString() + '-' + end_month + '-' + end_day;
		$scope.start_date = from_date.getFullYear().toString() + '-' + from_month + '-' + from_day;
		$("#start_date").datepicker('setDate', new Date($scope.start_date));
		$("#end_date").datepicker('setDate', new Date($scope.end_date));
	};
	
	$scope.show = function(x){
		
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "show.html",
            controller: "CustomModalController1",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
              item: function() {
                return x;
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

	$scope.getLectureListBox = function(){
		var parmas = {
			cpCd : $scope.select_company ? $scope.select_company.join(','): '',
			tcCd : $scope.select_teacher,
			shStartDt : $scope.start_date,
			shEndDt : $scope.end_date,
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
				shCpCdArea : $scope.select_company ? $scope.select_company.join(','): '',
				shStartDt : $scope.start_date,
				shEndDt : $scope.end_date,
				shLtCd : $scope.select_shLtCd,
				shLectureNm : $scope.shLectureNm,
				completeYn : $scope.select_complete
		};
		
		$ksHttp.post('EducationList', count_params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.educations = rs;
			$scope.total = 0;
			$scope.last_total = 0;
			console.log(rs);
			$scope.search_start_date = $scope.start_date;
			$scope.search_end_date = $scope.end_date;
			$scope.org_data = angular.copy(rs);
			
			angular.forEach($scope.educations, function(value, key) {
				value.show_add = false;

				value.unit_money = 0;
				if(value.tuitionFeeUnit == '01') {
					value.unit_money = value.tuitionFee * value.studentCnt;
				}
				else if(value.tuitionFeeUnit == '02') {
					value.unit_money = value.totalMin * value.tuitionFee;
				}
				else if(value.tuitionFeeUnit == '03') {
					var div = parseInt(value.totalMin / 60);
					var mod = value.totalMin % 60;
					var tmpPrice = value.tuitionFee / 60;

					value.unit_money = div * value.tuitionFee + mod * tmpPrice;
				}
				else if(value.tuitionFeeUnit == '04') {
					value.unit_money = value.tuitionFee * value.attCnt;
				}
				else if(value.tuitionFeeUnit == '05') {
					value.unit_money = value.tuitionFee;
				}
				else if(value.tuitionFeeUnit == '06') {
					value.unit_money = value.tuitionFee;
				}
				else {
					value.unit_money = value.tuitionFee * value.attCnt;
				}

				value.add_vat = 0;
				if(value.freeYn == 'N') {
					value.add_vat = parseInt(value.unit_money * 0.1);
				}
				value.schedules = value.schedule.split('|');
			});

		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.downExcel = function()
	{
		$("#payTable").table2excel({
			filename: "pay_list"
		});
	};
	
	$scope.$watch('current_page', function(){
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
	
	$scope.cancel = function() {
		$state.go('app.account.client_list');
	}
	
	$scope.saveAllTarget = function() {
		$('input[name="target[]"').prop('checked', true);
		$scope.saveTarget();
	}
	
	$scope.saveTarget = function()
	{
		var cpCd = new Array();
//		var tcCd = new Array();
		var ltCd = new Array();
		$('input[name="target[]"').each(function(idx, e) {
			var val = $(this).val();
			if($(this).is(':checked')) {
				$.each($scope.org_data, function(value, key) {
					if(val == key.ltCd) {
						cpCd.push(key.cpCd);
//						tcCd.push(key.tcCd);
						ltCd.push(key.ltCd);
					}
				});
//				$.each()
			}
		});
		
		var cpCd_ = cpCd.reduce(function(a,b){
			if (a.indexOf(b) < 0 ) a.push(b);
			return a;
		  },[]);
		
/*		var tcCd_ = tcCd.reduce(function(a,b){
			if (a.indexOf(b) < 0 ) a.push(b);
			return a;
		  },[]);*/
		
		$rootScope.showConfirm('정산등록 하시겠습니까?', function() {
			if(ltCd.length <= 0) {
				$rootScope.showMessage('error', '정산등록할 항목을 선택해 주세요.');
				return;
			}

			var params = {
				saveType : 'I',
				startDt : $scope.search_start_date,
				endDt : $scope.search_end_date,
				cpCnt : cpCd_.length,
//				tcCnt : tcCd_.length,
				ltCds : ltCd.join(','),
				regUser : $rootScope.current_user.userId
			};

			$ksHttp.post('InsertClientFeeList', params).then(function(rs) {
				rs = JSON.parse(rs);
				
				$state.go("app.account.client_view", {ptCd: rs[0].newCd});				
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
	}	
}

function CustomModalController1 ($scope, $uibModalInstance, $rootScope, item, $ksHttp) {
console.log(item);
	$scope.item = item;
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}






