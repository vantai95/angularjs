'use strict';

app.controller('MyinfoModify', MyinfoModify);

function MyinfoModify($scope, $rootScope, $ksHttp, $stateParams, $state) {
	$scope.tcCd = null;
	$scope.teacher_user_detail = null;
	$scope.bank_list = [];
	$scope.value_check_all = false;
	$scope.rvFiles = null;
	$scope.files = [];
	$scope.files['photo'] = null;

	$scope.upload_files = [];
	$scope.upload_files['photo'] = {
		curType : 'Teacher',
		curKey : 'photo',
		fileName : '',
		fileNewName : '',
	}
	
	$scope.rvFiles = {
		fileName : ''
	}
	
	$scope.init = function() {
			$scope.tcCd = $rootScope.current_user.tcCd;
			$scope.getTeacherUserDetail();
			$scope.getBankCd();
			$scope.getSubjects();
			$scope.getFile();
	};

	// -------------------------------

	$scope.setCheckAll = function() {
		var count = 0;
		angular.forEach($scope.lecture_areas, function(lecture_area, key) {
			if (lecture_area.check == false)
				count++;
		});
		if (count == 0)
			$scope.value_check_all = true;
		else
			$scope.value_check_all = false;
	};

	$scope.clickCheckAll = function() {
		angular.forEach($scope.lecture_areas, function(lecture_area, key) {
			lecture_area.check = $scope.value_check_all;
		});
	};

	$scope.setCheckbox = function() {
		angular.forEach($scope.lecture_areas, function(lecture_area, key) {
			lecture_area.check = false;
			angular.forEach($scope.teacher_user_detail.lectureArea, function(
					id, key) {
				if (lecture_area.codeId == id)
					lecture_area.check = true;
			});
		});
	}

	$scope.getBankCd = function() {
		var params = {
			groupId : "BANK_CD"
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.bank_list = rs;
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getSubjects = function() {
		$ksHttp.post('SubjectMasterList', {}).then(function(rs) {
			$scope.subjects = JSON.parse(rs);
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
			$scope.setCheckbox();
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getTeacherUserDetail = function() {
		
		$ksHttp.post('TeacherUserDetail', {	tcCd : $scope.tcCd }).then(
						function(rs) {
							rs = JSON.parse(rs);
							$scope.teacher_user_detail = rs[0];
							if (rs != null) {
								var date = $scope.teacher_user_detail.birthday
										.split('-', 3);
								$scope.teacher_user_detail.year = date[0];
								$scope.teacher_user_detail.month = date[1];
								$scope.teacher_user_detail.day = date[2];
								var email = $scope.teacher_user_detail.email
										.split('@', 2);
								$scope.teacher_user_detail.email_name = email[0];
								$scope.teacher_user_detail.email_domain = email[1];
								$scope.teacher_user_detail.lectureArea = $scope.teacher_user_detail.lectureArea
										.split(',');
								$scope.getLectureAreas();
							}
						}, function(error) {
							console.error(error);
						});
	};

	$scope.validate = function(){
		
		if($scope.teacher_user_detail.newUserPw != $scope.teacher_user_detail.userPw_confirm){
			$rootScope.showAlert('비밀번호가 일치하지 않습니다.');
			return false;
		}
		if($scope.teacher_user_detail.year == '' || $scope.teacher_user_detail.year == undefined 
				|| $scope.teacher_user_detail.month == '' || $scope.teacher_user_detail.month == undefined
				|| $scope.teacher_user_detail.day == '' || $scope.teacher_user_detail.day == undefined){
			$rootScope.showAlert('생년월일을 입력해주세요.');
			return false;
		}
		var c_mon = Number($scope.teacher_user_detail.month);
		var c_day = Number($scope.teacher_user_detail.day);
		if( c_mon < 1 || 12 < c_mon || c_day < 1 || 31 < c_day ){
			$rootScope.showAlert('올바른 생년월일을 입력해주세요.');
			return false;
		}
		var c_year = Number($scope.teacher_user_detail.year);
		var to_year = new Date();
		if(c_year < 1900 || to_year.getFullYear() < c_year){
			$rootScope.showAlert('올바른 생년월일을 입력해주세요.');
			return;
		}
		
		if($scope.teacher_user_detail.email_name == '' ||  $scope.teacher_user_detail.email_name == undefined
				|| $scope.teacher_user_detail.email_domain == '' ||  $scope.teacher_user_detail.email_domain == undefined){
			$rootScope.showAlert('이메일을 입력해주세요.');
			return false;
		}
		return true;
	};

	$scope.save = function() {
		
		if($scope.validate()){
			$rootScope.showConfirm('수정하시겠습니까?',  function(){
			
				var detail = $scope.teacher_user_detail;
				detail.lectureArea =[];
				angular.forEach($scope.lecture_areas, function(lecture_area, key) {
					if (lecture_area.check ){
						detail.lectureArea.push(lecture_area.codeId);
					}
				});
				var params = {
					saveType : 'AU',
					tcCd : $rootScope.current_user.tcCd,
					birthday : detail.year + '-' + detail.month + '-'+detail.day,
					gender : detail.gender,
					mobile : detail.mobile,
					postNo : detail.postNo,
					addr : detail.addr,
					dtlAddr : detail.dtlAddr,
					email : detail.email_name+'@'+detail.email_domain,
					userId : detail.userId,
					userPw : detail.newUserPw,
					subjectCd : detail.subjectCd,
					lectureArea : detail.lectureArea.toString(),
					career : detail.career,
					bankCd : detail.bankCd,
					bankAccount : detail.bankAccount,
					bankHolder : detail.bankHolder,
					updUser : $rootScope.current_user.userId,
					imgArr : [$scope.upload_files['photo']]
				};
				//console.log(params);
				$ksHttp.post('TeacherSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);					
					if(status == 'succ') $state.go("app.index.dashboard");
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		};
	};

	$scope.fileUpload = function(idx) {
		var obj = $scope.files[idx];
		if(obj.length > 0) {
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', obj[0]);
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
    		    	$scope.upload_files[idx].fileName = data.fineName;
    		    	$scope.upload_files[idx].fileNewName = data.fileNewName;
    		    	
    		    	//console.log($scope.upload_files[idx]);
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage(error, '파일등록오류');
    		    }
    		});			
		}
		else {
			$scope.upload_files[idx].fileName = '';
			$scope.upload_files[idx].fileNewName = '';
		}
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
				$scope.teacher_user_detail.postNo = data.zonecode;
				$scope.teacher_user_detail.addr = data.roadAddress;
				$scope.$apply();
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
	
	$scope.getFile = function() {
		var params = {
				curCd : $rootScope.current_user.tcCd
				,curType : 'Teacher'
				,curKey : 'photo'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			//console.log(rs);
			$scope.rvFiles = JSON.parse(rs);
			
		}, function(error) {			
			console.error(error);
		});
	}	
}

function closeDaumPostcode() {
	$('#layer').hide();
	$('#daum_wrap').hide();
}