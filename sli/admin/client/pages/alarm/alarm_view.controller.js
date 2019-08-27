"use strict";
app.controller("AlarmViewController", AlarmViewController);
function AlarmViewController($scope, $rootScope, $stateParams, $http, $state, $ksHttp) {
    $scope.alarm = null;
    $scope.alarm_id = $stateParams.id;
    $scope.teachers =[];
    
    $scope.init = function(){
        if(!$stateParams.id){
            $state.go("app.alarm.list");
        } else{
            $scope.getAlarm();
        }
    };
    
    $scope.getAlarm = function() {
		$ksHttp.post('NoticeInfoDetail', {ntCd: $scope.alarm_id}).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.alarm = rs[0];
				$ksHttp.post('TeacherListBox', {}).then(function(rs) {
					$scope.teachers = JSON.parse(rs);
					angular.forEach($scope.teachers, function(obj, key) {
						 if( obj.tcCd == $scope.alarm.tcCd)
							 $scope.alarm.tcCdNm = obj.userName;
						});
				}, function(error) {
					console.error(error);
				});
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.deleteAlarm = function(){
		$rootScope.showConfirm('게시글을 삭제하시겠습니까?', function(){
			var params = {
					saveType : 'D',
					ntCd : $scope.alarm.ntCd
			};
			$ksHttp.post('NoticeInfoSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				status == 'succ' ? $state.go("app.alarm.list") : $state.reload();
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
				console.error(error);
			});
		});
	}
}