'use strict';

app.controller('AttendController', AttendController);
app.controller('PoupAttendAbsenceController', PoupAttendAbsenceController);
app.controller('Poupup', Poupup);
app.controller('Poupup2', Poupup2);
app.controller('Poupup4', Poupup4);
app.controller('Poupup5', Poupup5);

function AttendController($scope, $rootScope, $ksHttp, $uibModal, $location, $timeout, $state, $stateParams) {
	$scope.select_lecture = $stateParams.ltCd;
	$scope.lecture_list_box = [];
	$scope.lecture_detail = [];
	$scope.schedule_list = [];
	$scope.student_list = [];
	$scope.attend_student_list = [];
	$scope.attend_absence_list = [];
	$scope.enrich_list = [];
	$scope.enrich_list_all = [];
	$scope.attend_student_array2way = {};
	$scope.org_attend_student = null;
	$scope.search = {};
	$scope.search.startDt = '';
	$scope.search.endDt = '';

	$scope.init = function() {
		if(!$stateParams.ltCd){
            $state.go("app.mylecture.index");
        } else{
        	$scope.select_lecture = $stateParams.ltCd;
			$scope.getLectureListBox();
			$scope.getAttendLectureDetail();
        }
	};

	$scope.getLectureListBox = function() {
		var params = {
			tcCd : $rootScope.current_user.tcCd
		};

		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lecture_list_box = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.changeAttendDt = function(){
		
		var params = {
			shLtCd : $scope.select_lecture,
			shStartDt : $scope.search.startDt,
			shEndDt : $scope.search.endDt
		}

		/* 전체 출석률 재조회 */
		$ksHttp.post('AttendLectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_detail.totalAttendAvg = rs[0].totalAttendAvg;
		}, function(error) {
			console.log(error);
		});
		
		/* 수강생별 출석률 조회 */
		$ksHttp.post('ApplyStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.student_list = rs;
			// console.log($scope.student_list);
		}, function(error) {
			console.log(error);
		});
		
		/* 출석목록 조회 */
		$ksHttp.post('AttendStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.attend_student_list = rs;
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getAttendLectureDetail = function() {
		var params = {
			shLtCd : $scope.select_lecture
		}

		$ksHttp.post('AttendLectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lecture_detail = rs[0];
			$scope.search.startDt = $scope.lecture_detail.startDt;
			$scope.search.endDt = $scope.lecture_detail.endDt;
			
			$scope.getEnrichList();
			$scope.setDefaultDt($scope.search.startDt, $scope.search.endDt);			
			
		}, function(error) {
			console.log(error);
		});

		$ksHttp.post('LectureScheduleList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.schedule_list = rs;
		}, function(error) {
			console.log(error);
		});

		$ksHttp.post('ApplyStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.student_list = rs;
			// console.log($scope.student_list);
		}, function(error) {
			console.log(error);
		});

		$ksHttp.post('AttendStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.attend_student_list = rs;
			//console.log($scope.attend_student_list);
		}, function(error) {
			console.log(error);
		});

		var params2 = {
				shLtCd : $scope.select_lecture
				,approveFlag : 'N'
			}
		$ksHttp.post('AttendAbsenceList', params2).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.attend_absence_list = rs;
			// console.log($scope.attend_absence_list);
		}, function(error) {
			console.log(error);
		});

	};
/*
	$scope.setTable = function(attend_student) {
		var lectureType = attend_student.lectureType;
		var attState = attend_student.attState;
		if (lectureType == '02')
			return '휴강'
		if (lectureType == '03')
			return '보강'
		if (lectureType == '04')
			return '☆'
		if (attState == '01')
			return '<span class="primary">O</span>'
		if (attState == '02')
			return '<span class="danger">X</span>'
		if (attState == '03')
			return '△'
		if (attState == '04')
			return '◎'
		if (attState == '05')
			return '확정대기'
		return '-'

	};*/

	$scope.getEnrichList = function(){
		var params = {
			ltCd : $scope.select_lecture,
			enrichCancelState : 'N'
		};
		$ksHttp.post('LectureEnrichList', params).then(function(rs) {
			$scope.enrich_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
		
		
		var params2 = {
			ltCd : $scope.select_lecture
		};
		$ksHttp.post('LectureEnrichList', params2).then(function(rs) {
			$scope.enrich_list_all = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});		
	}
	
	$scope.popupAttendAbsence = function(attend_absence) {
		$scope.attend_absence = attend_absence;
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popupAttendAbsence",
			controller : "PoupAttendAbsenceController",
			windowClass : "app-modal-window",
			scope : $scope

		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$rootScope.showAlert(result[0].message);
				$scope.getAttendLectureDetail();
			}
		}, function(err) {
			console.info(err);
		});
	};

	$scope.openPopup = function() {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup",
			controller : "Poupup",
			windowClass : "app-modal-window",
			scope : $scope

		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$rootScope.showAlert(result[0].message);
				$scope.getAttendLectureDetail();
			}
		}, function(err) {
			console.info(err);
		});
	};
	
	$scope.openPopup4 = function(attDate) {
		
		var bool = false;
		for( var i=0; i< $scope.enrich_list_all.length; i++){
			if( attDate == $scope.enrich_list_all[i].scheduleDt){
				if( $scope.enrich_list_all[i].enrichCancelState != "S"){
					bool = true; //출석체크 불가
				}
				break;
			}
		}
		
		if( bool ){
			$rootScope.showMessage('error', '[출석체크불가] 관리자 확인 전 또는 출석불가 날짜 입니다.');
			return;
		}
		
		$scope.popup4_attDate = attDate;
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup4",
			controller : "Poupup4",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve: {
				lectureObj : function() {
                return $scope.lecture_detail;
              }
            }
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$rootScope.showAlert(result[0].message);
				$scope.getAttendLectureDetail();
			}
		}, function(err) {
			console.info(err);
		});
	};

	$scope.openPopup5 = function(student) {
		$scope.popup5_student = student;
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup5",
			controller : "Poupup5",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve: {
				attendanceYn: function() {
                return $scope.lecture_detail.attendanceYn;
              }
            }
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$rootScope.showAlert(result[0].message);
				$scope.getAttendLectureDetail();
			}
		}, function(err) {
			console.info(err);
		});
	};

	$scope.openPopup2 = function(item) {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup2",
			controller : "Poupup2",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve: {
				item : item
              }			
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$rootScope.showAlert(result[0].message);
				$scope.getAttendLectureDetail();
			}
		}, function(err) {
			console.info(err);
		});
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

function PoupAttendAbsenceController($scope, $uibModalInstance, $rootScope,
		$window, $ksHttp) {

	$scope.savepopupAttendAbsence = function(approveFlag) {
		var params = {
			saveType : 'A',
			acCd : $scope.attend_absence.acCd,
			atCd : $scope.attend_absence.atCd,
			approveFlag : approveFlag
		};

		$ksHttp.post('AttendAbsenceSave', params).then(function(rs) {
			rs = JSON.parse(rs);
			//console.log(rs);
			
			var message = rs[0].message;
			var status = rs[0].result;
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			
			if(status == 'succ'){
				for(var i=0; i< $scope.attend_absence_list.length; i++ ){
					if( $scope.attend_absence_list[i].acCd ==  $scope.attend_absence.acCd){
						$scope.attend_absence_list.splice(i,1);						
						break;
					}
				}
				$uibModalInstance.close(rs);
			}
			
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};

function Poupup($scope, $uibModalInstance, $filter, $rootScope, $window, $ksHttp) {
	$scope.lectureNew1 = {
		lectureType : '02',
		scheduleDt : $filter('date')(new Date(), 'yyyy-MM-dd'),
		scheduleCnts : null
	};
	$scope.classButton1 = 'btn-primary';
	$scope.classButton2 = 'bg-black';

	$scope.initPopup1 = function(){
		$(".date").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		$(".date").datepicker('setDate', new Date());
	}
	
	$scope.save = function() {
		var params = {
			saveType : 'CI',
			ltCd : $scope.select_lecture,
			lectureType : $scope.lectureNew1.lectureType,
			scheduleDt : $scope.lectureNew1.scheduleDt,
			scheduleCnts : $scope.lectureNew1.scheduleCnts,
			regUser : $rootScope.current_user.userId
		};
		//console.log(params);
		$ksHttp.post('LectureScheduleSave', params).then(function(rs) {
			rs = JSON.parse(rs);
			//console.log(rs);
			$uibModalInstance.close(rs);
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};

function Poupup2($scope, $uibModalInstance, $filter, $rootScope, $window, $ksHttp, $state, item) {
	$scope.items = item;
	$scope.hour_list = [];
	$scope.minute_list = [];
	$scope.time = {};
	$scope.time.startHour = null;
	$scope.time.startMinute = null;
	$scope.time.cancelHour = null;
	$scope.time.cancelMinute = null;
	
	
	$scope.lectureNew2 = {
		scheduleDt : null,
		scheduleCnts : null,
		enrichCancelDt : $filter('date')(new Date(), 'yyyy-MM-dd')
	};

	$scope.initEnrich = function() {
		
		$scope.lectureNew2.scheduleDt = $scope.items.scheduleDt;
		$scope.lectureNew2.scheduleCnts = $scope.items.scheduleCnts;
		
		$(".date").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		$(".date").datepicker('setDate', new Date());		
		
		$scope.getScheduleTime();		
		$scope.setTimeList();
	}
	
	$scope.setTimeList = function(){
		var obj = {};
		var tmp = "";
		for( var i=5; i<24; i++ ){
			tmp = i;
			if( i < 10 ){
				tmp = "0"+i;
			}
			obj = {hour:tmp.toString()};
			$scope.hour_list.push(obj);
		}
		
		for( var k=0; k<56; k++ ){
			tmp = k;
			if( k < 10 ){
				tmp = "0"+k;
			}
			obj = {minute:tmp.toString()};
			$scope.minute_list.push(obj);
			k+= 4;
		}
	}
	
	$scope.getScheduleTime = function(){
		
		var params = {
			ltCd : $scope.select_lecture,
			scheduleDt : $scope.lectureNew2.scheduleDt			
		};
		
		$ksHttp.post('LectureScheduleTime', params).then(function(rs) {
			
			rs = JSON.parse(rs)[0];
			if( "0" == rs.cnt ){
				var d = new Date();
				var hourStr = d.getHours();
				var minutesStr = d.getMinutes();
				var minutesArr;
				
				if( Number(hourStr) < 10 ) hourStr = "0"+d.getHours();				
				if( Number(minutesStr) < 10 ) minutesStr = "0"+""+d.getMinutes();
				
				minutesArr = d.getMinutes().toString().split("");
								
				if( Number(minutesArr[1]) < 5){
					minutesStr = minutesArr[0]+""+0;
				}else if(Number(minutesArr[1]) < 10){
					minutesStr = minutesArr[0]+""+5;
				}
								
				$scope.time.startHour = hourStr.toString();
				$scope.time.startMinute = minutesStr.toString();
				$scope.time.endHour = hourStr.toString();
				$scope.time.endMinute = minutesStr.toString();
				
			}else{
				var arr;
				arr = rs.scheduleStartTime.split(":");
				$scope.time.startHour = arr[0];
				$scope.time.startMinute = arr[1];
				
				arr = rs.scheduleEndTime.split(":");
				$scope.time.endHour = arr[0];
				$scope.time.endMinute = arr[1];
			}

		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.checkComfirmTime = function(){
		
		
		if( null == $scope.time.startHour || null == $scope.time.startMinute
				|| null == $scope.time.cancelHour || null == $scope.time.cancelMinute){
			$("#check_time").html(0);
		} else{
			/**변경된 값 저장 시작**/
			$scope.lectureNew2.scheduleStartTime = $scope.time.startHour +":"+$scope.time.startMinute;
			$scope.lectureNew2.scheduleEndTime = $scope.time.endHour +":"+ $scope.time.endMinute;
			$scope.lectureNew2.enrichCancelTime = $scope.time.cancelHour+":"+$scope.time.cancelMinute;
			
			/**통보시간 계산을 위한 날짜 저장**/
			var type = "";
			var startTime = "";
			var endTime = "";
			var stDt = $scope.lectureNew2.scheduleDt.replace(/-/gi,"")+""+$scope.time.startHour +""+$scope.time.startMinute;
			var caDt = $scope.lectureNew2.enrichCancelDt.replace(/-/gi,"")+""+$scope.time.cancelHour +""+$scope.time.cancelMinute;
			
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
		   $("#check_time").html(result);
		}
	}
	
	$scope.save = function() {
		
		if( null == $scope.time.startHour || null == $scope.time.startMinute
				|| null == $scope.time.cancelHour || null == $scope.time.cancelMinute){
			$rootScope.showMessage('error', '시간을 선택해주세요.');
		}else{
				
			var params = {
				saveType : 'EU',
				lsCd : item.lsCd,
				scheduleStartTime : $scope.lectureNew2.scheduleStartTime,
				scheduleEndTime : $scope.lectureNew2.scheduleEndTime,
				enrichCancelDt : $scope.lectureNew2.enrichCancelDt,
				enrichCancelTime : $scope.lectureNew2.enrichCancelTime,
				updUser : $rootScope.current_user.userId
			};
			
			$ksHttp.post('LectureScheduleSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				//console.log(rs);
				$uibModalInstance.close(rs);
				$scope.getAttendLectureDetail();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};

function Poupup4($scope, $uibModalInstance, $filter, $rootScope, $window, $ksHttp, lectureObj) {
	$scope.id_check_all = null;
	$scope.popup4_time={attStartTime:'',attEndTime:''};
	$scope.popup4_attendStudent_list=[];
	$scope.teacher_sign = {};
	$scope.attendInfo = lectureObj;
	
	$scope.signature = null;	
	$scope.upload_files = {
		curType : 'Attend',
		curKey : 'sign_teacher',
		fileName : '',
		fileNewName : '',
	}
	
	$scope.initPopup4 = function() {
		$scope.getAttendStudentList();
		if( "Y" == lectureObj.attendanceYn ){
			$scope.getSignTeacher();
		}else{
			$("#sign_content").hide();
		}
	};
	
	$scope.getSignTeacher = function(){
		//서명등록되어있는지 확인
		var params = {
			shLtCd : $scope.select_lecture,
			shAttDate : $scope.popup4_attDate
		};
		
		$ksHttp.post('AttendTeacherSignOne', params).then(function(rs) {
			rs = JSON.parse(rs)[0];
			$scope.teacher_sign = rs;
			
			if($scope.teacher_sign.cnt != "0" ){
				$("#sign_content").hide();
			}
		}, function(error) {
			console.log(error);
		});
	}
	
	// check all tr
	$scope.checkAll = function(id) {
		angular.forEach($scope.popup4_attendStudent_list, function(value, key) {
			value.attState = id;
		});
		$scope.id_check_all = id;
	};
	$scope.checkTdPopup4 = function(id) {
		var check = 0;
		angular.forEach($scope.popup4_attendStudent_list, function(value, key) {
			if (value.attState != id)
				check = 1;
		});
		if (check == 0) {
			$scope.id_check_all = id;
		} else {
			$scope.id_check_all = null;
		}
	};

	$scope.getAttendStudentList = function() {
		var params = {
			shLtCd : $scope.select_lecture,
			shAttDate : $scope.popup4_attDate
		};
		//console.log(params);
		$ksHttp.post('AttendStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.popup4_attendStudent_list = rs;
			// console.log($scope.popup4_attendStudent_list);
			// $scope.popup4_attendStudent_list[0].attState=$scope.popup4_attendStudent_list[1].attState;
			$scope.popup4_time.attStartTime =$scope.popup4_attendStudent_list[0].attStartTime;
			$scope.popup4_time.attEndTime =$scope.popup4_attendStudent_list[0].attEndTime;
			$scope.checkTdPopup4($scope.popup4_attendStudent_list[0].attState);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.save = function() {
		
		//console.log($scope.popup4_time.attStartTime);
		angular.forEach($scope.popup4_attendStudent_list ,function(value, key) {
			//console.log(value);
			$scope.popup4_time.attStartTime != '' ? value.attStartTime = $scope.popup4_time.attStartTime : value.attStartTime = value.attStartTime;
			$scope.popup4_time.attEndTime != '' ? value.attEndTime = $scope.popup4_time.attEndTime : value.attEndTime = value.attEndTime;
			value.regUser =$rootScope.current_user.userId;
		});
		
		var tempYn = "";
		if($scope.teacher_sign.cnt == '0'){
			tempYn = lectureObj.attendanceYn;
		}else{
			tempYn = "N";
		}
		
		var params = {
			listLen : $scope.popup4_attendStudent_list.length,
			list : $scope.popup4_attendStudent_list,
			
			imgArr : [$scope.upload_files],
			ltCd : lectureObj.ltCd,
			attendanceYn : tempYn, 
			attDate : $scope.popup4_attDate,
			tcCd : $rootScope.current_user.tcCd, 
			regUser: $rootScope.current_user.userId
		};
		
		//console.log(params);
		$ksHttp.post('AttendStudentSave', params).then(function(rs) {
			rs = JSON.parse(rs);
			//console.log(rs);
			$uibModalInstance.close(rs);
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.log(error);
		});
		
	};
	
	$scope.saveImage = function(){
		
		if($scope.teacher_sign.cnt == "0") {
			$scope.signature = $scope.accept();

			var image = $scope.signature.dataUrl;
			if( undefined == image || null == image || "" == image){
				$rootScope.showMessage('error', '싸인패드영역에 서명을 해주세요.');
				return;
			}
			var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
			var blob = base64ToBlob(base64ImageContent, 'image/png');                
			var formData = new FormData();
			formData.append('uploadedfile', blob);
			
			$.ajax({
				url: "/sli/admin/fileUpload",
			    type: "POST",
			    data: formData,
			    dataType: 'json',
			    enctype: 'multipart/form-data',
			    processData: false,
			    contentType: false,
			    cache: false,
			    success: function (data, status) {
			    	//console.log(data);
			    	$scope.upload_files.fileName = data.fineName;
			    	$scope.upload_files.fileNewName = data.fileNewName;
			    	
			    	$scope.save();
			    },
			    error: function (res, status, error) {
			    	$rootScope.showMessage(error, '파일등록오류');
			    }
			});	
		}else{
			$scope.save();
		}	
	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	function base64ToBlob(base64, mime) 
	{
	    mime = mime || '';
	    var sliceSize = 1024;
	    var byteChars = window.atob(base64);
	    var byteArrays = [];

	    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
	        var slice = byteChars.slice(offset, offset + sliceSize);

	        var byteNumbers = new Array(slice.length);
	        for (var i = 0; i < slice.length; i++) {
	            byteNumbers[i] = slice.charCodeAt(i);
	        }

	        var byteArray = new Uint8Array(byteNumbers);

	        byteArrays.push(byteArray);
	    }

	    return new Blob(byteArrays, {type: mime});
	}
};



function Poupup5($scope, $uibModalInstance, $filter, $rootScope, $window, $ksHttp, attendanceYn) {
	$scope.id_check_all = null;
	$scope.popup5_attendStudent_list=[];
	$scope.fieldChange = "table";
	$scope.attendanceYn = attendanceYn;
	
	$scope.initPopup5 = function() {
		$scope.getAttendStudentList();
	};
	// check all tr
	$scope.checkAll = function(id) {
		angular.forEach($scope.popup5_attendStudent_list, function(value, key) {
			value.attState = id;
		});
		$scope.id_check_all = id;
	};
	
	$scope.checkTdPopup5 = function(id) {
		var check = 0;
		angular.forEach($scope.popup5_attendStudent_list, function(value, key) {
			if (value.attState != id)
				check = 1;
		});
		if (check == 0) {
			$scope.id_check_all = id;
		} else {
			$scope.id_check_all = null;
		}
	};

	$scope.getAttendStudentList = function() {
		var params = {
			shLtCd : $scope.select_lecture,
			shStCd : $scope.popup5_student.stCd
		};
		console.log(params);
		$ksHttp.post('AttendStudentList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.popup5_attendStudent_list = rs;
			$scope.org_attend_student = angular.copy($scope.popup5_attendStudent_list);
			$scope.checkTdPopup5($scope.popup5_attendStudent_list[0].attState);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.savePopup5 = function() {
		
		var student_list = [];
		var changed_items = $.grep($scope.popup5_attendStudent_list, function(x, i){
			if($scope.popup5_attendStudent_list[i].attState != $scope.org_attend_student[i].attState || $scope.popup5_attendStudent_list[i].attCnts != $scope.org_attend_student[i].attCnts) {
				return x;
			}
    	});
		angular.forEach(changed_items, function(ele1){
			var student1 = {
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
					  , attendanceYn : $scope.attendanceYn 
				}
				
				$ksHttp.post("AttendStudentSave", params).then(function(rs){
					rs = JSON.parse(rs);
					$uibModalInstance.close(rs);
		    	}, function(error){
		    		$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');		    		
		    	});
		}
		else {
			$rootScope.showMessage('success', '수정된 사항이 없습니다.');
		}		
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
		
	/*언어변경 세팅**/
	$scope.initLanguage = function(){
		var currentLanguage;
    	if( null == localStorage.getItem('sli_lang')){
    		currentLanguage = "ko";
    	}else{
    		currentLanguage = localStorage.getItem('sli_lang');
    	}
    	
    	$('[data-langNum]').each(function() {       	  
    		var $this = $(this);
    		$this.html($.lang[currentLanguage][$this.data('langnum')]); 
        });
    }    
};