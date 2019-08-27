'use strict';


var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ngFlash',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'ui.load',
    'ngKaon',
    'colorpicker.module',
    'blockUI',
    'signature'
]);

app.run(
    ['$rootScope', '$templateCache', '$uibModal', '$log', '$location',
      function ($rootScope, $templateCache, $uibModal, $log, $location) {
          // modal function
          var modalConfig = {
              title: 'Notice',
              content: 'content',
              btnOk: '확인',
              btnCancel: '아니오',
              showClose: true,
              showbtnOk: true,
              showBtnCancel: false,
              backdrop: 'static',
              fnReturnOk: null,
              fnReturnCancel: null,
              templateUrl: 'bootstrap-modal/modalContent.html',
              controller: 'VnModalInstanceCtrl'
          };

          var infoModalConfig = {
              content: 'content',
              btnOk: '확인',
              btnCancel: '아니오',
              showClose: true,
              showbtnOk: true,
              showBtnCancel: false,
              backdrop: 'static',
              fnReturnOk: null,
              fnReturnCancel: null,
              templateUrl: 'bootstrap-modal/infoModal.html',
              controller: 'VnModalInstanceCtrl'
          };

          // common modal function
          $rootScope.fnModalOpen = function (objConfig,data) {
              var config = angular.copy(infoModalConfig);
              angular.extend(config, objConfig);

              var modalInstance = $uibModal.open({
                  templateUrl: config.templateUrl,
                  controller: config.controller,
                  windowClass: 'modal-notify modal-centered',
                  backdrop: config.backdrop,
                  resolve: {
                      items: function () {
                          return config;
                      }
                  }
              });

              modalInstance.result.then(function (selectedItem) {
                  if (config.fnReturnOk != null) {
                      if (angular.isFunction(config.fnReturnOk)) {
                          config.fnReturnOk(selectedItem);
                      }
                  }
              }, function () {
                  //$log.info('Modal dismissed at: ' + new Date());
                  if (config.fnReturnCancel != null) {
                      if (angular.isFunction(config.fnReturnCancel)) {
                          config.fnReturnCancel();
                      }
                  }
              });
          };

          // angular bootstrap modal html
          $templateCache.put('bootstrap-modal/modalContent.html',
                      '<div class="modal-header clear">'
                      + '<h3 class="modal-title">{{items.title}}'
                      + '<button class="btn btn-default pull-right" ng-click="cancel()" ng-if="items.showClose"><i class="glyphicon glyphicon-remove"></i></button>'
                      + '</h3>'
                      + '</div>'
                      + '<div class="modal-body" ng-bind-html="items.content">'
                      + '</div>'
                      + '<div class="modal-footer">'
                      + '<button type="button" class="btn btn-default" ng-if="items.showbtnOk" ng-click="ok()" ng-bind-html="items.btnOk"></button>'
                      + '<button type="button" class="btn btn-primary" ng-if="items.showBtnCancel" ng-click="cancel()" ng-bind-html="items.btnCancel"></button>'
                      + '</div>'
                );

          $templateCache.put('bootstrap-modal/infoModal.html',
                '<div class="modal-body text-center">'
                + '<h4 ng-bind-html="items.content"></h4>'
                + '</div>'
                +'<div class="modal-footer">'
                + '<div class="row" ng-if="items.showbtnOk && items.showBtnCancel">'
                + '<div class="col-xs-6 no-padding">'
                + ' <button type="button" ng-click="cancel()" class="btn btn-block">{{items.btnCancel}}</button>'
                + '</div>'
                + '<div class="col-xs-6 no-padding">'
                + ' <button type="button" ng-click="ok()" class="btn btn-block">{{items.btnOk}}</button>'
                + '</div>'
                +'</div>'
                + '<button type="button" ng-if="items.showbtnOk && !items.showBtnCancel" data-dismiss="modal" class="btn btn-block" ng-click="ok()">'
                +  '{{items.btnOk}}</button>'
                + ' </div>'
          );
      }
    ]
  ).controller('VnModalInstanceCtrl', ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

app.directive('onlyNum', function() {
    return function(scope, element, attrs) {

        var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});

app.directive('myDatePicker1111', function() {
    return function(scope, element, attrs) {
        var format_string = 'YYYY-MM-DD';
        
    	element.datepicker({
            dateFormat: format_string,
    		onSelect: function(dateText, inst) {
                var selectedDate = moment(dateText).format(format_string);

                scope.$apply(function() {
                    scope.ngModel = selectedDate;
                });
            }
    	});
    	
    	scope.$watch('ngModel', function(value) {
    		alert(122);
    		element.datepicker('setDate', value ? moment(value).toDate() : null);
    		element.blur();
        });
    };
});

app.directive('myDatePicker', function($rootScope) {
    function link(scope, element, attrs) {
        var $element = $(element),
            selectableDates = null,
            format_string = 'YYYY-MM-DD';
        
        $element.datepicker({
            format: 'yyyy-mm-dd',
            onSelect: function(dateText, inst) {
                var selectedDate = moment(dateText).format(format_string);

                scope.$apply(function() {
                    scope.ngModel = selectedDate;
                });
            },
            beforeShowDay: function (date) {
                var isSelectable = true,
                    normalizedDate;

                if (selectableDates) {
                    normalizedDate = moment(date).format(format_string);
                    isSelectable = $.inArray(normalizedDate, selectableDates) > -1;
                }

                return [isSelectable, ''];
            }
        });

        scope.$watch('myDatePicker', function(value) {
            var firstDate, last_date, today;

            today = new Date();
            selectableDates = value;
            $element.datepicker('refresh');

            if (selectableDates && selectableDates.length > 0){
                firstDate = moment(selectableDates[0]).toDate();
                last_date = moment(selectableDates[selectableDates.length - 1]).toDate();
                $element.datepicker("option", {
                    minDate: firstDate,
                    maxDate: last_date,
                    defaultDate: firstDate
                });
            }

            // check if the first date has different month
            if (firstDate > today &&
                (firstDate.getMonth() != today.getMonth() || firstDate.getFullYear() != today.getFullYear())) {
                // Go to the month having the first available date
                $element.datepicker('setDate', '');
            }

            // Remove today default selection
            $('.ui-datepicker-current-day', $element).removeClass('ui-datepicker-current-day');
        });

        scope.$watch('ngModel', function(value) {
            $element.datepicker('setDate', value && value != '' ? moment(value).format(format_string) : null);
            $element.blur();
        });
    }

    return {
        scope: {
            ngModel: '=',
            myDatePicker: '=myDatePicker',
        },
        link: link
    };
});
