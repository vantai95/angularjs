"use strict";

/**
 * Config for the router
 */
angular.module("app")
    .run([
        "$rootScope",
        "$state",
        "$stateParams",
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    .config([
        "$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/access/login");
            $stateProvider
                .state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                .state("access.login", {
                    url: "/login",
                    templateUrl: "pages/access/login/login.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/login/login.controller.js']);
                            }]
                    }
                })
                .state("access.password", {
                    url: "/password",   
                    templateUrl: "pages/access/password/password.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/password/password_controller.js']);
                            }]
                    }
                })
                .state("access.find_id", {
                    url: "/find_id",   
                    templateUrl: "pages/access/find_id/find_id.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/find_id/find_id_controller.js']);
                            }]
                    }
                })
                .state("access.my_setting", {
                    url: "/my_setting",   
                    templateUrl: "pages/access/my_setting/my_setting.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/my_setting/my_setting.controller.js']);
                            }]
                    }
                })
                .state("access.myinfo_modify", {
                    url: "/myinfo_modify",   
                    templateUrl: "pages/access/myinfo_modify/myinfo_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/myinfo_modify/myinfo_modify.controller.js']);
                            }]
                    }
                })
                .state("app", {
                    abstract: true,
                    url: "/app",
                    templateUrl: "pages/app/app.html"
                })
                .state("app.index", {
                    abstract: true,
                    url: "/index",
                    template: '<div ui-view></div>'
                })
                .state("app.index.dashboard", {
                    url: "/dashboard",
                    templateUrl: "pages/index/index.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/index/index.controller.js']);
                            }]
                    }
                })
                .state("app.notice", {
                    abstract: true,
                    url: "/notice",
                    template: '<div ui-view></div>'
                })
                .state("app.notice.list", {
                    url: "/notice_list",
                    templateUrl: "pages/notice/notice_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/notice/notice_controller.js']);
                            }]
                    }
                })
                .state("app.teacher", {
                    abstract: true,
                    url: "/teacher",
                    template: '<div ui-view></div>'
                })
                .state("app.teacher.certificate", {
                    url: "/certificate",
                    templateUrl: "pages/teacher/certificate/teacher_certificate.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/teacher/certificate/teacher_certificate.controller.js']);
                            }]
                    }
                })
                .state("app.teacher.calculate", {
                    url: "/calculate",
                    templateUrl: "pages/teacher/calculate/teacher_calculate.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/teacher/calculate/teacher_calculate.controller.js']);
                            }]
                    }
                })
                .state("app.mylecture", {
                    abstract: true,
                    url: "/mylecture",
                    template: '<div ui-view></div>'
                })
                .state("app.mylecture.index", {
                    url: "/index",
                    templateUrl: "pages/mylecture/index.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/index.controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.lecture", {
                    url: "/lecture/:ltCd",
                    templateUrl: "pages/mylecture/lecture.html",
                    params: {
                    	ltCd: { squash: true, value: null }},
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/lecture.controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.alert_list", {
                    url: "/alert_list/:ltCd",
                    templateUrl: "pages/mylecture/alert_list.html",
                    params: {
                    	ltCd: { squash: true, value: null }},
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/alert_list.controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.lvtest", {
                    url: "/lvtest/:ltCd",
                    templateUrl: "pages/mylecture/lvtest.html",
                    params: {
                    	ltCd: { squash: true, value: null }},
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/lvtest.controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.attend", {
                    url: "/attend/:ltCd",
                    templateUrl: "pages/mylecture/attend.html",
                    params: {
                    	ltCd: { squash: true, value: null }},
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['../../common/client/js/jquery/moment/moment.js',
                                                         '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.min.js',
                                                         '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.css',
                                                '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.theme.css',
                                                             '../../common/client/js/jquery/jquery-ui-1.10.3.custom.min.js',
                                                            '../../common/client/js/jquery/moment/moment.js',
                                                            'pages/mylecture/attend.controller.js',
                                                         'pages/mylecture/calendar.js']).then(

                                                                 function(){
                                                                   return $ocLazyLoad.load('ui.calendar');
                                                                 }		 
                                                         );
                            }]
                    }
                })
                .state("app.mylecture.student", {
                    url: "/student/:ltCd",
                    templateUrl: "pages/mylecture/student.html",
                    params: {
                    	ltCd: { squash: true, value: null }},
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/student.controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.test", {
                    url: "/test/:ltCd",
                    templateUrl: "pages/mylecture/test.html",
                    params: {
                    	ltCd: { squash: true, value: null }},
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/test.controller.js']);
                            }]
                    }
                }) 
                .state("app.data", {
                    abstract: true,
                    url: "/data",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.data.list", {
                    url: "/list",
                    templateUrl: "pages/data/data_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/data/data_list.controller.js']);
                            }]
                    }
                })
                .state("app.data.write", {
                    url: "/write",
                    templateUrl: "pages/data/data_write.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/data/data_write.controller.js']);
                            }]
                    }
                })
                .state("app.data.view", {
                    url: "/view/:id",
                    templateUrl: "pages/data/data_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/data/data_view.controller.js']);
                            }]
                    }
                })
                .state("app.data.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/data/data_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/data/data_write.controller.js']);
                            }]
                    }
                })
                
        }
    ]);
