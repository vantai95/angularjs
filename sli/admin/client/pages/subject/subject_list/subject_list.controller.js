'use strict';

app.controller('SubjectListController', SubjectListController);
app.controller('SubjectListPoupController', SubjectListPoupController);

function SubjectListController($scope, $rootScope, $ksHttp, $uibModal,$window, $stateParams, $state) {
	// create value
	$scope.majors = [];
	$scope.majorNew = null;
	$scope.subjects = [];
	$scope.subject = {};
	$scope.major = null;
	
	$scope.init = function() {
		if ($stateParams.error && $stateParams.err_msg) {
			$rootScope.showAlert($stateParams.err_msg);
		}
		$scope.getMajor();
        $scope.getSubject();
        $scope.subject.subjectName = "";
	};
	
	$scope.getSubject = function() {
		var params ={
				
		}
		$ksHttp.post('SubjectMasterList', params).then(function(rs) {
			$scope.subjects = JSON.parse(rs);
//			console.log(rs);
		}, function(err) {
			console.log(err);
		});
	};

	$scope.getMajor = function() {
		var paramMajor = {
			groupId : 'TITLE_CD'
		};
		$ksHttp.post('CodeList', paramMajor).then(function(rs) {
			$scope.majors = JSON.parse(rs);
//			console.log(rs);
		}, function(err) {
			console.log(err);
		});
	};

	$scope.showAddMajorModal = function() {
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl : "addMajor_modal.html",
			controller : "SubjectListPoupController",
			windowClass : "app-modal-window",
			scope : $scope,
			resolve : {
				items : function() {
					return $scope.data;
				}
			}
		});

		modalInstance.result.then(function(result) {
			console.info(result);
		}, function(err) {
			console.info(err);
		});
	};

	$scope.addSubject = function() {
		
		if ($scope.subject.subjectName == "" || $scope.major == null ) {
			$rootScope.showAlert('영역을 선택하고, 과목명을 입력해주세요.');
		} else {
            $rootScope.showConfirm('과목을 추가하시겠습니까?', function() {
                var paramsSubject = {
                    titleCd : $scope.major.codeId ? $scope.major.codeId : 0,
                    subjectName : $scope.subject.subjectName ? $scope.subject.subjectName : null,
                    regUser : $rootScope.current_user.userId
                };
                $ksHttp.post('SM_SubjectInsert', paramsSubject).then(function(rs) {
                	rs = JSON.parse(rs);
        			var message = rs[0].message;
        			var status = rs[0].result;
        			$rootScope.showMessage($rootScope.getMessageType(status), message);
                    $state.reload();
                }, function(err) {
                	$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
                    console.log(err);
                });
            });			
		}
	};

};

function SubjectListPoupController ($scope, $uibModalInstance, $rootScope, items, $window, $ksHttp, $state) {
	$scope.addMajor = function() {
		if ($scope.majorNew != null) {
			$scope.showConfirm('신규 영역을 추가하시겠습니까?', function() {
				var checkExist = 0;
				angular.forEach($scope.majors, function(item, key2) {
					if ($scope.majorNew == item.codeName1)
						checkExist = 1;
				});
				 if (checkExist == 0) {
				 	var paramsMajor = {
				 		titleNm : $scope.majorNew,
				 		regUser : $rootScope.current_user.userId
				 	}
				 	$ksHttp.post('SM_AreaInsert', paramsMajor).then(function(rs) {
				 		rs = JSON.parse(rs);
						var message = rs[0].message;
						var status = rs[0].result;
						$rootScope.showMessage($rootScope.getMessageType(status), message);
					 	$state.reload();
				 	}, function(err) {
				 		console.log(err);
				 	});
				 } else {
	                 $rootScope.showAlert('동일한 영역명이 존재합니다.')
				 }
	         });
		}
		else{
			$rootScope.showAlert('영역 명을 입력해주세요.');
		}
		
	};

	$scope.cancel = function() {
		$scope.majorNew = "";
		 $uibModalInstance.dismiss('cancel');
	};
};