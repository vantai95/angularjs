"use strict";
app.controller("BookListInsertController", BookListInsertController);
app.controller("CustomModalController", CustomModalController);

function BookListInsertController($scope, $rootScope, $stateParams, $state, $uibModal, $filter,$ksHttp) {
    $scope.book_titles = [];
    $scope.book_subjects = [];
    $scope.subject = null;
    $scope.name_of_lecturers = [];
    $scope.name_of_lecturer = null;
    $scope.book_id = null;
    $scope.book = {};
  
    
    $scope.init = function(){
        if($stateParams.id){
            $scope.book_id = $stateParams.id;
            $scope.getBook($scope.book_id);
            $scope.getFile();
        }
        $scope.getBookTitles();
        $scope.getNameOfLecturer();
        $scope.getConnectLessonData();
    };

    $scope.getBook = function(id) {
    	if(id){
    		var params = {
            		bkCd: id			  	  
            	}
		    $ksHttp.post('BookInfoDetail', params)
			  	.then(function(rs){
			  		rs = JSON.parse(rs);
			  		$scope.book = rs[0];
			  	}, function(error){
			  		console.error(error);
			  	})    
    	}
    };

    $scope.getBookRelation = function() {
   		var params = {
           		bkCd: $scope.book_id			  	  
           	}
	    $ksHttp.post('GetBookInfoRelation', params)
		  	.then(function(rs){
		  		rs = JSON.parse(rs);
		  		console.log(rs);
    			$scope.connect_lessons1 = rs;
    			for(var i = 0; i < $scope.connect_lessons1.length; i++) {
    				for(var j = 0; j < $scope.connect_lessons.length; j++) {
    					if($scope.connect_lessons1[i].ltCd == $scope.connect_lessons[j].ltCd) {
    						$scope.connect_lessons[j].selected = true;
    					}
    				}
    			}
		  	}, function(error){
		  		console.error(error);
		  	})    
    };

    $scope.getBookTitles = function(){
    	var params = {
    			groupId: 'TITLE_CD'
    	}
    	$ksHttp.post('CodeList', params)
    		.then(function(rs){
    			$scope.book_titles = JSON.parse(rs);
    		}, function(error){
    			console.log(error);
    		});       
    };
    
    $scope.getSubjects = function(){
    	var params = {	
    			titleCd: $scope.book.titleCd ? $scope.book.titleCd : null
  	  }
  	  $ksHttp.post('SubjectMasterList', params)
  	  	.then(function(rs){
  	  		$scope.book_subjects = JSON.parse(rs);
  	  	}, function(error){
  	  		console.error(error);
  	  	})         
    };

    $scope.$watch('book.titleCd', function() {
    	 $scope.getSubjects();
	});
    
    $scope.getNameOfLecturer = function(){
    	var params = {			  
    	  }
    	  $ksHttp.post('TeacherListBox', params)
    	  	.then(function(rs){
    	  		$scope.name_of_lecturers = JSON.parse(rs);
    	  	}, function(error){
    	  		console.error(error);
    	  	})      
        
    };

    $scope.getConnectLessonData = function(){
    	var params={
    			sjCd: '',
    			tcCd: '',
    			lectureNm: ''
    	}
    	$ksHttp.post('LectureListPopup', params)
    		.then(function(rs){
    			$scope.connect_lessons = JSON.parse(rs);
                $scope.getBookRelation();
    		}, function(error){
    			console.error(error);
    		})      
    };

    $scope.openPopup = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "custom_modal.html",
            controller: "CustomModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
                connect_lessons: function() {
                    return $scope.connect_lessons;
                },
                subjects: function() {
                    return $scope.book_subjects;
                },
                name_of_lecturers: function(){
                    return $scope.name_of_lecturers;
                }
            }
        });
        
        modalInstance.result.then(function(result) {
            // recieve returned data
            $scope.connect_lessons1 = result.connect_lessons;
            $scope.book.subject = result.subject;            
        }, function(err) {
            console.info(err);
        });
      
    }
    
	$scope.generateBookParams = function(){
		return {
			saveType : 'I',
			titleCd : $scope.book.titleCd ? $scope.book.titleCd : 0,
			sjCd : $scope.book.sjCd ? $scope.book.sjCd : 0,
			bookName : $scope.book.bookName ? $scope.book.bookName : null,
			bookMoney : $scope.book.bookMoney ? $scope.book.bookMoney : null,
			publisher : $scope.book.publisher ? $scope.book.publisher : null,
			bookContents : $scope.book.bookContents ? $scope.book.bookContents : [],
			buyUrl : $scope.book.buyUrl ? $scope.book.buyUrl : null,
			author : $scope.book.author ? $scope.book.author : null,
			regUser : $rootScope.current_user.userId,
			updUser : $rootScope.current_user.userId,
			imgArr : [$scope.upload_files],
			connectObj : $scope.connect_lessons1,
			connectLen : $scope.connect_lessons1.length,
			delImgSeqs : ''
		};
	};

	$scope.validate = function(){
		var obj = $scope.book;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.titleCd) == ''){
			$rootScope.showAlert('영역' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.sjCd) == ''){
			$rootScope.showAlert('과목' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.bookName) == ''){
			$rootScope.showAlert('교재명' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.bookMoney) == ''){
			$rootScope.showAlert('교재금액' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.publisher) == ''){
			$rootScope.showAlert('출판사' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.author) == ''){
			$rootScope.showAlert('저자' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.bookContents) == ''){
			$rootScope.showAlert('교재목차' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.buyUrl) == ''){
			$rootScope.showAlert('구매링크' + required_msg.textbox);
			return false;
		}
		return true;
	}
    $scope.saveBook = function(){
    	if ($scope.validate()) {
    		$rootScope.showConfirm('등록하시겠습니까?', function(){
//                $rootScope.showMessage('success', '성공적으로 만든 회사!');
                 // Call api
                var params = $scope.generateBookParams();
                params.saveType = 'I'
    			params.regUser = $rootScope.current_user.userId;
    			$ksHttp.post('BookInfoSave', params).then(function(rs) {
    				rs = JSON.parse(rs);
    				var message = rs[0].message;
    				var status = rs[0].result;
    				if(status == 'succ') $state.go("app.book.book_list");
    				$rootScope.showMessage($rootScope.getMessageType(status), message);
    			}, function(error) {
    				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
    				console.error(error);
    			});           
            }); 
    	}
            
    };

    $scope.updateBook = function(){
    	if ($scope.validate()) {
    		$rootScope.showConfirm('교재를 업데이트 하시겠습니까?', function(){
                var params = $scope.generateBookParams();
                params.saveType = 'U'
                params.bkCd = $scope.book.bkCd;
                params.lectureCnt = $scope.book.lecturecnt;
                params.updUser = $rootScope.current_user.userId;
                if($scope.down_files.is_del == 'Y') {
                	params.delImgSeqs = $scope.down_files.seq;
                }
    			$ksHttp.post('BookInfoSave', params).then(function(rs) {
    				rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);		
    				if(status == 'succ') $state.go("app.book.book_detail", {'id': $scope.book_id});
    			}, function(error) {
    				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
    				console.error(error);
    			});   
    		});
    	}

    }

    $scope.cancelUpdating = function(){
        $rootScope.showConfirm("수정을 취소하시겠습니까?", function(){
        	$state.go("app.book.book_detail", {'id': $scope.book_id});
        });
      }

    $scope.cancel = function(){
        $state.go("app.book.book_list");
    };
    
	$scope.upload_files = {
		curType : 'Book',
		curKey : 'book',
		fileName : '',
		fileNewName : '',
	}

	$scope.down_files = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}
	
	$scope.fileUpload = function() {
		var obj = $scope.book.files;
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
    		    	$rootScope.showMessage(error, '파일등록오류');
    		    }
    		});			
		}
		else {
			$scope.upload_files.fileName = '';
			$scope.upload_files.fileNewName = '';
		}
	}

	$scope.getFile = function() {
		var params = {
			curCd : $scope.book_id
			,curType : 'Book'
		};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			if(arr.length > 0) {
				$scope.down_files = {
					seq : arr[0].seq
					, curKey : arr[0].curKey
					, fileName : arr[0].fileName
					, originalName : arr[0].originalName
					, pathUrl : arr[0].pathUrl
				}
			}
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.error(error);
		});
	}

	$scope.clearDownloadFile = function(idx) {
		$scope.down_files.fileName = '';
		$scope.down_files.originalName = '';
		$scope.down_files.is_del = 'Y';
	}
	
};

function CustomModalController ($ksHttp, $scope, $uibModalInstance, connect_lessons, subjects, name_of_lecturers) {
    $scope.book.connect_lessons = connect_lessons;
    $scope.subjects = subjects;
    $scope.name_of_lecturers = name_of_lecturers;
    $scope.connect_lesson = null;
    $scope.selected_subject = null;
    $scope.selected_name_of_lecture = null;
    
    $scope.init = function() {
    }
    
    $scope.getConnectLesson = function(){
    	var params={
    			sjCd: $scope.selected_subject,
    			tcCd: $scope.selected_name_of_lecture,
    			lectureNm: $scope.lectureNm ? $scope.lectureNm : null
    	}
    	$ksHttp.post('LectureListPopup', params)
    		.then(function(rs){
    			$scope.connect_lessons = JSON.parse(rs);
    		}, function(error){
    			console.error(error);
    		});  
    }; 
    
    $scope.ok = function () {
       var selected_items = $.grep($scope.connect_lessons, function(x,i){ return x.selected;})
        $uibModalInstance.close({subject: $scope.selected_subject,
            connect_lessons: selected_items});       
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};