'use strict';

app.controller('userController', UserController);
app.controller('UserJoinLayerPoupController', UserJoinLayerPoupController);
app.controller('UserJoinLayerPoup2Controller', UserJoinLayerPoup2Controller);
app.controller('UserJoinLayerPoup3Controller', UserJoinLayerPoup3Controller);
app.controller('UserOutLayerPoupController', UserOutLayerPoupController);

function UserController($scope, $http, $stateParams, $uibModal, $ksHttp, $state, $rootScope) {

	$scope.teachers = [];
	$scope.customer_companies = [];
	$scope.lectures = [];
	$scope.students = [];
	$scope.selected_teacher = null;
	$scope.selected_customer_company = null;
	$scope.selected_lecture = null;
	$scope.username_student = '';
	$scope.total_students = 0;
	$scope.total_pages = 0;
	$scope.current_page = 1;

	$scope.init = function() {
		if ($stateParams.teacher) {
			$scope.selected_teacher = $stateParams.teacher;
		}
		if ($stateParams.lecture) {
			$scope.selected_lecture = $stateParams.lecture;
		}
		if ($stateParams.customer_company) {
			$scope.selected_customer_company = $stateParams.customer_company;
		}
		if ($stateParams.username_student) {
			$scope.username_student = $stateParams.username_student;
		}
		$scope.getTeacherList();
		$scope.getCustomerCompanies();
		$scope.getStudents();
		$scope.getStudentCount();
	};

	$scope.getTeacherList = function() {
		$ksHttp.post('TeacherListBox', {}).then(function(rs) {
			$scope.teachers = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});

	};

	$scope.getCustomerCompanies = function() {
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.$watch('[selected_teacher , selected_customer_company]', function() {
		if ($scope.selected_teacher != null
				&& $scope.selected_customer_company != null) {
			$scope.getLectures();

		}
	});

	$scope.getLectures = function() {
		var params = {
			tcCd : $scope.selected_teacher.tcCd ? $scope.selected_teacher.tcCd : 0,
			cpCd : $scope.selected_customer_company.cpCd ? $scope.selected_customer_company.cpCd : 0
		};

		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.lectures = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};

	$scope.searchListStudents = function() {
		$scope.getStudents();
		$scope.getStudentCount();
		$state.go("app.user.list");
	};

	$scope.getStudents = function() {
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		var params = {
			tcCd : $scope.selected_teacher ? $scope.selected_teacher.tcCd : '',
			cpCd : $scope.selected_customer_company ? $scope.selected_customer_company.cpCd : '',
			ltCd : $scope.selected_lecture ? $scope.selected_lecture.ltCd : '',
			userName : $scope.username_student ? $scope.username_student : null,
			startPage :start_page,
			endPage : end_page
		}
		
		$ksHttp.post('StudentList', params).then(function(rs) {
			$scope.students = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});

	};
	
	$scope.getStudentCount = function() {
		var count_params = {
				tcCd : $scope.selected_teacher ? $scope.selected_teacher.tcCd : '',
				cpCd : $scope.selected_customer_company ? $scope.selected_customer_company.cpCd : '',
				ltCd : $scope.selected_lecture ? $scope.selected_lecture.ltCd : '',
				userName : $scope.username_student ? $scope.username_student : null
			}

			$ksHttp.post('StudentListCnt', count_params).then(function(rs) {
				rs = JSON.parse(rs);
				if(rs && rs.length > 0){
					$scope.total_students = rs[0].totalcnt;
					$scope.total_pages = Math.ceil($scope.total_students/$scope.app.page_size);
					
				}
			}, function(error) {
				console.log(error);
			});
	};

	$scope.$watch('current_page', function(){
		$scope.getStudents();
		
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
	
	$scope.openStudentJoinLayerPopup = function() {
		$scope.student = {};
		$scope.student.sexual = "boy";
		
		var studentJoinLayerPopupInstance = $uibModal.open({
			templateUrl : 'popup',
			controller : 'UserJoinLayerPoupController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				customer_companies : function() {
					return $scope.customer_companies;
				},
				students : function(){
					return $scope.students;
				}
			}
		});
		
		studentJoinLayerPopupInstance.result.then(function(result) {
            // recieve returned data
			$scope.getStudents();
			$scope.getStudentCount();
        }, function(err) {
            console.info(err);
        });
	};

	$scope.openStudentJoinLayerPopup2 = function() {
		var studentJoinLayerPopupInstance = $uibModal.open({
			templateUrl : 'popup2',
			controller : 'UserJoinLayerPoup2Controller',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				customer_companies : function() {
					return $scope.customer_companies;
				}
			}
		});
		
		studentJoinLayerPopupInstance.result.then(function(result) {
            // recieve returned data
			//console.log(result);
			if(result.totalCnt > result.resultCnt) {
				$scope.openStudentJoinLayerPopup3(result);
			}
			else {
				$rootScope.showMessage('success', '등록되었습니다.');
			}
			$scope.getStudents();
			$scope.getStudentCount();
        }, function(err) {
            console.info(err);
        });
	};
	
	$scope.openStudentJoinLayerPopup3 = function(rs) {
		var studentJoinLayerPopupInstance = $uibModal.open({
			templateUrl : 'popup3',
			controller : 'UserJoinLayerPoup3Controller',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				data : rs
			}
		});
		
		studentJoinLayerPopupInstance.result.then(function() {
        }, function(err) {
            console.info(err);
        });
	};
	
	$scope.openStudentOutLayerPopup = function(rs) {
		var studentJoinLayerPopupInstance = $uibModal.open({
			templateUrl : 'popupOutStudent',
			controller : 'UserOutLayerPoupController',
			windowClass : 'app-modal-window',
			scope : $scope
		});
		
		studentJoinLayerPopupInstance.result.then(function() {			
			$scope.getStudents();
        }, function(err) {
            console.info(err);
        });
	};

	$scope.SearchOnList = function()
	{
		$state.go("app.user.list", { teacher: $scope.selected_teacher, lecture: $scope.selected_lecture, customer_company: $scope.selected_customer_company, username_student: $scope.username_student });
	};
	
	$scope.changeCertify = function(user){
		
		if( undefined == user.cpCd || null == user.cpCd ){
			$rootScope.showMessage('error', '고객사 먼저 설정 후 인증해주세요.');
			
		}else{
			
			$rootScope.showConfirm("인증완료 하시겠습니까?", function() {
	    		var params = { 
	    				saveType : 'CF',
	    				userId : user.userId,
	    				updUser : $rootScope.current_user.userId	    				
	    			};
	    		
				$ksHttp.post('StudentSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					
					if( "succ" == status){
						user.certifyYn = 'Y';
					}				
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');					
				});
			});
		}
	}	
};

function UserJoinLayerPoupController($scope, $rootScope, $uibModalInstance,  $state,  $ksHttp, 
		customer_companies, students) {
	
	$scope.userId = {};
	$scope.customer_list = customer_companies;
	$scope.students = students;
	$scope.student_insert = {};
	$scope.student_insert.user_id = '';
	$scope.check_exist = 0;
	
	$scope.checkExist = function()
    {
		//console.log($scope.student_insert.user_id);
		if($scope.student_insert.user_id == '') {
			$rootScope.showAlert('아이디를 입력해 주세요.');
			return;
		}
		var params = {checkId: $scope.student_insert.user_id}
		$ksHttp.post('CheckIdCnt', params).then(function(rs) {
			rs = JSON.parse(rs);
			//console.log(rs);
			if(rs && rs.length > 0){
				$scope.check_exist = rs[0].idCnt;
				if(rs[0].idCnt > 0) {
					$rootScope.showMessage('error', '이미등록된 아이디 입니다.');
				}
				else {
					$rootScope.showMessage('success', '사용가능한 아이디 입니다.');
				}
			}
		}, function(error) {
			console.log(error);
		});
        
        
    };
    
    $scope.foucusBirthday = function(key, val){
    	if(val == undefined || val == '' || val == null)
    		return;
  
    		if(key == 'year' && val.length >= 4){
        		$('[ng-model="year_of_birth"]').focus();
    			$scope.year_of_birth = val.substring(0, 4);
        	}

        	if(key == 'month' && val.length >= 2){
        		$('[ng-model="month_of_birth"]').focus();
    			$scope.month_of_birth = val.substring(0, 2);
        	}
        	
        	if(key == 'day' && val.length >= 2){
    			$scope.date_of_birth = val.substring(0, 2);
        	}
    };
    
    
    $scope.closeModalStudentJoinLayerPopup = function (){
    	$uibModalInstance.close({customer_companies: $scope.customer_companies,
			 students: students}); 
    };
    
	var excelJsonObj = [];
	$scope.uploadFile = function() {
		$("#btn_upload").click();
		if ($("#btn_upload").val() != "") {

		}
	}

	$scope.getFiles = function() {
		var fullPath = $("#btn_upload").val();
		if (fullPath) {
			var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath
					.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
			var filename = fullPath.substring(startIndex);
			if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				filename = filename.substring(1);
			}
			$scope.excel_file = filename;
		}
	};

	$scope.downloadExcel = function() {
		$http({
				url : './pages/user/user_list.html',
				method : "POST",
				data : "",
				headers : {
					'Content-type' : 'application/json'
				},responseType : 'arraybuffer'}).then(function(response) {
					var blob = new Blob([ response.data ],
									{type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
					var objectUrl = URL.createObjectURL(blob);
					window.open(objectUrl);}), function errorCallback(response) {
				};
	};
	
	$scope.validate = function(){
		var obj = $scope.student_insert;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.selected_customer) == ''){
			$rootScope.showAlert('고객사명' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.user_name) == ''){
			$rootScope.showAlert('이름' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.user_id) == ''){
			$rootScope.showAlert('아이디' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.mobile) == ''){
			$rootScope.showAlert('휴대폰번호' + required_msg.textbox);
			return false;
		}
		
		var regExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
		if(regExp.test(obj.mobile)){ 
			return true; 
		} else { 
			$rootScope.showAlert('올바른 휴대폰번호를 입력해주세요.');
			return false;
		}
		
		if($.trim(obj.user_password) == ''){
			$rootScope.showAlert('비밀번호' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.retype_password) == '' || $.trim(obj.retype_password) != $.trim(obj.user_password)){
			$rootScope.showAlert('비밀번호 확인이 일치하지 않습니다.' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.gender) == ''){
			$rootScope.showAlert('성별' + required_msg.textbox);
			return false;
		}
		
		if($.trim($scope.year_of_birth) == '' || $.trim($scope.month_of_birth) == '' || $.trim($scope.date_of_birth) == ''){
			$rootScope.showAlert('생년월일' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.deptNm) == '' || $.trim(obj.positionNm) == ''){
			$rootScope.showAlert('부서명/직급' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.email) == ''){
			$rootScope.showAlert('이메일' + required_msg.textbox);
			return false;
		}
		
		return true;
	};
	
	  $scope.getBirthday = function()
	    {
	        if($scope.year_of_birth != "" && $scope.month_of_birth != "" && $scope.date_of_birth != "" && $scope.year_of_birth != null && $scope.month_of_birth != null && $scope.date_of_birth != null)
	        {
	            $scope.student_insert.birthday = $scope.year_of_birth + "-" + $scope.month_of_birth + "-" + $scope.date_of_birth;
	        }
	        else
	        {
	        	$scope.student_insert.birthday = '';
	        }
	    }
	
	$scope.generateUserParams = function(){
		$scope.getBirthday();
		return {
				saveType : 'I',
				cpCd: $scope.student_insert.selected_customer.cpCd ? $scope.student_insert.selected_customer.cpCd : 0,
				userName : $scope.student_insert.user_name ? $scope.student_insert.user_name : null,
				mobile :  $scope.student_insert.mobile ? $scope.student_insert.mobile : null,
				userId : $scope.student_insert.user_id ? $scope.student_insert.user_id : 0,
				userPw : $scope.student_insert.user_password ? $scope.student_insert.user_password : null,
				gender : $scope.student_insert.gender ? $scope.student_insert.gender : null,
				birthday : $scope.student_insert.birthday ? $scope.student_insert.birthday : null,
				deptNm : $scope.student_insert.deptNm ? $scope.student_insert.deptNm : null,
				positionNm :$scope.student_insert.positionNm ? $scope.student_insert.positionNm : null,
				email : $scope.student_insert.email ? $scope.student_insert.email : null,
				certifyYn : 'Y',
				agreeEvtYn : 'Y',
				regUser : $rootScope.current_user.userId,
				updUser : $rootScope.current_user.userId
			}
	};
	
	$scope.createStudent = function() {
		if ($scope.validate()) {
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateUserParams();
				$ksHttp.post('StudentSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$uibModalInstance.close({customer_companies: $scope.customer_companies,
						 students: students});
					
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
			});
			
		}
	};
	
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};

function UserJoinLayerPoup2Controller($scope, $rootScope, $uibModalInstance,  $state,  $ksHttp, 
		customer_companies) {
	
	$scope.userId = {};
	$scope.customer_list = customer_companies;
	$scope.upload_file = {
			fileName : '',
			fileNewName : ''
		};
	$scope.user = {};
	$scope.selected_customer = '';
	
	$scope.fileUpload = function() {
		
		if($scope.user.files.length > 0) {
			//console.log($scope.user.files);
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', $scope.user.files[0]);
        	
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
    		    	$scope.upload_file.fileName = data.fineName;
    		    	$scope.upload_file.fileNewName = data.fileNewName;
    		    	
    		    	//console.log($scope.upload_file);
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage('파일등록오류', error);
    		    }
    		});			
		}
		else {
			$scope.upload_file.fileName = '';
			$scope.upload_file.fileNewName = '';
		}
	}

	$scope.saveFile = function() {
		$rootScope.showConfirm('등록하시겠습니까?', function() {
			if($scope.selected_customer == '') {
				$rootScope.showMessage('error', '업체를 선택해 주세요.');
				return;
			}
			
			if($scope.upload_file.fileName == '') {
				$rootScope.showMessage('error', '업로드할 파일을 선택해 주세요.');
				return;
			}

			var params = {
				'cpCd' : $scope.selected_customer.cpCd
				, 'regUser' : $rootScope.current_user.userId
				, 'uploadFileName' : $scope.upload_file.fileNewName
			}

			$ksHttp.post('FileUser', params).then(function(rs) {
				$uibModalInstance.close(rs);

			}, function(error) {
				$rootScope.showMessage('error', '사용자를 생성 할 수 없습니다.');
				console.log(error);
			});
		});
	};
	
    $scope.closeModalStudentJoinLayerPopup2 = function (){
    	$uibModalInstance.close(); 
    };
};

function UserJoinLayerPoup3Controller($scope, $rootScope, $uibModalInstance,  $state,  $ksHttp, data) {
	$scope.errList = data.errList;
	
    $scope.closeModal = function (){
    	$uibModalInstance.close(); 
    };
};


function UserOutLayerPoupController($scope, $rootScope, $uibModalInstance,  $state,  $ksHttp) {
	
	$scope.out_company = null;
	$scope.out_lecture = null;
	$scope.out_companies_list = [];
	$scope.out_lecture_list = [];
	$scope.out_user_cnt = 0;
	
	$scope.outInit = function(){
		$scope.getOutPopCustomerCompany();
		$scope.getOutPopLecture();
	}
	
	$scope.getOutPopCustomerCompany = function(){
		$ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
			$scope.out_companies_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getOutPopLecture = function(){
		var params = {
			cpCd : $scope.out_company
		};
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			$scope.out_lecture_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getOutStudentCnt = function(){
		
		var params = {
			cpCd : $scope.out_company
			,ltCd : $scope.out_lecture
		};
		
		$ksHttp.post('StudentOutCnt', params).then(function(rs) {
			$scope.out_user_cnt = JSON.parse(rs)[0].totalCnt;
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.saveOutStudent = function() {
		
		if($scope.out_user_cnt == 0 ){
			$rootScope.showMessage('error', '선택된 유저가 없습니다.');
			return;
		}
		
		$rootScope.showConfirm('해당 유저들을 탈퇴처리 하시겠습니까?', function() {
			
			var params = {
				cpCd : $scope.out_company
				,ltCd : $scope.out_lecture
				,updUser : $rootScope.current_user.userId
			};
			
			$ksHttp.post('StudentsOutSave', params).then(function(rs) {				
				rs = JSON.parse(rs);
				if(rs && rs.length > 0){
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					
					if( "succ" == status){
						$scope.out_company = null;
						$scope.out_lecture = null;
						$scope.out_user_cnt = 0;
					}
				}
			}, function(error) {
				$rootScope.showMessage('error', '오류입니다. 관리자에게 문의해주세요.');
			});
		});
	};
	
    $scope.closeModalStudentOutLayerPopup = function (){
    	$uibModalInstance.close(); 
    };
};