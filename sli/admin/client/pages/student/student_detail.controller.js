"use strict";
app.controller("StudentDetailController", StudentDetailController);
function StudentDetailController($scope, $stateParams, $http, $state, $ksHttp, $uibModal, $rootScope) {
    $scope.student = null;
    $scope.cl_cd =$stateParams.id;
    
    $scope.attDateList = [];
    
    /**레벨테스트 s*/
    $scope.attend_student_list=[];
	$scope.lvtest_info = null;
	$scope.lvtest_detail = null;
	/**레벨테스트 e*/
	
	/**성취도평가 s*/
	$scope.test_list = [];
	$scope.test_lv_info = null;
	$scope.lvCd = '';
	/**성취도평가 e*/
    
    
    $scope.init = function(){
        if(!$stateParams.id){
            $state.go("app.student.list",{error: true, err_msg: 'something wrong happened'});
        } else{
            $scope.getStudent();            
        }
    };
    
    $scope.getStudent = function(){
    	
    	var params = {
    			clCd : $scope.cl_cd
    		};
    		
		$ksHttp.post('ClassInfoStudent', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.student = rs[0];
				$scope.setDefaultDt($scope.student.startDt, $scope.student.endDt);
				
				$scope.getAttendStudentList('Y');
				$scope.getLvTestInfo();
	    		$scope.getLvTestResult();    		
	    		$scope.getTestList();
			}
		}, function(error) {
			console.log(error);
		});
    };
    
    $scope.changeDrop = function(dropYn){
    	
    	var msg = "";
    	if( "W" != dropYn ){
    		msg = "Drop 하시겠습니까?";
    	}else{
    		msg = "Drop해제 하시겠습니까?";
    	}
    	
    	$rootScope.showConfirm(msg, function() {
    		var params = { 
    				clCd : $scope.cl_cd,
    				dropYn : dropYn,
    				updUser : $rootScope.current_user.userId
    			};
    		
			$ksHttp.post('ChangeDrop', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				
				if( "succ" == status){
					$scope.student.lastDropFlag = dropYn;
				}				
			}, function(error) {
				$rootScope.showMessage('error', '[오류] 관리자에게 문의해주세요.');
				console.log(error);
			});
		});
    }    
    
    //출석체크
	$scope.getAttendStudentList = function(type)
	{
		//학생 정보 출결현황 재조회 
		var params = {
    			clCd : $scope.cl_cd,
    			shStartDt : $scope.student.startDt,				
				shEndDt : $scope.student.endDt 
    		};    		
		$ksHttp.post('ClassInfoStudent', params).then(function(rs) {
			rs = JSON.parse(rs);
			if (rs && rs.length > 0) {
				$scope.student.attendRate = rs[0].attendRate;
				$scope.student.attCntY = rs[0].attCntY;
				$scope.student.attCntN = rs[0].attCntN;				
			}
		}, function(error) {
			console.log(error);
		});
		
		
		//출석목록 조회 
		var params = 
		{
				shLtCd : $scope.student.ltCd, 
				shStCd : $scope.student.stCd,
				shStartDt : $scope.student.startDt,				
				shEndDt : $scope.student.endDt
		};
		
		$ksHttp.post("AttendStudentList", params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.attendance_student_list = rs;

			$scope.getApplyStudentList();
		}, function(error){
			console.log(error);
		});
	}
	
    //출석체크
    $scope.getApplyStudentList = function()
	{
		var params = 
		{
				shLtCd: $scope.student.ltCd,
				shStCd: $scope.student.stCd,
				shStartDt : $scope.student.startDt,				
				shEndDt : $scope.student.endDt
		};
		
		$ksHttp.post('ApplyStudentList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.apply_student_list = rs;
			
			$scope.setAttDate();
		}, function(error){
			console.log(error);
		});
	}
    
    //출석체크
    $scope.setAttDate = function(){
		var a = 0;
		var month = [], day = [], from_time = [], end_time = [], year = [], week = [];
		$scope.attDateList = [];
		var tmpName = '';
		angular.forEach($scope.apply_student_list, function(ele){
			angular.forEach($scope.attendance_student_list, function(ele1){
				if(tmpName == '') tmpName = ele1.stCd;
				if(ele.stCd == ele1.stCd && tmpName == ele1.stCd)
				{
					a++;
					year.push(new Date(ele1.attDate).getFullYear());
					if(new Date(ele1.attDate).getMonth() + 1 < 10)
					{
						var tempMonth = new Date(ele1.attDate).getMonth() + 1;
						tempMonth = '0' + tempMonth;
						month.push(tempMonth);
					}
					else
					{
						month.push(new Date(ele1.attDate).getMonth() + 1);
					}
					if(new Date(ele1.attDate).getDate() < 10)
					{
						var tempDay = new Date(ele1.attDate).getDate();
						tempDay = '0' + tempDay;
						day.push(tempDay);
					}
					else
					{
						day.push(new Date(ele1.attDate).getDate());
					}
					from_time.push(ele1.attStartTime);
					end_time.push(ele1.attEndTime);
					week.push(ele1.attWeek);
				}
			});
			if(a >= 1)
			{
				for(var i = 0; i < from_time.length; i++)
				{
					$scope.attDateList.push({date: year[i] + '-' + month[i] + '-' + day[i], from_time: from_time[i], end_time: end_time[i], week: week[i]});
				}
			}
			month = [];
			day = [];
			from_time = [];
			end_time = [];
			a = 0;
		});
		$scope.setStatus();
	};
    
	//출석체크
	$scope.setStatus = function()
	{
		var attStr = "";
		for(var i=0;i < $scope.apply_student_list.length;i++)
		{
			$scope.apply_student_list[i].status = [];
			for(var j = 0; j < $scope.attDateList.length; j++)
			{
				$scope.apply_student_list[i].status[j] = "";
				angular.forEach($scope.attendance_student_list, function(ele2){
					if($scope.apply_student_list[i].stCd == ele2.stCd && ele2.attStartTime == $scope.attDateList[j].from_time && ele2.attEndTime == $scope.attDateList[j].end_time && ele2.attDate == $scope.attDateList[j].date)
					{
						attStr = "";
						if(ele2.lectureType == "02")
						{
							attStr = "<span>(휴) </span>";
						}
						else if(ele2.lectureType == "03")
						{
							attStr = "<span>(보강) </span>";
						}
						else if(ele2.lectureType == "04")
						{
							attStr = "<span>(☆) </span>";
						}
						
						if( ele2.attState == "01")
						{
							attStr += "<span class='primary'>O</span>";
						}
						else if( ele2.attState == "02")
						{ 
							attStr += "<span data-toggle='tooltip' data-placement='top' title='결석사유'>X</span>";
						}
						else if( ele2.attState == "03")
						{
							attStr += "<span>△</span>";
						}
						else if( ele2.attState == "04")
						{
							attStr += "<span>◎</span>";
						}
						else if( ele2.attState == "05")
						{
							attStr += "<span>확정대기</span>";
						}
						else
						{  
							attStr += "<span>-</span>";
						}
												
						$scope.apply_student_list[i].status[j] = attStr; 
					}
				});
			};
		}		
	}
	
	//출석체크
	$scope.getStyle = function(status)
	{ 
		if(status == "<span>휴</span>")
		{
			return 'off';
		}
		else if(status == "<span data-toggle='tooltip' data-placement='top' title='결석사유'>X</span>")
		{
			return 'danger';
		}
		return '';
	}
		
    
    //레벨테스트 
	$scope.getLvTestInfo = function() {
		var params = {
			ltCd : $scope.student.ltCd
		};

		$ksHttp.post('LevelTestForLecture', params).then(function(rs) {
			rs = JSON.parse(rs);
			if(rs.length > 0) {
				$scope.lvtest_info = rs[0];
			}
			else {
//				$scope.lvtest_info.tpCd;
			}
		}, function(error) {
			console.log(error);
		});
	};

	//레벨테스트 
	$scope.getLvTestResult = function() {
		var params = {
			ltCd : $scope.student.ltCd,
			stCd : $scope.student.stCd
		};

		$ksHttp.post('GetLevelTestResult', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.lvtest_detail =rs[0]; 
		}, function(error) {
			console.log(error);
		});
	};
	
	//성취도평가 
	$scope.changeTest = function() {
		for(var i = 0; i < $scope.test_list.length; i++) {
			if($scope.test_list[i].lvCd == $scope.lvCd) {
				$scope.test_lv_info = $scope.test_list[i];
				break;
			}
		}
		$scope.getTestResult();
	}
	
	//성취도평가 - 평가목록 
	$scope.getTestList = function() {
		var params = {
			ltCd : $scope.student.ltCd
		};
		
		$ksHttp.post('TestList', params).then(function(rs) {
			rs = JSON.parse(rs);
			$scope.test_list = rs;			
			if($scope.test_list.length > 0) {
				$scope.lvCd = $scope.test_list[0].lvCd;
				$scope.test_lv_info = $scope.test_list[0];
				$scope.getTestResult();
			}
		}, function(error) {
			console.log(error);
		});
	};
	
	//성취도평가
	$scope.getTestResult = function(){
		if( $scope.student.ltCd != null && $scope.student.ltCd != undefined ){
			var params = {
				stCd: $scope.student.stCd,
				ltCd: $scope.student.ltCd,
				lvCd: $scope.lvCd
			};
			
			$ksHttp.post('GetTestResult', params).then(function(rs){
				//console.log(rs);
				var tmp = JSON.parse(rs);
				if(tmp.length > 0) {
					$scope.test_detail = tmp[0];
				}
			}, function(error){
				console.log(error);
			});
		}
	};
	
	$scope.setDefaultDt = function(strDt, endDt){
		var strArr, endArr, newStrDt, newEndDt, otherArr, otherDt;
		
		if( undefined != strDt && "" != strDt){
			strArr = strDt.split("-");
			newStrDt = new Date(strArr[0], Number(strArr[1])-1, strArr[2]);
			$(".dateStr").datepicker('setDate', newStrDt);			
		}
		
		if( undefined != endDt && "" != endDt){
			endArr = endDt.split("-");
			newEndDt = new Date(endArr[0], Number(endArr[1])-1, endArr[2]);
			$(".dateEnd").datepicker('setDate', newEndDt);
		}
	}
}