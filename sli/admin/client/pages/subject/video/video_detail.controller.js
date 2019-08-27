"use strict";
app.controller("VideoDetailController", VideoDetailController);
app.controller("CustomModalController", CustomModalController);
function VideoDetailController($scope, $rootScope, $stateParams,$http,$state,$ksHttp, $uibModal) {
    
	$scope.video_id =$stateParams.id;
	$scope.videoInfo = null;
    $scope.videoList = [];
    $scope.total_video = 0;
    $scope.total_pages = 0;
    $scope.current_page = 1; 
    
    $scope.init = function(){
    	if(!$stateParams.id){
            $state.go("app.video.video_list",{error: true, err_msg: 'something wrong happened'});
        } else{
        	$scope.getVideoDetail($scope.video_id);
        	$scope.getVideoListCnt($scope.video_id);
        }
    };
    $scope.getVideoDetail = function(id){
        if(id){
        	var params = {
            		ltCd: id			  	  
            	}
		    $ksHttp.post('LectureVideoDetail', params)
			  	.then(function(rs){
			  		rs = JSON.parse(rs);
			  		$scope.videoInfo = rs[0];
			  	}, function(error){
			  		console.error(error);
			  	})            
        }
    }
    
    $scope.getVideoListCnt = function(id){
        if(id){
        	var params = {
            		ltCd: id			  	  
            	}
		    $ksHttp.post('LectureDetailVideoListCnt', params)
			  	.then(function(rs){
			  		rs = JSON.parse(rs);
			  		if(rs && rs.length > 0){
						$scope.total_video = rs[0].totalCnt;
						$scope.total_pages = Math.ceil($scope.total_video/$scope.app.page_size);
						$scope.getVideoList();
					}
			  	}, function(error){
			  		console.error(error);
			  	})            
        }
    }
    
    $scope.getVideoList = function(){
    	if($scope.video_id){
    		var start_page = $scope.current_page == 1 ? 1 : ($scope.current_page - 1) * $scope.app.page_size + 1;
    		var end_page = $scope.current_page * $scope.app.page_size;
        	var params = {
            		ltCd: $scope.video_id,
            		startPage: start_page,
      			  	endPage: end_page
            	}
		    $ksHttp.post('LectureDetailVideoList', params)
			  	.then(function(rs){
			  		$scope.videoList = JSON.parse(rs);
			  		angular.forEach($scope.videoList, function(value, key) {
						value.checked = true;
					});			  		
			  	}, function(error){
			  		console.error(error);
			  	})            
        }
    }
    
    $scope.deleteVideo = function(seq){
    	
    	$rootScope.showConfirm('삭제하시겠습니까?', function() {
    		var params = {
            		seq : seq
            		,saveType : 'D'
            	}
			
			$ksHttp.post('LectureVideoSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				$state.reload();
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
    	
    	if(id){
        	var params = {
            		ltCd: id			  	  
            	}
		    $ksHttp.post('LectureDetailVideoList', params)
			  	.then(function(rs){
			  		$scope.videoList = JSON.parse(rs);
			  		angular.forEach($scope.videoList, function(value, key) {
						value.checked = true;
					});			  		
			  	}, function(error){
			  		console.error(error);
			  	})            
        }
    }
    
    $scope.openPopup = function(item){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "custom_modal.html",
            controller: "CustomModalController",
            windowClass: "app-modal-window",
            scope: $scope,
            resolve: {
                item : item
            }
        });
    }
    
    $scope.$watch('current_page', function(){
    	$scope.getVideoList();
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
}

function CustomModalController ($ksHttp, $scope, $uibModalInstance, $rootScope, item) {
	
	$scope.pop_orderNo = item.orderNo;
	$scope.pop_videoTitle = item.videoTitle;
	$scope.pop_videoCnts = item.videoCnts;
	$scope.pop_fileUrl = item.fileUrl;
	$scope.pop_fileName = item.fileName;
	
	$scope.saveModify = function () {
		
		if ($scope.validate()) {
			var params = {
	        		saveType : 'U'
	        		, ltCd: $scope.video_id
	        		, seq : item.seq
	        		, orderNo : $scope.pop_orderNo
	        		, videoTitle : $scope.pop_videoTitle
	        		, videoCnts : $scope.pop_videoCnts
	        		, fileUrl : $scope.pop_fileUrl
	        		, fileName : $scope.pop_fileName
	        		, updUser : $rootScope.current_user.userId
	        	}
			
			$ksHttp.post('LectureVideoSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showAlert(message);
				
				item.orderNo = $scope.pop_orderNo;
				item.videoTitle = $scope.pop_videoTitle;
				item.videoCnts = $scope.pop_videoCnts;
				item.fileUrl = $scope.pop_fileUrl;
				item.fileName = $scope.pop_fileName;				
				
				if( status == 'succ'){
					$uibModalInstance.dismiss('cancel');
				}
			}, function(error) {
				$rootScope.showAlert('[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		}
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.validate = function(){
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim($scope.pop_orderNo) == ''){
			$rootScope.showAlert('회차' + required_msg.textbox);
			return false;
		}		
		if($.trim($scope.pop_videoTitle) == ''){
			$rootScope.showAlert('제목' + required_msg.textbox);
			return false;
		}		
		if($.trim($scope.pop_fileUrl) == ''){
			$rootScope.showAlert('링크주소' + required_msg.textbox);
			return false;
		}		
		if($.trim($scope.pop_fileName) == ''){
			$rootScope.showAlert('파일명' + required_msg.textbox);
			return false;
		}		
		return true;
	}
}