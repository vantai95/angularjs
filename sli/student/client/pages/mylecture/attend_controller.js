"use strict";

app.controller("AttendController", AttendController);

app.controller("AbSencePopUpController", AbSencePopUpController);
app.controller("AttendanceApplicationPopUpController", AttendanceApplicationPopUpController);
app.controller('Poupup2', Poupup2);
function AttendController($scope, $rootScope, $ksHttp, $uibModal, $state, $location, $timeout, $stateParams, $filter) {
	$scope.lecture = null;
	$scope.attend_students = [];
	$scope.absence_list = [];
	$scope.select_lecture = $stateParams.ltCd;
	$scope.attFile = {};
	
	$scope.upload_file = {
			curType : 'Attend',
			curKey : 'att_file',
			fileName : '',
			fileNewName : ''
		};
	
	$scope.init = function(){
		if(!$scope.select_lecture) {
			 $state.go("app.mylecture.index");
		}
		else {
			$scope.getLectureListBox();
			$scope.select_lecture = $stateParams.ltCd;
			$scope.getAttendStudentList();
			$scope.getRecognize();
		}
	}
	$scope.getLectureListBox = function() {
		var params = {
				stCd : $rootScope.current_user.stCd
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs){
			$scope.lectures = JSON.parse(rs);
			$scope.lecture1 = $filter('filter')($scope.lectures, {'ltCd':$scope.select_lecture})[0];
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getMyAttendStats = function(){
		var params = {
				stCd:  $rootScope.current_user.stCd,
				ltCd: $scope.select_lecture
		};
		
		$ksHttp.post('MyAttendStats', params).then(function(rs){
			$scope.attend_status = JSON.parse(rs);
			
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getAttendStudentList = function(){
		var params = {
				stCd: $rootScope.current_user.stCd,
				ltCd: $scope.select_lecture
		};
		
		$ksHttp.post('AttendStudentList', params).then(function(rs){
			$scope.attend_students = JSON.parse(rs);
			$scope.getLectureListBox();
			$scope.getMyAbsenceList();
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.$watch('select_lecture', function(){
		if($scope.select_lecture != null){
			$scope.getMyAttendStats();
			
		}
	});
	
	$scope.getMyAbsenceList = function(){
		if( $scope.select_lecture != null && $scope.select_lecture != undefined ){
			var params = {
					stCd:  $rootScope.current_user.stCd,
					ltCd: $scope.select_lecture
			};
	
			$ksHttp.post('MyAbsenceList', params).then(function(rs){
				$scope.absence_list = JSON.parse(rs);
			}, function(error){
				console.error(error);
			});
		}
	};
	
	$scope.submitAbsence = function(item){
		$scope.tempAttItem = item;
		
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "popup4",
            controller: "AbSencePopUpController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            }
        });
        
        modalInstance.result.then(function(result) {
        }, function(err) {
            console.info(err);
        });
      
    };
    
    $scope.getRecognize = function(){
    	 var params = {
    		groupId : 'RECOGNIZE_CD'	 
    	 };
    	 
    	 $ksHttp.post('CodeList', params).then(function(rs){
    		 rs = JSON.parse(rs);
    		 $scope.type_cd = rs;
    	 }, function(error){
    		 console.error(error);
    	 });
    };

    
  
    $scope.submitApplication = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "popup3",
            controller: "AttendanceApplicationPopUpController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
            	selected_lecture : function() {
					return $scope.select_lecture ;
				},
				type_cd : function() {
					return $scope.type_cd ;
				}
            }
        });
        
        modalInstance.result.then(function(result) {
        }, function(err) {
            console.info(err);
        });
      
    };
    
    $scope.cancelAbsence = function( acCd ){
    	$rootScope.showConfirm('신청취소를 하시겠습니까?', function() {
			var params = {
					saveType : 'C',
					acCd : acCd,
					cancelYn : 'Y',
					updUser : $rootScope.current_user.userId
			};
			
			$ksHttp.post('AttendAbsenceDelSave', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status =  rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				
				if(status == 'succ'){
					for(var i=0; i< $scope.absence_list.length; i++ ){
						if( $scope.absence_list[i].acCd ==  acCd){
							$scope.absence_list.splice(i,1);						
							break;
						}
					}
					$uibModalInstance.close(rs);
				}
				
				
			}, function(error){
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
    	});
	}
    
    $scope.openPopup2 = function() {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "popup2",
			controller : "Poupup2",
			windowClass : "app-modal-window",
			scope : $scope
		});

		modalInstance.result.then(function(result) {
			if (result != "cancel") {
				$rootScope.showAlert(result[0].message);				
			}
		}, function(err) {
			console.info(err);
		});
	};
};


function AbSencePopUpController ($ksHttp, $scope, $rootScope , $uibModalInstance, $state) {
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};

	$scope.signature = null;
	
	$scope.upload_files = {
		curType : 'Attend',
		curKey : 'sign',
		fileName : '',
		fileNewName : '',
	}

	$scope.approve = function(){
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
		
		return;
	}
	
	$scope.save = function() {
		var params = {
				saveType : 'V',
				atCd : $scope.tempAttItem.atCd,
				updUser : $rootScope.current_user.userId,
				imgArr : [$scope.upload_files]
			};
			
			$ksHttp.post('AttendApprove', params).then(function(rs){
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status =  rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if( status == 'succ'){
					$scope.tempAttItem.studentRegDt = "now";
					$uibModalInstance.close();
				}
			}, function(error){
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');			
			});
	}
};

function AttendanceApplicationPopUpController($ksHttp, $scope, $rootScope, $state , $uibModalInstance, selected_lecture, type_cd){
	$scope.selected_lectured = selected_lecture;
	$scope.types_cd = type_cd;
	$scope.saveAttendAbsenceSave = function(){
		
		if( $scope.selected_lectured == "" || $scope.selected_lectured == undefined ){
			$rootScope.showMessage("error", "강의가 선택되어있지 않습니다.");
			return;
		}
		if( $rootScope.current_user.stCd == "" || $rootScope.current_user.stCd == undefined ){
			$rootScope.showMessage("error", "로그인정보가 유실되었습니다.");
			return;
		}
		if( $scope.absenceDt == "" || $scope.absenceDt == undefined ){
			$rootScope.showAlert('발급요청일을 선택해주세요.');
			return;
		}
		if( $scope.recognizeCd == "" || $scope.recognizeCd == undefined ){
			$rootScope.showAlert('인정사유를 선택해주세요.');
			return;
		}
		if( $scope.detailCnts == "" || $scope.detailCnts == undefined ){
			$rootScope.showAlert('상세사유를 입력해주세요.');
			return;
		}
		
		var params = {
				saveType : 'I',
				ltCd : $scope.selected_lectured,
				stCd : $rootScope.current_user.stCd,
				absenceDt : $scope.absenceDt,
				recognizeCd : $scope.recognizeCd,
				detailCnts : $scope.detailCnts,
				regUser : $rootScope.current_user.userId,
				imgArr : [$scope.upload_file]
		};
		
		$ksHttp.post('AttendAbsenceSave', params).then(function(rs){
			rs = JSON.parse(rs);
			var message = rs[0].message;
			var status =  rs[0].result;
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			if( status == 'succ') {
				//$state.go("app.mylecture.attend", {'ltCd': $scope.select_lecture});
				$state.reload();
				$uibModalInstance.close();
			}
		}, function(error){
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.error(error);
		});
	};
	
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};	
	
	$scope.fileUpload = function() {
		
		if($scope.attendFile.att_file.length > 0) {
			
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', $scope.attendFile.att_file[0]);
        	
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
}

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

function Poupup2($scope, $uibModalInstance, $filter, $rootScope, $window, $ksHttp, $state) {
	$scope.upload_files2 = {
		curType : 'Attend',
		curKey : 'sign_enrich',
		fileName : '',
		fileNewName : '',
	}
	
	$scope.lectureNew2 = {
		scheduleDt : null,
		scheduleCnts : null,
		scheduleDt : $filter('date')(new Date(), 'yyyy-MM-dd'),
		enrichCancelDt : $filter('date')(new Date(), 'yyyy-MM-dd')
	};

	$scope.approveEnrich = function(){
		
		if( undefined == $scope.select_lecture || "" == $scope.select_lecture ){
			$rootScope.showMessage('error', '강의가 선택되어있지 않습니다.');
			return;
		}
		if( null == $scope.lectureNew2.scheduleDt || "" == $scope.lectureNew2.scheduleDt ){
			$rootScope.showMessage('error', '수업일자를 선택해주세요.');
			return;
		}
		if( null == $scope.lectureNew2.scheduleCnts || "" == $scope.lectureNew2.scheduleCnts ){
			$rootScope.showMessage('error', '메모를 입력해주세요.');
			return;
		}
		
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
		    	$scope.upload_files2.fileName = data.fineName;
		    	$scope.upload_files2.fileNewName = data.fileNewName;
		    	
		    	$scope.enrichSave();
		    },
		    error: function (res, status, error) {
		    	$rootScope.showMessage(error, '파일등록오류');
		    }
		});	
		
		return;
	}
	$scope.enrichSave = function() {
		
		var params = {
			saveType : 'EI',
			ltCd : $scope.select_lecture,
			lectureType : '04',
			scheduleDt : $scope.lectureNew2.scheduleDt,			
			scheduleCnts : $scope.lectureNew2.scheduleCnts,			
			regUser : $rootScope.current_user.userId,
			imgArr : [$scope.upload_files2]
		};
		
		$ksHttp.post('LectureScheduleSave', params).then(function(rs) {
			rs = JSON.parse(rs);
			//console.log(rs);
			$uibModalInstance.close(rs);
			$state.reload();
		}, function(error) {
			$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
			console.error(error);
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};