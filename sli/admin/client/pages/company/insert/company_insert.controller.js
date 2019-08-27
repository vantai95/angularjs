"use strict";

app.controller("CompanyInsertController", CompanyInsertController);

function CompanyInsertController($scope, $rootScope, $state, $stateParams, $ksHttp, $uibModal) {
	$scope.memberships = [];
	$scope.corporate_modes = [];
	$scope.contacts = [];
	$scope.accountings = [];
	$scope.sales = [];
	$scope.logoFile = {};
	$scope.bannerFile = {};
	$scope.contact = null;
	$scope.company = {};
	$scope.company_id = null;
	$scope.company.compStatus = null;
	$scope.company.compType = null;
	$scope.company.compNm = null;
	$scope.company.cpCd = null;
	$scope.company.sliCsId = null;
	$scope.company.accountType = null;
	$scope.company.sliSaId = null;
	$scope.company.cnts = null;
	$scope.company.url = null;
	$scope.company.color = null;
	
	$scope.upload_logo = {
		curType : 'Company',
		curKey : 'logo',
		fileName : '',
		fileNewName : '',
	};
	$scope.upload_banner = {
		curType : 'Company',
		curKey : 'banner',
		fileName : '',
		fileNewName : '',
	};

	$scope.logoFile = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}

	$scope.bannerFile = {
		seq : ''
		, curKey : ''
		, pathServer : ''
		, fileName : ''
		, originalName : ''
		, pathUrl : ''
		, is_del : 'N'
	}
	
	$scope.init = function() {
		if ($stateParams.id) {
			$scope.company_id = $stateParams.id;
			$scope.getCompany();
			$scope.getFile();
		}else{
			$scope.getContacts();
		}

		$scope.getMemberships();
		$scope.getCorporateModes();
		$scope.getAccountings();
		$scope.getSales();
	};

	$scope.getCompany = function() {
		var params = {
			cpCd : $scope.company_id
		};
		
		$ksHttp.post('CustomerCompanyDetail', params).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.company = rs[0];
				$scope.getContacts();
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getMemberships = function() {
		var params = {
			groupId : 'COMP_STATUS'
		}
		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.memberships = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getCorporateModes = function() {
		var paramMap = {
			groupId : 'COMP_TYPE'
		}
		$ksHttp.post('CodeList', paramMap).then(function(rs) {
			$scope.corporate_modes = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getContacts = function() {
		var params = {
			arCd : 1001
		}
		$ksHttp.post('AdminGroupUserList', params).then(function(rs) {
			$scope.contacts = JSON.parse(rs);
			$scope.setCompanyContact();
		}, function(error) {
			console.error(error);
		})
	};

	$scope.getAccountings = function() {
		var paramMap = {
			groupId : 'ACCOUNT_TYPE'
		}
		$ksHttp.post('CodeList', paramMap).then(function(rs) {
			$scope.accountings = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
	};

	$scope.getSales = function() {
		var params = {
			arCd : 1002
		}
		$ksHttp.post('AdminGroupUserList', params).then(function(rs) {
			$scope.sales = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		})
	};
	
	$scope.setCompanyContact = function(){
		if($scope.company.sliCsId){
			var contacts = $.grep($scope.contacts, function(x, i){ return x.userId == $scope.company.sliCsId});

			if(contacts.length > 0){
				var contact = contacts[0];
				$scope.company.sliCsMobile = contact.mobile;
				$scope.company.sliCsEmail = contact.email;
			}
		}
	};

	$scope.validate = function() {
		var comp = $scope.company;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(comp.compStatus) == ''){
			$rootScope.showAlert('회원구분' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(comp.compType) == ''){
			$rootScope.showAlert('기업모드' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(comp.compNm) == ''){
			$rootScope.showAlert('업체명' + required_msg.textbox);
			return false;
		}
		
		if($.trim(comp.sliCsId) == ''){
			$rootScope.showAlert('고객사 담당자' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(comp.url) == ''){
			$rootScope.showAlert('고객사 URL' + required_msg.textbox);
			return false;
		}
		
		if($.trim(comp.color) == ''){
			$rootScope.showAlert('대표 색상' + required_msg.textbox);
			return false;
		}

		return true;
	};
	
	$scope.generateCompanyParams = function(){
		return {
			compStatus : $scope.company.compStatus,
			compType : $scope.company.compType,
			compNm : $scope.company.compNm,
			cpCd : $scope.company.cpCd,
			sliCsId : $scope.company.sliCsId,
			accountType : $scope.company.accountType,
			sliSaId : $scope.company.sliSaId,
			cnts : $scope.company.cnts,
			url : $scope.company.url,
			color : $scope.company.color,
			regUser: $rootScope.current_user.userId,
			imgArr : [$scope.upload_logo, $scope.upload_banner],
			delImgSeqs : ''
		};
	};

	$scope.saveCompany = function() {
		if ($scope.validate()) {
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateCompanyParams();
				
				$ksHttp.post('CustomerInsertCompany', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$state.go("app.company.list");
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
	};

	$scope.updateCompany = function() {
		if ($scope.validate()) {
			$rootScope.showConfirm('회사를 업데이트 하시겠습니까?', function() {
				var params = $scope.generateCompanyParams();

				var tmp = new Array();
				if($scope.logoFile.is_del == 'Y') tmp.push($scope.logoFile.seq);
				if($scope.bannerFile.is_del == 'Y') tmp.push($scope.bannerFile.seq);

				if(tmp.length > 0) params.delImgSeqs = tmp.join(',');
				
				$ksHttp.post('CustomerUpdateCompany', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					$state.go("app.company.list");
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
	};

	$scope.cancelUpdating = function() {
		var msg = $scope.company_id ? '편집을 취소 하시겠습니까?' : '등록을 취소 하시겠습니까?';
		$rootScope.showConfirm(msg, function() {
			$state.go("app.company.view", {id:$scope.company_id});
		});
	};
	
	$scope.logoUpload = function() {
		if($scope.company.logos.length > 0) {
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', $scope.company.logos[0]);
        	
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
    		    	$scope.upload_logo.fileName = data.fineName;
    		    	$scope.upload_logo.fileNewName = data.fileNewName;
    		    	
    		    	console.log($scope.upload_banner);
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage('파일등록오류', error);
    		    }
    		});			
		}
		else {
			$scope.upload_banner.fileName = '';
			$scope.upload_banner.fileNewName = '';
		}
	};
	
	$scope.bannerUpload = function() {
		if($scope.company.banners.length > 0) {
        	var fileForm = new FormData();
        	fileForm.append('uploadedfile', $scope.company.banners[0]);
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
    		    	console.log(data);
    		    	$scope.upload_banner.fileName = data.fineName;
    		    	$scope.upload_banner.fileNewName = data.fileNewName;
    		    	
    		    	console.log($scope.upload_banner);
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage(error, '파일등록오류');
    		    }
    		});			
		}
		else {
			$scope.upload_banner.fileName = '';
			$scope.upload_banner.fileNewName = '';
		}
	}
	
	$scope.getFile = function() {
		var params = {
				curCd : $scope.company_id
				,curType : 'Company'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			console.log(rs);
			for( var i=0; i< arr.length; i++ ){
				if(arr[i].curKey == "logo" ){
					$scope.logoFile = {
						seq : arr[i].seq
						, curKey : arr[i].curKey
						, pathServer : arr[i].pathServer
						, fileName : arr[i].fileName
						, originalName : arr[i].originalName
						, pathUrl : arr[i].pathUrl
					}
					
				}else if(arr[i].curKey == "banner" ){
					$scope.bannerFile = {
						seq : arr[i].seq
						, curKey : arr[i].curKey
						, pathServer : arr[i].pathServer
						, fileName : arr[i].fileName
						, originalName : arr[i].originalName													
						, pathUrl : arr[i].pathUrl
					}
				}
			}
			console.log($scope.logoFile);
			console.log($scope.bannerFile);
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.error(error);
		});
	}
	
	$scope.clearDownloadFile = function(idx) {
		if(idx == 'logo') {
			$scope.logoFile.fileName = '';
			$scope.logoFile.originalName = '';
			$scope.logoFile.is_del = 'Y';
		}
		else if(idx == 'banner') {
			$scope.bannerFile.fileName = '';
			$scope.bannerFile.originalName = '';
			$scope.bannerFile.is_del = 'Y';
		}
	}
};

