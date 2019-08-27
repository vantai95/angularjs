'use strict';

app.controller('TeacherDetailCtrl', TeacherDetailCtrl);
app.controller('TeacherDetailPopUpController', TeacherDetailPopUpController);
app.controller('SavePopUpController', SavePopUpController);
app.controller('UpdatePopUpController', UpdatePopUpController);

function TeacherDetailCtrl($scope, $state, dateFilter, $stateParams, $rootScope, $ksHttp, $uibModal ) {
    $scope.gugun_target_list = [];
    $scope.subArea = {};
    $scope.subArea.subAreaYn = 'N';
	
    $scope.init = function()
    {
        if(!$stateParams.id){
            $state.go("app.teacher.list",{error: true, err_msg: 'something wrong happened'});
        } else{
			$scope.teacher_id = $stateParams.id;
        	$scope.getTeacher($stateParams.id);
            $scope.getFile();
            $scope.getTeacherJudge();
        };
    }

	$scope.down_files = [];
	$scope.down_files['photo'] = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}

	$scope.down_files['contract'] = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}

	$scope.down_files['resume'] = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}

	$scope.down_files['idcard'] = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}

	$scope.down_files['bankbook'] = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}
	
	$scope.getTeacher = function(id){
        if(id){
        	var params = {
        			tcCd: id,
        			userId:$rootScope.current_user.userId
        			  };
        			  
		    $ksHttp.post('TeacherUserDetail', params).then(function(rs) {
		    	rs = JSON.parse(rs);
		    	   if (rs && rs.length > 0) {
			    	    $scope.teacher = rs[0];
			    	    if($scope.teacher.birthday){
			    	    	var birthday = $scope.teacher.birthday.toString().split('-');
				    	    if(birthday.length == 3){
					    	     $scope.teacher.birthday_year = birthday[0];
					    	     $scope.teacher.birthday_month = birthday[1];
					    	     $scope.teacher.birthday_day = birthday[2];
				    	    }
				    	    
				    	    var email = $scope.teacher.email.toString().split('@');
				    	    if(email.length == 2){
					    	     $scope.teacher.email_user_name = email[0];
					    	     $scope.teacher.email_domain = email[1];
				    	    }
			    	    }
			    	    $scope.setLectureSubArea();
		    	   }
		    	  }, function(error) {
		    	   console.log(error);
		    	  });
        }
    }
    
	$scope.getFile = function() {
		var params = {
				curCd : $scope.teacher_id
				,curType : 'Teacher'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			console.log(rs);
			for( var i=0; i< arr.length; i++ ){
				$scope.down_files[arr[i].curKey] = {
						seq : arr[i].seq
						, curKey : arr[i].curKey
						, fileName : arr[i].fileName
						, originalName : arr[i].originalName
						, pathUrl : arr[i].pathUrl
					}
			}
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.log(error);
		});
	}    
	
	$scope.sendNewPassword = function() {
  	  	var params = {
  	  			"userId" : $scope.teacher.userId,
  	  			"userEmail" : $scope.teacher.email,
  	  			"result" : '',
  	  			"message" : ''
  	  		};

  	  	$ksHttp.post('NewPasswordT', params).then(function(rs) {
			  console.log(rs);
			  if(rs.result == 'succ') {
				  $rootScope.showAlert(rs.message);
//				  $state.go("access.login")
			  }
			  else {
				  $rootScope.showAlert(rs.message);
//				  $rootScope.showMessage('error', rs.message);
			  }
		  }, function(error) {
				console.log(error);
		  });
	}

	$scope.contractLayerPopup = function() {
		var tmpData = {item: $scope.teacher_id};
		var PopupInstance = $uibModal.open({
			templateUrl : 'popup',
			controller : 'TeacherDetailPopUpController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item: tmpData
			}
		});
		
		PopupInstance.result.then(function(result) {
            // recieve returned data
			
		}, function(err) {
            console.info(err);
        });
	};
	
	$scope.saveContractLayerPopup = function() {
		var tmpData = {item: $scope.teacher_id};
		var PopupInstance = $uibModal.open({
			templateUrl : 'popup2',
			controller : 'SavePopUpController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item: tmpData
			}
		});
		
		PopupInstance.result.then(function(result) {
            // recieve returned data
			
		}, function(err) {
            console.info(err);
        });
	};
	
	$scope.deleteTeacher = function(){
		
		$rootScope.showConfirm("삭제하시겠습니까?", function() {
			var params = {
					saveType: 'D',
					userId : $scope.teacher.userId,
					updUser: $rootScope.current_user.userId
				};
			
			$ksHttp.post('TeacherSave', params).then(function(rs) {
				rs = JSON.parse(rs)
				var message = rs[0].message;
				var status = rs[0].result;
				
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if( 'succ' == status ) $state.go("app.teacher.list");				
			}, function(error) {
				console.log(error);
			});
		});
	}
	
	$scope.setLectureSubArea = function(){
    	
		var lectureSubAreaArr = [];
    	if( undefined != $scope.teacher.lectureSubArea){
    		lectureSubAreaArr = $scope.teacher.lectureSubArea.split(",");
    	}
    	
    	var tmpList = [];
    	$scope.gugun_target_list = [];
    	var paramMap = {
    		sidoCd : ''
		}
    	
		$ksHttp.post('GugunList', paramMap).then(function(rs) {
			tmpList = JSON.parse(rs);
			for(var i=0; i< lectureSubAreaArr.length; i++){
				for( var k=0; k < tmpList.length; k++ ){					
					if( lectureSubAreaArr[i] == tmpList[k].gugunCd ){
						$scope.gugun_target_list.push(tmpList[k]);
						$scope.subArea.subAreaYn = 'Y';
						break;
					}
				}
			}
			
		}, function(error) {
			console.log(error);
		});
    }
	
	$scope.getTeacherJudge = function(){		
		// 강사 선발 점수 
		$ksHttp.post('TeacherJudgeDetail', {tcCd: $stateParams.id}).then(function(rs) {
			if (rs && rs.length > 0) {				
				rs = JSON.parse(rs);
				$scope.teacherJudge = rs[0];
				
				var sum = 0;
				angular.forEach($scope.teacherJudge, function(value, key) {
					if( key.indexOf("Cd") < 0 ){
						if(isNaN(value)){
							value = 0;				
						}
						sum += Number(value);
						$scope.article_total = sum;
					}					
				});	
			}	
		}, function(error) {
			console.log(error);
		});
	}
}

function TeacherDetailPopUpController($ksHttp, $scope, $rootScope , $uibModal, $uibModalInstance, $filter, item, dateFilter){
	$scope.tcCd = item.item;
	console.log($scope.tcCd);
	$scope.contract = {};
    $scope.current_page = 1;
	$scope.total_pages = 0;
	
	$scope.totalCnt = 0;
	$scope.init = function() {
		$scope.getContractListCnt();
		$scope.getContractList();
	}
	
	$scope.getContractListCnt = function() {
		var params = {
				tcCd : $scope.tcCd
			};
		
		$ksHttp.post('TeacherContractListCnt', params).then(function(rs) {
			var arr = JSON.parse(rs);
			console.log(rs);
			if(arr.length > 0) {
				$scope.totalCnt = arr[0].totalCnt;
			}
			else {
				$scope.totalCnt = 0;
			}
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.log(error);
		});
	}    

	$scope.contractList = [];
	$scope.getContractList = function() {
    	var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
		var end_page = $scope.current_page * $scope.app.page_size;

		var params = {
			tcCd : $scope.tcCd,
			startPage: start_page,
			endPage: end_page
		};
		
		$ksHttp.post('TeacherContractList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			if(arr.length > 0) {
				$scope.contractList = arr;
			}
			else {
				$scope.contractList = [];
			}
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.log(error);
		});
	}    
	
	$scope.$watch('current_page', function(){
	      $scope.getContractList();
	});
	
	$scope.setCurrentPage = function(page){
		$scope.current_page = page;
	}
	
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
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.updateContractLayerPopup = function(data) {
		var tmpData = {item : data, tcCd: $scope.tcCd};
		var PopupInstance = $uibModal.open({
			templateUrl : 'popup3',
			controller : 'UpdatePopUpController',
			windowClass : 'app-modal-window',
			scope : $scope,
			resolve : {
				item: tmpData
			}
		});
		
		PopupInstance.result.then(function() {
            $scope.getContractList();
			
		}, function(err) {
            console.info(err);
        });
	};
	
	$scope.deleteContract = function(data) {
		$rootScope.showConfirm('계약 내용을 삭제하시겠습니까?', function() {
			var params = {
				saveType : 'D',
				tcCd : data.tcCd,
				tccCd : data.tccCd,
				contractStartDt: data.contractStartDt,
				contractEndDt: data.contractEndDt,
				regUser : $rootScope.current_user.userId,
				updUser : $rootScope.current_user.userId,
				imgArr : [],
				delImgSeqs : data.seq
			};
				
				$ksHttp.post('TeacherContractSave', params).then(function(rs) {
					var arr = JSON.parse(rs);
					console.log(arr);
					if(arr[0].result == 'succ') {
						$rootScope.showMessage('success', arr[0].message);
						$scope.getContractList();
					}
					else {
						$rootScope.showMessage('error', arr[0].message);
					}
					//$scope.files = JSON.parse(rs);
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
		});
	}
	
};

function SavePopUpController($ksHttp, $scope, $rootScope , $uibModalInstance, $filter, item, dateFilter){
	$scope.tcCd = item.item;
	
	$scope.contract = {};
	
	$scope.upload_files = {
		curType : 'Contract',
		curKey : 'contract',
		fileName : '',
		fileNewName : ''
	}
	$scope.fileUpload = function() {
		var obj = $scope.contract.file;
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
    		    	$scope.upload_files.fileName = data.fineName;
    		    	$scope.upload_files.fileNewName = data.fileNewName;
    		    	
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage('error', '파일등록오류');
    		    }
    		});			
		}
		else {
			$scope.upload_files.fileName = '';
			$scope.upload_files.fileNewName = '';
		}
	}

	$scope.save = function() {		
		$rootScope.showConfirm('계약 내용을 등록하시겠습니까?', function() {
			if($scope.contract.contractStartDt == '') {
				$rootScope.showMessage('error', '계약시작일을 등록해 주세요.');
				return;
			}
			/*if($scope.contract.contractEndDt == '') {
				$rootScope.showMessage('error', '계약종료일을 등록해 주세요.');
				return;
			}*/
			if($scope.upload_files.fileName == '') {
				$rootScope.showMessage('error', '계약서를 등록해 주세요.');
				return;
			}
			
			var params = {
				saveType : 'I',
				tcCd : $scope.tcCd,
				tccCd : null,
				contractStartDt: $scope.contract.contractStartDt,
				contractEndDt: $scope.contract.contractEndDt == undefined ? '' : $scope.contract.contractEndDt,
				regUser : $rootScope.current_user.userId,
				updUser : $rootScope.current_user.userId,
				imgArr : [$scope.upload_files],
				delImgSeqs : ''
			};
				
				$ksHttp.post('TeacherContractSave', params).then(function(rs) {
					var arr = JSON.parse(rs);
					console.log(arr);
					if(arr[0].result == 'succ') {
						$rootScope.showMessage('success', arr[0].message);
						$uibModalInstance.close();
					}
					else {
						$rootScope.showMessage('error', arr[0].message);
					}
					//$scope.files = JSON.parse(rs);
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.log(error);
				});
		});
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};

function UpdatePopUpController($ksHttp, $scope, $rootScope , $uibModalInstance, $filter, item, dateFilter){
	console.log(item);
	$scope.tcCd = item.tcCd;
	$scope.item = item.item;
	
	$scope.contract = {};
	
	$scope.down_files = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}

	$scope.upload_files = {
		curType : 'Contract',
		curKey : 'contract',
		fileName : '',
		fileNewName : ''
	}

	$scope.init = function() {
		$scope.down_files.seq = $scope.item.seq;
		$scope.down_files.curKey = $scope.item.curKey;
		$scope.down_files.pathUrl = $scope.item.pathUrl;
		$scope.down_files.fileName = $scope.item.fileName;
		$scope.down_files.originalName = $scope.item.originalName;
		
		$scope.contract.contractStartDt = $scope.item.contractStartDt;
		$scope.contract.contractEndDt = $scope.item.contractEndDt;

		
		var strArr = $scope.contract.contractStartDt.split("-");
		var endArr = [];		
		var strDt = new Date(strArr[0], Number(strArr[1])-1, strArr[2]);
		var endDt;
		$(".dateStr").datepicker('setDate', strDt);
		if( $scope.contract.contractEndDt != undefined ){
			endArr = $scope.contract.contractEndDt.split("-");
			endDt = new Date(endArr[0], Number(endArr[1])-1, endArr[2]);
			$(".dateEnd").datepicker('setDate', endDt);
		}
	}
	
	$scope.fileUpload = function() {
		var obj = $scope.contract.file;
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
    		    	$scope.upload_files.fileName = data.fineName;
    		    	$scope.upload_files.fileNewName = data.fileNewName;
    		    	
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage('error', '파일등록오류');
    		    }
    		});			
		}
		else {
			$scope.upload_files.fileName = '';
			$scope.upload_files.fileNewName = '';
		}
	}

	$scope.clearDownloadFile = function() {
		$scope.down_files.fileName = '';
		$scope.down_files.originalName = '';
		$scope.down_files.is_del = 'Y';
	}
	
	$scope.save = function() {
		$rootScope.showConfirm('계약 내용을 수정하시겠습니까?', function() {
			if($scope.contract.contractStartDt == '') {
				$rootScope.showMessage('error', '계약시작일을 등록해 주세요.');
				return;
			}
			
			if($scope.contract.contractEndDt == '') {
				$rootScope.showMessage('error', '계약종료일을 등록해 주세요.');
				return;
			}
			
			if($scope.down_files.is_del == 'Y' && $scope.upload_files.fileName == '') {
				$rootScope.showMessage('error', '계약서를 등록해 주세요.');
				return;
			}
			
			var params = {
				saveType : 'I',
				tcCd : $scope.tcCd,
				tccCd : $scope.item.tccCd,
				contractStartDt: $scope.contract.contractStartDt,
				contractEndDt: $scope.contract.contractEndDt,
				regUser : $rootScope.current_user.userId,
				updUser : $rootScope.current_user.userId,
				imgArr : [$scope.upload_files],
				delImgSeqs : $scope.down_files.is_del == 'Y' ? $scope.down_files.seq : ''
			};
				
				$ksHttp.post('TeacherContractSave', params).then(function(rs) {
					var arr = JSON.parse(rs);
					console.log(arr);
					if(arr[0].result == 'succ') {
						$rootScope.showMessage('success', arr[0].message);
						$uibModalInstance.close();
					}
					else {
						$rootScope.showMessage('error', arr[0].message);
					}
					//$scope.files = JSON.parse(rs);
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				});
		});
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};