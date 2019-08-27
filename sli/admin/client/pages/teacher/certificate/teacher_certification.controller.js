'use strict';

app.controller('TeacherCertificationController', TeacherCertificationController);
app.controller('teacherCertificationPoupController', TeacherCertificationPoupController);

function TeacherCertificationController($scope, $rootScope, $state, $ksHttp, $uibModal, $filter) {
	$scope.application_from_date = null;
	$scope.appliation_to_date = null;
	$scope.request_from_date = null;
	$scope.request_to_date = null;
	$scope.current_page = 1;
	$scope.total_cetificates = 0;
	$scope.total_pages = 0;
	$scope.certificate_types = [];
	$scope.selected_certificate_type = null;
	$scope.teacher_detail = {};
	$scope.lectures = [];
	$scope.process_statuses = [{id: 'A', name: '전체'},{id: 'N', name: '처리중'},{id: 'Y', name: '처리완료'}];
	$scope.selected_status = 'A';
	$scope.certificates = [];
	$scope.certificateFile = {};
	
	$scope.upload_file = {
		curType : 'Certify',
		curKey : 'proof',
		fileName : '',
		fileNewName : ''
	};

	$scope.init = function(){
		 $scope.getCertificateTypes();
		 $scope.getCertificates();
		 $scope.setDate();
		 $scope.getCertificatesCount();
		 $(".date input").attr("readonly","readonly");
		 $(".date input").css("background-color", "#fff");
	}; 	
	
	$scope.setDate = function(){
		var startDt = new Date();
		var endDt = new Date();
		startDt.setDate(startDt.getDate() - 14);
		
		$scope.application_from_date = $filter('date')(startDt, "yyyy-MM-dd"); 
		$scope.appliation_to_date = $filter('date')(endDt, "yyyy-MM-dd"); 
		$scope.request_from_date = $filter('date')(startDt, "yyyy-MM-dd"); 
		$scope.request_to_date = $filter('date')(endDt, "yyyy-MM-dd");
	}
	
    $scope.getCertificateTypes = function() {
		var params = {
			groupId : 'CERTIFICATE_TYPE'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.certificate_types = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.buildParams = function(){
		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;
		return  {
				startPage : start_page,
				endPage : end_page,
				shStartReDt: $scope.application_from_date ? $scope.application_from_date : null,
				shEndReDt :  $scope.appliation_to_date ? $scope.appliation_to_date : null,
				shStartIssDt : $scope.request_from_date ? $scope.request_from_date : null,
				shEndIssDt : $scope.request_to_date ? $scope.request_to_date : null,
				shCertificateType : $scope.selected_certificate_type ? $scope.selected_certificate_type : null,
				shIssueYn :  $scope.selected_status ? $scope.selected_status : null
			}
	};
	
	$scope.getCertificates = function(){
		var params = $scope.buildParams();
		$ksHttp.post('CertificateInfoList', params).then(function(rs) {
			$scope.certificates = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	};
	
	
	$scope.getCertificatesCount = function() {
		var count_params = $scope.buildParams();
			$ksHttp.post('CertificateInfoListCnt', count_params).then(function(rs) {
				rs = JSON.parse(rs);
				if(rs && rs.length > 0){
					$scope.total_cetificates = rs[0].totalCnt;
					$scope.total_pages = Math.ceil($scope.total_cetificates/$scope.app.page_size);
				}
			}, function(error) {
				console.log(error);
			});
	};
	
	$scope.getTeacherDetail = function(selected_teacher){
		var params = {
			tcCd: selected_teacher
		}
			
		$ksHttp.post('TeacherUserDetail', params).then(function(rs) {
			$scope.teacher_detail = JSON.parse(rs);
			
			//강사 로딩이 끝난 후 불러오도록 수정 
			$scope.getLectureList(selected_teacher);
			
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getLectureList = function(selected_teacher){
		var params = {
				tcCd: selected_teacher,
				stateY : 'Y',
				stateN : 'Y',
				stateW : 'Y'
			};		
		$ksHttp.post('LectureList', params).then(function(rs) {
			$scope.lectures = JSON.parse(rs);
			
			var modalInstance = $uibModal.open({
	            templateUrl	: 'popup',
	            controller	: 'teacherCertificationPoupController',
	            windowClass: 'app-modal-window',
	            scope		: $scope,
	            resolve		: {
					teacher_info : function(){
						return $scope.teacher_detail;
					},
					lectures : function(){
						return $scope.lectures;
					}
	            }
	        });
	        
	        modalInstance.result.then(function (result) {
	           console.log(result);
	        }, function (err) {
	          console.log(err)
	       });
	        
		}, function(error) {
			console.log(error);
		});
	}
		
    $scope.teacherDetailPopUp = function(item){
    	$scope.getTeacherDetail(item);    	        
    };
    
    $scope.$watch('current_page', function(){
		$scope.getCertificates();
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

	$scope.fileUpload = function(cfaCd) {
		
		if($scope.certificateFile.proof.length > 0) {
			
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', $scope.certificateFile.proof[0]);
        	
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
    		    	
    		    	//파일저장
    		    	var params = {
    		    			saveType : 'U',
    		    			cfaCd : cfaCd,
    		    			regUser: $rootScope.current_user.userId,
    		    			imgArr : [$scope.upload_file]    		    			
    		    	};
    		    	
    				$ksHttp.post('CertifyIssue', params).then(function(rs) {
    					rs = JSON.parse(rs);
    					
    					var message = rs[0].message;
    					var status = rs[0].result;
    					$rootScope.showMessage($rootScope.getMessageType(status), message);
    					
    					$scope.getCertificates();
    				}, function(error) {
    					$rootScope.showMessage('danger', '[오류] 잠시 후 다시등록해주세요.');
    				});    		    	
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
	};
	
	$scope.fileDelete = function(item) {
				
		$rootScope.showConfirm('첨부파일을 삭제하시겠습니까?', function() {			
			var params = {
				saveType : 'D',
	    		cfaCd : item.cfaCd,
	    		regUser: $rootScope.current_user.userId
			}
			
			$ksHttp.post('CertificateSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if(status == 'succ'){
					item.issueYn = 'N';
					item.issueDt = '';
					item.issueYnNm = '처리중';
					item.pathServer = '';
					item.fileName = '';
				}
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
			
		});
	}
}	


function TeacherCertificationPoupController($scope, $rootScope, $ksHttp, $uibModal,  teacher_info, lectures, $uibModalInstance){
   $scope.teacher_detail = teacher_info[0];
   $scope.leactures = lectures;
   
   $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
   };
}
