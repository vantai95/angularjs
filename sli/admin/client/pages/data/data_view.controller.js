"use strict";
app.controller("DataViewController", DataViewController);
function DataViewController($scope, $rootScope, $stateParams, $http, $state, $ksHttp) {
    $scope.dataInfo = null;
    $scope.files = [];
    
    $scope.init = function(){
        if(!$stateParams.id){
            $state.go("app.data.list");
        } else{
            $scope.getDataInfo();
            $scope.getFile();
        }
    };
    
    $scope.getDataInfo = function() {
    	
		$ksHttp.post('DataInfoDetail', {daCd: $stateParams.id}).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.dataInfo = rs[0];				
			}
		}, function(error) {
			console.error(error);
		});
	};

	$scope.deleteDataInfo = function(){
		$rootScope.showConfirm('게시글을 삭제하시겠습니까?', function(){
			var params = {
					saveType : 'D',
					updUserType : 'A',
					updUser : $rootScope.current_user.userId,
					daCd : $scope.dataInfo.daCd
			};
			$ksHttp.post('DataInfoSave', params).then(function(rs) {
				rs = JSON.parse(rs);
				var message = rs[0].message;
				var status = rs[0].result;
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				status == 'succ' ? $state.go("app.data.list") : $state.reload();
			}, function(error) {
				$rootScope.showMessage('danger', '[오류] 관리자에게 문의해주세요.');
			});
		});
	}
	
	$scope.getFile = function() {
		var params = {
				curCd : $stateParams.id
				,curType : 'DataInfo'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			$scope.files = JSON.parse(rs);
			
		}, function(error) {
			$rootScope.showMessage('danger', '[오류] 파일읽기오류');			
		});
	}
}