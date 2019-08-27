"use strict";
app.controller("VideoInsertController", VideoInsertController);

function VideoInsertController($scope, $rootScope, $stateParams, $state, $uibModal, $filter,$ksHttp) {
    $scope.videoInfo_titles = [];
    $scope.videoInfo_subjects = [];
    $scope.subject = null;
    $scope.name_of_lecturers = [];
    $scope.name_of_lecturer = null;
    
    
    $scope.filter = {};
    $scope.filter.cpCd = null;
    $scope.filter.ltCd = null;
    $scope.videoInfo = {};
  
    
    $scope.init = function(){
    	$scope.getCustomerCompanies();
    	$scope.getLectures();    	
    };

    $scope.getCustomerCompanies = function() {
  	  $ksHttp.post('CustomerCompanyListBox', {}).then(function(rs) {
  		  $scope.customer_companies = JSON.parse(rs);
  	  }, function(error) {
  		  console.error(error);
  	  });
    };
    
    $scope.getLectures = function() {
  	  var params = {
  			  cpCd : $scope.filter.cpCd
  	  };
  	  $ksHttp.post('LectureListBox', params).then(function(rs) {
  		  $scope.lectures = JSON.parse(rs);
  	  }, function(error) {
  		  console.error(error);
  	  });
    };
    
    
    
    

    
	$scope.generateVideoParams = function(){
		return {
			ltCd : $scope.filter.ltCd,
			orderNo : $scope.videoInfo.orderNo,
			videoTitle : $scope.videoInfo.videoTitle,
			videoCnts : $scope.videoInfo.videoCnts ? $scope.videoInfo.videoCnts : null,
			fileUrl : $scope.videoInfo.fileUrl,
			fileName : $scope.videoInfo.fileName
		};
	};

	$scope.validate = function(){
		var obj = $scope.videoInfo;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($scope.filter.cpCd == '' || $scope.filter.cpCd == null ){
			$rootScope.showAlert('고객사' + required_msg.dropdown);
			return false;
		}
		
		if($scope.filter.ltCd == '' || $scope.filter.ltCd == null ){
			$rootScope.showAlert('강의명' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.orderNo) == ''){
			$rootScope.showAlert('회차' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.videoTitle) == ''){
			$rootScope.showAlert('제목' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.fileUrl) == ''){
			$rootScope.showAlert('링크주소' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.fileName) == ''){
			$rootScope.showAlert('파일명' + required_msg.textbox);
			return false;
		}		
		return true;
	}
    
	$scope.saveVideo = function(){
    	if ($scope.validate()) {
    		$rootScope.showConfirm('등록하시겠습니까?', function(){
                var params = $scope.generateVideoParams();
                params.saveType = 'I'
    			params.regUser = $rootScope.current_user.userId;
    			$ksHttp.post('LectureVideoSave', params).then(function(rs) {
    				rs = JSON.parse(rs);
    				var message = rs[0].message;
    				var status = rs[0].result;
    				$rootScope.showMessage($rootScope.getMessageType(status), message);
    				if(status == 'succ' ){
    					$scope.videoInfo.orderNo = '';
    					$scope.videoInfo.videoTitle = '';
    					$scope.videoInfo.videoCnts = '';
    					$scope.videoInfo.fileUrl = '';
    					$scope.videoInfo.fileName = '';
    				}    				
    			}, function(error) {
    				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
    				console.error(error);
    			});           
            }); 
    	}
            
    };
    
    $scope.cancel = function(){
        $state.go("app.video.video_list");
    };
};
