'use strict';

app.controller('TeacherInsertCtrl', TeacherInsertCtrl);
app.controller('TeacherDetailPopUpController', TeacherDetailPopUpController);
app.controller('SavePopUpController', SavePopUpController);
app.controller('UpdatePopUpController', UpdatePopUpController);

var scope = null;

function TeacherInsertCtrl($scope, $state, $stateParams, dateFilter, $rootScope, $ksHttp, $uibModal ) {
    $scope.teacher = {};
    $scope.nationalities = [];
    $scope.email_servers = [];
    $scope.subjects = [];
    $scope.managers = [];
    $scope.all_lecture_areas = false;
    $scope.scores = [];
    $scope.lecture_areas = [];
    $scope.bank_cds = [];
	$scope.teacher_id = $stateParams.id;
	$scope.contracts = [];
	$scope.subArea = {};
	$scope.subArea.select_sido = null;
	$scope.subArea.select_gugun = null;
	$scope.subArea.subAreaYn = 'N';
	$scope.sido_list = [];
	$scope.gugun_list = [];
	$scope.gugun_target_list = [];
	$scope.gugun_cd_list = [];
    
	$scope.files = [];
	$scope.files['photo'] = null;
	$scope.files['contract'] = null;
	$scope.files['resume'] = null;
	$scope.files['idcard'] = null;
	$scope.files['bankbook'] = null;
	
	$scope.upload_files = [];
	$scope.upload_files['photo'] = {
		curType : 'Teacher',
		curKey : 'photo',
		fileName : '',
		fileNewName : '',
	}

	$scope.upload_files['contract'] = {
		curType : 'Teacher',
		curKey : 'contact',
		fileName : '',
		fileNewName : '',
	}

	$scope.upload_files['resume'] = {
		curType : 'Teacher',
		curKey : 'resume',
		fileName : '',
		fileNewName : '',
	}
	
	$scope.upload_files['idcard'] = {
		curType : 'Teacher',
		curKey : 'idcard',
		fileName : '',
		fileNewName : '',
	}

	$scope.upload_files['bankbook'] = {
		curType : 'Teacher',
		curKey : 'bankbook',
		fileName : '',
		fileNewName : '',
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
	
	//강사 점수
	$scope.article_list1;
	$scope.article_list2;
	$scope.article_list3;
	$scope.article_list4;
	$scope.article_list5;
	$scope.article_list6;
	$scope.article_list7;
	$scope.article_obj = {};
	$scope.article_total = 0;
	
	$scope.init = function(){
    	scope = $scope;
    	$(".date").datepicker({
    		format : "yyyy-mm-dd",
    		autoclose: true
    	});
    	$(".date").attr("readonly","readonly");
		$(".date").css("background-color", "#fff");
		$(".date input").attr("readonly","readonly");
		$(".date input").css("background-color", "#fff");
		if ($stateParams.id) {
			$scope.getTeacher();
			$scope.getFile();
			$scope.teacher_id = $stateParams.id;
		}
		$scope.getScores();
    	$scope.getNationalities();
    	$scope.getEmailServers();
    	$scope.getSubjects();
        $scope.getManagers();
    	$scope.getLectureAreas();
        $scope.getBankCds();
        $scope.getSidoList();
        $scope.getTeacherJudge();
    };
    
    $scope.getScores = function(){
    	for(var i = 0; i <= 5; i = i + 0.1)
		{
    		$scope.scores.push(i.toFixed(1));
		}
    };
    
    $scope.foucusBirthday = function(key, val){
    	if(val == undefined || val == '' || val == null)
    		return;
    	
    	if(key == 'year' && val.length >= 4){
    		$('[ng-model="teacher.birthday_month"]').focus();
			$scope.teacher.birthday_year = val.substring(0, 4);
    	}

    	if(key == 'month' && val.length >= 2){
    		$('[ng-model="teacher.birthday_day"]').focus();
			$scope.teacher.birthday_month = val.substring(0, 2);
    	}
    	
    	if(key == 'day' && val.length >= 2){
			$scope.teacher.birthday_day = val.substring(0, 2);
    	}
    };
    
    $scope.getTeacher = function() {
		var params = {
			tcCd: $scope.teacher_id,
			userId: $rootScope.current_user.userId
		};
		
		$ksHttp.post('TeacherUserDetail', params).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.teacher = rs[0];
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
					
					$.each($scope.email_servers, function(x, i){
						if(x.codeId == email[1]){
							$scope.teacher.email_server = x.codeId;
							return false;
						}
					});
					
				}
				
				$scope.teacher.lectureArea = $scope.teacher.lectureArea.split(',');
		        var total = $scope.lecture_areas.length;
		        $scope.all_lecture_areas = total > 0 && $scope.teacher.lectureArea.length == total;
		        if($scope.teacher.score % 1 == 0)
	        	{
		        	$scope.teacher.score = $scope.teacher.score + '.0';	
	        	}
		        $scope.teacher.score = $scope.teacher.score.toString();
		        
		        //강의세부지역 세팅
		        $scope.setLectureSubArea();
			}
		}, function(error) {
			console.error(error);
		});
	};

    $scope.getNationalities = function(){
    	var params = {
			groupId : 'NATIONAL_TYPE'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.nationalities = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
    };
    
    $scope.getEmailServers = function(){
    	var params = {
			groupId: 'EMAIL'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.email_servers = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
    };
    
    $scope.getSubjects = function(value){
    	$ksHttp.post('SubjectMasterList', {}).then(function(rs) {
			$scope.subjects = $.parseJSON(rs);
		}, function(error) {
			console.error(error);
		});
    };

    $scope.getManagers = function(value){
    	$ksHttp.post('AdminGroupUserList', {}).then(function(rs) {
			$scope.managers = $.parseJSON(rs);
		}, function(error) {
			console.error(error);
		});
    };

    $scope.selectLectureArea = function(value){
        var temp = $scope.teacher.lectureArea;
        if(temp == null)
            temp = [];
        
        if(temp.indexOf(value) < 0)
            temp.push(value);
        else
            temp.splice(temp.indexOf(value),1);
        $scope.teacher.lectureArea = temp;
        
        var total = $scope.lecture_areas.length;
        $scope.all_lecture_areas = total > 0 && $scope.teacher.lectureArea.length == total;
        
        var acBool = false;
        for( var i=0; i<$scope.teacher.lectureArea.length; i++){
        	if(Number($scope.teacher.lectureArea[i]) == 1 || Number($scope.teacher.lectureArea[i]) == 2){
        		acBool = true;
        		break;
        	}
        }
        if( acBool ){
        	$scope.subArea.subAreaYn = 'Y';
        }else{
        	$scope.subArea.subAreaYn = 'N';
        }
    };
    
    $scope.selectAllLectureAreas = function(){
		$scope.teacher.lectureArea = [];
		
    	if($scope.all_lecture_areas){
    	  $.each($scope.lecture_areas, function(i, x){ $scope.teacher.lectureArea.push(x.codeId);});
    	  
    	  $scope.subArea.subAreaYn = 'Y';
    	}else{
    		$scope.subArea.subAreaYn = 'N';
    	}

    };
    
    $scope.getLectureAreas = function(){
    	var params = {
			groupId: 'LECTURE_AREA'
		};

		$ksHttp.post('CodeList', params).then(function(rs) {
			$scope.lecture_areas = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
    };

    $scope.getBankCds = function()
    {
    	var paramMap = {
			groupId : 'BANK_CD'
		}
    	
		$ksHttp.post('CodeList', paramMap).then(function(rs) {
			$scope.bank_cds = JSON.parse(rs);
		}, function(error) {
			console.error(error);
		});
    }
    
    $scope.getSidoList = function()
    {
    	var paramMap = {
			groupId : 'SIDO'
		}
    	
		$ksHttp.post('CodeList', paramMap).then(function(rs) {
			$scope.sido_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
    }
    
    $scope.gugunList = function()
    {
    	var paramMap = {
    		sidoCd : $scope.subArea.select_sido
		}
		$ksHttp.post('GugunList', paramMap).then(function(rs) {
			$scope.gugun_list = JSON.parse(rs);
		}, function(error) {
			console.log(error);
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
    
    $scope.validate = function(saveType) {
		var obj = $scope.teacher;
		var required_msg = $scope.$parent.app.required_msg;
		
		if($.trim(obj.userName) == '' || $.trim(obj.nickName) == ''){
			$rootScope.showAlert('이름' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.nationalType) == ''){
			$rootScope.showAlert('국적' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.birthday_year) == '' || $.trim(obj.birthday_month) == '' || $.trim(obj.birthday_day) == ''){
			$rootScope.showAlert('생년월일' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.gender) == ''){
			$rootScope.showAlert('성별' + required_msg.dropdown);
			return false;
		}
		
		if($.trim(obj.mobile) == ''){
			$rootScope.showAlert('휴대폰번호' + required_msg.textbox);
			return false;
		}
		var regExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
		if(regExp.test(obj.mobile)){ 
			//return true; 
		} else { 
			$rootScope.showAlert('올바른 휴대폰번호를 입력해주세요.');
			return false;
		}
		
		if( 'I' == saveType ){
			if($.trim(obj.number_social) == '' || $.trim(obj.foreigner_registration_number) == '' ){
				$rootScope.showAlert('주민번호' + required_msg.textbox);
				return false;
			}
		}
		
		if($.trim(obj.email_user_name) == '' || ($.trim(obj.email_domain) == '' && $.trim(obj.email_server) == '')){
			$rootScope.showAlert('이메일' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.userId) == ''){
			$rootScope.showAlert('아이디' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.userPw) == ''){
			$rootScope.showAlert('비밀번호' + required_msg.textbox);
			return false;
		}
		
		if($.trim(obj.subjectCd) == ''){
			$rootScope.showAlert('담당과목' + required_msg.dropdown);
			return false;
		}
		
		return true;
	};
	
	$scope.generateTeacherParams = function(){
		var obj = $scope.teacher;
		var lectures = obj.lectureArea ? obj.lectureArea.join(',') : '';
		obj.birthday = obj.birthday_year + '-' + obj.birthday_month + '-' + obj.birthday_day;
		obj.email = obj.email_user_name + '@' + (obj.email_server ? obj.email_server : obj.email_domain);
		
		//강의세부지역
		var lectureSubArea = "";
		for( var i=0; i< $scope.gugun_target_list.length; i++){
			if( i == 0 ){
				lectureSubArea += $scope.gugun_target_list[i].gugunCd;
			}else{
				lectureSubArea += ","+$scope.gugun_target_list[i].gugunCd;
			}			
		}
		
		return {
				saveType: 'I',
				userName: obj.userName ? obj.userName : null,
				nickName: obj.nickName ? obj.nickName : null,
			    nationalType: obj.nationalType ? obj.nationalType : null,
			    birthday: obj.birthday ? obj.birthday : null,
			    gender: obj.gender ? obj.gender : null,
			    mobile: obj.mobile ? obj.mobile : null,
			    postNo: obj.postNo ? obj.postNo : null,
			    addr: obj.addr ? obj.addr : null,
			    dtlAddr: obj.dtlAddr ? obj.dtlAddr : null,
			    email: obj.email ? obj.email : null,
			    userId: obj.userId ? obj.userId : 0,
			    userPw: obj.userPw ? obj.userPw : null,
			    subjectCd:  obj.subjectCd ? obj.subjectCd : 0,
			    sliId:  obj.sliId ? obj.sliId : 0,
			    lectureArea: lectures,
			    career:  obj.career ? obj.career : null,
			    visa:  obj.visa ? obj.visa : null,
			    visaExpireDt: obj.visaExpireDt ? obj.visaExpireDt : null,
			    score: obj.score ? obj.score : 0.0,
			    bankCd: obj.bankCd ? obj.bankCd : null,
			    bankAccount: obj.bankAccount ? obj.bankAccount : null,
			    bankHolder: (obj.bankHolder ? obj.bankHolder : obj.userName),
			    cnts: obj.cnts ? obj.cnts : null,
			    juminNum: obj.number_social + '-' + obj.foreigner_registration_number,
			    regUser : $rootScope.current_user.userId,
			    updUser : $rootScope.current_user.userId,
				imgArr : [$scope.upload_files['photo'], $scope.upload_files['resume'], $scope.upload_files['idcard'], $scope.upload_files['bankbook']],
				delImgSeqs : '',
				lectureSubArea : lectureSubArea,
				aticleParam : $scope.getArticleParam()
		};
	};

	$scope.saveTeacher = function() {
		if ($scope.validate('I')) {
			$rootScope.showConfirm('등록하시겠습니까?', function() {
				var params = $scope.generateTeacherParams();
				params.regUser = $rootScope.current_user.userId;
				
				$ksHttp.post('TeacherSave', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					if(status == 'succ') $state.go("app.teacher.list"); //$state.reload();
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
	};

	$scope.updateTeacher = function() {
		if ($scope.validate('U')) {
			$rootScope.showConfirm('수정하시겠습니까?', function() {
				var params = $scope.generateTeacherParams();
				params.saveType = 'U';
				params.tcCd = $scope.teacher_id;
				params.updUser = $rootScope.current_user.userId;
				params.juminNum = $scope.teacher.juminNum;
				var tmp = new Array();
				if($scope.down_files['photo'].is_del == 'Y') tmp.push($scope.down_files['photo'].seq);
				if($scope.down_files['idcard'].is_del == 'Y') tmp.push($scope.down_files['idcard'].seq);
				if($scope.down_files['bankbook'].is_del == 'Y') tmp.push($scope.down_files['bankbook'].seq);
				if($scope.down_files['resume'].is_del == 'Y') tmp.push($scope.down_files['resume'].seq);

				if(tmp.length > 0) params.delImgSeqs = tmp.join(',');

				$ksHttp.post('TeacherUpdate', params).then(function(rs) {
					rs = JSON.parse(rs);
					var message = rs[0].message;
					var status = rs[0].result;
					$rootScope.showMessage($rootScope.getMessageType(status), message);
					if(status == 'succ') $state.go("app.teacher.list"); // : $state.reload();
				}, function(error) {
					$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
					console.error(error);
				});
			});
		}
	};

	$scope.cancelUpdating = function() {
		var msg = $scope.teacher_id ? '강사 정보 수정을 취소하시겠습니까?' : '강사 등록을 취소하시겠습니까?';
		$rootScope.showConfirm(msg, function() {
			$state.go("app.teacher.detail", {'id':$stateParams.id});
		});
	};

	$scope.getFile = function() {
		var params = {
				curCd : $scope.teacher_id
				,curType : 'Teacher'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			//console.log(rs);
			for( var i=0; i< arr.length; i++ ){
				$scope.down_files[arr[i].curKey] = {
					seq : arr[i].seq
					, curKey : arr[i].curKey
					, fileName : arr[i].fileName
					, originalName : arr[i].originalName
					, pathUrl : arr[i].pathUrl
				}
			}
			//console.log($scope.logoFile);
			//console.log($scope.bannerFile);
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.error(error);
		});
	}
	
	$scope.fileUpload = function(idx) {
		var obj = $scope.files[idx];
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
    		    	console.log(data);
    		    	$scope.upload_files[idx].fileName = data.fineName;
    		    	$scope.upload_files[idx].fileNewName = data.fileNewName;
    		    	
    		    	console.log($scope.upload_files[idx]);
    		    },
    		    error: function (res, status, error) {
    		    	$rootScope.showMessage(error, '파일등록오류');
    		    }
    		});			
		}
		else {
			$scope.upload_files[idx].fileName = '';
			$scope.upload_files[idx].fileNewName = '';
		}
	}

	$scope.clearDownloadFile = function(idx) {
		$scope.down_files[idx].fileName = '';
		$scope.down_files[idx].originalName = '';
		$scope.down_files[idx].is_del = 'Y';
	}
	
	$scope.execDaumPostcode = function() {
		$('#daum_wrap').show();
		var element_layer = document.getElementById('layer');
		new daum.Postcode({
			shorthand : false,
			oncomplete: function(data) {
				var addr = data.roadAddress;
				if(addr == '') {
					addr = data.roadAddress
				}
				$scope.teacher.postNo = data.zonecode;
				$scope.teacher.addr = data.roadAddress;
				$scope.$apply();
			},
			onclose: function() {
				element_layer.style.display = 'none';
				$('#daum_wrap').hide();
			},
            width : '100%',
            height : '100%',
            maxSuggestItems : 5
		}).embed(element_layer);
		element_layer.style.display = 'block';
		var width = 400; //우편번호서비스가 들어갈 element의 width
        var height = 500; //우편번호서비스가 들어갈 element의 height
        var borderWidth = 1; //샘플에서 사용하는 border의 두께

        // 위에서 선언한 값들을 실제 element에 넣는다.
        element_layer.style.width = width + 'px';
        element_layer.style.height = height + 'px';
        element_layer.style.border = borderWidth + 'px solid';
        // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
        element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
        element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
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
				console.error(error);
		  });
	}
	
	$scope.addAreaGugun = function(){
		var bool = true;
		if( "" == $scope.subArea.select_gugun || null == $scope.subArea.select_gugun) {
			
		}else{
			for( var i=0; i< $scope.gugun_target_list.length; i++){
				if( $scope.gugun_target_list[i].gugunCd == $scope.subArea.select_gugun.gugunCd ){
					$rootScope.showMessage('error', "동일한 지역이 존재합니다.");
					bool = false;
					break;
				}
			}
			if( bool ){
				bool = false;
				
				for(var i=0; i< $scope.teacher.lectureArea.length; i++ ){
					if( $scope.teacher.lectureArea[i] == $scope.subArea.select_sido){
						bool = true;
						break;
					}
				}
				if( bool ){
					$scope.gugun_target_list.push($scope.subArea.select_gugun);
				}else{
					$rootScope.showMessage('error', "상위 지역이 선택되어있지 않습니다.");
				}
			}
		}
	}
	
	$scope.getTeacherJudge = function(){
		
		// 강사 선발 점수 
		$ksHttp.post('TeacherJudgeDetail', {tcCd: $scope.teacher_id}).then(function(rs) {
			if (rs && rs.length > 0) {				
				rs = JSON.parse(rs);
				$scope.teacherJudge = rs[0];
				
				$scope.article_obj.item6 = $scope.teacherJudge.article6;				
				$scope.article_obj.item7 = $scope.teacherJudge.article7;				
				$scope.article_obj.item8 = $scope.teacherJudge.article8;
				$scope.article_obj.item9 = $scope.teacherJudge.article9;
				$scope.article_obj.item10 = $scope.teacherJudge.article10;
				$scope.article_obj.item11 = $scope.teacherJudge.article11;
				$scope.article_obj.item12 = $scope.teacherJudge.article12;
				$scope.article_obj.item13 = $scope.teacherJudge.article13;
				$scope.article_obj.item14 = $scope.teacherJudge.article14;
								
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
			
			$scope.getCodeJudge();			
			
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.getCodeJudge = function(){
		// 강사 선발 코드 1
		$ksHttp.post('CodeList', {groupId : 'JUDGE_DEGREE'}).then(function(rs) {
			$scope.article_list1 = JSON.parse(rs);
			
			for( var i=0; i < scope.article_list1.length; i++){
				if( $scope.teacherJudge.article1Cd == scope.article_list1[i].codeId ){
					$scope.article_op1 = scope.article_list1[i];
					$scope.article_obj.item1 = scope.article_list1[i].codeName2;
					break;
				}
			}			
		}, function(error) {
			console.log(error);
		});
		
		// 강사 선발 코드 2
		$ksHttp.post('CodeList', {groupId : 'JUDGE_CERTIFICATE'}).then(function(rs) {
			$scope.article_list2 = JSON.parse(rs);
			for( var i=0; i < scope.article_list2.length; i++){
				if( $scope.teacherJudge.article2Cd == scope.article_list2[i].codeId ){
					$scope.article_op2 = scope.article_list2[i];
					$scope.article_obj.item2 = scope.article_list2[i].codeName2;
					break;
				}
			}
		}, function(error) {
			console.log(error);
		});
		
		// 강사 선발 코드 3
		$ksHttp.post('CodeList', {groupId : 'JUDGE_TEXTBOOK'}).then(function(rs) {
			$scope.article_list3 = JSON.parse(rs);
			for( var i=0; i < scope.article_list3.length; i++){
				if( $scope.teacherJudge.article3Cd == scope.article_list3[i].codeId ){
					$scope.article_op3 = scope.article_list3[i];
					$scope.article_obj.item3 = scope.article_list3[i].codeName2;
					break;
				}
			}
		}, function(error) {
			console.log(error);
		});
		
		// 강사 선발 코드 4
		$ksHttp.post('CodeList', {groupId : 'JUDGE_LECTURE_CAREER'}).then(function(rs) {
			$scope.article_list4 = JSON.parse(rs);
			for( var i=0; i < scope.article_list4.length; i++){
				if( $scope.teacherJudge.article4Cd == scope.article_list4[i].codeId ){
					$scope.article_op4 = scope.article_list4[i];
					$scope.article_obj.item4 = scope.article_list4[i].codeName2;
					break;
				}
			}
		}, function(error) {
			console.log(error);
		});
		
		// 강사 선발 코드 5
		$ksHttp.post('CodeList', {groupId : 'JUDGE_COMPANY_CAREER'}).then(function(rs) {
			$scope.article_list5 = JSON.parse(rs);
			for( var i=0; i < scope.article_list5.length; i++){
				if( $scope.teacherJudge.article5Cd == scope.article_list5[i].codeId ){
					$scope.article_op5 = scope.article_list5[i];
					$scope.article_obj.item5 = scope.article_list5[i].codeName2;
					break;
				}
			}
		}, function(error) {
			console.log(error);
		});
		
		// 강사 선발 코드 6
		$ksHttp.post('CodeList', {groupId : 'JUDGE_COACH'}).then(function(rs) {
			$scope.article_list6 = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
		
		// 강사 선발 코드 7
		$ksHttp.post('CodeList', {groupId : 'JUDGE_ATTITUDE'}).then(function(rs) {
			$scope.article_list7 = JSON.parse(rs);
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.setArticleScore = function( type){
		
		if( 1 == type ){
			$scope.article_obj.item1 = $scope.article_op1 == null ? 0 : $scope.article_op1.codeName2;			
		}else if( 2 == type ){
			$scope.article_obj.item2 = $scope.article_op2 == null ? 0 : $scope.article_op2.codeName2;			
		}else if( 3 == type ){
			$scope.article_obj.item3 = $scope.article_op3 == null ? 0 : $scope.article_op3.codeName2;			
		}else if( 4 == type ){
			$scope.article_obj.item4 = $scope.article_op4 == null ? 0 : $scope.article_op4.codeName2;			
		}else if( 5 == type ){
			$scope.article_obj.item5 = $scope.article_op5 == null ? 0 : $scope.article_op5.codeName2;			
		}
		
		var sum = 0;
		angular.forEach($scope.article_obj, function(value, key) {
			if(isNaN(value)){
				value = 0;
				$scope.article_obj[key] = 0;				
			}
			sum += Number(value);
		});
		
		$scope.article_total = sum;
	}
	
	
	$scope.getArticleParam = function(){
		var aticle_param = {};		
		aticle_param.article1Cd = $scope.article_op1 == null ? '' : $scope.article_op1.codeId;
		aticle_param.article1Score = $scope.article_obj.item1 == undefined ? 0 : $scope.article_obj.item1;		
		aticle_param.article2Cd = $scope.article_op2 == null ? '' : $scope.article_op2.codeId;
		aticle_param.article2Score = $scope.article_obj.item2 == undefined ? 0 : $scope.article_obj.item2;		
		aticle_param.article3Cd = $scope.article_op3 == null ? '' : $scope.article_op3.codeId;
		aticle_param.article3Score = $scope.article_obj.item3 == undefined ? 0 : $scope.article_obj.item3;		
		aticle_param.article4Cd = $scope.article_op4 == null ? '' : $scope.article_op4.codeId;
		aticle_param.article4Score = $scope.article_obj.item4 == undefined ? 0 : $scope.article_obj.item4;		
		aticle_param.article5Cd = $scope.article_op5 == null ? '' : $scope.article_op5.codeId;
		aticle_param.article5Score = $scope.article_obj.item5 == undefined ? 0 : $scope.article_obj.item5;		
		
		aticle_param.article6Cd = '01';
		aticle_param.article6Score = $scope.article_obj.item6 == undefined ? 0 : $scope.article_obj.item6;	
		aticle_param.article7Cd = '02';
		aticle_param.article7Score = $scope.article_obj.item7 == undefined ? 0 : $scope.article_obj.item7;	
		aticle_param.article8Cd = '03';
		aticle_param.article8Score = $scope.article_obj.item8 == undefined ? 0 : $scope.article_obj.item8;	
		aticle_param.article9Cd = '01';
		aticle_param.article9Score = $scope.article_obj.item9 == undefined ? 0 : $scope.article_obj.item9;	
		aticle_param.article10Cd = '02';
		aticle_param.article10Score = $scope.article_obj.item10 == undefined ? 0 : $scope.article_obj.item10;	
		aticle_param.article11Cd = '03';
		aticle_param.article11Score = $scope.article_obj.item11 == undefined ? 0 : $scope.article_obj.item11;	
		aticle_param.article12Cd = '04';
		aticle_param.article12Score = $scope.article_obj.item12 == undefined ? 0 : $scope.article_obj.item12;	
		aticle_param.article13Cd = '05';
		aticle_param.article13Score = $scope.article_obj.item13 == undefined ? 0 : $scope.article_obj.item13;	
		aticle_param.article14Cd = '06';
		aticle_param.article14Score = $scope.article_obj.item14 == undefined ? 0 : $scope.article_obj.item14;
		
		return aticle_param;
	}
}

function closeDaumPostcode() {
	$('#layer').hide();
	$('#daum_wrap').hide();
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
			
			console.error(error);
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
			
			console.error(error);
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
					console.error(error);
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
				contractEndDt: $scope.contract.contractEndDt,
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
					console.error(error);
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
					console.error(error);
				});
		});
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};