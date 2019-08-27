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
                                return $ocLazyLoad.load(['pages/access/my_setting/setting.controller.js']);
                            }]
                    }
                })
                .state("access.myinfo_modify", {
                    url: "/myinfo_modify",   
                    templateUrl: "pages/access/myinfo_modify/myinfo_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/myinfo_modify/myinfo.controller.js']);
                            }]
                    }
                })
                .state("access.join_agreement", {
                    url: "/join_agreement",
                    templateUrl: "pages/access/join/join_agreement.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/join/register_controller.js']);
                            }]
                    }
                })
                .state("access.join_form", {
                    url: "/join_form",
                    templateUrl: "pages/access/join/join_form.html",
                    params:{
                    	agree_event : '',
                    	user_name: '',
                    	mobile: '',
                    	cpCd: '',
                    	checked_SLI : false,
                    	checked_info: false,
                    	cheked_event: false
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/join/register_controller.js']);
                            }]
                    }
                })
                .state("access.join_certification", {
                    url: "/join_certification",
                    templateUrl: "pages/access/join/join_certification.html",
                    params:{
                    	checked_SLI : false,
                    	checked_info: false,
                    	cheked_event: false
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/access/join/register_controller.js']);
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
                                return $ocLazyLoad.load(['pages/index/index_controller.js']);
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
                                return $ocLazyLoad.load(['pages/teacher/certificate/popup.controller.js']);
                            }]
                    }
                })
                .state("app.student", {
                    abstract: true,
                    url: "/student",
                    template: '<div ui-view></div>'
                })
                .state("app.student.student_help", {
                    url: "/student_help",
                    templateUrl: "pages/student_help/student_help.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/student_help/student_help.controller.js']);
                            }]
                    }
                })
                .state("app.student.student_help_add", {
                    url: "/student_help_add",
                    templateUrl: "pages/student_help/student_help_add.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/student_help/student.controller.js']);
                            }]
                    }
                })
                .state("app.student.student_help_view", {
                    url: "/student_help_view/:id",
                    templateUrl: "pages/student_help/student_help_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/student_help/student_view.controller.js']);
                            }]
                    }
                })
                .state("app.student.student_help_comment", {
                    url: "/student_help_comment/:id",
                    templateUrl: "pages/student_help/student_help_comment.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/student_help/student_view.controller.js']);
                            }]
                    }
                })
                .state("app.lecture", {
                    abstract: true,
                    url: "/lecture",
                    template: '<div ui-view></div>'
                })
                .state("app.lecture.list", {
                    url: "/list",
                    templateUrl: "pages/lecture/list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/lecture/lecture.controller.js']);
                            }]
                    }
                })
                .state("app.order", {
                    abstract: true,
                    url: "/order",
                    template: '<div ui-view></div>'
                })
                .state("app.order.list", {
                    url: "/list",
                    templateUrl: "pages/order/list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/order/list_controller.js']);
                            }]
                    }
                })
                .state("app.lecture.detail", {
                    url: "/detail/:id",
                    templateUrl: "pages/lecture/detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/lecture/lecture_detail.controller.js']);
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
                        	 return $ocLazyLoad.load(['pages/index/index_controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.index_endLecture", {
                    url: "/index_endLecture",
                    templateUrl: "pages/mylecture/index_endLecture.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                        	 return $ocLazyLoad.load(['pages/index/index_controller.js']);
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
                        	 return $ocLazyLoad.load(['pages/mylecture/mylecture_controller.js']);
                            }]
                    }
                })
                .state("app.mylecture.video", {
                    url: "/video/:ltCd",
                    templateUrl: "pages/mylecture/video_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/mylecture/video_list.controller.js']);
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
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            ['../../common/client/js/jquery/moment/moment.js',
                          '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.min.js',
                          '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.css',
                 '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.theme.css',
                              '../../common/client/js/jquery/jquery-ui-1.10.3.custom.min.js',
                             '../../common/client/js/jquery/moment/moment.js',
                              'pages/mylecture/calendar.js',
                            'pages/mylecture/attend_controller.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
                })
                .state("app.mylecture.student", {
                    url: "/student",
                    templateUrl: "pages/mylecture/student.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/teacher/certificate/popup.controller.js']);
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
                .state("app.payment", {
                    url: "/payment",
                    templateUrl: "pages/payment/crossplatform.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
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
        }
    ]);
