// lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['../../common/client/js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
      sparkline:      ['../../common/client/js/jquery/charts/sparkline/jquery.sparkline.min.js'],
      plot:           ['../../common/client/js/jquery/charts/flot/jquery.flot.min.js', 
                          '../../common/client/js/jquery/charts/flot/jquery.flot.resize.js',
                          '../../common/client/js/jquery/charts/flot/jquery.flot.tooltip.min.js',
                          '../../common/client/js/jquery/charts/flot/jquery.flot.spline.js',
                          '../../common/client/js/jquery/charts/flot/jquery.flot.orderBars.js',
                          '../../common/client/js/jquery/charts/flot/jquery.flot.pie.min.js'],
      slimScroll:     ['../../common/client/js/jquery/slimscroll/jquery.slimscroll.min.js'],
      moment:         [   '../../common/client/js/jquery/moment/moment.js'],
      sortable:       ['../../common/client/js/jquery/sortable/jquery.sortable.js'],
      nestable:       ['../../common/client/js/jquery/nestable/jquery.nestable.js',
                          '../../common/client/js/jquery/nestable/nestable.css'],
      filestyle:      ['../../common/client/js/jquery/file/bootstrap-filestyle.min.js'],
      slider:         ['../../common/client/js/jquery/slider/bootstrap-slider.js',
                          '../../common/client/js/jquery/slider/slider.css'],
      chosen:         ['../../common/client/js/jquery/chosen/chosen.jquery.min.js',
                          '../../common/client/js/jquery/chosen/chosen.css'],
      TouchSpin:      ['../../common/client/js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                          '../../common/client/js/jquery/spinner/jquery.bootstrap-touchspin.css'],
      wysiwyg:        ['../../common/client/js/jquery/wysiwyg/bootstrap-wysiwyg.js',
                          '../../common/client/js/jquery/wysiwyg/jquery.hotkeys.js'],
      dataTable:      ['../../common/client/js/jquery/datatables/jquery.dataTables.min.js',
                          '../../common/client/js/jquery/datatables/dataTables.bootstrap.js',
                          '../../common/client/js/jquery/datatables/dataTables.bootstrap.css'],
      vectorMap:      ['../../common/client/js/jquery/jvectormap/jquery-jvectormap.min.js', 
                          '../../common/client/js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                          '../../common/client/js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                          '../../common/client/js/jquery/jvectormap/jquery-jvectormap.css'],
      footable:       ['../../common/client/js/jquery/footable/footable.all.min.js',
                          '../../common/client/js/jquery/footable/footable.core.css'],
    fullcalendar:   [   '../../common/client/js/jquery/moment/moment.js',
                          '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.min.js',
                          '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.css',
                 '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.theme.css'],
      }
  )
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug: false,
          events: true,
          modules: [
              {
                  name: 'ngGrid',
                  files: [
                      '../../common/client/js/modules/ng-grid/ng-grid.min.js',
                      '../../common/client/js/modules/ng-grid/ng-grid.min.css',
                      '../../common/client/js/modules/ng-grid/theme.css'
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      '../../common/client/js/modules/angular-ui-select/select.min.js',
                      '../../common/client/js/modules/angular-ui-select/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    '../../common/client/js/modules/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['../../common/client/js/modules/angular-ui-calendar/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      '../../common/client/js/modules/ngImgCrop/ng-img-crop.js',
                      '../../common/client/js/modules/ngImgCrop/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      '../../common/client/js/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
                      '../../common/client/js/modules/angular-bootstrap-nav-tree/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      '../../common/client/js/modules/angularjs-toaster/toaster.js',
                      '../../common/client/js/modules/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      '../../common/client/js/modules/textAngular/textAngular-sanitize.min.js',
                      '../../common/client/js/modules/textAngular/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      '../../common/client/js/modules/angular-slider/angular-slider.min.js',
                      '../../common/client/js/modules/angular-slider/angular-slider.css'
                  ]
              }
          ]
      });
  }])
;