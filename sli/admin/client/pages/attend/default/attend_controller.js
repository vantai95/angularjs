"use strict";

app.controller('AttendController', AttendController);
app.controller('PopupAttendController', PopupAttendController);

function AttendController($scope, $http, $stateParams, $uibModal, $ksHttp, $state, $filter, $rootScope) {
	$scope.student = {};
	$scope.attend = {};
	$scope.teachers = [];
	$scope.selected_teacher = null;
	$scope.client_companies = [];
	$scope.selected_client_company = null;
	$scope.lectures = [];
	$scope.selected_lecture = null;
	$scope.term_from_date = '';
	$scope.term_to_date = '';
	$scope.exposure_date_setting = '';
	$scope.attDateList = [];
	$scope.student.lecture = null;
	$scope.student.startDt = null;
	$scope.student.endDt = null; 
	$scope.attend.teacher = null;
	$scope.attend.company = null;
	$scope.lecture_schedule = {};
	
	$scope.init = function() {
		$scope.getTeacherList();
		$scope.setDate();
		$scope.getCompanyList();
//		$scope.getAttendAbsentList();
//		$scope.getAttendStudentList();
//		$scope.getApplyStudentList();
//		$scope.getLectureScheduleList();

		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		if($stateParams.ltCd && $stateParams.cpCd && $stateParams.tcCd)
		{
			$scope.attend.company = $stateParams.cpCd;
			$scope.attend.teacher = $stateParams.tcCd;
			$scope.attend.lecture = $stateParams.ltCd;
			
			$scope.getLectureList();
			$scope.getAttendList();
		}
	};
	
	$scope.checkObjectNull = function()
	{
		!angular.equals({}, $scope.lecture_schedule)
		if(angular.equals({}, $scope.lecture_schedule))
		{
			return true;
		}
		return false;
	}
	

	
	$scope.getLectureSchedule = function(){
		$scope.lecture_schedule.totalAttendAvg = null;
		$scope.lecture_schedule.lectureTotalCnt = null;
		$scope.lecture_schedule.startDt = null;
		$scope.lecture_schedule.endDt = null;
		$scope.lecture_schedule.attendanceYn = '';
		$scope.lecture_schedule.scheduleTime = [];
		$.each($scope.lecture_schedule_list, function(i, x){
			$scope.lecture_schedule.totalAttendAvg = x.totalAttendAvg;
			$scope.lecture_schedule.startDt = x.startDt;
			$scope.lecture_schedule.endDt = x.endDt;
			$scope.lecture_schedule.lectureTotalCnt = x.lectureTotalCnt;
			$scope.lecture_schedule.attendanceYn = x.attendanceYn;
			$scope.lecture_schedule.scheduleTime.push({
				scheduleStartTime: x.scheduleStartTime,
				scheduleEndTime: x.scheduleEndTime,
				scheduleWeekKor: x.scheduleWeekKor
			});
		});
	};
	
	$scope.setStatus = function()
	{
		var attStr = "";
		for(var i=0;i < $scope.apply_student_list.length;i++)
		{
			$scope.apply_student_list[i].status = [];
			for(var j = 0; j < $scope.attDateList.length; j++)
			{
				$scope.apply_student_list[i].status[j] = "";
				angular.forEach($scope.attendance_student_list, function(ele2){
					if($scope.apply_student_list[i].stCd == ele2.stCd && ele2.attDate == $scope.attDateList[j].date)
					{
						attStr = "";
						if(ele2.lectureType == "02")
						{
							attStr = "<span>(휴) </span>";
						}
						else if(ele2.lectureType == "03")
						{
							attStr = "<span>(보강) </span>";
						}
						else if(ele2.lectureType == "04")
						{
							attStr = "<span>(☆) </span>";
						}
						
						if( ele2.attState == "01")
						{
							attStr += "<span class='primary'>O</span>";
						}
						else if( ele2.attState == "02")
						{ 
							attStr += "<span data-toggle='tooltip' data-placement='top' title='결석사유'>X</span>";
						}
						else if( ele2.attState == "03")
						{
							attStr += "<span>△</span>";
						}
						else if( ele2.attState == "04")
						{
							attStr += "<span>◎</span>";
						}
						else if( ele2.attState == "05")
						{
							attStr += "<span>확정대기</span>";
						}
						else
						{  
							attStr += "<span>-</span>";
						}
												
						$scope.apply_student_list[i].status[j] = attStr;
					}
				});
			};
		}
		
	}
	
	$scope.getStyle = function(status)
	{ 
		if(status == "<span>휴</span>")
		{
			return 'off';
		}
		else if(status == "<span data-toggle='tooltip' data-placement='top' title='결석사유'>X</span>")
		{
			return 'danger';
		}
		return '';
	}
	
	$scope.setAttDate = function(){
		var a = 0;
		var month = [], day = [], from_time = [], end_time = [], year = [], week = [];
		$scope.attDateList = [];
		var tmpName = '';
		angular.forEach($scope.apply_student_list, function(ele){
			angular.forEach($scope.attendance_student_list, function(ele1){
				if(tmpName == '') tmpName = ele1.stCd;
				if(ele.stCd == ele1.stCd && tmpName == ele1.stCd)
				{
					a++;
					year.push(new Date(ele1.attDate).getFullYear());
					if(new Date(ele1.attDate).getMonth() + 1 < 10)
					{
						var tempMonth = new Date(ele1.attDate).getMonth() + 1;
						tempMonth = '0' + tempMonth;
						month.push(tempMonth);
					}
					else
					{
						month.push(new Date(ele1.attDate).getMonth() + 1);
					}
					if(new Date(ele1.attDate).getDate() < 10)
					{
						var tempDay = new Date(ele1.attDate).getDate();
						tempDay = '0' + tempDay;
						day.push(tempDay);
					}
					else
					{
						day.push(new Date(ele1.attDate).getDate());
					}
					from_time.push(ele1.attStartTime);
					end_time.push(ele1.attEndTime);
					week.push(ele1.attWeek);
				}
			});
			if(a >= 2)
			{
				for(var i = 0; i < from_time.length; i++)
				{
					$scope.attDateList.push({date: year[i] + '-' + month[i] + '-' + day[i], from_time: from_time[i], end_time: end_time[i], week: week[i]});
				}
			}
			month = [];
			day = [];
			from_time = [];
			end_time = [];
			a = 0;
		});
		$scope.setStatus();
	};
	
	$scope.getApplyStudentList = function()
	{
		var params = 
		{
				shLtCd: $scope.attend.lecture
				,shStartDt : $scope.attend.startDt
				,shEndDt : $scope.attend.endDt
		};
		
		$ksHttp.post('ApplyStudentList', params).then(function(rs){
			rs = JSON.parse(rs);
			console.log(rs);
			$scope.apply_student_list = rs;
			$scope.setAttDate();
		}, function(error){
			console.error(error);
		});
	}
	
	$scope.getAttendStudentList = function()
	{
		var params = 
		{
				shLtCd : $scope.attend.lecture, 
				shStartDt : $scope.attend.startDt,
				shEndDt : $scope.attend.endDt 
		};
		
		$ksHttp.post("AttendStudentList", params).then(function(rs){
			rs = JSON.parse(rs);
			console.log(rs);
			$scope.attendance_student_list = rs;

			$scope.getApplyStudentList();	
//			$scope.setAttDate();
		}, function(error){
			console.error(error);
		});
	}
	
	$scope.SearchAttend = function()
	{
		if($.trim($scope.attend.lecture) == '')
		{
			$rootScope.showAlert('강의명을 선택해주세요.');
			return;
		}
		
		$scope.getLectureScheduleList();
		$scope.getAttendAbsentList();
		$scope.getAttendStudentList();		
	}
	
	$scope.getAttendAbsentList = function(){
		$scope.attend_absent_list = [];
		var params = 
		{
				shLtCd: $scope.attend.lecture,
				approveFlag : 'N'
		}
		$ksHttp.post("AttendAbsenceList", params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.attend_absence_list = rs;
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getLectureScheduleList = function(){
		var params = 
		{
				shLtCd: $scope.attend.lecture
				,shStartDt : $scope.attend.startDt
				,shEndDt : $scope.attend.endDt
		};
		
		$ksHttp.post("LectureScheduleList", params).then(function(rs){
			$scope.lecture_schedule_list = JSON.parse(rs);
			if($scope.lecture_schedule_list.length > 0)
			{
				$scope.getLectureSchedule();	
			}
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getLectureList = function()
    {
		var params = 
		{
				tcCd: $scope.attend.teacher,
				cpCd: $scope.attend.company
		};
    	$ksHttp.post("LectureListBox", params).then(function(rs){
    		rs = JSON.parse(rs);
    		$scope.lecture_list = rs;
    		$scope.setStartEndDt();
    	}, function(error){
    		console.error(error);
    	});
    };
	
	$scope.getCompanyList = function()
    {
    	$ksHttp.post("CustomerCompanyListBox", null).then(function(rs){
    		$scope.company_list = JSON.parse(rs);
    	}, function(error){
    		console.error(error);
    	});
    };

	$scope.setDate = function() {
		$scope.term_to_date = $filter('date')(new Date(), "yyyy-MM-dd");
		$scope.term_from_date = $filter('date')(new Date(), "yyyy-MM-dd");
		$scope.exposure_date_setting = $filter('date')(new Date(), "yyyy-MM-dd");
	}

	$scope.getTeacherList = function()
    {
    	$ksHttp.post("TeacherListBox", null).then(function(rs){
    		$scope.teacher_list = JSON.parse(rs);
    	}, function(error){
    		console.error(error);
    	});
    };

	$scope.getAttendList = function() {
		if($.trim($scope.attend.lecture) == '')
		{
			$rootScope.showAlert('강의명을 선택해주세요.');
			return;
		}
		
		$scope.getLectureScheduleList();
		$scope.getAttendAbsentList();
		$scope.getAttendStudentList();
	};

	$scope.acceptAttend = function(attend_absence) {
		//do any thing
		//if success
		attend_absence.month = new Date(attend_absence.absenceDt).getMonth() + 1;
		attend_absence.month = attend_absence.month < 10 ? '0' + attend_absence.month : attend_absence.month; 
		attend_absence.day = new Date(attend_absence.absenceDt).getDate();
		attend_absence.day = attend_absence.day < 10 ? '0' + attend_absence.day : attend_absence.day;
		$rootScope.showConfirm(attend_absence.studentNm + ' 수강생의 '+attend_absence.month+'월 '+attend_absence.day+'일의 출석을 반려하겠습니까?', function() {
			var params = { 
				saveType : 'A'
				  ,acCd : attend_absence.acCd
				  ,atCd : attend_absence.atCd
				  ,approveFlag : 'S'
			};	
			$ksHttp.post("AttendAbsenceSave", params).then(function(rs){
				rs = JSON.parse(rs);
				var message = attend_absence.studentNm + ' 수강생의'+attend_absence.month+'월 '+attend_absence.day+'일<의 출석을 인정합니다';
				var status = rs[0].result;
				message = status == 'succ' ? message : rs[0].message;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.reload();
			
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
		
	};

	$scope.declineAttend = function(attend_absence) {
		attend_absence.month = new Date(attend_absence.absenceDt).getMonth() + 1;
		attend_absence.month = attend_absence.month < 10 ? '0' + attend_absence.month : attend_absence.month; 
		attend_absence.day = new Date(attend_absence.absenceDt).getDate();
		attend_absence.day = attend_absence.day < 10 ? '0' + attend_absence.day : attend_absence.day;
		$rootScope.showConfirm(attend_absence.studentNm + ' 수강생의 '+attend_absence.month+'월 '+attend_absence.day+'일의 출석을 반려하겠습니까?', function() {
			var params = { 
				saveType : 'A'
				  ,acCd : attend_absence.acCd
				  ,atCd : attend_absence.atCd
				  ,approveFlag : 'R'
			};	
			$ksHttp.post("AttendAbsenceSave", params).then(function(rs){
				rs = JSON.parse(rs);
				var message = attend_absence.studentNm + ' 수강생의 '+ attend_absence.month +'월 '+attend_absence.day+'일의 출석을 인정합니다.';
				var status = rs[0].result;
				message = status == 'succ' ? message : rs[0].message;
				$state.reload();
				$rootScope.showMessage($rootScope.getMessageType(status), message);
			
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	};
	
	$scope.openCancelReinforcementPopUp = function() {
		var cancelReinforcementPopUp = $uibModal.open({
			templateUrl : 'popup3',
			controller : 'PopupAttendController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				student: function(){
					return $scope.attend
				},
				date: function(){
					return '';
				},
				apply_student: function(){
					return '';
				},
				popup_type : function() {
					return 'add';
				}
			}
		});
		
		cancelReinforcementPopUp.result.then(function(result) {
			$scope.SearchAttend();
        }, function(err) {
            console.info(err);
        });
	};
	
	$scope.openRegistrationOfProtectionPopUp = function() {
		var registrationOfProtectionPopUp = $uibModal.open({
			templateUrl : 'popup4',
			controller : 'PopupAttendController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				student: function(){
					return $scope.attend;
				},
				date: function(){
					return '';
				},
				apply_student: function(){
					return '';
				},
				popup_type : function() {
					return 'add2';
				}
			}
		});
		
		registrationOfProtectionPopUp.result.then(function(result) {
        }, function(err) {
            console.info(err);
        });
	};
	
	$scope.openCheckAttendPopUp = function(date){
		
		var checkAttendPopUp = $uibModal.open({
			templateUrl : 'popup',
			controller : 'PopupAttendController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				student: function(){
					return $scope.attend;
				},
				date: function(){
					return date;
				},
				apply_student: function(){
					return '';
				},
				popup_type : function() {
					return 'day';
				}
			}
		});
		
		checkAttendPopUp.result.then(function(result) {
			$scope.SearchAttend();
        }, function(err) {
            console.info(err);
        });
	};
	
	$scope.openAttendStatusPopup = function(apply_student){
		var attendStatusPopup = $uibModal.open({
			templateUrl : 'popup2',
			controller : 'PopupAttendController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				student: function(){
					return $scope.attend;
				},
				date: function(){
					return '';
				},
				apply_student: function(){
					return apply_student;
				},
				popup_type : function() {
					return 'attend';
				}
			}
		});
		
		attendStatusPopup.result.then(function(result) {
			$scope.SearchAttend();
        }, function(err) {
            console.info(err);
        });
	};
	
	$scope.downloadExcel = function() {
		var config = {
			shLtCd: $scope.attend.lecture
			,shStartDt : $scope.attend.startDt
			,shEndDt : $scope.attend.endDt
			,approveFlag : 'N'
		};

		window.open('/excel/attend.do?shLtCd='+ config.shLtCd + '&shStartDt=' + config.shStartDt + '&shEndDt=' + config.shEndDt + '&approveFlag=' + config.approveFlag);
	};
	
	$scope.submitAdmission = function(){
		
	};
	
	$scope.setStartEndDt = function()
	{
		var current_lecture = null;
		if($scope.student.lecture)
		{
			current_lecture = $.grep($scope.lecture_list, function(x,i){return x.ltCd == $scope.student.lecture})[0];
			$scope.student.startDt = current_lecture.startDt;
			$scope.student.endDt = current_lecture.endDt;
		}
		if($scope.attend.lecture)
		{
			current_lecture = $.grep($scope.lecture_list, function(x,i){return x.ltCd == $scope.attend.lecture})[0];
			$scope.attend.startDt = current_lecture.startDt;
			$scope.attend.endDt = current_lecture.endDt;
		}
		
		if(current_lecture){
			$scope.setDefaultDt(current_lecture.startDt, current_lecture.endDt);
		}
	}
	
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

function PopupAttendController($scope, $rootScope, $uibModalInstance,  $state,  $ksHttp, $filter, student, $stateParams, date, apply_student, popup_type) {
	$scope.date_restriction = '';
	$scope.date_of_protect = '';
	$scope.cancellation_date = '';
	$scope.selected_time_protect = '';
	$scope.memo = '';
	$scope.lecture_type = '02';
	$scope.start_time = "";
	$scope.end_time = "";
	$scope.attDate = date;
	$stateParams.lecture = student.lecture;
	$scope.apply_student = apply_student; 
	$scope.fieldChange = "table";
	$scope.schedule_date = null;
	$scope.schedule_cnts = null;
	$scope.schedule_start_time = null;
	$scope.schedule_end_time = null;
	$scope.cancellation_date = null;
	$scope.selected_time_cancellation = null;
	$scope.attend_student = null;
	$scope.org_attend_student = null;
	$scope.popup = {};
	$scope.attendInfo = {};
	
	$scope.initPopUp = function(){	
		if(popup_type == 'attend') {
			$scope.getAttendStudent();
		}
		else if(popup_type == 'day') {
			$scope.getAttendLectureDetail();
			$scope.getAttendStudentList();
		}
		$scope.setDate();
		$(".date input").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
	};

	$scope.getAttendLectureDetail = function(){
		var params = 
		{
				ltCd: student.lecture
				,attDate : $scope.attDate.date
		}
		$ksHttp.post("AttendTeacherSignInfo", params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.attendInfo = rs[0];
		}, function(error){
			console.error(error);
		});
	}

	$scope.getAttendStudent = function(){
		var params = 
		{
				shLtCd: student.lecture
				, shStCd: apply_student.stCd
				, shStartDt : student.startDt
				, shEndDt : student.endDt 
		}
		$ksHttp.post("AttendStudentList", params).then(function(rs){
			$scope.attend_student = JSON.parse(rs);
			$scope.org_attend_student = angular.copy($scope.attend_student);
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.setAttState = function()
	{
		angular.forEach($scope.apply_student_list, function(ele){	
			angular.forEach($scope.attend_student_list, function(ele1){
				if(ele.stCd == ele1.stCd && ele.ltCd == ele1.ltCd)
				{
					ele.attState = ele1.attState;
					ele.attCnts = ele1.attCnts;
				}
			});
		});
	};
	
	$scope.$watch('[schedule_start_time , selected_time_cancellation,schedule_date,cancellation_date]', function() {
		
		if($scope.schedule_start_time != null && $scope.selected_time_cancellation != null && $scope.schedule_date !=null && $scope.cancellation_date){
			
			/**통보시간 계산을 위한 날짜 저장**/
			var type = "";
			var startTime = "";
			var endTime = "";
			var stDt = $scope.schedule_date.replace(/-/gi,"")+""+$scope.schedule_start_time.replace(/:/gi,"");
			var caDt = $scope.cancellation_date.replace(/-/gi,"")+""+$scope.selected_time_cancellation.replace(/:/gi,"");
			
			if( Number(stDt) <= Number(caDt) ){
				startTime = stDt;
				endTime = caDt;
			}else{
				type = "-";
				startTime = caDt;
				endTime = stDt;
			}
			
			/**통보시간 계산**/
			var startDate = new Date(parseInt(startTime.substring(0,4), 10),
		             parseInt(startTime.substring(4,6), 10)-1,
		             parseInt(startTime.substring(6,8), 10),
		             parseInt(startTime.substring(8,10), 10),
		             parseInt(startTime.substring(10,12), 10)
		            );
		            
		   // 종료일시 
		   var endDate   = new Date(parseInt(endTime.substring(0,4), 10),
		             parseInt(endTime.substring(4,6), 10)-1,
		             parseInt(endTime.substring(6,8), 10),
		             parseInt(endTime.substring(8,10), 10),
		             parseInt(endTime.substring(10,12), 10)
		            );
	
		   // 두 일자(startTime, endTime) 사이의 차이를 구한다.
		   var dateGap = endDate.getTime() - startDate.getTime();
		   var timeGap = new Date(0, 0, 0, 0, 0, 0, endDate - startDate); 
		   
		   // 두 일자(startTime, endTime) 사이의 간격을 "일-시간-분"으로 표시한다.
		   var diffDay  = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수       
		   var diffHour = timeGap.getHours();       // 시간 
		   var diffMin  = timeGap.getMinutes();      // 분
			
		   var result = type+""+diffDay + "일 " + diffHour + "시간 " + diffMin + "분 ";
		   $scope.equal_time = result;
		   
			/*
			 * var x = $scope.schedule_date + ' ' + $scope.schedule_start_time;
			var y = $scope.cancellation_date + ' ' + $scope.selected_time_cancellation;
			$scope.startTime = new Date(x);
			$scope.endTime = new Date(y);
			 var diffMs = ($scope.endTime - $scope.startTime);
			 var diffDays = Math.floor(diffMs / 86400000); // days
			 var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
			 var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
			 if(diffDays != 0){
				 $scope.equal_time = diffHrs + diffDays*24 + ':' + diffMins;
			 }
			 else {
				 $scope.equal_time = diffHrs + ':' + diffMins;
			 }*/
		}else{
			$scope.equal_time = 0;
		}
	});
	
	$scope.getAttendStudentList = function()
	{
		var params = { 
			shLtCd : student.lecture
			,shAttDate : $scope.attDate.date
		};
		$ksHttp.post("AttendStudentList", params).then(function(rs){
			$scope.attend_student_list = JSON.parse(rs);
			$scope.apply_student_list = angular.copy($scope.attend_student_list);
//			$scope.setAttState();
		}, function(error){
			console.error(error);
		});
	}
	
	$scope.setDate = function() {
		$scope.schedule_date = $filter('date')(new Date(), "yyyy-MM-dd");
		$scope.date_of_protect = $filter('date')(new Date(), "yyyy-MM-dd");
		$scope.cancellation_date = $filter('date')(new Date(), "yyyy-MM-dd");
	};
	
	$scope.validate = function() {
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim($scope.selected_time_cancellation) == ''){
			$rootScope.showAlert('취소 통보 시간' + required_msg.dropdown);
			return false;
		}
		if($.trim($scope.cancellation_date) == ''){
			$rootScope.showAlert('취소 통보일자' + required_msg.dropdown);
			return false;
		}
		if($.trim($scope.schedule_end_time) == ''){
			$rootScope.showAlert('보장성 수업 시간' + required_msg.dropdown);
			return false;
		}
		if($.trim($scope.schedule_start_time) == ''){
			$rootScope.showAlert('보장성 수업 시간' + required_msg.dropdown);
			return false;
		}
		if($.trim($scope.schedule_date) == ''){
			$rootScope.showAlert('보장성 수업일자' + required_msg.dropdown);
			return false;
		}
		if($.trim($scope.memo) == ''){
			$rootScope.showAlert('메모' + required_msg.dropdown);
			return false;
		}
		return true;
	};
	
	$scope.submitRegister = function(){
		if ($scope.validate()) {
			$rootScope.showConfirm('보장성 수업을 등록하시겠습니까?', function(){
				var params = {
						saveType : 'EA'
						,ltCd : student.lecture
						,lectureType : '04'
						,scheduleDt : $scope.schedule_date
						,scheduleStartTime : $scope.schedule_start_time
						,scheduleEndTime : $scope.schedule_end_time
						,scheduleCnts: $scope.memo
						,enrichCancelDt: $scope.cancellation_date
						,enrichCancelTime : $scope.selected_time_cancellation
						,regUser : $rootScope.current_user.userId
				};
				
				$ksHttp.post("LectureScheduleSave", params).then(function(rs){
					rs = JSON.parse(rs);
					var status = rs[0].result;
					var message = rs[0].message;
					
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					if(status == 'succ') $uibModalInstance.close();
					
				}, function(error){
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
		
	};
	
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.setField1 = function()
    {
    	console.log($scope.popup.field1);
    	console.log($scope.popup.field2);
    	if($scope.popup.field2 == true)
		{
    		angular.forEach($scope.apply_student_list, function(ele){
    			ele.attState = '02';
        	});
    	
		}
    	else if($scope.popup.field1 == true)
		{
    		angular.forEach($scope.apply_student_list, function(ele){
        		ele.attState = '01';
        	});
		}
    	else if($scope.popup.field1 == false && $scope.popup.field2 == false)
		{
    		angular.forEach($scope.apply_student_list, function(ele){
        		ele.attState = '';
        	});
		}
    }
    
    $scope.setOneField1 = function(idx)
    {
    	if(idx == 0) {
    		var bAll = true;
    		angular.forEach($scope.apply_student_list, function(ele){
    			if(ele.attState != '01') {
    				bAll = false;
    			}
        	});
    		$scope.popup.field2 = false;
    		$scope.popup.field1 = bAll;
    	}
    	else if(idx == 1) {
    		var bAll = true;
    		angular.forEach($scope.apply_student_list, function(ele){
    			if(ele.attState != '02') {
    				bAll = false;
    			}
        	});
    		$scope.popup.field2 = bAll;
    		$scope.popup.field1 = false;
    	}
    	else {
        	$scope.popup.field1 = false;
        	$scope.popup.field2 = false;
    	}
    }

    $scope.setField2 = function(obj)
    {
    	console.log($scope.popup.field1);
    	console.log($scope.popup.field2);
    	if($scope.popup.field2 == true)
		{
    		angular.forEach($scope.attend_student, function(ele){
    			ele.attState = '02';
        	});
    	
		}
    	else if($scope.popup.field1 == true)
		{
    		angular.forEach($scope.attend_student, function(ele){
        		ele.attState = '01';
        	});
		}
    	else if($scope.popup.field1 == false && $scope.popup.field2 == false)
		{
    		angular.forEach($scope.attend_student, function(ele){
        		ele.attState = '';
        	});
		}
    }
    
    $scope.setOneField2 = function(idx)
    {
    	if(idx == 0) {
    		var bAll = true;
    		angular.forEach($scope.attend_student, function(ele){
    			if(ele.attState != '01') {
    				bAll = false;
    			}
        	});
    		$scope.popup.field2 = false;
    		$scope.popup.field1 = bAll;
    	}
    	else if(idx == 1) {
    		var bAll = true;
    		angular.forEach($scope.attend_student, function(ele){
    			if(ele.attState != '02') {
    				bAll = false;
    			}
        	});
    		$scope.popup.field2 = bAll;
    		$scope.popup.field1 = false;
    	}
    	else {
        	$scope.popup.field1 = false;
        	$scope.popup.field2 = false;
    	}
    }
    
    $scope.getApplyStudentList = function()
	{
		var params = 
		{
				shLtCd: student.lecture
		};
		
		$ksHttp.post('ApplyStudentList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.apply_student_list = rs;
			$scope.setAttState();
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.saveAttendStudent = function()
	{
		var student_list = [];
		var changed_items = $.grep($scope.attend_student, function(x, i){
			if($scope.attend_student[i].attState != $scope.org_attend_student[i].attState || $scope.attend_student[i].attCnts != $scope.org_attend_student[i].attCnts) {
				return x;
			}
    	});
		angular.forEach(changed_items, function(ele1){
			var student1 = {
//				ltCd : student.lecture
				atCd : ele1.atCd
			    , clCd : ele1.clCd
			    , ltCd : ele1.ltCd
			    , stCd : ele1.stCd
			    , attState : ele1.attState
			    , attDate : ele1.attDate
			    , attStartTime : ele1.attStartTime
			    , attEndTime : ele1.attEndTime
			    , attCnts : ele1.attCnts
			    , regUser: $rootScope.current_user.userId
    		}; 
			student_list.push(student1);
		});
		
		if(student_list.length > 0) {
			var params = { 
					  listLen : student_list.length
					  , list : student_list
				}
				
				$ksHttp.post("AttendStudentSave", params).then(function(rs){
			    	$rootScope.showAlert("저장되었습니다.");
					$uibModalInstance.close();
		    	}, function(error){
		    		$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
		    		console.error(error);
		    	});
		}
		else {
			$rootScope.showMessage('success', '수정된 사항이 없습니다.');
		}
	}

    $scope.saveCheckAttendance = function()
    {
    	var student_list = [];

		var changed_items = $.grep($scope.apply_student_list, function(x, i){
			if($scope.apply_student_list[i].attState != $scope.attend_student_list[i].attState || $scope.apply_student_list[i].attCnts != $scope.attend_student_list[i].attCnts) {
				return x;
			}
    	});
		angular.forEach(changed_items, function(ele){
			var student1 = {
//				ltCd : student.lecture
				atCd : ele.atCd
			    , clCd : ele.clCd
			    , ltCd : ele.ltCd
			    , stCd : ele.stCd
			    , attState : ele.attState
			    , attDate : $scope.attDate.date
			    , attStartTime : $scope.attDate.from_time
			    , attEndTime : $scope.attDate.end_time
			    , attCnts : ele.attCnts
			    , regUser: $rootScope.current_user.userId
    		}; 
			student_list.push(student1);
		});

		if(student_list.length > 0) {
	    	var params = 
			{
	    			listLen : student_list.length
				  , list : student_list
			};
	    	
	    	$ksHttp.post("AttendStudentSave", params).then(function(rs){
		    	$rootScope.showAlert("저장되었습니다.");
				$uibModalInstance.close();
	    	}, function(error){
	    		$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
	    		console.error(error);
	    	});
		}
		else {
			$rootScope.showMessage('success', '수정된 사항이 없습니다.');
		}
    	
    };	

	$scope.saveLectureSchedule = function(){
		$rootScope.showConfirm('휴강(or 보강) 을 등록하겠습니까?', function(){
			var params = { 
				saveType : 'CI'
				,ltCd : student.lecture
				,lectureType : $scope.lecture_type
				,scheduleDt : $scope.schedule_date
				,scheduleCnts: $scope.schedule_cnts
				,regUser: $rootScope.current_user.userId
			};
			
			$ksHttp.post("LectureScheduleSave", params).then(function(rs){
				rs = JSON.parse(rs);
				var status = rs[0].result;
				var message = rs[0].message;
				
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if(status == 'succ') $uibModalInstance.close();
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	};
};
