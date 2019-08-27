/**
 * calendarDemoApp - 0.1.3
 */

app.controller('FullcalendarCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };

    /* event source that contains custom events on the scope */
    $scope.latest_date = null;
    if($scope.attend_student.length == 0){
    	$scope.latest_date = moment().format('YYYY-MM-DD');
    }
    
    $scope.events = [];
    angular.forEach($scope.attend_student, function(ele){
    	if(!$scope.latest_date || moment($scope.latest_date) < moment(ele.attDate)){
    		$scope.latest_date = ele.attDate;
    	}
    	
    	if(ele.attState == '01')
		{
    		$scope.events.push({title:'출석', start: new Date(ele.attDate), className: ['bg-primary bg']});
		}
    	else if(ele.attState == '02')
		{
    		$scope.events.push({title:'결석', start: new Date(ele.attDate), className: ['bg-cancle bg']});
		}
    	else if(ele.attState == '03')
		{
    		$scope.events.push({title:'지각', start: new Date(ele.attDate), className: ['bg-delay bg']});
		}
    	else if(ele.attState == '04')
		{
    		$scope.events.push({title:'출석인정', start: new Date(ele.attDate),className: ['bg-primary bg']});
		}
    });

    $scope.getStudentInfo = function(selected_date){
    	console.log(selected_date);
    	var bExists = false;
    	for(var i = 0; i < $scope.attend_student.length; i++) {
    		if($scope.attend_student[i].attDate == selected_date) {
    			bExists = true;
    		}
    	}
    	
    	if(!bExists) {
    		$rootScope.showMessage('error', selected_date + '은 수업일이 아닙니다.');
    		return;
    	}
    	$scope.schedule_item = {};
    	var changed_items = $.grep($scope.attend_student, function(x, i){
    		return x.is_changed;
    	});

    	$.each(changed_items, function(i,x){
    		x.is_changed = false;
    	});
    	
    	var attend_students = $.grep($scope.attend_student, function(x, i){
    		return x.attDate == selected_date
    	});

    	if(attend_students.length > 0){
    		$scope.schedule_item = attend_students[0];
    		$scope.schedule_item.is_changed = true;
    	}else{
    		$scope.schedule_item = {
        			atCd: '', 
        			ltCd: $scope.apply_student.ltCd, 
        			clCd: '', 
        			stCd: $scope.apply_student.stCd, 
        			attDate: selected_date, 
        			attStartTime: '', 
        			attEndTime: '', 
        			attState: null, 
        			attCnts: '',
        			is_changed: true};
    		$scope.attend_student.push($scope.schedule_item)
    	}
    	
    	setTimeout(function(){
	    	$('.fc-day-number.fc-today').removeClass('fc-today');
	    	$('.fc-day-number.fc-state-highlight').removeClass('fc-state-highlight');
	    	$('.fc-day.fc-today').removeClass('fc-today');
	    	$('.fc-day.fc-state-highlight').removeClass('fc-state-highlight');
	    	var fc_day_number = '.fc-day-number[data-date=' + selected_date + ']';
	    	var fc_day = '.fc-day[data-date=' + selected_date + ']';
	    	$(fc_day_number).addClass('fc-today');
	    	$(fc_day_number).addClass('fc-state-highlight');
	    	$(fc_day).addClass('fc-today');
	    	$(fc_day).addClass('fc-state-highlight');
    	}, 100);
    };
    
//	$scope.getStudentInfo($scope.latest_date);

    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;
    $scope.alertOnEventClick = function( date, jsEvent, view ){
//      var time = new Date().getTime();
//      if(time - $scope.lastClickTime <= $scope.precision){
//          $scope.events.push({
//            title: '출석',
//            start: date,
//            className: ['bg-primary bg']
//          });
//      }
//      $scope.lastClickTime = time;
		var selected_date = moment(date).format('YYYY-MM-DD');
		$scope.getStudentInfo(selected_date);
    };
    
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        dayClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventMouseover: $scope.alertOnMouseOver
      }
    };
    
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'New Event',
        start: new Date(y, m, d),
        className: ['b-l b-2x b-info']
      });
    };

    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };

    /* Change View */
    /* event sources array*/
    $scope.eventSources = [$scope.events];
}]);
/* EOF */
