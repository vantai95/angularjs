"use strict";

app.controller("ErrorController", ErrorController);
function ErrorController($scope, $rootScope, $state) {

	$scope.init = function() {		
		if( !$rootScope.menuAuthInfo){
			$state.go("app.company.list");
		}		
	};
	
}
