<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en" data-ng-app="app">

<head>
  <meta charset="utf-8" />
  <title>SLI 교육그룹</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="stylesheet" href="../../common/client/assets/css/bootstrap.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/animate.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/font-awesome.min.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/simple-line-icons.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/font.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/angular-flash.min.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/angular-bootstrap-colorpicker.min.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/js/jquery/datepicker/bootstrap-datepicker.min.css" type="text/css" />
  <link rel="stylesheet" href="../../teacher/client/assets/css/app.css" type="text/css" />  
  <link rel="stylesheet" href="http://cdn.rawgit.com/hiun/NanumSquare/master/nanumsquare.css">
  <link rel="stylesheet" href="../../teacher/client/assets/css/bootstrap-rtl.min.css" type="text/css" />
  <link rel="stylesheet" href="../../teacher/client/assets/css/app.rtl.css" type="text/css" />
  <link rel="stylesheet" href="../../common/client/assets/css/angular-block-ui.min.css" type="text/css" />
  <script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
  <style>
  		.datepicker-dropdown.dropdown-menu{
  			right: auto;
  		}
  </style>    
</head>

<body ng-controller="AppCtrl" dir="ltr">
    <flash-message
    duration="30000"
    show-close="false" style="z-index:9999;">
  </flash-message> 
  <div class="app" id="app" ui-view></div>
  <!-- jQuery -->
  <script src="../../common/client/js/jquery/jquery.min.js"></script>
  <script src="../../common/client/js/jquery/datepicker/bootstrap-datepicker.min.js"></script>

  <!-- Angular -->
  <script src="../../common/client/js/angular/1.7.2/angular.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-animate.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-resource.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-sanitize.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-touch.min.js"></script>

  <script src="../../common/client/js/angular/1.7.2/ocLazyLoad.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/ngStorage.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-ui-router.js"></script>

  <script src="../../common/client/js/jquery/bootstrap.js"></script>
  <script src="../../common/client/js/angular/1.7.2/ui-bootstrap-tpls.js"></script>
  <script src="../../common/client/js/angular/1.7.2/ui-bootstrap-tpls-2.5.0.min.js"></script>
  <script src="../../common/client/js/kemp/angular-kernel-kaon.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-cookies.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-translate.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-translate-loader-static-files.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-translate-storage-cookie.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-translate-storage-local.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-flash.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-bootstrap-colorpicker.min.js"></script>
  <script src="../../common/client/js/angular/1.7.2/angular-block-ui.min.js"></script>

  <script src="../../common/client/js/app.js"></script>
  <script src="../../common/client/js/services/ui-load.js"></script>
  <script src="../../common/client/js/directives/ui-butterbar.js"></script>
  <script src="../../common/client/js/directives/ui-nav.js"></script>
  <script src="../../common/client/js/directives/ui-toggleclass.js"></script>

  <script src="../../common/client/js/config.js"></script>
  <script src="../../common/client/js/config.lazyload.js"></script>
  <!-- App -->
  <script src="main.js"></script>
  <script src="router.js"></script>
  <script src="../../common/client/js/controllers/bootstrap.js"></script>
</body>

</html>