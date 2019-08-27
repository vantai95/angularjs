"use strict";

app.controller("TesttController", TesttController);
function TesttController($scope, $rootScope, $ksHttp, $uibModal, $window,$stateParams) {
    
  $scope.init = function(){
	  
/*	
,startPage: 1
,endPage: 20
*/ 
/**관리자 관리자 **/

	  var studentList = [];
	  var user1 = {
	     ltCd : 'L00001'
	   , atCd : ''
	   , stCd : '1001'
	   , attState : '01'
	   , attDate : '2019-01-14'
	   , attStartTime : ''
	   , attEndTime : ''
	   , attCnts : 'cccc'
	  };
	studentList.push(user1);
	  
	  var sampleMap = { 
	  listLen : studentList.length
	  , list : studentList
	  
	  };
  
	  
	  $ksHttp.post('AttendStudentSave', sampleMap).then(function(rs) {
	  		
  			console.log(JSON.parse(rs) );
  			/*if (rs != null) {
  				var obj = JSON.parse(rs);
  	  			//console.log( obj )  	  			
  			} else {
  				$scope.items = [];
  			}*/

  		}, function(error) {
  			console.error(error);
  		});  	
  	
  };  
}
