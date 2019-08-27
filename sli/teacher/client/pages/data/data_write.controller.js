'use strict';

app.controller('DataWriteController', DataWriteController);

function DataWriteController($scope, $rootScope, $ksHttp, $uibModal, $window, $state, $stateParams) {
	
	$scope.da_cd = $stateParams.id;
	$scope.lectures = [];
	$scope.customer_companies = [];
	$scope.dataList = [];
	$scope.dataInfo = {};
	
	$scope.dataInfo.cpCd = null;
	$scope.dataInfo.ltCd = null;
	$scope.dataInfo.dataTitle = null;
	$scope.dataInfo.dataCnts = null;
	$scope.dataInfo.daCd = null;
	$scope.upload = {};
	
	$scope.file1 = { curType : 'DataInfo', curKey : 'file', orderNo : 1, fileName : '', fileNewName : '' };
	$scope.file2 = { curType : 'DataInfo', curKey : 'file', orderNo : 2, fileName : '', fileNewName : '' };
	$scope.file3 = { curType : 'DataInfo', curKey : 'file', orderNo : 3, fileName : '', fileNewName : '' };
	$scope.file4 = { curType : 'DataInfo', curKey : 'file', orderNo : 4, fileName : '', fileNewName : '' };
	$scope.file5 = { curType : 'DataInfo', curKey : 'file', orderNo : 5, fileName : '', fileNewName : '' };	
	$scope.imgArr = [$scope.file1, $scope.file2, $scope.file3, $scope.file4, $scope.file5];
	
	$scope.checkFiCd = null;
	
	$scope.init = function() {

		if ($scope.da_cd) {
			//$scope.file_id = $scope.da_cd;
			$scope.getDataInfo();
			$scope.getFile();
		}
		$scope.getCustomerCompany();
		$scope.getLectureListBox();
		/*$scope.changeOption();		*/
	};

	$scope.getCustomerCompany = function() {
		var params = {
			shTcCd : $scope.current_user.tcCd
		};
		
		$ksHttp.post('MyCompanyList', params).then(function(rs) {
			$scope.customer_companies = JSON.parse(rs);			
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getLectureListBox = function() {
		var params = {
			tcCd : $scope.current_user.tcCd,
			cpCd :$scope.dataInfo.cpCd 
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lectures = rs;
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.validate = function(){
		var obj = $scope.dataInfo;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.cpCd) == ''){
			$rootScope.showAlert('고객사명을 선택해주세요.');
			return false;
		}
		if($.trim(obj.ltCd) == ''){
			$rootScope.showAlert('강의명을 선택해주세요');
			return false;
		}
		if($.trim(obj.dataTitle) == ''){
			$rootScope.showAlert('제목을 입력해주세요.');
			return false;
		}			
		
		return true;
	};
	
	$scope.generateParams = function() {
		return {
			ltCd : $scope.dataInfo.ltCd == undefined ? null : $scope.dataInfo.ltCd,
			cpCd : $scope.dataInfo.cpCd,
			dataTitle : $scope.dataInfo.dataTitle,
			dataCnts : $scope.dataInfo.dataCnts == undefined ? null : $scope.dataInfo.dataCnts,
			imgArr : $scope.imgArr,
			regUser : $rootScope.current_user.userId,
			updUser : $rootScope.current_user.userId,
			regUserType : 'T',
			updUserType : 'T'
		}
	}

	$scope.saveDataInfo = function() {
		if($scope.validate()){
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params= $scope.generateParams();
				params.saveType= 'I';
				$ksHttp.post('DataInfoSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go('app.data.list') : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				});
				
			}, function(error) {
				$rootScope.showMessage('danger', error);				
			});
		}
		
	};
	
	$scope.getDataInfo = function() {
    	
		$ksHttp.post('DataInfoDetail', {daCd: $scope.da_cd}).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.dataInfo = rs[0];				
			}
		}, function(error) {
			$rootScope.showMessage('danger', 'error');
		});
	};

	$scope.updateDataInfo = function() {
		if($scope.validate()){
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params= $scope.generateParams();
				params.saveType= 'U';
				params.daCd= $scope.da_cd;
				
				var tmp = new Array();
				for( var i=0; i< $scope.dataList.length; i++ ){
					if( $scope.dataList[i].is_del == 'Y' ){
						tmp.push($scope.dataList[i].seq);
					}
				}
				if(tmp.length > 0) params.delImgSeqs = tmp.join(',');
				 
				$ksHttp.post('DataInfoSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					status == 'succ' ? $state.go('app.data.list') : $state.reload();
				}, function(error) {
					$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				});
			});
		}
	};
	
	$scope.cancelUpdating = function() {
		var msg = $scope.lecture_id ? '편집을 취소 하시겠습니까?' : '등록을 취소 하시겠습니까?';
		$rootScope.showConfirm(msg, function() {
			$state.go("app.data.list");
		});
	};
		
	$scope.fileUpload = function(num) {
		var tmpObj = null;
		if( num == 0 ){
			tmpObj = $scope.upload.file1;
		}else if( num == 1 ){
			tmpObj = $scope.upload.file2;
		}else if( num == 2 ){
			tmpObj = $scope.upload.file3;
		}else if( num == 3 ){
			tmpObj = $scope.upload.file4;
		}else if( num == 4 ){
			tmpObj = $scope.upload.file5;
		}
				
		if(tmpObj.length > 0) {
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', tmpObj[0]);
        	
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
    		    	$scope.imgArr[num].fileName = data.fineName;
    		    	$scope.imgArr[num].fileNewName = data.fileNewName;    		    	
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage('파일등록오류', "error");
    		    }
    		});			
		}
		else {
			$scope.imgArr[num].fileName = '';
			$scope.imgArr[num].fileNewName = '';
		}
	};
	
	$scope.getFile = function() {
		var params = {
				curCd : $scope.da_cd
				,curType : 'DataInfo'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {			
			$scope.dataList = JSON.parse(rs);			
		}, function(error) {			
			$rootScope.showMessage('error', "파일읽기 오류");
		});
	}
	
	$scope.clearDownloadFile = function(idx) {
		
		$scope.dataList[idx].fileName = "";
		$scope.dataList[idx].originalName = "";
		$scope.dataList[idx].is_del = "Y";			
	}
	
	$scope.changeCompany = function(){		
		var current_lecture = null;
		if($scope.dataInfo.ltCd)
		{
			current_lecture = $.grep($scope.lectures, function(x,i){return x.ltCd == $scope.dataInfo.ltCd})[0];
			$scope.dataInfo.cpCd = current_lecture.cpCd;
		}
	}
};