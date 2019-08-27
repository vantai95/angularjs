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
    .directive("callbackOnEnd", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            	if (scope.$last) {
                	scope.$eval(attrs.callbackOnEnd);
            	}
        	}
    	};
    })
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
                                return $ocLazyLoad.load(['pages/access/password/password.controller.js']);
                            }]
                    }
                })
                .state("app", {
                    abstract: true,
                    url: "/app",
                    templateUrl: "pages/app/app.html"
                })
                .state("app.notice", {
                    abstract: true,
                    url: "/notice",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.attend", {
                    abstract: true,
                    url: "/attend",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.student", {
                    abstract: true,
                    url: "/student",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state('app.components', {
                    url: '/components',
                    templateUrl: 'pages/components/components.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/components/components.controller.js']);
                            }]
                    }
                })
                .state("app.notice.write", {
                    url: "/notice_write",
                    templateUrl: "pages/notice/notice_write.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/notice/notice_insert.controller.js']);
                            }]
                    }
                })
                .state("app.notice.list", {
                    url: "/notice_list",
                    templateUrl: "pages/notice/notice_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/notice/notice_list.controller.js']);
                            }]
                    }
                })
                .state("app.notice.modify", {
                    url: "/notice_modify/:id",
                    templateUrl: "pages/notice/notice_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/notice/notice_insert.controller.js']);
                            }]
                    }
                })
                .state("app.notice.view", {
                    url: "/notice_view/:id",
                    templateUrl: "pages/notice/notice_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/notice/notice_list.controller.js']);
                            }]
                    }
                })
                .state("app.attend.detail", {
                    url: "/detail",
                    templateUrl: "pages/attend/detail/detail.html",
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
                              'pages/attend/detail/calendar.js',
                            'pages/attend/default/attend_controller.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                    },
                    params: {
                    	attend: null
                  }
                })
                .state("app.attend.default", {
                    url: "/default/:cpCd/:ltCd/:tcCd",
                    templateUrl: "pages/attend/default/default.html",
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function ($ocLazyLoad, uiLoad) {
                                return uiLoad.load(['../../common/client/js/jquery/moment/moment.js',
                                                         '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.min.js',
                                                         '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.css',
                                                         '../../common/client/js/jquery/fullcalendar/dist/fullcalendar.theme.css',
                                                             '../../common/client/js/jquery/jquery-ui-1.10.3.custom.min.js',
                                                            '../../common/client/js/jquery/moment/moment.js',
                                                             'pages/attend/detail/calendar.js',
                                                             'pages/attend/default/attend_controller.js']).then(
                                                                     function(){
                                                                         return $ocLazyLoad.load('ui.calendar');
                                                                       }
                                                                     )
                            }]
                    }
                })
                .state("app.attend.allow_list", {
                    url: "/allow_list",
                    templateUrl: "pages/attend/allow/allow_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/attend/allow/allow.controller.js']);
                            }]
                    }
                })
                .state("app.attend.guarantee_list", {
                    url: "/guarantee_list",
                    templateUrl: "pages/attend/guarantee/guarantee_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/attend/guarantee/guarantee_controller.js']);
                            }]
                    }
                })
                .state("app.teacher", {
                    abstract: true,
                    url: "/teacher",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.teacher.insert", {
                    url: "/insert",
                    templateUrl: "pages/teacher/insert/teacher_insert.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/teacher/insert/teacher_insert_controller.js']);
                            }]
                    }
                })
                .state("app.teacher.list", {
                    url: "/list",
                    templateUrl: "pages/teacher/list/teacher_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/teacher/list/teacher_list_controller.js']);
                            }]
                    }
                })
                .state("app.teacher.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/teacher/modify/Teacher_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                            	return $ocLazyLoad.load(['pages/teacher/insert/teacher_insert_controller.js']);
                            }]
                    }
                })
                .state("app.teacher.detail", {
                    url: "/detail/:id",
                    templateUrl: "pages/teacher/detail/Teacher_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                            	return $ocLazyLoad.load(['pages/teacher/detail/teacher_detail_controller.js']);
                            }]
                    }
                })
                .state("app.teacher.certificate", {
                    url: "/certificate",
                    templateUrl: "pages/teacher/certificate/teacher_certificate.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/teacher/certificate/teacher_certification.controller.js']);
                            }]
                    }
                })
                .state("app.alarm", {
                    abstract: true,
                    url: "/alarm",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.alarm.list", {
                    url: "/list",
                    templateUrl: "pages/alarm/alarm_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/alarm/alarm_list.controller.js']);
                            }]
                    }
                })
                .state("app.alarm.write", {
                    url: "/write",
                    templateUrl: "pages/alarm/alarm_write.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/alarm/alarm_write.controller.js']);
                            }]
                    }
                })
                .state("app.alarm.view", {
                    url: "/view/:id",
                    templateUrl: "pages/alarm/alarm_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/alarm/alarm_view.controller.js']);
                            }]
                    }
                })
                .state("app.alarm.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/alarm/alarm_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/alarm/alarm_write.controller.js']);
                            }]
                    }
                })
                .state("app.survey", {
                    abstract: true,
                    url: "/survey",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.survey.result", {
                    url: "/result/:smCd",
                    templateUrl: "pages/survey/survey_result.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/survey/survey_result.controller.js']);
                            }]
                    },
                })
                .state("app.survey.default", {
                    url: "/default",
                    templateUrl: "pages/survey/survey_default.html",
                })
            .state("app.survey.setting", {
                    url: "/setting/:id?:smCd",
                    templateUrl: "pages/survey/survey_setting.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/survey/survey_setting.controller.js']);
                            }]
                    },
                })
                .state("app.survey.list", {
                    url: "/list",
                    templateUrl: "pages/survey/survey_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/survey/survey.controller.js']);
                            }]
                    }
                })
                .state("app.student.detail", {
                    url: "/detail/:id",
                    templateUrl: "pages/student/student_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/student/student_detail.controller.js']);
                            }]
                    }
                })
                .state("app.student.list", {
                    url: "/list/:id",
                    templateUrl: "pages/student/student_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/student/student.controller.js']);
                            }]
                    }
                })
                .state("app.sms", {
                    abstract: true,
                    url: "/sms",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.sms.automessage", {
                    url: "/automessage",
                    templateUrl: "pages/sms/automessage/sms_automessage.html",
                })
                .state("app.sms.teacher_sorting", {
                    url: "/teacher_sorting",
                    templateUrl: "pages/sms/teacher_sorting/sms_teacher_sorting.html",
	                resolve: {
	                    deps: ['$ocLazyLoad',
	                        function ($ocLazyLoad) {
	                            return $ocLazyLoad.load(['pages/sms/teacher_sorting/sms_teacher_sorting_controller.js']);
	                        }]
	                }
                })
                .state("app.sms.list", {
                    url: "/list",
                    templateUrl: "pages/sms/list/sms_list.html",
                    resolve: {
	                    deps: ['$ocLazyLoad',
	                        function ($ocLazyLoad) {
	                            return $ocLazyLoad.load(['pages/sms/list/sms.controller.js']);
	                        }]
	                }
                })
                .state("app.admin", {
                    abstract: true,
                    url: "/admin",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.admin.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/admin/admin_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/admin/admin_regist.controller.js']);
                            }]
                    }
                })
                .state("app.admin.list", {
                    url: "/list",
                    templateUrl: "pages/admin/admin_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/admin/admin_list.controller.js']);
                            }]
                    }
                })
                .state("app.admin.regist", {
                    url: "/regist",
                    templateUrl: "pages/admin/admin_regist.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/admin/admin_regist.controller.js']);
                            }]
                    }
                })
                .state("app.admin.authority", {
                    url: "/authority",
                    templateUrl: "pages/admin/admin_authority.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/admin/admin_authority.controller.js']);
                            }]
                    }
                })
                .state("app.company", {
                    abstract: true,
                    url: "/company",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.company.list", {
                    url: "/list",
                    templateUrl: "pages/company/list/company_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/company/list/company.controller.js']);
                            }]
                    }
                })
                .state("app.company.insert", {
                    url: "/insert",
                    templateUrl: "pages/company/insert/company_insert.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/company/insert/company_insert.controller.js');
                            }]
                    }
                })
                .state("app.company.view", {
                    url: "/view/:id",
                    templateUrl: "pages/company/view/company_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/company/view/company_view.controller.js');
                            }]
                    }
                })
                .state("app.company.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/company/modify/company_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/company/insert/company_insert.controller.js');
                            }]
                    }
                })
                .state("app.subject", {
                    abstract: true,
                    url: "/subject",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.subject.subject_list", {
                    url: "/sub_list",
                    templateUrl: "pages/subject/subject_list/subject_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/subject_list/subject_list.controller.js']);
                            }]
                    }
                })
                .state("app.subject.lecture_list", {
                    url: "/lec_list",
                    templateUrl: "pages/subject/lecture/lecture_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/lecture/lecture_list.controller.js']);
                            }]
                    }
                })
                .state("app.subject.lecture_insert", {
                    url: "/lec_insert",
                    templateUrl: "pages/subject/lecture/lecture_insert.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/lecture/lecture_insert.controller.js']);
                            }]
                    }
                })
                .state("app.subject.lecture_modify", {
                    url: "/lec_modify/:id",
                    templateUrl: "pages/subject/lecture/lecture_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/lecture/lecture_insert.controller.js']);
                            }]
                    }
                })
                .state("app.subject.lecture_detail", {
                    url: "/lec_detail/:id",
                    templateUrl: "pages/subject/lecture/lecture_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/lecture/lecture_detail.controller.js']);
                            }]
                    }
                })
                .state("app.book", {
                    abstract: true,
                    url: "/book",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.book.book_detail", {
                    url: "/book_detail/:id",
                    templateUrl: "pages/subject/book/book_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/subject/book/book_detail.controller.js');
                            }]
                    }
                })
                .state("app.book.book_insert", {
                    url: "/book_insert",
                    templateUrl: "pages/subject/book/book_insert.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/book/book_insert.controller.js']);
                            }]
                    }
                })
                .state("app.book.book_list", {
                    url: "/book_list",
                    templateUrl: "pages/subject/book/book_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/book/book_list.controller.js']);
                            }]
                    }
                })
                .state("app.book.book_modify", {
                    url: "/book_modify/:id",
                    templateUrl: "pages/subject/book/book_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/book/book_insert.controller.js']);
                            }]
                    }
                })
                .state("app.video", {
                    abstract: true,
                    url: "/video",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.video.video_detail", {
                    url: "/video_detail/:id",
                    templateUrl: "pages/subject/video/video_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/subject/video/video_detail.controller.js');
                            }]
                    }
                }) 
                .state("app.video.video_insert", {
                    url: "/video_insert",
                    templateUrl: "pages/subject/video/video_insert.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/video/video_insert.controller.js']);
                            }]
                    }
                })
                .state("app.video.video_list", {
                    url: "/video_list",
                    templateUrl: "pages/subject/video/video_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/subject/video/video_list.controller.js']);
                            }]
                    }
                })
                .state("app.exam", {
                    abstract: true,
                    url: "/exam",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.exam.exam_list", {
                    url: "/list",
                    templateUrl: "pages/exam/exam_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/exam/exam.controller.js']);
                            }]
                    }
                })
                .state("app.exam.exam_detail", {
                    url: "/detail/:lvCd?:ltCd",
                    templateUrl: "pages/exam/exam_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/exam/exam.detail.controller.js']);
                            }]
                    }
                })
                .state("app.user", {
                    abstract: true,
                    url: "/user",
                    template: '<div ui-view class="fade-in-up"></div>'
                })  
                .state("app.user.default", {
                    url: "/default",
                    templateUrl: "pages/user/user_default.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/user/user_controller.js']);
                            }]
                    }
                })  
                .state("app.user.detail", {
                    url: "/detail/:id",
                    templateUrl: "pages/user/user_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/user/user_detail_controller.js']);
                            }]
                    }
                })
                 .state("app.user.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/user/user_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/user/user_detail_controller.js']);
                            }]
                    }
                })
                .state("app.user.list", {
                    url: "/list",
                    templateUrl: "pages/user/user_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/user/user_controller.js']);
                            }]
                    },
                    params: {
                    	teacher: null,
                    	lecture: null,
                    	customer_company: null,
                    	username_student: null
                    }
                })
                .state("app.student_qna", {
                    abstract: true,
                    url: "/student_qna",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.student_qna.list", {
                    url: "/list",
                    templateUrl: "pages/student_qna/student_qna_list.html",
                })
                .state("app.student_qna.reply", {
                    url: "/reply/:id",
                    templateUrl: "pages/student_qna/student_qna_reply.html",
                })
                .state("app.student_qna.view", {
                    url: "/view/:id",
                    templateUrl: "pages/student_qna/student_qna_view.html",
                })
                .state("app.lvtest", {
                    abstract: true,
                    url: "/lvtest",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.lvtest.list", {
                    url: "/list",
                    templateUrl: "pages/lvtest/list/lvtest_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/lvtest/list/lvtest_list_controller.js']);
                            }]
                    }
                })
                .state("app.lvtest.lvtest_detail", {
                    url: "/detail/:ltCd",
                    templateUrl: "pages/lvtest/detail/lvtest_detail.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/lvtest/detail/lvtest_detail_controller.js']);
                            }]
                    }
                })
                .state("app.account", {
                    abstract: true,
                    url: "/account",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.account.pay_list", {
                    url: "/pay_list",
                    templateUrl: "pages/account/pay_list.html",
                    resolve: {
                    	deps: ['$ocLazyLoad',
                	       function($ocLazyLoad){
                    			return $ocLazyLoad.load(['pages/account/pay_list_controller.js']);
                    	}]
                    }
                })
                .state("app.account.refund_list", {
                    url: "/refund_list",
                    templateUrl: "pages/account/refund_list.html",
                    resolve: {
                    	deps: ['$ocLazyLoad',
                	       function($ocLazyLoad){
                    		return $ocLazyLoad.load(['pages/account/pay_list_controller.js']);
                    	}]
                    }
                })
                .state("app.account.client_list", {
                    url: "/client_list",
                    templateUrl: "pages/account/client_list.html",
                    resolve: {
                    	deps: ['$ocLazyLoad',
                	       function($ocLazyLoad){
                    		return $ocLazyLoad.load(['pages/account/client_list.controller.js']);
                    	}]
                    }
                })
                .state("app.account.client", {
                    url: "/client",
                    templateUrl: "pages/account/client.html",
                    resolve: {
                    	deps: ['$ocLazyLoad',
                	       function($ocLazyLoad){
                    		return $ocLazyLoad.load(['pages/account/client.controller.js']);
                    	}]
                    }
                })
                .state("app.account.client_view", {
                    url: "/client/:ptCd",
                    templateUrl: "pages/account/client_view.html",
                    resolve: {
                    	deps: ['$ocLazyLoad',
                	       function($ocLazyLoad){
                    		return $ocLazyLoad.load(['pages/account/client_view.controller.js']);
                    	}]
                    }
                })
                .state("app.account.teacher_list", {
                    url: "/teacher_list",
                    templateUrl: "pages/account/teacher_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/account/teacher_list.controller.js']);
                            }]
                    }
                })
                .state("app.account.teacher", {
                    url: "/teacher",
                    templateUrl: "pages/account/teacher.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/account/teacher.controller.js']);
                            }]
                    }
                })
                .state("app.account.teacher_view", {
                    url: "/teacher_view/:ptCd",
                    templateUrl: "pages/account/teacher_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/account/teacher_view.controller.js']);
                            }]
                    }
                })
                .state("app.account.monthly", {
                    url: "/monthly",
                    templateUrl: "pages/account/monthly.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/account/monthly.controller.js']);
                            }]
                    }
                })                
                .state("app.error", {
                    url: "/error",
                    templateUrl: "pages/error/error.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/error/error.controller.js']);
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
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                .state("app.code", {
                    abstract: true,
                    url: "/code",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.code.list", {
                    url: "/list",
                    templateUrl: "pages/code/code_list.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['pages/code/code.controller.js']);
                            }]
                    }
                })
                .state("app.code.insert", {
                    url: "/insert",
                    templateUrl: "pages/code/code_insert.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/code/code_insert.controller.js');
                            }]
                    }
                })
                .state("app.code.view", {
                    url: "/view/:id",
                    templateUrl: "pages/code/code_view.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/code/code_insert.controller.js');
                            }]
                    }
                })
                .state("app.code.modify", {
                    url: "/modify/:id",
                    templateUrl: "pages/code/code_modify.html",
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('pages/code/code_insert.controller.js');
                            }]
                    }
                })
                
                .state("app.fileDownload", {
                    abstract: true,
                    url: "/fileDownload",
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state("app.fileDownload.lecture", {
                    url: "/lecture",
                    templateUrl: "pages/fileDownload/lectureData.html",
                })
        }
    ]);
