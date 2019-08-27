'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$rootScope','Flash', 'blockUI', '$sessionStorage', '$location', '$state', '$ksHttp',
    function( $scope,   $translate,   $localStorage,   $window , $rootScope, Flash , blockUI, $sessionStorage, $location, $state, $ksHttp) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

  	$rootScope.current_user = null

  	$rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams){
      	if($location.$$url == '/access/login' || $location.$$url == '/access/password' || $location.$$url == '/access/find_id') {
      		if($sessionStorage.loginModel) {
      			$rootScope.current_user = $sessionStorage.loginModel;
      			//console.log($rootScope.current_user);
      			$state.go("app.index.dashboard");
      			
      			$scope.chkSession();
      			return false;
      		}
      	}
      	else {
      		if(!$sessionStorage.loginModel) {
      			$rootScope.current_user = null;
      			$state.go("access.login")
      			return false;
      		}
      		else {
      			$rootScope.current_user = $sessionStorage.loginModel;
      			$scope.chkSession();
      		}
  			//console.log($rootScope.current_user);
      	}
      });
	$scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
		console.log('module loaded', module);
	});
      
      // config
      $scope.app = {
        name: 'Angulr',
        version: '1.3.2',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36',
            border:   '#ee3524'
        },
        settings: {
          themeID: 1,
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: true,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      };

  	$scope.chkSession = function() {
		var params = {
			'userId' : $rootScope.current_user.userId
		}

		$ksHttp.post('GetUserInfo', params).then(function(rs) {
			//console.log(rs);
			rs = JSON.parse(rs);
		}, function(error) {
			if(error.status == '401') {
				$sessionStorage.loginModel = null;
				$state.go('access.login');
			}
		});
	};
      
      $rootScope.status_reponse =  {
  			success: 'succ',
  			fail: 'fail'
      };
      
      $scope.oneAtATime = true;

      $scope.groups = [
        {
          title: 'Dynamic Group Header - 1',
          content: 'Dynamic Group Body - 1'
        },
        {
          title: 'Dynamic Group Header - 2',
          content: 'Dynamic Group Body - 2'
        }
      ];

      $scope.items = ['Item 1', 'Item 2', 'Item 3'];

      $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
      };

      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
      };
      

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
      

  	$rootScope.showAlert = function(message) {
  		var config = {
  			content : message
  		};

  		$rootScope.fnModalOpen(config);
  	};

  	$rootScope.showConfirm = function(message, callbackSuccess, callbackFail) {
  		var config = {
  			content : message,
  			fnReturnOk : callbackSuccess,
  			fnReturnCancel : callbackFail,
  			showBtnCancel : true
  		};

  		$rootScope.fnModalOpen(config);
  	};

  	$rootScope.showMessage = function(type, message) {
  		if (type == 'success') {
  			message = '<i class="text-success fa fa-check"></i> '
  					+ message;
  		} else if (type == 'error') {
  			message = '<i class="text-danger fa fa-times"></i> '
  					+ message;
  		} else if (type == 'warning') {
  			message = '<i class="text-warning fa fa-exclamation-circle"></i> '
  				+ message;
  		}

  		Flash.create('default', message);
  	};
  	
  	$rootScope.getMessageType = function(api_status){
  		return api_status == $rootScope.status_reponse.success ? 'success' : 'error';
  	};
  	
   //config
$scope.app = {
	name : 'Angulr',
	version : '1.3.2',
	// for chart colors
	color : {
		primary : '#7266ba',
		info : '#23b7e5',
		success : '#27c24c',
		warning : '#fad733',
		danger : '#f05050',
		light : '#e8eff0',
		dark : '#3a3f51',
		black : '#1c2b36',
		border : '#ee3524'
	},
	settings : {
		themeID : 1,
		navbarCollapseColor : 'bg-white-only',
		asideColor : 'bg-black',
		headerFixed : true,
		asideFixed : true,
		asideFolded : false,
		asideDock : false,
		container : false
	},
	page_size : 10,
	required_msg : {
		dropdown : '?(?) ??????',
		textbox : '?(?) ??????'
	}
};

$rootScope.generateListNo = function(page, total, idx) {
	return $scope.app.page_size * page - $scope.app.page_size + total - idx
};

$scope.logout = function() {
	$sessionStorage.loginModel = null;
	$state.go('access.login');
}

}]);
	
 
