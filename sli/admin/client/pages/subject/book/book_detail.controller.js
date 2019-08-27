"use strict";
app.controller("BookDetailController", BookDetailController);
function BookDetailController($scope, $rootScope, $stateParams,$http,$state,$ksHttp) {
    $scope.book = null;
    $scope.book_id =$stateParams.id;
    $scope.init = function(){
        if(!$stateParams.id){
            $state.go("app.book.book_list",{error: true, err_msg: 'something wrong happened'});
        } else{
            $scope.getBook($scope.book_id);
            $scope.getBookRelation();
            $scope.getFile();            
        }
    };
    $scope.getBook = function(id){
        if(id){
        	var params = {
            		bkCd: id			  	  
            	}
		    $ksHttp.post('BookInfoDetail', params)
			  	.then(function(rs){
			  		rs = JSON.parse(rs);
			  		$scope.book = rs[0];	  						  		
			  	}, function(error){
			  		console.error(error);
			  	})            
        }
    }

    $scope.getBookRelation = function() {
   		var params = {
           		bkCd: $scope.book_id			  	  
           	}
	    $ksHttp.post('GetBookInfoRelation', params)
		  	.then(function(rs){
		  		rs = JSON.parse(rs);
    			$scope.connect_lessons1 = rs;
		  	}, function(error){
		  		console.error(error);
		  	})    
    };
    
	$scope.getFile = function() {
		var params = {
			curCd : $scope.book_id
			,curType : 'Book'
		};
		
		$ksHttp.post('FileList', params).then(function(rs) {
			var arr = JSON.parse(rs);
			if(arr.length > 0) {
				$scope.down_files = {
					seq : arr[0].seq
					, curKey : arr[0].curKey
					, fileName : arr[0].fileName
					, originalName : arr[0].originalName
					, pathUrl : arr[0].pathUrl
				}
			}
			//$scope.files = JSON.parse(rs);
		}, function(error) {
			
			console.error(error);
		});
	}
}