'use strict';

app.controller('TeacherCertificationController', TeacherCertificationController);
app.controller('TeacherCertificationPopupController', TeacherCertificationPopupController);
function TeacherCertificationController($scope, $rootScope, $ksHttp, $uibModal) {
    
	$scope.current_page = 1;
	$scope.total_cnt = 0;
	$scope.total_pages = 0;
	$scope.startPage = 1;
	$scope.endPage = 10;
	$scope.certificate_list = [];
		
    $scope.init = function(){
    	$scope.getCertificateListCnt();
    }
    
    $scope.getCertificateListCnt = function(){
    	
    	$ksHttp.post('CertificateListCnt', {userId: $rootScope.current_user.userId}).then(function(rs) {
			rs = JSON.parse(rs)
			if (rs && rs.length > 0) {
				$scope.total_cnt = rs[0].totalCnt;
				$scope.total_pages = Math.ceil($scope.total_cnt / $scope.app.page_size);
			}
		}, function(error) {
			console.error(error);
		});
    }
    
    $scope.getCertificateList = function(){
    	var params ={
    		userId: $rootScope.current_user.userId,
    		startPage : $scope.startPage,
			endPage : $scope.endPage
    	}
    	
    	$ksHttp.post('CertificateList', params).then(function(rs){
    		rs = JSON.parse(rs);
    		if( $scope.certificate_list.length > 0 ){
				for(var i=0; i<rs.length; i++ ){
					$scope.certificate_list.push(rs[i]);
				}				
			}else{
				$scope.certificate_list = rs;
			}    		
    	}, function(error){
    		console.error(error);
    	});
    }
    
    $scope.openTeacherCertificationPopup = function()
    {
    	var teacherCertificationPopup = $uibModal.open({
    		templateUrl: 'TeacherCertificationPopup',
    		controller: 'TeacherCertificationPopupController',
    		windowClass: 'app-modal-window',
    		scope: $scope
    	})
    	teacherCertificationPopup.result.then(function(rs){
    		
    	}, function(err){
    		console.info(err);
    	});
    }
    
    $scope.$watch('current_page', function() {
    	$scope.getCertificateList();
	});

	$scope.setCurrentPage = function(page) {
		$scope.current_page = page;
	};

	$scope.nextPageClick = function() {
		if ($scope.current_page < $scope.total_pages){
			$scope.current_page += 1;
			$scope.startPage = ($scope.current_page * $scope.app.page_size) - 9;
			$scope.endPage = $scope.current_page * $scope.app.page_size;
			
		}else{
			$scope.current_page = $scope.total_pages;
			$rootScope.showAlert('더 이상 목록이 존재하지 않습니다.');
			$(".btnMoreList").hide();
		}
	};   
}

function TeacherCertificationPopupController($state, $scope, $ksHttp, $rootScope, $uibModalInstance)
{
	$scope.certificate = {};
	$scope.init = function()
	{
		$scope.getCertificateTypes();
	}
	
	$scope.saveCertificate = function()
	{
		var params = {
		  saveType : 'I'
		  ,certificateType : $scope.certificate.certificateType
		  ,issueCnts : $scope.certificate.issueCnts
		  ,requestDt : $scope.certificate.requestDt
		  ,regUser : $rootScope.current_user.userId
		}
		$ksHttp.post('CertificateSave', params).then(function(rs){
			rs = JSON.parse(rs);
			var message = rs[0].message;
			var status = rs[0].result;
			$rootScope.showMessage($rootScope.getMessageType(status), message);
			$state.reload();
		}, function(error){
			$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
			console.error(error);
		});
	}
	
	$scope.getCertificateTypes = function() {
		var params = {
			groupId : 'CERTIFICATE_TYPE'
		};
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.certificate_types = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
}