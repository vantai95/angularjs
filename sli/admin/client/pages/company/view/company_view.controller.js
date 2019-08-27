"use strict";
app.controller("CompanyViewController", CompanyViewController);
function CompanyViewController($scope, $rootScope, $stateParams, $http, $state, $ksHttp) {
    $scope.company = null;
    $scope.files = [];
    $scope.company_id = $stateParams.id;
    
    $scope.init = function(){
        if(!$stateParams.id){
            $state.go("app.company.list");
        } else{
            $scope.getCompany();
            $scope.getFile();
        }
    };
    
    $scope.getCompany = function() {
		var params = {
			cpCd : $scope.company_id
		};
		
		$ksHttp.post('CustomerCompanyDetail', params).then(function(rs) {
			rs = JSON.parse(rs);

			if (rs && rs.length > 0) {
				$scope.company = rs[0];
			}
		}, function(error) {
			console.error(error);
		});
	};
	
	$scope.getFile = function() {
		var params = {
				curCd : $scope.company_id
				,curType : 'Company'
			};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			console.log(rs);
			$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.error(error);
		});
	}
	
	$scope.deleteCompany = function(){
		
		$rootScope.showConfirm("삭제하시겠습니까?<br><br>※ 해당 고객사에 매칭된 학생들도 모두 삭제 됩니다.", function() {
			var params = {
					cpCd : $scope.company_id,
					updUser: $rootScope.current_user.userId					
				};
			
			$ksHttp.post('CustomerDeleteCompany', params).then(function(rs) {
				rs = JSON.parse(rs)
				var message = rs[0].message;
				var status = rs[0].result;
				
				$rootScope.showMessage($rootScope.getMessageType(status), message);
				if( 'succ' == status ) $state.go("app.company.list");				
			}, function(error) {
				console.error(error);
			});
		});
	}
}