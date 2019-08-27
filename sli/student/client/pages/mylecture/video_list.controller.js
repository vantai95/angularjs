'use strict';

app.controller('VideoListController', VideoListController);

function VideoListController($ksHttp, $scope, $state, $rootScope, $stateParams, $anchorScroll){
	$scope.lecture_detail = null;
	$scope.total_leture = 0;
	$scope.selected_lecture = $stateParams.ltCd;
	
	$scope.init = function(){
		if(!$scope.selected_lecture) {
			 $state.go("app.mylecture.index");
		}
		else {
			$scope.getLectureListBox();
			//$scope.getVideoListCnt();
			$scope.getVideoList();
		}
	};
	
	$scope.getLectureListBox = function(){
		var params = {
				stCd: $rootScope.current_user.stCd
		};
		
		$ksHttp.post('LectureListBox', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.lectureList = rs;
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.$watch('selected_lecture', function(){
		if($scope.selected_lecture != null){
			$scope.getMyLectureDetail();
		}
	});
	
	$scope.getMyLectureDetail = function(){
		var params = {
				stCd : $rootScope.current_user.stCd,
				ltCd : $scope.selected_lecture
		};
		$ksHttp.post('MyLectureDetail', params).then(function(rs){
			$scope.lecture_detail = JSON.parse(rs);
		}, function(error){
			console.error(error);
		});
	};
		
	$scope.getVideoListCnt = function(){
		var params = {
				ltCd : $scope.selected_lecture
		};
		
		$ksHttp.post('VideoListCnt', params).then(function(rs){
			rs = JSON.parse(rs);			
			$scope.total_leture = rs[0].totalCnt;			
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.getVideoList = function(){
		var params = {
				ltCd : $scope.selected_lecture				
		};
		
		$ksHttp.post('VideoList', params).then(function(rs){
			rs = JSON.parse(rs);
			$scope.video_list = rs;			
		}, function(error){
			console.error(error);
		});
	};
	
	$scope.playVideo = function(item){
		console.log(item);
		var filter = "win16|win32|win64|mac";
		if (navigator.platform && filter.indexOf(navigator.platform.toLowerCase()) >= 0) {
			var mf = window.open('','AquaNPlayer','left=0, top=0, width=900, height=600, menubar=no, directories=no, resizable=yes, status=no, scrollbars=no');            
			mf.focus();
			
			var $form = $('<form></form>');
		    $form.attr('action', '/cdn/PC/player.jsp');
		    $form.attr('method', 'post');
		    $form.attr('target', 'AquaNPlayer');
		    $form.appendTo('body');
		    if(item.fileUrl.substr(item.fileUrl.length - 1) == '/') {
			    $form.append('<input type="hidden" value="' + item.fileUrl + item.fileName + '" name="url">');
		    }
		    else {
			    $form.append('<input type="hidden" value="' + item.fileUrl + '/' + item.fileName + '" name="url">');
		    }
		    $form.submit();
		}
		else {
			var $form = $('<form></form>');
		    $form.attr('action', '/cdn/Mobile/player.jsp');
		    $form.attr('method', 'post');
		    $form.attr('target', 'mtarget');
		    $form.appendTo('body');
		    if(item.fileUrl.substr(item.fileUrl.length - 1) == '/') {
			    $form.append('<input type="hidden" value="' + item.fileUrl + item.fileName + '" name="url">');
		    }
		    else {
			    $form.append('<input type="hidden" value="' + item.fileUrl + '/' + item.fileName + '" name="url">');
		    }
			if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
			    $form.append('<input type="hidden" value="iOS" name="mtype">');
			} else if(navigator.userAgent.match(/Android/i)) {
			    $form.append('<input type="hidden" value="Android" name="mtype">');
			}
		    $form.submit();

			location.href = "player.jsp?mtype="+mtype;
		}
	}
	
	$scope.moveTop = function(){
		$anchorScroll();
	}
}