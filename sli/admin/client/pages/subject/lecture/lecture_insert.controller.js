'use strict';

app.controller('LectureInsertController', LectureInsertController);

app.controller('PoupController', PoupController);

function LectureInsertController($scope, $filter, $rootScope, $ksHttp, $uibModal, $state, $stateParams, $timeout ) {
	$scope.domains = [];
	$scope.subjects = [];
	$scope.companies = [];
	$scope.lecture_sorts = [];
	$scope.teachers = [];
	$scope.tuition_fee_units = [];
	$scope.teacher_fee_units = [];
	$scope.lecture = {};
	$scope.lecture_id = null;
	$scope.percent_attendance = [];
	$scope.lecture.scheduleWeek = null;
	$scope.lecture.paymentType = 'M';
	$scope.indexSchedule = 0;
	$scope.add_schedule_week = [];
	$scope.org_schedule_week = [];
	$scope.deleted_schedule_week = [];
	$scope.lecture_books = [];
	$scope.book_name = '';
	$scope.selected_books = [];
	$scope.selected_schedule_week = [];
	$scope.schedule_week = [{name: '일' , id: 6}, {name:'월', id: 0}, {name: '화', id: 1}, {name: '수', id: 2}, {name: '목', id: 3}, {name: '금', id: 4}, {name: '토', id: 5}];
	$scope.hour_list = [];
	$scope.minute_list = [];
	$scope.search = {};
	$scope.search.user_name = '';
	
	$scope.upload_img = {
		curType : 'Lecture',
		curKey : 'img',
		fileName : '',
		fileNewName : '',
	};

	$scope.imgFile = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}
	
	$scope.init = function() {
		if($stateParams.id){
		    $scope.lecture_id = $stateParams.id;
		    $scope.getLecture();
		    $scope.getLectureScheduleList();
		    $scope.getLectureBookList();
		    $scope.getFile();
		}
		$scope.setTimeList();
		$scope.addScheduleWeek();
		$scope.getDomains();
		$scope.getCompanies();
		$scope.getLectureSorts();
		$scope.getTeachers();
		$scope.getTuitionFeeUnits();
		$scope.getTeacherFeeUnits();
		$scope.getPercentAttendance();
		
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
	};
	
	$scope.setDefaultDt = function(strDt, endDt ){
		var strArr, endArr, newStrDt, newEndDt;
		
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
	
	$scope.checkComfirmTime = function(obj){
		
		obj.scheduleStartTime = obj.startHour +":"+obj.startMinute;
		obj.scheduleEndTime = obj.endHour +":"+obj.endMinute;
	}
	
	$scope.getLectureScheduleList = function(){
		$ksHttp.post('LectureScheduleList', {shLtCd: $scope.lecture_id}).then(function(rs){
			$scope.add_schedule_week = JSON.parse(rs);
			
			var s_arr, e_arr;
			for( var i=0; i< $scope.add_schedule_week.length; i++){
				s_arr = $scope.add_schedule_week[i].scheduleStartTime.split(":");
				e_arr = $scope.add_schedule_week[i].scheduleEndTime.split(":");
				$scope.add_schedule_week[i].startHour = s_arr[0];
				$scope.add_schedule_week[i].startMinute = s_arr[1];
				$scope.add_schedule_week[i].endHour = e_arr[0];
				$scope.add_schedule_week[i].endMinute = e_arr[1];
			}			
			
			$scope.org_schedule_week = angular.copy($scope.add_schedule_week);
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.checkAlreadyAssigned = function(item, id) {
		if(item.scheduleWeek != undefined && item.scheduleWeek != null && item.scheduleWeek != ''){
			var schedule_week =  JSON.parse("[" + item.scheduleWeek + "]");
			return schedule_week.some(function(obj) {
		        return obj == id
		    });
		}
	    
	};
	
	$scope.getLectureBookList = function(){
		$ksHttp.post('LectureBookList', {shLtCd: $stateParams.id}).then(function(rs){
			$scope.bookInfoListPopup = JSON.parse(rs);
		
		}, function(error){
			console.log(error);
		});
	};
	
	$scope.addScheduleWeek = function()
	{
		if($scope.add_schedule_week.length >= 7) {
			$rootScope.showAlert('강의 일정은 최대 7개까지 등록가능합니다.');
			return;
		}
		var object = {};
		object.scheduleWeek = '';
		object.stdDt = '';
		object.scheduleStartTime = '';
	    object.scheduleEndTime = '';
		object.orderNo = ++ $scope.indexSchedule;
		object.lsCd = '';
		object.checked = true;
		$scope.add_schedule_week.push(object);
		$scope.org_schedule_week.push(object);

	};
	
	$scope.repeatComplete = function(index)
	{
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$(".date").datepicker({
			format : "yyyy-mm-dd",
			autoclose: true
		});
		
		
		var strArr, newStrDt, strDt;
		if(index == $scope.add_schedule_week.length-1 ){
			
			setTimeout(function() {				   
				for( var i=0; i< $scope.add_schedule_week.length; i++){					
					strDt = $scope.add_schedule_week[i].stdDt;
					if( undefined != strDt && "" != strDt){
						strArr = strDt.split("-");
						newStrDt = new Date(strArr[0], Number(strArr[1])-1, strArr[2]);
						$(".dateSchedule"+i).datepicker('setDate', newStrDt);
					}
				}
				
			}, 3000);
		}
	}

	$scope.deleteScheduleWeek = function(item)
	{
		var index = $scope.add_schedule_week.indexOf(item);
		if(item.lsCd != undefined && item.lsCd != null){
			$scope.deleted_schedule_week.push(item.lsCd); 
		}
		$scope.add_schedule_week.splice(index, 1);   
	};
	
	
	$scope.setScheduleWeek = function(value, x)
	{
		var temp = x.scheduleWeek;	
		if(temp == null || temp == '')
		{
			temp = [];
		}
		if(temp != null && temp.length > 0 && typeof temp == 'string')
		{
			temp = temp.split(',');
		}
		if(temp.indexOf(value.toString()) != -1)
		{
			temp.splice(temp.indexOf(value.toString()), 1);
		}
		else
		{
			temp.push(value);
		}
		temp = temp.join(',');
		
		x.scheduleWeek = temp;
	}
	
	$scope.getPercentAttendance = function()
	{
		for(var i = 10; i <= 20; i++)
		{
			$scope.percent_attendance.push(i*5);			
		}
	}
	
    $scope.getLecture = function() {
    	var params = {
			ltCd: $stateParams.id
		};

		$ksHttp.post('LectureDetail', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.lecture = rs[0];
				$scope.getSubjects();
			}
			
			$scope.setDefaultDt($scope.lecture.startDt, $scope.lecture.endDt);
		}, function(error) {
			console.log(error);
		});
    };
	
	$scope.getDomains = function() {
		var params = {
			groupId : 'TITLE_CD'
		};
		
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.domains = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getSubjects = function() {
		$ksHttp.post('SubjectMasterList', {titleCd: $scope.lecture.titleCd ? $scope.lecture.titleCd : 0}).then(function(rs) {
			$scope.subjects = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getCompanies = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.companies = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getLectureSorts = function() {
		var paramLecSort = {
			groupId : 'LECTURE_SORT'
		}
		$ksHttp.post('CodeList', paramLecSort).then(function(rs) {
			$scope.lecture_sorts = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getTeachers = function() {
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	

	$scope.getTuitionFeeUnits = function() {
		var params = {
			groupId : 'TUITION_FEE_UNIT'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.tuition_fee_units = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.getTeacherFeeUnits = function() {
		var params = {
			groupId : 'TEACHER_FEE_UNIT'
		}
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.teacher_fee_units = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.setPaymentType = function() {
		var accountType = '';
		$.each($scope.companies, function(i, x){
			if(x.cpCd == $scope.lecture.cpCd) {
				accountType = x.accountType;
			}
		});
		
		if(accountType == '01') {
			$scope.lecture.paymentType = 'C';
		}
		else if(accountType == '02' || accountType == '03') {
			$scope.lecture.paymentType = 'M';
		}
	}
	$scope.setDate = function(){
		$scope.lectureNew.startDt = $filter('date')(new Date(), "yyyy-MM-dd"); ;
		$scope.lectureNew.endDt = $filter('date')(new Date(), "yyyy-MM-dd"); ;
	};

	$scope.generateLectureParams = function() {
		var obj = $scope.lecture;
		if($scope.bookInfoListPopup != undefined)
		{
			$.each($scope.bookInfoListPopup, function(i, x){ $scope.selected_books.push(x.bkCd) });
		}
		return {
			saveType: $stateParams.id ? 'U' : 'I',
			cpCd : obj.cpCd != undefined ? obj.cpCd : null ,
			tcCd : obj.tcCd != undefined ? obj.tcCd : null ,
			sjCd : obj.sjCd != undefined ? obj.sjCd : null ,
			bkCds : $scope.selected_books.toString(),
			titleCd : obj.titleCd != undefined ? obj.titleCd : null ,
			lectureSort : obj.lectureSort != undefined ? obj.lectureSort : null,
			studentLimit : obj.studentLimit != undefined ? obj.studentLimit : 0,
			lectureNm :obj.lectureNm,
			lectureCnts :obj.lectureCnts,
			lectureCurriculum :obj.lectureCurriculum,
			lecturePlaceNm : obj.lecturePlaceNm != undefined ? obj.lecturePlaceNm : null,
//			lecturePlaceMap : obj.lecturePlaceMap != undefined ? obj.lecturePlaceMap : null,
			postNo : obj.postNo != undefined ? obj.postNo : null,
			addr : obj.addr != undefined ? obj.addr : null,
			dtlAddr: obj.dtlAddr != undefined ? obj.dtlAddr : null,
			latitude : obj.latitude != undefined ? obj.latitude : null,
			longitude : obj.longitude != undefined ? obj.longitude : null,
			startDt: obj.startDt != undefined ? obj.startDt : null,
			endDt: obj.endDt != undefined ? obj.endDt : null,
			lectureTotalCnt : obj.lectureTotalCnt != undefined ? obj.lectureTotalCnt : 0,
			attendanceYn : obj.attendanceYn != undefined ? obj.attendanceYn : 'N',
			completAttendance : obj.completAttendance != undefined ? obj.completAttendance : 0,
			tuitionFee :obj.tuitionFee != undefined ? obj.tuitionFee : 0,
			tuitionFeeUnit : obj.tuitionFeeUnit != undefined ? obj.tuitionFeeUnit : null,
			freeYn : obj.freeYn != undefined ? obj.freeYn : null,
			teacherFee : obj.teacherFee != undefined ? obj.teacherFee : 0,
			teacherFeeUnit : obj.teacherFeeUnit != undefined ? obj.teacherFeeUnit : null,
			teacherTrspFee : obj.teacherTrspFee != undefined ? obj.teacherTrspFee : 0,
			lectureContents : obj.lectureContents != undefined ? obj.lectureContents : null,
			lecturePoint : obj.lecturePoint != undefined ? obj.lecturePoint : null,
			bookYn : obj.bookYn != undefined ? obj.bookYn : 'N',
			sampleUrl : obj.sampleUrl != undefined ? obj.sampleUrl : null,
			scheduleArr : $scope.add_schedule_week,
		    scheduleLen: $scope.add_schedule_week.length,
		    useYn : obj.useYn != undefined && obj.useYn == 'Y' ? 'Y' : 'N',
		    absenceRate : obj.absenceRate != undefined && obj.absenceRate != '' ? obj.absenceRate : 0,
		    delScheduleCds : $scope.deleted_schedule_week != null ? $scope.deleted_schedule_week.toString() : '',
			imgArr : [$scope.upload_img],
			delImgSeqs : '',
			paymentType : $scope.lecture.paymentType
		};
	};

	$scope.showBookMaching = function() {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup.html",
			controller : "PoupController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				items : function() {
					return $scope.data;
				},
				book_name : function(){
					return $scope.book_name;
				},
				selected_books : function(){
					return $scope.bookInfoListPopup;
				}
			}
		});

		modalInstance.result.then(function(result) {
			if(result != "cancel"){
				console.log(result);
				if(!$scope.bookInfoListPopup) $scope.bookInfoListPopup = new Array();
				for(var i = 0; i < result.bookInfoListPopup.length; i++) {
					$scope.bookInfoListPopup.push(result.bookInfoListPopup[i]);
				}
			}
		}, function(err) {
			console.info(err);
		});
	};

	$scope.saveLecture = function() {
		var is_valid = true;
		angular.forEach($scope.add_schedule_week, function(value, index){
			if(!(value.scheduleEndTime == "" && value.scheduleStartTime == "" && value.scheduleWeek == "") 
					&& !(value.scheduleEndTime != "" && value.scheduleStartTime != "" && value.scheduleWeek != "")){
				is_valid = false;
				return;
			}
		});
		
		if(!is_valid){
			$rootScope.showAlert('추가된 강의일정을 입력해주세요.' );
			return false;
		}
		if($scope.validate()){
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateLectureParams();
				params.regUser = $rootScope.current_user.userId;

				$ksHttp.post('LectureSave', params).then(function(rs) {
						rs = JSON.parse(rs);
						var message = rs[0].message;
						var status = rs[0].result;
						$rootScope.showMessage($rootScope.getMessageType(status), message);
						if(status == 'succ') $state.go("app.subject.lecture_list");
//						if(status == 'succ') $scope.insertLectureScheduleHistory();
					}, function(error) {
						$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					});
			});
		}	
		
	};

	$scope.updateLecture = function() {
		var is_valid = true;
		angular.forEach($scope.add_schedule_week, function(value, index){
			if(!(value.scheduleEndTime == "" && value.scheduleStartTime == "" && value.scheduleWeek == "") 
					&& !(value.scheduleEndTime != "" && value.scheduleStartTime != "" && value.scheduleWeek != "")){
				is_valid = false;
				return;
			}
		});
		
		if(!is_valid){
			$rootScope.showAlert('추가된 강의일정을 입력해주세요.' );
			return false;
		}

		if($scope.validate()){
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params = $scope.generateLectureParams();
				params.ltCd = $scope.lecture_id;
				params.updUser = $rootScope.current_user.userId;
				if($scope.imgFile.is_del == 'Y') params.delImgSeqs = $scope.imgFile.seq;

				$ksHttp.post('LectureSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					if(status == 'succ') $state.go("app.subject.lecture_detail", {id: $scope.lecture_id});
//					if(status == 'succ') $scope.insertLectureScheduleHistory();
					$rootScope.showMessage($rootScope.getMessageType(status), message);
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
			});
		}
		
	};

	$scope.insertLectureScheduleHistory = function() 
	{
		var isChange = false;
		
		if($scope.add_schedule_week.length != $scope.org_schedule_week.length) {
			isChange = true;
		}
		else {
			for(var i = 0; i < $scope.add_schedule_week.length; i++) {
				if($scope.add_schedule_week[i].scheduleWeek != $scope.org_schedule_week[i].scheduleWeek) {
					isChange = true;
					break;
				}
			}
		}
		
		if(isChange) {
			for(var i = 0; i < $scope.add_schedule_week.length; i++) {
				var params = {
						ltCd : $scope.lecture_id
						, regUser : $rootScope.current_user.userId
						, scheduleWeek : $scope.add_schedule_week[i].scheduleWeek
						, stdDt : $scope.add_schedule_week[i].stdDt
					};
			
				$ksHttp.post('LectureScheduleHistory', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					if(status == 'succ') {
//						if($scope.lecture_id != null) $state.go("app.subject.lecture_detail", {id: $scope.lecture_id});
//						else $state.go('app.subject.lecture_list');
					}
					$rootScope.showMessage($rootScope.getMessageType(status), message);
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
			}
		}
		else {
			$state.go("app.subject.lecture_detail", {id: $scope.lecture_id});
		}
	}
	
	$scope.fileUpload = function() {
		if($scope.lecture.images.length > 0) {
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', $scope.lecture.images[0]);
        	
    		$.ajax({
    			url: "/sli/admin/fileUpload",
    		    type: "POST",
    		    data: fileForm,
    		    dataType: 'json',
    		    enctype: 'multipart/form-data',
    		    processData: false,
    		    contentType: false,
    		    cache: false,
    		    success: function (data, status) {
    		    	//console.log(data);
    		    	$scope.upload_img.fileName = data.fineName;
    		    	$scope.upload_img.fileNewName = data.fileNewName;
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage('파일등록오류', error);
    		    }
    		});			
		}
		else {
			$scope.upload_img.fileName = '';
			$scope.upload_img.fileNewName = '';
		}
	};

	$scope.clearDownloadFile = function(idx) {
		$scope.imgFile.fileName = '';
		$scope.imgFile.originalName = '';
		$scope.imgFile.is_del = 'Y';
	}
	
	$scope.getFile = function() {
		var params = {
				curCd : $scope.lecture_id
				,curType : 'Lecture'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			//console.log(rs);
			for( var i=0; i< arr.length; i++ ){
				if(arr[i].curKey == "img" ){
					$scope.imgFile = {
						seq : arr[i].seq
						, curKey : arr[i].curKey
						, pathServer : arr[i].pathServer
						, fileName : arr[i].fileName
						, originalName : arr[i].originalName
						, pathUrl : arr[i].pathUrl
					}
					
				}
			}
		}, function(error) {
			
			console.log(error);
		});
	}	
	$scope.cancelUpdating = function() {
		var msg = $scope.lecture_id ? '편집을 취소 하시겠습니까?' : '등록을 취소 하시겠습니까?';
		$rootScope.showConfirm(msg, function() {
			$state.go("app.subject.lecture_detail", {id: $scope.lecture_id});
		});
	};
	
	$scope.validate = function() {
		var obj = $scope.lecture;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.lectureNm) == '' || $.trim(obj.lectureNm) == undefined){
			$rootScope.showAlert('강의명 ' + required_msg.textbox);
			return false;
		}
		if($.trim(obj.startDt) == '' || $.trim(obj.startDt) == undefined){
			$rootScope.showAlert('개강일 ' + required_msg.textbox);
			return false;
		}					
		return true;
	};
	
	$scope.deleteBook = function(x) {
		var index = $scope.bookInfoListPopup.map(function(x) {return x.bkCd; }).indexOf(x.bkCd);
		$scope.bookInfoListPopup.splice(index,1);
	}

	$scope.execDaumPostcode = function() {
		$('#daum_wrap').show();
		var element_layer = document.getElementById('layer');
		new daum.Postcode({
			shorthand : false,
			oncomplete: function(data) {
				var addr = data.roadAddress;
				if(addr == '') {
					addr = data.roadAddress
				}
				$scope.lecture.postNo = data.zonecode;
				$scope.lecture.addr = data.roadAddress;
				$scope.$apply();

			    var geocoder = new daum.maps.services.Geocoder();
  			    geocoder.addressSearch(data.address, function(results, status) {
	                    // 정상적으로 검색이 완료됐으면
					if (status === daum.maps.services.Status.OK) {
						var result = results[0]; //첫번째 결과의 값을 활용
			
									// 해당 주소에 대한 좌표를 받아서
						var coords = new daum.maps.LatLng(result.y, result.x);
						$scope.lecture.latitude = result.y;
						$scope.lecture.longitude = result.x;
					}
				});
			},
			onclose: function() {
				element_layer.style.display = 'none';
				$('#daum_wrap').hide();
			},
            width : '100%',
            height : '100%',
            maxSuggestItems : 5
		}).embed(element_layer);
		element_layer.style.display = 'block';
		var width = 400; //우편번호서비스가 들어갈 element의 width
        var height = 500; //우편번호서비스가 들어갈 element의 height
        var borderWidth = 1; //샘플에서 사용하는 border의 두께

        // 위에서 선언한 값들을 실제 element에 넣는다.
        element_layer.style.width = width + 'px';
        element_layer.style.height = height + 'px';
        element_layer.style.border = borderWidth + 'px solid';
        // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
        element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
        element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
	}
		
	var match = function (item, val) {
	    var regex = new RegExp(val, 'i');
	    return item.userName.toString().search(regex) == 0;
	  };
	  
	$scope.filterUsers = function(user) {
	    // No filter, so return everything
	    if (!$scope.search.user_name) return true;
	    var matched = true;
	    
	    // Otherwise apply your matching logic
	    $scope.search.user_name.split(' ').forEach(function(token) {
	        matched = matched && match(user, token); 
	    });
	     
	    return matched;
	};
	
}
function closeDaumPostcode() {
	$('#layer').hide();
	$('#daum_wrap').hide();
}

function PoupController ($scope, $uibModalInstance, $rootScope, items, $window, $ksHttp, book_name, selected_books) {
	$scope.subjectMasterListPopup = [];
	$scope.bookInfoSelect = {};
	$scope.bookInfoListPopup = {};
	$scope.dataBook = [];
	$scope.book_name = book_name;
	$scope.selected_subject = null;
	$scope.selected_books = selected_books;
	$scope.initPopup = function() {
		$scope.getSubjectMasterListPopup();
		$scope.getBookInfoListPopup();
	}
	
	$scope.changeMasterList = function(){
		$scope.getBookInfoListPopup();
	}
	
	$scope.ok = function () {
		var count = 0;
		angular.forEach($scope.bookInfoListPopup.data, function(ele){
			if(ele.selected == true)
			{
				count ++;
			}
		});
		if(count == 0)
		{
			$rootScope.showAlert("교재를 선택해주세요");
			return;
		}
       var selected_items = $.grep($scope.bookInfoListPopup.data, function(x,i){ return x.selected;})
        $uibModalInstance.close({bookInfoListPopup: selected_items});
	    };
	
	$scope.getBookInfoListPopup = function (){
	
		var paramsBookInfoListPopup = {
				sjCd : $scope.selected_subject,
				bookName : $scope.book_name
		};
		
		$ksHttp.post('BookInfoListPopup', paramsBookInfoListPopup).then(function(rs) {
			$scope.bookInfoListPopup.data = JSON.parse(rs);
			angular.forEach($scope.selected_books, function(value) {
				var index = $scope.bookInfoListPopup.data.map(function(x) {return x.bkCd; }).indexOf(value.bkCd);
				$scope.bookInfoListPopup.data.splice(index,1);
			});
		}, function(error) {	
			console.log(error);
		});
	}
	
	$scope.getSubjectMasterListPopup = function() {
		var params = {};
		$ksHttp.post('SubjectMasterList', params).then(function(rs) {
			rs= JSON.parse(rs);
			$scope.subjectMasterListPopup = rs;
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.selectedBook = function(book) {

		var idx = $scope.bookInfoListPopup.selected.indexOf(book);

		// is currently selected
		if (idx > -1) {
			$scope.bookInfoListPopup.selected.splice(idx, 1);
		}

		// is newly selected
		else {
			$scope.bookInfoListPopup.selected.push(book);
		}
	}
	$scope.addBook = function() {
		  angular.forEach($scope.bookInfoListPopup.selected, function (obj, key1) {
	           $scope.dataBook.push(obj.bkCd);
	        });
	        $uibModalInstance.close($scope.dataBook);
	};

	$scope.cancel = function() {
		 $uibModalInstance.dismiss('cancel');
	};
};


