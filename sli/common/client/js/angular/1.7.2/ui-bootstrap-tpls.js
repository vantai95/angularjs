/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.14.3 - 2015-10-23
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.stackedMap", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]),
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html", "template/accordion/accordion.html", "template/alert/alert.html", "template/carousel/carousel.html", "template/carousel/slide.html", "template/datepicker/datepicker.html", "template/datepicker/day.html", "template/datepicker/month.html", "template/datepicker/popup.html", "template/datepicker/year.html", "template/modal/backdrop.html", "template/modal/window.html", "template/pagination/pager.html", "template/pagination/pagination.html", "template/tooltip/tooltip-html-popup.html", "template/tooltip/tooltip-popup.html", "template/tooltip/tooltip-template-popup.html", "template/popover/popover-html.html", "template/popover/popover-template.html", "template/popover/popover.html", "template/progressbar/bar.html", "template/progressbar/progress.html", "template/progressbar/progressbar.html", "template/rating/rating.html", "template/tabs/tab.html", "template/tabs/tabset.html", "template/timepicker/timepicker.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html"]),
angular.module("ui.bootstrap.collapse", []).directive("uibCollapse", ["$animate", "$injector", function(a, b) {
    var c = b.has("$animateCss") ? b.get("$animateCss") : null;
    return {
        link: function(b, d, e) {
            function f() {
                d.removeClass("collapse").addClass("collapsing").attr("aria-expanded", !0).attr("aria-hidden", !1),
                c ? c(d, {
                    addClass: "in",
                    easing: "ease",
                    to: {
                        height: d[0].scrollHeight + "px"
                    }
                }).start()["finally"](g) : a.addClass(d, "in", {
                    to: {
                        height: d[0].scrollHeight + "px"
                    }
                }).then(g)
            }
            function g() {
                d.removeClass("collapsing").addClass("collapse").css({
                    height: "auto"
                })
            }
            function h() {
                return d.hasClass("collapse") || d.hasClass("in") ? (d.css({
                    height: d[0].scrollHeight + "px"
                }).removeClass("collapse").addClass("collapsing").attr("aria-expanded", !1).attr("aria-hidden", !0),
                void (c ? c(d, {
                    removeClass: "in",
                    to: {
                        height: "0"
                    }
                }).start()["finally"](i) : a.removeClass(d, "in", {
                    to: {
                        height: "0"
                    }
                }).then(i))) : i()
            }
            function i() {
                d.css({
                    height: "0"
                }),
                d.removeClass("collapsing").addClass("collapse")
            }
            b.$watch(e.uibCollapse, function(a) {
                a ? h() : f()
            })
        }
    }
}
]),
angular.module("ui.bootstrap.collapse").value("$collapseSuppressWarning", !1).directive("collapse", ["$animate", "$injector", "$log", "$collapseSuppressWarning", function(a, b, c, d) {
    var e = b.has("$animateCss") ? b.get("$animateCss") : null;
    return {
        link: function(b, f, g) {
            function h() {
                f.removeClass("collapse").addClass("collapsing").attr("aria-expanded", !0).attr("aria-hidden", !1),
                e ? e(f, {
                    easing: "ease",
                    to: {
                        height: f[0].scrollHeight + "px"
                    }
                }).start().done(i) : a.animate(f, {}, {
                    height: f[0].scrollHeight + "px"
                }).then(i)
            }
            function i() {
                f.removeClass("collapsing").addClass("collapse in").css({
                    height: "auto"
                })
            }
            function j() {
                return f.hasClass("collapse") || f.hasClass("in") ? (f.css({
                    height: f[0].scrollHeight + "px"
                }).removeClass("collapse in").addClass("collapsing").attr("aria-expanded", !1).attr("aria-hidden", !0),
                void (e ? e(f, {
                    to: {
                        height: "0"
                    }
                }).start().done(k) : a.animate(f, {}, {
                    height: "0"
                }).then(k))) : k()
            }
            function k() {
                f.css({
                    height: "0"
                }),
                f.removeClass("collapsing").addClass("collapse")
            }
            d || c.warn("collapse is now deprecated. Use uib-collapse instead."),
            b.$watch(g.collapse, function(a) {
                a ? j() : h()
            })
        }
    }
}
]),
angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("uibAccordionConfig", {
    closeOthers: !0
}).controller("UibAccordionController", ["$scope", "$attrs", "uibAccordionConfig", function(a, b, c) {
    this.groups = [],
    this.closeOthers = function(d) {
        var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;
        e && angular.forEach(this.groups, function(a) {
            a !== d && (a.isOpen = !1)
        })
    }
    ,
    this.addGroup = function(a) {
        var b = this;
        this.groups.push(a),
        a.$on("$destroy", function(c) {
            b.removeGroup(a)
        })
    }
    ,
    this.removeGroup = function(a) {
        var b = this.groups.indexOf(a);
        -1 !== b && this.groups.splice(b, 1)
    }
}
]).directive("uibAccordion", function() {
    return {
        controller: "UibAccordionController",
        controllerAs: "accordion",
        transclude: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/accordion/accordion.html"
        }
    }
}).directive("uibAccordionGroup", function() {
    return {
        require: "^uibAccordion",
        transclude: !0,
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/accordion/accordion-group.html"
        },
        scope: {
            heading: "@",
            isOpen: "=?",
            isDisabled: "=?"
        },
        controller: function() {
            this.setHeading = function(a) {
                this.heading = a
            }
        },
        link: function(a, b, c, d) {
            d.addGroup(a),
            a.openClass = c.openClass || "panel-open",
            a.panelClass = c.panelClass,
            a.$watch("isOpen", function(c) {
                b.toggleClass(a.openClass, !!c),
                c && d.closeOthers(a)
            }),
            a.toggleOpen = function(b) {
                a.isDisabled || b && 32 !== b.which || (a.isOpen = !a.isOpen)
            }
        }
    }
}).directive("uibAccordionHeading", function() {
    return {
        transclude: !0,
        template: "",
        replace: !0,
        require: "^uibAccordionGroup",
        link: function(a, b, c, d, e) {
            d.setHeading(e(a, angular.noop))
        }
    }
}).directive("uibAccordionTransclude", function() {
    return {
        require: ["?^uibAccordionGroup", "?^accordionGroup"],
        link: function(a, b, c, d) {
            d = d[0] ? d[0] : d[1],
            a.$watch(function() {
                return d[c.uibAccordionTransclude]
            }, function(a) {
                a && (b.find("span").html(""),
                b.find("span").append(a))
            })
        }
    }
}),
angular.module("ui.bootstrap.accordion").value("$accordionSuppressWarning", !1).controller("AccordionController", ["$scope", "$attrs", "$controller", "$log", "$accordionSuppressWarning", function(a, b, c, d, e) {
    e || d.warn("AccordionController is now deprecated. Use UibAccordionController instead."),
    angular.extend(this, c("UibAccordionController", {
        $scope: a,
        $attrs: b
    }))
}
]).directive("accordion", ["$log", "$accordionSuppressWarning", function(a, b) {
    return {
        restrict: "EA",
        controller: "AccordionController",
        controllerAs: "accordion",
        transclude: !0,
        replace: !1,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/accordion/accordion.html"
        },
        link: function() {
            b || a.warn("accordion is now deprecated. Use uib-accordion instead.")
        }
    }
}
]).directive("accordionGroup", ["$log", "$accordionSuppressWarning", function(a, b) {
    return {
        require: "^accordion",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/accordion/accordion-group.html"
        },
        scope: {
            heading: "@",
            isOpen: "=?",
            isDisabled: "=?"
        },
        controller: function() {
            this.setHeading = function(a) {
                this.heading = a
            }
        },
        link: function(c, d, e, f) {
            b || a.warn("accordion-group is now deprecated. Use uib-accordion-group instead."),
            f.addGroup(c),
            c.openClass = e.openClass || "panel-open",
            c.panelClass = e.panelClass,
            c.$watch("isOpen", function(a) {
                d.toggleClass(c.openClass, !!a),
                a && f.closeOthers(c)
            }),
            c.toggleOpen = function(a) {
                c.isDisabled || a && 32 !== a.which || (c.isOpen = !c.isOpen)
            }
        }
    }
}
]).directive("accordionHeading", ["$log", "$accordionSuppressWarning", function(a, b) {
    return {
        restrict: "EA",
        transclude: !0,
        template: "",
        replace: !0,
        require: "^accordionGroup",
        link: function(c, d, e, f, g) {
            b || a.warn("accordion-heading is now deprecated. Use uib-accordion-heading instead."),
            f.setHeading(g(c, angular.noop))
        }
    }
}
]).directive("accordionTransclude", ["$log", "$accordionSuppressWarning", function(a, b) {
    return {
        require: "^accordionGroup",
        link: function(c, d, e, f) {
            b || a.warn("accordion-transclude is now deprecated. Use uib-accordion-transclude instead."),
            c.$watch(function() {
                return f[e.accordionTransclude]
            }, function(a) {
                a && (d.find("span").html(""),
                d.find("span").append(a))
            })
        }
    }
}
]),
angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$attrs", "$interpolate", "$timeout", function(a, b, c, d) {
    a.closeable = !!b.close;
    var e = angular.isDefined(b.dismissOnTimeout) ? c(b.dismissOnTimeout)(a.$parent) : null;
    e && d(function() {
        a.close()
    }, parseInt(e, 10))
}
]).directive("uibAlert", function() {
    return {
        controller: "UibAlertController",
        controllerAs: "alert",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/alert/alert.html"
        },
        transclude: !0,
        replace: !0,
        scope: {
            type: "@",
            close: "&"
        }
    }
}),
angular.module("ui.bootstrap.alert").value("$alertSuppressWarning", !1).controller("AlertController", ["$scope", "$attrs", "$controller", "$log", "$alertSuppressWarning", function(a, b, c, d, e) {
    e || d.warn("AlertController is now deprecated. Use UibAlertController instead."),
    angular.extend(this, c("UibAlertController", {
        $scope: a,
        $attrs: b
    }))
}
]).directive("alert", ["$log", "$alertSuppressWarning", function(a, b) {
    return {
        controller: "AlertController",
        controllerAs: "alert",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/alert/alert.html"
        },
        transclude: !0,
        replace: !0,
        scope: {
            type: "@",
            close: "&"
        },
        link: function() {
            b || a.warn("alert is now deprecated. Use uib-alert instead.")
        }
    }
}
]),
angular.module("ui.bootstrap.buttons", []).constant("uibButtonConfig", {
    activeClass: "active",
    toggleEvent: "click"
}).controller("UibButtonsController", ["uibButtonConfig", function(a) {
    this.activeClass = a.activeClass || "active",
    this.toggleEvent = a.toggleEvent || "click"
}
]).directive("uibBtnRadio", function() {
    return {
        require: ["uibBtnRadio", "ngModel"],
        controller: "UibButtonsController",
        controllerAs: "buttons",
        link: function(a, b, c, d) {
            var e = d[0]
              , f = d[1];
            b.find("input").css({
                display: "none"
            }),
            f.$render = function() {
                b.toggleClass(e.activeClass, angular.equals(f.$modelValue, a.$eval(c.uibBtnRadio)))
            }
            ,
            b.on(e.toggleEvent, function() {
                if (!c.disabled) {
                    var d = b.hasClass(e.activeClass);
                    (!d || angular.isDefined(c.uncheckable)) && a.$apply(function() {
                        f.$setViewValue(d ? null : a.$eval(c.uibBtnRadio)),
                        f.$render()
                    })
                }
            })
        }
    }
}).directive("uibBtnCheckbox", function() {
    return {
        require: ["uibBtnCheckbox", "ngModel"],
        controller: "UibButtonsController",
        controllerAs: "button",
        link: function(a, b, c, d) {
            function e() {
                return g(c.btnCheckboxTrue, !0)
            }
            function f() {
                return g(c.btnCheckboxFalse, !1)
            }
            function g(b, c) {
                return angular.isDefined(b) ? a.$eval(b) : c
            }
            var h = d[0]
              , i = d[1];
            b.find("input").css({
                display: "none"
            }),
            i.$render = function() {
                b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()))
            }
            ,
            b.on(h.toggleEvent, function() {
                c.disabled || a.$apply(function() {
                    i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()),
                    i.$render()
                })
            })
        }
    }
}),
angular.module("ui.bootstrap.buttons").value("$buttonsSuppressWarning", !1).controller("ButtonsController", ["$controller", "$log", "$buttonsSuppressWarning", function(a, b, c) {
    c || b.warn("ButtonsController is now deprecated. Use UibButtonsController instead."),
    angular.extend(this, a("UibButtonsController"))
}
]).directive("btnRadio", ["$log", "$buttonsSuppressWarning", function(a, b) {
    return {
        require: ["btnRadio", "ngModel"],
        controller: "ButtonsController",
        controllerAs: "buttons",
        link: function(c, d, e, f) {
            b || a.warn("btn-radio is now deprecated. Use uib-btn-radio instead.");
            var g = f[0]
              , h = f[1];
            d.find("input").css({
                display: "none"
            }),
            h.$render = function() {
                d.toggleClass(g.activeClass, angular.equals(h.$modelValue, c.$eval(e.btnRadio)))
            }
            ,
            d.bind(g.toggleEvent, function() {
                if (!e.disabled) {
                    var a = d.hasClass(g.activeClass);
                    (!a || angular.isDefined(e.uncheckable)) && c.$apply(function() {
                        h.$setViewValue(a ? null : c.$eval(e.btnRadio)),
                        h.$render()
                    })
                }
            })
        }
    }
}
]).directive("btnCheckbox", ["$document", "$log", "$buttonsSuppressWarning", function(a, b, c) {
    return {
        require: ["btnCheckbox", "ngModel"],
        controller: "ButtonsController",
        controllerAs: "button",
        link: function(d, e, f, g) {
            function h() {
                return j(f.btnCheckboxTrue, !0)
            }
            function i() {
                return j(f.btnCheckboxFalse, !1)
            }
            function j(a, b) {
                var c = d.$eval(a);
                return angular.isDefined(c) ? c : b
            }
            c || b.warn("btn-checkbox is now deprecated. Use uib-btn-checkbox instead.");
            var k = g[0]
              , l = g[1];
            e.find("input").css({
                display: "none"
            }),
            l.$render = function() {
                e.toggleClass(k.activeClass, angular.equals(l.$modelValue, h()))
            }
            ,
            e.bind(k.toggleEvent, function() {
                f.disabled || d.$apply(function() {
                    l.$setViewValue(e.hasClass(k.activeClass) ? i() : h()),
                    l.$render()
                })
            }),
            e.on("keypress", function(b) {
                f.disabled || 32 !== b.which || a[0].activeElement !== e[0] || d.$apply(function() {
                    l.$setViewValue(e.hasClass(k.activeClass) ? i() : h()),
                    l.$render()
                })
            })
        }
    }
}
]),
angular.module("ui.bootstrap.carousel", []).controller("UibCarouselController", ["$scope", "$element", "$interval", "$animate", function(a, b, c, d) {
    function e(b, c, e) {
        s || (angular.extend(b, {
            direction: e,
            active: !0
        }),
        angular.extend(m.currentSlide || {}, {
            direction: e,
            active: !1
        }),
        d.enabled() && !a.noTransition && !a.$currentTransition && b.$element && m.slides.length > 1 && (b.$element.data(q, b.direction),
        m.currentSlide && m.currentSlide.$element && m.currentSlide.$element.data(q, b.direction),
        a.$currentTransition = !0,
        o ? d.on("addClass", b.$element, function(b, c) {
            "close" === c && (a.$currentTransition = null,
            d.off("addClass", b))
        }) : b.$element.one("$animate:close", function() {
            a.$currentTransition = null
        })),
        m.currentSlide = b,
        r = c,
        g())
    }
    function f(a) {
        if (angular.isUndefined(n[a].index))
            return n[a];
        var b;
        n.length;
        for (b = 0; b < n.length; ++b)
            if (n[b].index == a)
                return n[b]
    }
    function g() {
        h();
        var b = +a.interval;
        !isNaN(b) && b > 0 && (k = c(i, b))
    }
    function h() {
        k && (c.cancel(k),
        k = null)
    }
    function i() {
        var b = +a.interval;
        l && !isNaN(b) && b > 0 && n.length ? a.next() : a.pause()
    }
    function j(b) {
        b.length || (a.$currentTransition = null)
    }
    var k, l, m = this, n = m.slides = a.slides = [], o = angular.version.minor >= 4, p = "uib-noTransition", q = "uib-slideDirection", r = -1;
    m.currentSlide = null;
    var s = !1;
    m.select = a.select = function(b, c) {
        var d = a.indexOfSlide(b);
        void 0 === c && (c = d > m.getCurrentIndex() ? "next" : "prev"),
        b && b !== m.currentSlide && !a.$currentTransition && e(b, d, c)
    }
    ,
    a.$on("$destroy", function() {
        s = !0
    }),
    m.getCurrentIndex = function() {
        return m.currentSlide && angular.isDefined(m.currentSlide.index) ? +m.currentSlide.index : r
    }
    ,
    a.indexOfSlide = function(a) {
        return angular.isDefined(a.index) ? +a.index : n.indexOf(a)
    }
    ,
    a.next = function() {
        var b = (m.getCurrentIndex() + 1) % n.length;
        return 0 === b && a.noWrap() ? void a.pause() : m.select(f(b), "next")
    }
    ,
    a.prev = function() {
        var b = m.getCurrentIndex() - 1 < 0 ? n.length - 1 : m.getCurrentIndex() - 1;
        return a.noWrap() && b === n.length - 1 ? void a.pause() : m.select(f(b), "prev")
    }
    ,
    a.isActive = function(a) {
        return m.currentSlide === a
    }
    ,
    a.$watch("interval", g),
    a.$watchCollection("slides", j),
    a.$on("$destroy", h),
    a.play = function() {
        l || (l = !0,
        g())
    }
    ,
    a.pause = function() {
        a.noPause || (l = !1,
        h())
    }
    ,
    m.addSlide = function(b, c) {
        b.$element = c,
        n.push(b),
        1 === n.length || b.active ? (m.select(n[n.length - 1]),
        1 === n.length && a.play()) : b.active = !1
    }
    ,
    m.removeSlide = function(a) {
        angular.isDefined(a.index) && n.sort(function(a, b) {
            return +a.index > +b.index
        });
        var b = n.indexOf(a);
        n.splice(b, 1),
        n.length > 0 && a.active ? b >= n.length ? m.select(n[b - 1]) : m.select(n[b]) : r > b && r--,
        0 === n.length && (m.currentSlide = null)
    }
    ,
    a.$watch("noTransition", function(a) {
        b.data(p, a)
    })
}
]).directive("uibCarousel", [function() {
    return {
        transclude: !0,
        replace: !0,
        controller: "UibCarouselController",
        controllerAs: "carousel",
        require: "carousel",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/carousel/carousel.html"
        },
        scope: {
            interval: "=",
            noTransition: "=",
            noPause: "=",
            noWrap: "&"
        }
    }
}
]).directive("uibSlide", function() {
    return {
        require: "^uibCarousel",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/carousel/slide.html"
        },
        scope: {
            active: "=?",
            actual: "=?",
            index: "=?"
        },
        link: function(a, b, c, d) {
            d.addSlide(a, b),
            a.$on("$destroy", function() {
                d.removeSlide(a)
            }),
            a.$watch("active", function(b) {
                b && d.select(a)
            })
        }
    }
}).animation(".item", ["$injector", "$animate", function(a, b) {
    function c(a, b, c) {
        a.removeClass(b),
        c && c()
    }
    var d = "uib-noTransition"
      , e = "uib-slideDirection"
      , f = null;
    return a.has("$animateCss") && (f = a.get("$animateCss")),
    {
        beforeAddClass: function(a, g, h) {
            if ("active" == g && a.parent() && a.parent().parent() && !a.parent().parent().data(d)) {
                var i = !1
                  , j = a.data(e)
                  , k = "next" == j ? "left" : "right"
                  , l = c.bind(this, a, k + " " + j, h);
                return a.addClass(j),
                f ? f(a, {
                    addClass: k
                }).start().done(l) : b.addClass(a, k).then(function() {
                    i || l(),
                    h()
                }),
                function() {
                    i = !0
                }
            }
            h()
        },
        beforeRemoveClass: function(a, g, h) {
            if ("active" === g && a.parent() && a.parent().parent() && !a.parent().parent().data(d)) {
                var i = !1
                  , j = a.data(e)
                  , k = "next" == j ? "left" : "right"
                  , l = c.bind(this, a, k, h);
                return f ? f(a, {
                    addClass: k
                }).start().done(l) : b.addClass(a, k).then(function() {
                    i || l(),
                    h()
                }),
                function() {
                    i = !0
                }
            }
            h()
        }
    }
}
]),
angular.module("ui.bootstrap.carousel").value("$carouselSuppressWarning", !1).controller("CarouselController", ["$scope", "$element", "$controller", "$log", "$carouselSuppressWarning", function(a, b, c, d, e) {
    e || d.warn("CarouselController is now deprecated. Use UibCarouselController instead."),
    angular.extend(this, c("UibCarouselController", {
        $scope: a,
        $element: b
    }))
}
]).directive("carousel", ["$log", "$carouselSuppressWarning", function(a, b) {
    return {
        transclude: !0,
        replace: !0,
        controller: "CarouselController",
        controllerAs: "carousel",
        require: "carousel",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/carousel/carousel.html"
        },
        scope: {
            interval: "=",
            noTransition: "=",
            noPause: "=",
            noWrap: "&"
        },
        link: function() {
            b || a.warn("carousel is now deprecated. Use uib-carousel instead.")
        }
    }
}
]).directive("slide", ["$log", "$carouselSuppressWarning", function(a, b) {
    return {
        require: "^carousel",
        transclude: !0,
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/carousel/slide.html"
        },
        scope: {
            active: "=?",
            actual: "=?",
            index: "=?"
        },
        link: function(c, d, e, f) {
            b || a.warn("slide is now deprecated. Use uib-slide instead."),
            f.addSlide(c, d),
            c.$on("$destroy", function() {
                f.removeSlide(c)
            }),
            c.$watch("active", function(a) {
                a && f.select(c)
            })
        }
    }
}
]),
angular.module("ui.bootstrap.dateparser", []).service("uibDateParser", ["$log", "$locale", "orderByFilter", function(a, b, c) {
    function d(a) {
        var b = []
          , d = a.split("");
        return angular.forEach(g, function(c, e) {
            var f = a.indexOf(e);
            if (f > -1) {
                a = a.split(""),
                d[f] = "(" + c.regex + ")",
                a[f] = "$";
                for (var g = f + 1, h = f + e.length; h > g; g++)
                    d[g] = "",
                    a[g] = "$";
                a = a.join(""),
                b.push({
                    index: f,
                    apply: c.apply
                })
            }
        }),
        {
            regex: new RegExp("^" + d.join("") + "$"),
            map: c(b, "index")
        }
    }
    function e(a, b, c) {
        return 1 > c ? !1 : 1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 === b || 5 === b || 8 === b || 10 === b ? 31 > c : !0
    }
    var f, g, h = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
    this.init = function() {
        f = b.id,
        this.parsers = {},
        g = {
            yyyy: {
                regex: "\\d{4}",
                apply: function(a) {
                    this.year = +a
                }
            },
            yy: {
                regex: "\\d{2}",
                apply: function(a) {
                    this.year = +a + 2e3
                }
            },
            y: {
                regex: "\\d{1,4}",
                apply: function(a) {
                    this.year = +a
                }
            },
            MMMM: {
                regex: b.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(a) {
                    this.month = b.DATETIME_FORMATS.MONTH.indexOf(a)
                }
            },
            MMM: {
                regex: b.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(a) {
                    this.month = b.DATETIME_FORMATS.SHORTMONTH.indexOf(a)
                }
            },
            MM: {
                regex: "0[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                }
            },
            M: {
                regex: "[1-9]|1[0-2]",
                apply: function(a) {
                    this.month = a - 1
                }
            },
            dd: {
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                }
            },
            d: {
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(a) {
                    this.date = +a
                }
            },
            EEEE: {
                regex: b.DATETIME_FORMATS.DAY.join("|")
            },
            EEE: {
                regex: b.DATETIME_FORMATS.SHORTDAY.join("|")
            },
            HH: {
                regex: "(?:0|1)[0-9]|2[0-3]",
                apply: function(a) {
                    this.hours = +a
                }
            },
            hh: {
                regex: "0[0-9]|1[0-2]",
                apply: function(a) {
                    this.hours = +a
                }
            },
            H: {
                regex: "1?[0-9]|2[0-3]",
                apply: function(a) {
                    this.hours = +a
                }
            },
            h: {
                regex: "[0-9]|1[0-2]",
                apply: function(a) {
                    this.hours = +a
                }
            },
            mm: {
                regex: "[0-5][0-9]",
                apply: function(a) {
                    this.minutes = +a
                }
            },
            m: {
                regex: "[0-9]|[1-5][0-9]",
                apply: function(a) {
                    this.minutes = +a
                }
            },
            sss: {
                regex: "[0-9][0-9][0-9]",
                apply: function(a) {
                    this.milliseconds = +a
                }
            },
            ss: {
                regex: "[0-5][0-9]",
                apply: function(a) {
                    this.seconds = +a
                }
            },
            s: {
                regex: "[0-9]|[1-5][0-9]",
                apply: function(a) {
                    this.seconds = +a
                }
            },
            a: {
                regex: b.DATETIME_FORMATS.AMPMS.join("|"),
                apply: function(a) {
                    12 === this.hours && (this.hours = 0),
                    "PM" === a && (this.hours += 12)
                }
            }
        }
    }
    ,
    this.init(),
    this.parse = function(c, g, i) {
        if (!angular.isString(c) || !g)
            return c;
        g = b.DATETIME_FORMATS[g] || g,
        g = g.replace(h, "\\$&"),
        b.id !== f && this.init(),
        this.parsers[g] || (this.parsers[g] = d(g));
        var j = this.parsers[g]
          , k = j.regex
          , l = j.map
          , m = c.match(k);
        if (m && m.length) {
            var n, o;
            angular.isDate(i) && !isNaN(i.getTime()) ? n = {
                year: i.getFullYear(),
                month: i.getMonth(),
                date: i.getDate(),
                hours: i.getHours(),
                minutes: i.getMinutes(),
                seconds: i.getSeconds(),
                milliseconds: i.getMilliseconds()
            } : (i && a.warn("dateparser:", "baseDate is not a valid date"),
            n = {
                year: 1900,
                month: 0,
                date: 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            });
            for (var p = 1, q = m.length; q > p; p++) {
                var r = l[p - 1];
                r.apply && r.apply.call(n, m[p])
            }
            return e(n.year, n.month, n.date) && (angular.isDate(i) && !isNaN(i.getTime()) ? (o = new Date(i),
            o.setFullYear(n.year, n.month, n.date, n.hours, n.minutes, n.seconds, n.milliseconds || 0)) : o = new Date(n.year,n.month,n.date,n.hours,n.minutes,n.seconds,n.milliseconds || 0)),
            o
        }
    }
}
]),
angular.module("ui.bootstrap.dateparser").value("$dateParserSuppressWarning", !1).service("dateParser", ["$log", "$dateParserSuppressWarning", "uibDateParser", function(a, b, c) {
    b || a.warn("dateParser is now deprecated. Use uibDateParser instead."),
    angular.extend(this, c)
}
]),
angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function(a, b) {
    function c(a, c) {
        return a.currentStyle ? a.currentStyle[c] : b.getComputedStyle ? b.getComputedStyle(a)[c] : a.style[c]
    }
    function d(a) {
        return "static" === (c(a, "position") || "static")
    }
    var e = function(b) {
        for (var c = a[0], e = b.offsetParent || c; e && e !== c && d(e); )
            e = e.offsetParent;
        return e || c
    };
    return {
        position: function(b) {
            var c = this.offset(b)
              , d = {
                top: 0,
                left: 0
            }
              , f = e(b[0]);
            f != a[0] && (d = this.offset(angular.element(f)),
            d.top += f.clientTop - f.scrollTop,
            d.left += f.clientLeft - f.scrollLeft);
            var g = b[0].getBoundingClientRect();
            return {
                width: g.width || b.prop("offsetWidth"),
                height: g.height || b.prop("offsetHeight"),
                top: c.top - d.top,
                left: c.left - d.left
            }
        },
        offset: function(c) {
            var d = c[0].getBoundingClientRect();
            return {
                width: d.width || c.prop("offsetWidth"),
                height: d.height || c.prop("offsetHeight"),
                top: d.top + (b.pageYOffset || a[0].documentElement.scrollTop),
                left: d.left + (b.pageXOffset || a[0].documentElement.scrollLeft)
            }
        },
        positionElements: function(a, b, c, d) {
            var e, f, g, h, i = c.split("-"), j = i[0], k = i[1] || "center";
            e = d ? this.offset(a) : this.position(a),
            f = b.prop("offsetWidth"),
            g = b.prop("offsetHeight");
            var l = {
                center: function() {
                    return e.left + e.width / 2 - f / 2
                },
                left: function() {
                    return e.left
                },
                right: function() {
                    return e.left + e.width
                }
            }
              , m = {
                center: function() {
                    return e.top + e.height / 2 - g / 2
                },
                top: function() {
                    return e.top
                },
                bottom: function() {
                    return e.top + e.height
                }
            };
            switch (j) {
            case "right":
                h = {
                    top: m[k](),
                    left: l[j]()
                };
                break;
            case "left":
                h = {
                    top: m[k](),
                    left: e.left - f
                };
                break;
            case "bottom":
                h = {
                    top: m[j](),
                    left: l[k]()
                };
                break;
            default:
                h = {
                    top: e.top - g,
                    left: l[k]()
                }
            }
            return h
        }
    }
}
]),
angular.module("ui.bootstrap.position").value("$positionSuppressWarning", !1).service("$position", ["$log", "$positionSuppressWarning", "$uibPosition", function(a, b, c) {
    b || a.warn("$position is now deprecated. Use $uibPosition instead."),
    angular.extend(this, c)
}
]),
angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"]).value("$datepickerSuppressError", !1).constant("uibDatepickerConfig", {
    formatDay: "dd",
    formatMonth: "MMMM",
    formatYear: "yyyy",
    formatDayHeader: "EEE",
    formatDayTitle: "MMMM yyyy",
    formatMonthTitle: "yyyy",
    datepickerMode: "day",
    minMode: "day",
    maxMode: "year",
    showWeeks: !0,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null,
    shortcutPropagation: !1
}).controller("UibDatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$log", "dateFilter", "uibDatepickerConfig", "$datepickerSuppressError", function(a, b, c, d, e, f, g, h) {
    var i = this
      , j = {
        $setViewValue: angular.noop
    };
    this.modes = ["day", "month", "year"],
    angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "showWeeks", "startingDay", "yearRange", "shortcutPropagation"], function(c, e) {
        i[c] = angular.isDefined(b[c]) ? 6 > e ? d(b[c])(a.$parent) : a.$parent.$eval(b[c]) : g[c]
    }),
    angular.forEach(["minDate", "maxDate"], function(d) {
        b[d] ? a.$parent.$watch(c(b[d]), function(a) {
            i[d] = a ? new Date(a) : null,
            i.refreshView()
        }) : i[d] = g[d] ? new Date(g[d]) : null
    }),
    angular.forEach(["minMode", "maxMode"], function(d) {
        b[d] ? a.$parent.$watch(c(b[d]), function(c) {
            i[d] = angular.isDefined(c) ? c : b[d],
            a[d] = i[d],
            ("minMode" == d && i.modes.indexOf(a.datepickerMode) < i.modes.indexOf(i[d]) || "maxMode" == d && i.modes.indexOf(a.datepickerMode) > i.modes.indexOf(i[d])) && (a.datepickerMode = i[d])
        }) : (i[d] = g[d] || null,
        a[d] = i[d])
    }),
    a.datepickerMode = a.datepickerMode || g.datepickerMode,
    a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()),
    angular.isDefined(b.initDate) ? (this.activeDate = a.$parent.$eval(b.initDate) || new Date,
    a.$parent.$watch(b.initDate, function(a) {
        a && (j.$isEmpty(j.$modelValue) || j.$invalid) && (i.activeDate = a,
        i.refreshView())
    })) : this.activeDate = new Date,
    a.isActive = function(b) {
        return 0 === i.compare(b.date, i.activeDate) ? (a.activeDateId = b.uid,
        !0) : !1
    }
    ,
    this.init = function(a) {
        j = a,
        j.$render = function() {
            i.render()
        }
    }
    ,
    this.render = function() {
        if (j.$viewValue) {
            var a = new Date(j.$viewValue)
              , b = !isNaN(a);
            b ? this.activeDate = a : h || e.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')
        }
        this.refreshView()
    }
    ,
    this.refreshView = function() {
        if (this.element) {
            this._refreshView();
            var a = j.$viewValue ? new Date(j.$viewValue) : null;
            j.$setValidity("dateDisabled", !a || this.element && !this.isDisabled(a))
        }
    }
    ,
    this.createDateObject = function(a, b) {
        var c = j.$viewValue ? new Date(j.$viewValue) : null;
        return {
            date: a,
            label: f(a, b),
            selected: c && 0 === this.compare(a, c),
            disabled: this.isDisabled(a),
            current: 0 === this.compare(a, new Date),
            customClass: this.customClass(a)
        }
    }
    ,
    this.isDisabled = function(c) {
        return this.minDate && this.compare(c, this.minDate) < 0 || this.maxDate && this.compare(c, this.maxDate) > 0 || b.dateDisabled && a.dateDisabled({
            date: c,
            mode: a.datepickerMode
        })
    }
    ,
    this.customClass = function(b) {
        return a.customClass({
            date: b,
            mode: a.datepickerMode
        })
    }
    ,
    this.split = function(a, b) {
        for (var c = []; a.length > 0; )
            c.push(a.splice(0, b));
        return c
    }
    ,
    a.select = function(b) {
        if (a.datepickerMode === i.minMode) {
            var c = j.$viewValue ? new Date(j.$viewValue) : new Date(0,0,0,0,0,0,0);
            c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()),
            j.$setViewValue(c),
            j.$render()
        } else
            i.activeDate = b,
            a.datepickerMode = i.modes[i.modes.indexOf(a.datepickerMode) - 1]
    }
    ,
    a.move = function(a) {
        var b = i.activeDate.getFullYear() + a * (i.step.years || 0)
          , c = i.activeDate.getMonth() + a * (i.step.months || 0);
        i.activeDate.setFullYear(b, c, 1),
        i.refreshView()
    }
    ,
    a.toggleMode = function(b) {
        b = b || 1,
        a.datepickerMode === i.maxMode && 1 === b || a.datepickerMode === i.minMode && -1 === b || (a.datepickerMode = i.modes[i.modes.indexOf(a.datepickerMode) + b])
    }
    ,
    a.keys = {
        13: "enter",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    var k = function() {
        i.element[0].focus()
    };
    a.$on("uib:datepicker.focus", k),
    a.keydown = function(b) {
        var c = a.keys[b.which];
        if (c && !b.shiftKey && !b.altKey)
            if (b.preventDefault(),
            i.shortcutPropagation || b.stopPropagation(),
            "enter" === c || "space" === c) {
                if (i.isDisabled(i.activeDate))
                    return;
                a.select(i.activeDate)
            } else
                !b.ctrlKey || "up" !== c && "down" !== c ? (i.handleKeyDown(c, b),
                i.refreshView()) : a.toggleMode("up" === c ? 1 : -1)
    }
}
]).controller("UibDaypickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
    function d(a, b) {
        return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? f[b] : 29
    }
    function e(a) {
        var b = new Date(a);
        b.setDate(b.getDate() + 4 - (b.getDay() || 7));
        var c = b.getTime();
        return b.setMonth(0),
        b.setDate(1),
        Math.floor(Math.round((c - b) / 864e5) / 7) + 1
    }
    var f = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.step = {
        months: 1
    },
    this.element = b,
    this.init = function(b) {
        angular.extend(b, this),
        a.showWeeks = b.showWeeks,
        b.refreshView()
    }
    ,
    this.getDates = function(a, b) {
        for (var c, d = new Array(b), e = new Date(a), f = 0; b > f; )
            c = new Date(e),
            d[f++] = c,
            e.setDate(e.getDate() + 1);
        return d
    }
    ,
    this._refreshView = function() {
        var b = this.activeDate.getFullYear()
          , d = this.activeDate.getMonth()
          , f = new Date(this.activeDate);
        f.setFullYear(b, d, 1);
        var g = this.startingDay - f.getDay()
          , h = g > 0 ? 7 - g : -g
          , i = new Date(f);
        h > 0 && i.setDate(-h + 1);
        for (var j = this.getDates(i, 42), k = 0; 42 > k; k++)
            j[k] = angular.extend(this.createDateObject(j[k], this.formatDay), {
                secondary: j[k].getMonth() !== d,
                uid: a.uniqueId + "-" + k
            });
        a.labels = new Array(7);
        for (var l = 0; 7 > l; l++)
            a.labels[l] = {
                abbr: c(j[l].date, this.formatDayHeader),
                full: c(j[l].date, "EEEE")
            };
        if (a.title = c(this.activeDate, this.formatDayTitle),
        a.rows = this.split(j, 7),
        a.showWeeks) {
            a.weekNumbers = [];
            for (var m = (11 - this.startingDay) % 7, n = a.rows.length, o = 0; n > o; o++)
                a.weekNumbers.push(e(a.rows[o][m].date))
        }
    }
    ,
    this.compare = function(a, b) {
        return new Date(a.getFullYear(),a.getMonth(),a.getDate()) - new Date(b.getFullYear(),b.getMonth(),b.getDate())
    }
    ,
    this.handleKeyDown = function(a, b) {
        var c = this.activeDate.getDate();
        if ("left" === a)
            c -= 1;
        else if ("up" === a)
            c -= 7;
        else if ("right" === a)
            c += 1;
        else if ("down" === a)
            c += 7;
        else if ("pageup" === a || "pagedown" === a) {
            var e = this.activeDate.getMonth() + ("pageup" === a ? -1 : 1);
            this.activeDate.setMonth(e, 1),
            c = Math.min(d(this.activeDate.getFullYear(), this.activeDate.getMonth()), c)
        } else
            "home" === a ? c = 1 : "end" === a && (c = d(this.activeDate.getFullYear(), this.activeDate.getMonth()));
        this.activeDate.setDate(c)
    }
}
]).controller("UibMonthpickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
    this.step = {
        years: 1
    },
    this.element = b,
    this.init = function(a) {
        angular.extend(a, this),
        a.refreshView()
    }
    ,
    this._refreshView = function() {
        for (var b, d = new Array(12), e = this.activeDate.getFullYear(), f = 0; 12 > f; f++)
            b = new Date(this.activeDate),
            b.setFullYear(e, f, 1),
            d[f] = angular.extend(this.createDateObject(b, this.formatMonth), {
                uid: a.uniqueId + "-" + f
            });
        a.title = c(this.activeDate, this.formatMonthTitle),
        a.rows = this.split(d, 3)
    }
    ,
    this.compare = function(a, b) {
        return new Date(a.getFullYear(),a.getMonth()) - new Date(b.getFullYear(),b.getMonth())
    }
    ,
    this.handleKeyDown = function(a, b) {
        var c = this.activeDate.getMonth();
        if ("left" === a)
            c -= 1;
        else if ("up" === a)
            c -= 3;
        else if ("right" === a)
            c += 1;
        else if ("down" === a)
            c += 3;
        else if ("pageup" === a || "pagedown" === a) {
            var d = this.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);
            this.activeDate.setFullYear(d)
        } else
            "home" === a ? c = 0 : "end" === a && (c = 11);
        this.activeDate.setMonth(c)
    }
}
]).controller("UibYearpickerController", ["$scope", "$element", "dateFilter", function(a, b, c) {
    function d(a) {
        return parseInt((a - 1) / e, 10) * e + 1
    }
    var e;
    this.element = b,
    this.yearpickerInit = function() {
        e = this.yearRange,
        this.step = {
            years: e
        }
    }
    ,
    this._refreshView = function() {
        for (var b, c = new Array(e), f = 0, g = d(this.activeDate.getFullYear()); e > f; f++)
            b = new Date(this.activeDate),
            b.setFullYear(g + f, 0, 1),
            c[f] = angular.extend(this.createDateObject(b, this.formatYear), {
                uid: a.uniqueId + "-" + f
            });
        a.title = [c[0].label, c[e - 1].label].join(" - "),
        a.rows = this.split(c, 5)
    }
    ,
    this.compare = function(a, b) {
        return a.getFullYear() - b.getFullYear()
    }
    ,
    this.handleKeyDown = function(a, b) {
        var c = this.activeDate.getFullYear();
        "left" === a ? c -= 1 : "up" === a ? c -= 5 : "right" === a ? c += 1 : "down" === a ? c += 5 : "pageup" === a || "pagedown" === a ? c += ("pageup" === a ? -1 : 1) * this.step.years : "home" === a ? c = d(this.activeDate.getFullYear()) : "end" === a && (c = d(this.activeDate.getFullYear()) + e - 1),
        this.activeDate.setFullYear(c)
    }
}
]).directive("uibDatepicker", function() {
    return {
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/datepicker.html"
        },
        scope: {
            datepickerMode: "=?",
            dateDisabled: "&",
            customClass: "&",
            shortcutPropagation: "&?"
        },
        require: ["uibDatepicker", "^ngModel"],
        controller: "UibDatepickerController",
        controllerAs: "datepicker",
        link: function(a, b, c, d) {
            var e = d[0]
              , f = d[1];
            e.init(f)
        }
    }
}).directive("uibDaypicker", function() {
    return {
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/day.html"
        },
        require: ["^?uibDatepicker", "uibDaypicker", "^?datepicker"],
        controller: "UibDaypickerController",
        link: function(a, b, c, d) {
            var e = d[0] || d[2]
              , f = d[1];
            f.init(e)
        }
    }
}).directive("uibMonthpicker", function() {
    return {
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/month.html"
        },
        require: ["^?uibDatepicker", "uibMonthpicker", "^?datepicker"],
        controller: "UibMonthpickerController",
        link: function(a, b, c, d) {
            var e = d[0] || d[2]
              , f = d[1];
            f.init(e)
        }
    }
}).directive("uibYearpicker", function() {
    return {
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/year.html"
        },
        require: ["^?uibDatepicker", "uibYearpicker", "^?datepicker"],
        controller: "UibYearpickerController",
        link: function(a, b, c, d) {
            var e = d[0] || d[2];
            angular.extend(e, d[1]),
            e.yearpickerInit(),
            e.refreshView()
        }
    }
}).constant("uibDatepickerPopupConfig", {
    datepickerPopup: "yyyy-MM-dd",
    datepickerPopupTemplateUrl: "template/datepicker/popup.html",
    datepickerTemplateUrl: "template/datepicker/datepicker.html",
    html5Types: {
        date: "yyyy-MM-dd",
        "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss",
        month: "yyyy-MM"
    },
    currentText: "Today",
    clearText: "Clear",
    closeText: "Done",
    closeOnDateSelection: !0,
    appendToBody: !1,
    showButtonBar: !0,
    onOpenFocus: !0
}).controller("UibDatepickerPopupController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$document", "$rootScope", "$uibPosition", "dateFilter", "uibDateParser", "uibDatepickerPopupConfig", "$timeout", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m(a) {
        return a.replace(/([A-Z])/g, function(a) {
            return "-" + a.toLowerCase()
        })
    }
    function n(b) {
        if (angular.isNumber(b) && (b = new Date(b)),
        b) {
            if (angular.isDate(b) && !isNaN(b))
                return b;
            if (angular.isString(b)) {
                var c = j.parse(b, r, a.date);
                return isNaN(c) ? void 0 : c
            }
            return void 0
        }
        return null
    }
    function o(a, b) {
        var d = a || b;
        if (!c.ngRequired && !d)
            return !0;
        if (angular.isNumber(d) && (d = new Date(d)),
        d) {
            if (angular.isDate(d) && !isNaN(d))
                return !0;
            if (angular.isString(d)) {
                var e = j.parse(d, r);
                return !isNaN(e)
            }
            return !1
        }
        return !0
    }
    function p(c) {
        var d = A[0]
          , e = b[0].contains(c.target)
          , f = void 0 !== d.contains && d.contains(c.target);
        !a.isOpen || e || f || a.$apply(function() {
            a.isOpen = !1
        })
    }
    function q(c) {
        27 === c.which && a.isOpen ? (c.preventDefault(),
        c.stopPropagation(),
        a.$apply(function() {
            a.isOpen = !1
        }),
        b[0].focus()) : 40 !== c.which || a.isOpen || (c.preventDefault(),
        c.stopPropagation(),
        a.$apply(function() {
            a.isOpen = !0
        }))
    }
    var r, s, t, u, v, w, x, y, z, A, B = {}, C = !1;
    a.watchData = {},
    this.init = function(h) {
        if (z = h,
        s = angular.isDefined(c.closeOnDateSelection) ? a.$parent.$eval(c.closeOnDateSelection) : k.closeOnDateSelection,
        t = angular.isDefined(c.datepickerAppendToBody) ? a.$parent.$eval(c.datepickerAppendToBody) : k.appendToBody,
        u = angular.isDefined(c.onOpenFocus) ? a.$parent.$eval(c.onOpenFocus) : k.onOpenFocus,
        v = angular.isDefined(c.datepickerPopupTemplateUrl) ? c.datepickerPopupTemplateUrl : k.datepickerPopupTemplateUrl,
        w = angular.isDefined(c.datepickerTemplateUrl) ? c.datepickerTemplateUrl : k.datepickerTemplateUrl,
        a.showButtonBar = angular.isDefined(c.showButtonBar) ? a.$parent.$eval(c.showButtonBar) : k.showButtonBar,
        k.html5Types[c.type] ? (r = k.html5Types[c.type],
        C = !0) : (r = c.datepickerPopup || c.uibDatepickerPopup || k.datepickerPopup,
        c.$observe("uibDatepickerPopup", function(a, b) {
            var c = a || k.datepickerPopup;
            if (c !== r && (r = c,
            z.$modelValue = null,
            !r))
                throw new Error("uibDatepickerPopup must have a date format specified.")
        })),
        !r)
            throw new Error("uibDatepickerPopup must have a date format specified.");
        if (C && c.datepickerPopup)
            throw new Error("HTML5 date input types do not support custom formats.");
        if (x = angular.element("<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>"),
        x.attr({
            "ng-model": "date",
            "ng-change": "dateSelection(date)",
            "template-url": v
        }),
        y = angular.element(x.children()[0]),
        y.attr("template-url", w),
        C && "month" === c.type && (y.attr("datepicker-mode", '"month"'),
        y.attr("min-mode", "month")),
        c.datepickerOptions) {
            var l = a.$parent.$eval(c.datepickerOptions);
            l && l.initDate && (a.initDate = l.initDate,
            y.attr("init-date", "initDate"),
            delete l.initDate),
            angular.forEach(l, function(a, b) {
                y.attr(m(b), a)
            })
        }
        angular.forEach(["minMode", "maxMode", "minDate", "maxDate", "datepickerMode", "initDate", "shortcutPropagation"], function(b) {
            if (c[b]) {
                var d = e(c[b]);
                if (a.$parent.$watch(d, function(c) {
                    a.watchData[b] = c,
                    ("minDate" === b || "maxDate" === b) && (B[b] = new Date(c))
                }),
                y.attr(m(b), "watchData." + b),
                "datepickerMode" === b) {
                    var f = d.assign;
                    a.$watch("watchData." + b, function(b, c) {
                        angular.isFunction(f) && b !== c && f(a.$parent, b)
                    })
                }
            }
        }),
        c.dateDisabled && y.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"),
        c.showWeeks && y.attr("show-weeks", c.showWeeks),
        c.customClass && y.attr("custom-class", "customClass({ date: date, mode: mode })"),
        C ? z.$formatters.push(function(b) {
            return a.date = b,
            b
        }) : (z.$$parserName = "date",
        z.$validators.date = o,
        z.$parsers.unshift(n),
        z.$formatters.push(function(b) {
            return a.date = b,
            z.$isEmpty(b) ? b : i(b, r)
        })),
        z.$viewChangeListeners.push(function() {
            a.date = j.parse(z.$viewValue, r, a.date)
        }),
        b.bind("keydown", q),
        A = d(x)(a),
        x.remove(),
        t ? f.find("body").append(A) : b.after(A),
        a.$on("$destroy", function() {
            a.isOpen === !0 && (g.$$phase || a.$apply(function() {
                a.isOpen = !1
            })),
            A.remove(),
            b.unbind("keydown", q),
            f.unbind("click", p)
        })
    }
    ,
    a.getText = function(b) {
        return a[b + "Text"] || k[b + "Text"]
    }
    ,
    a.isDisabled = function(b) {
        return "today" === b && (b = new Date),
        a.watchData.minDate && a.compare(b, B.minDate) < 0 || a.watchData.maxDate && a.compare(b, B.maxDate) > 0
    }
    ,
    a.compare = function(a, b) {
        return new Date(a.getFullYear(),a.getMonth(),a.getDate()) - new Date(b.getFullYear(),b.getMonth(),b.getDate())
    }
    ,
    a.dateSelection = function(c) {
        angular.isDefined(c) && (a.date = c);
        var d = a.date ? i(a.date, r) : null;
        b.val(d),
        z.$setViewValue(d),
        s && (a.isOpen = !1,
        b[0].focus())
    }
    ,
    a.keydown = function(c) {
        27 === c.which && (a.isOpen = !1,
        b[0].focus())
    }
    ,
    a.select = function(b) {
        if ("today" === b) {
            var c = new Date;
            angular.isDate(a.date) ? (b = new Date(a.date),
            b.setFullYear(c.getFullYear(), c.getMonth(), c.getDate())) : b = new Date(c.setHours(0, 0, 0, 0))
        }
        a.dateSelection(b)
    }
    ,
    a.close = function() {
        a.isOpen = !1,
        b[0].focus()
    }
    ,
    a.$watch("isOpen", function(c) {
        c ? (a.position = t ? h.offset(b) : h.position(b),
        a.position.top = a.position.top + b.prop("offsetHeight"),
        l(function() {
            u && a.$broadcast("uib:datepicker.focus"),
            f.bind("click", p)
        }, 0, !1)) : f.unbind("click", p)
    })
}
]).directive("uibDatepickerPopup", function() {
    return {
        require: ["ngModel", "uibDatepickerPopup"],
        controller: "UibDatepickerPopupController",
        scope: {
            isOpen: "=?",
            currentText: "@",
            clearText: "@",
            closeText: "@",
            dateDisabled: "&",
            customClass: "&"
        },
        link: function(a, b, c, d) {
            var e = d[0]
              , f = d[1];
            f.init(e)
        }
    }
}).directive("uibDatepickerPopupWrap", function() {
    return {
        replace: !0,
        transclude: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/popup.html"
        }
    }
}),
angular.module("ui.bootstrap.datepicker").value("$datepickerSuppressWarning", !1).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$log", "dateFilter", "uibDatepickerConfig", "$datepickerSuppressError", "$datepickerSuppressWarning", function(a, b, c, d, e, f, g, h, i) {
    i || e.warn("DatepickerController is now deprecated. Use UibDatepickerController instead.");
    var j = this
      , k = {
        $setViewValue: angular.noop
    };
    this.modes = ["day", "month", "year"],
    angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "showWeeks", "startingDay", "yearRange", "shortcutPropagation"], function(c, e) {
        j[c] = angular.isDefined(b[c]) ? 6 > e ? d(b[c])(a.$parent) : a.$parent.$eval(b[c]) : g[c]
    }),
    angular.forEach(["minDate", "maxDate"], function(d) {
        b[d] ? a.$parent.$watch(c(b[d]), function(a) {
            j[d] = a ? new Date(a) : null,
            j.refreshView()
        }) : j[d] = g[d] ? new Date(g[d]) : null
    }),
    angular.forEach(["minMode", "maxMode"], function(d) {
        b[d] ? a.$parent.$watch(c(b[d]), function(c) {
            j[d] = angular.isDefined(c) ? c : b[d],
            a[d] = j[d],
            ("minMode" == d && j.modes.indexOf(a.datepickerMode) < j.modes.indexOf(j[d]) || "maxMode" == d && j.modes.indexOf(a.datepickerMode) > j.modes.indexOf(j[d])) && (a.datepickerMode = j[d])
        }) : (j[d] = g[d] || null,
        a[d] = j[d])
    }),
    a.datepickerMode = a.datepickerMode || g.datepickerMode,
    a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()),
    angular.isDefined(b.initDate) ? (this.activeDate = a.$parent.$eval(b.initDate) || new Date,
    a.$parent.$watch(b.initDate, function(a) {
        a && (k.$isEmpty(k.$modelValue) || k.$invalid) && (j.activeDate = a,
        j.refreshView())
    })) : this.activeDate = new Date,
    a.isActive = function(b) {
        return 0 === j.compare(b.date, j.activeDate) ? (a.activeDateId = b.uid,
        !0) : !1
    }
    ,
    this.init = function(a) {
        k = a,
        k.$render = function() {
            j.render()
        }
    }
    ,
    this.render = function() {
        if (k.$viewValue) {
            var a = new Date(k.$viewValue)
              , b = !isNaN(a);
            b ? this.activeDate = a : h || e.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')
        }
        this.refreshView()
    }
    ,
    this.refreshView = function() {
        if (this.element) {
            this._refreshView();
            var a = k.$viewValue ? new Date(k.$viewValue) : null;
            k.$setValidity("dateDisabled", !a || this.element && !this.isDisabled(a))
        }
    }
    ,
    this.createDateObject = function(a, b) {
        var c = k.$viewValue ? new Date(k.$viewValue) : null;
        return {
            date: a,
            label: f(a, b),
            selected: c && 0 === this.compare(a, c),
            disabled: this.isDisabled(a),
            current: 0 === this.compare(a, new Date),
            customClass: this.customClass(a)
        }
    }
    ,
    this.isDisabled = function(c) {
        return this.minDate && this.compare(c, this.minDate) < 0 || this.maxDate && this.compare(c, this.maxDate) > 0 || b.dateDisabled && a.dateDisabled({
            date: c,
            mode: a.datepickerMode
        })
    }
    ,
    this.customClass = function(b) {
        return a.customClass({
            date: b,
            mode: a.datepickerMode
        })
    }
    ,
    this.split = function(a, b) {
        for (var c = []; a.length > 0; )
            c.push(a.splice(0, b));
        return c
    }
    ,
    this.fixTimeZone = function(a) {
        var b = a.getHours();
        a.setHours(23 === b ? b + 2 : 0)
    }
    ,
    a.select = function(b) {
        if (a.datepickerMode === j.minMode) {
            var c = k.$viewValue ? new Date(k.$viewValue) : new Date(0,0,0,0,0,0,0);
            c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()),
            k.$setViewValue(c),
            k.$render()
        } else
            j.activeDate = b,
            a.datepickerMode = j.modes[j.modes.indexOf(a.datepickerMode) - 1]
    }
    ,
    a.move = function(a) {
        var b = j.activeDate.getFullYear() + a * (j.step.years || 0)
          , c = j.activeDate.getMonth() + a * (j.step.months || 0);
        j.activeDate.setFullYear(b, c, 1),
        j.refreshView()
    }
    ,
    a.toggleMode = function(b) {
        b = b || 1,
        a.datepickerMode === j.maxMode && 1 === b || a.datepickerMode === j.minMode && -1 === b || (a.datepickerMode = j.modes[j.modes.indexOf(a.datepickerMode) + b])
    }
    ,
    a.keys = {
        13: "enter",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    var l = function() {
        j.element[0].focus()
    };
    a.$on("uib:datepicker.focus", l),
    a.keydown = function(b) {
        var c = a.keys[b.which];
        if (c && !b.shiftKey && !b.altKey)
            if (b.preventDefault(),
            j.shortcutPropagation || b.stopPropagation(),
            "enter" === c || "space" === c) {
                if (j.isDisabled(j.activeDate))
                    return;
                a.select(j.activeDate)
            } else
                !b.ctrlKey || "up" !== c && "down" !== c ? (j.handleKeyDown(c, b),
                j.refreshView()) : a.toggleMode("up" === c ? 1 : -1)
    }
}
]).directive("datepicker", ["$log", "$datepickerSuppressWarning", function(a, b) {
    return {
        replace: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/datepicker.html"
        },
        scope: {
            datepickerMode: "=?",
            dateDisabled: "&",
            customClass: "&",
            shortcutPropagation: "&?"
        },
        require: ["datepicker", "^ngModel"],
        controller: "DatepickerController",
        controllerAs: "datepicker",
        link: function(c, d, e, f) {
            b || a.warn("datepicker is now deprecated. Use uib-datepicker instead.");
            var g = f[0]
              , h = f[1];
            g.init(h)
        }
    }
}
]).directive("daypicker", ["$log", "$datepickerSuppressWarning", function(a, b) {
    return {
        replace: !0,
        templateUrl: "template/datepicker/day.html",
        require: ["^datepicker", "daypicker"],
        controller: "UibDaypickerController",
        link: function(c, d, e, f) {
            b || a.warn("daypicker is now deprecated. Use uib-daypicker instead.");
            var g = f[0]
              , h = f[1];
            h.init(g)
        }
    }
}
]).directive("monthpicker", ["$log", "$datepickerSuppressWarning", function(a, b) {
    return {
        replace: !0,
        templateUrl: "template/datepicker/month.html",
        require: ["^datepicker", "monthpicker"],
        controller: "UibMonthpickerController",
        link: function(c, d, e, f) {
            b || a.warn("monthpicker is now deprecated. Use uib-monthpicker instead.");
            var g = f[0]
              , h = f[1];
            h.init(g)
        }
    }
}
]).directive("yearpicker", ["$log", "$datepickerSuppressWarning", function(a, b) {
    return {
        replace: !0,
        templateUrl: "template/datepicker/year.html",
        require: ["^datepicker", "yearpicker"],
        controller: "UibYearpickerController",
        link: function(c, d, e, f) {
            b || a.warn("yearpicker is now deprecated. Use uib-yearpicker instead.");
            var g = f[0];
            angular.extend(g, f[1]),
            g.yearpickerInit(),
            g.refreshView()
        }
    }
}
]).directive("datepickerPopup", ["$log", "$datepickerSuppressWarning", function(a, b) {
    return {
        require: ["ngModel", "datepickerPopup"],
        controller: "UibDatepickerPopupController",
        scope: {
            isOpen: "=?",
            currentText: "@",
            clearText: "@",
            closeText: "@",
            dateDisabled: "&",
            customClass: "&"
        },
        link: function(c, d, e, f) {
            b || a.warn("datepicker-popup is now deprecated. Use uib-datepicker-popup instead.");
            var g = f[0]
              , h = f[1];
            h.init(g)
        }
    }
}
]).directive("datepickerPopupWrap", ["$log", "$datepickerSuppressWarning", function(a, b) {
    return {
        replace: !0,
        transclude: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/datepicker/popup.html"
        },
        link: function() {
            b || a.warn("datepicker-popup-wrap is now deprecated. Use uib-datepicker-popup-wrap instead.")
        }
    }
}
]),
angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.position"]).constant("uibDropdownConfig", {
    openClass: "open"
}).service("uibDropdownService", ["$document", "$rootScope", function(a, b) {
    var c = null;
    this.open = function(b) {
        c || (a.bind("click", d),
        a.bind("keydown", e)),
        c && c !== b && (c.isOpen = !1),
        c = b
    }
    ,
    this.close = function(b) {
        c === b && (c = null,
        a.unbind("click", d),
        a.unbind("keydown", e))
    }
    ;
    var d = function(a) {
        if (c && (!a || "disabled" !== c.getAutoClose())) {
            var d = c.getToggleElement();
            if (!(a && d && d[0].contains(a.target))) {
                var e = c.getDropdownElement();
                a && "outsideClick" === c.getAutoClose() && e && e[0].contains(a.target) || (c.isOpen = !1,
                b.$$phase || c.$apply())
            }
        }
    }
      , e = function(a) {
        27 === a.which ? (c.focusToggleElement(),
        d()) : c.isKeynavEnabled() && /(38|40)/.test(a.which) && c.isOpen && (a.preventDefault(),
        a.stopPropagation(),
        c.focusDropdownEntry(a.which))
    }
}
]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function(a, b, c, d, e, f, g, h, i, j, k) {
    var l, m, n = this, o = a.$new(), p = e.openClass, q = angular.noop, r = c.onToggle ? d(c.onToggle) : angular.noop, s = !1, t = !1;
    b.addClass("dropdown"),
    this.init = function() {
        c.isOpen && (m = d(c.isOpen),
        q = m.assign,
        a.$watch(m, function(a) {
            o.isOpen = !!a
        })),
        s = angular.isDefined(c.dropdownAppendToBody),
        t = angular.isDefined(c.uibKeyboardNav),
        s && n.dropdownMenu && (i.find("body").append(n.dropdownMenu),
        b.on("$destroy", function() {
            n.dropdownMenu.remove()
        }))
    }
    ,
    this.toggle = function(a) {
        return o.isOpen = arguments.length ? !!a : !o.isOpen
    }
    ,
    this.isOpen = function() {
        return o.isOpen
    }
    ,
    o.getToggleElement = function() {
        return n.toggleElement
    }
    ,
    o.getAutoClose = function() {
        return c.autoClose || "always"
    }
    ,
    o.getElement = function() {
        return b
    }
    ,
    o.isKeynavEnabled = function() {
        return t
    }
    ,
    o.focusDropdownEntry = function(a) {
        var c = n.dropdownMenu ? angular.element(n.dropdownMenu).find("a") : angular.element(b).find("ul").eq(0).find("a");
        switch (a) {
        case 40:
            angular.isNumber(n.selectedOption) ? n.selectedOption = n.selectedOption === c.length - 1 ? n.selectedOption : n.selectedOption + 1 : n.selectedOption = 0;
            break;
        case 38:
            angular.isNumber(n.selectedOption) ? n.selectedOption = 0 === n.selectedOption ? 0 : n.selectedOption - 1 : n.selectedOption = c.length - 1
        }
        c[n.selectedOption].focus()
    }
    ,
    o.getDropdownElement = function() {
        return n.dropdownMenu
    }
    ,
    o.focusToggleElement = function() {
        n.toggleElement && n.toggleElement[0].focus()
    }
    ,
    o.$watch("isOpen", function(c, d) {
        if (s && n.dropdownMenu) {
            var e = h.positionElements(b, n.dropdownMenu, "bottom-left", !0)
              , i = {
                top: e.top + "px",
                display: c ? "block" : "none"
            }
              , m = n.dropdownMenu.hasClass("dropdown-menu-right");
            m ? (i.left = "auto",
            i.right = window.innerWidth - (e.left + b.prop("offsetWidth")) + "px") : (i.left = e.left + "px",
            i.right = "auto"),
            n.dropdownMenu.css(i)
        }
        if (g[c ? "addClass" : "removeClass"](b, p).then(function() {
            angular.isDefined(c) && c !== d && r(a, {
                open: !!c
            })
        }),
        c)
            n.dropdownMenuTemplateUrl && k(n.dropdownMenuTemplateUrl).then(function(a) {
                l = o.$new(),
                j(a.trim())(l, function(a) {
                    var b = a;
                    n.dropdownMenu.replaceWith(b),
                    n.dropdownMenu = b
                })
            }),
            o.focusToggleElement(),
            f.open(o);
        else {
            if (n.dropdownMenuTemplateUrl) {
                l && l.$destroy();
                var t = angular.element('<ul class="dropdown-menu"></ul>');
                n.dropdownMenu.replaceWith(t),
                n.dropdownMenu = t
            }
            f.close(o),
            n.selectedOption = null
        }
        angular.isFunction(q) && q(a, c)
    }),
    a.$on("$locationChangeSuccess", function() {
        "disabled" !== o.getAutoClose() && (o.isOpen = !1)
    });
    var u = a.$on("$destroy", function() {
        o.$destroy()
    });
    o.$on("$destroy", u)
}
]).directive("uibDropdown", function() {
    return {
        controller: "UibDropdownController",
        link: function(a, b, c, d) {
            d.init()
        }
    }
}).directive("uibDropdownMenu", function() {
    return {
        restrict: "AC",
        require: "?^uibDropdown",
        link: function(a, b, c, d) {
            if (d && !angular.isDefined(c.dropdownNested)) {
                b.addClass("dropdown-menu");
                var e = c.templateUrl;
                e && (d.dropdownMenuTemplateUrl = e),
                d.dropdownMenu || (d.dropdownMenu = b)
            }
        }
    }
}).directive("uibKeyboardNav", function() {
    return {
        restrict: "A",
        require: "?^uibDropdown",
        link: function(a, b, c, d) {
            b.bind("keydown", function(a) {
                if (-1 !== [38, 40].indexOf(a.which)) {
                    a.preventDefault(),
                    a.stopPropagation();
                    var b = d.dropdownMenu.find("a");
                    switch (a.which) {
                    case 40:
                        angular.isNumber(d.selectedOption) ? d.selectedOption = d.selectedOption === b.length - 1 ? d.selectedOption : d.selectedOption + 1 : d.selectedOption = 0;
                        break;
                    case 38:
                        angular.isNumber(d.selectedOption) ? d.selectedOption = 0 === d.selectedOption ? 0 : d.selectedOption - 1 : d.selectedOption = b.length - 1
                    }
                    b[d.selectedOption].focus()
                }
            })
        }
    }
}).directive("uibDropdownToggle", function() {
    return {
        require: "?^uibDropdown",
        link: function(a, b, c, d) {
            if (d) {
                b.addClass("dropdown-toggle"),
                d.toggleElement = b;
                var e = function(e) {
                    e.preventDefault(),
                    b.hasClass("disabled") || c.disabled || a.$apply(function() {
                        d.toggle()
                    })
                };
                b.bind("click", e),
                b.attr({
                    "aria-haspopup": !0,
                    "aria-expanded": !1
                }),
                a.$watch(d.isOpen, function(a) {
                    b.attr("aria-expanded", !!a)
                }),
                a.$on("$destroy", function() {
                    b.unbind("click", e)
                })
            }
        }
    }
}),
angular.module("ui.bootstrap.dropdown").value("$dropdownSuppressWarning", !1).service("dropdownService", ["$log", "$dropdownSuppressWarning", "uibDropdownService", function(a, b, c) {
    b || a.warn("dropdownService is now deprecated. Use uibDropdownService instead."),
    angular.extend(this, c)
}
]).controller("DropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", "$log", "$dropdownSuppressWarning", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    m || l.warn("DropdownController is now deprecated. Use UibDropdownController instead.");
    var n, o, p = this, q = a.$new(), r = e.openClass, s = angular.noop, t = c.onToggle ? d(c.onToggle) : angular.noop, u = !1, v = !1;
    b.addClass("dropdown"),
    this.init = function() {
        c.isOpen && (o = d(c.isOpen),
        s = o.assign,
        a.$watch(o, function(a) {
            q.isOpen = !!a
        })),
        u = angular.isDefined(c.dropdownAppendToBody),
        v = angular.isDefined(c.uibKeyboardNav),
        u && p.dropdownMenu && (i.find("body").append(p.dropdownMenu),
        b.on("$destroy", function() {
            p.dropdownMenu.remove()
        }))
    }
    ,
    this.toggle = function(a) {
        return q.isOpen = arguments.length ? !!a : !q.isOpen
    }
    ,
    this.isOpen = function() {
        return q.isOpen
    }
    ,
    q.getToggleElement = function() {
        return p.toggleElement
    }
    ,
    q.getAutoClose = function() {
        return c.autoClose || "always"
    }
    ,
    q.getElement = function() {
        return b
    }
    ,
    q.isKeynavEnabled = function() {
        return v
    }
    ,
    q.focusDropdownEntry = function(a) {
        var c = p.dropdownMenu ? angular.element(p.dropdownMenu).find("a") : angular.element(b).find("ul").eq(0).find("a");
        switch (a) {
        case 40:
            angular.isNumber(p.selectedOption) ? p.selectedOption = p.selectedOption === c.length - 1 ? p.selectedOption : p.selectedOption + 1 : p.selectedOption = 0;
            break;
        case 38:
            angular.isNumber(p.selectedOption) ? p.selectedOption = 0 === p.selectedOption ? 0 : p.selectedOption - 1 : p.selectedOption = c.length - 1
        }
        c[p.selectedOption].focus()
    }
    ,
    q.getDropdownElement = function() {
        return p.dropdownMenu
    }
    ,
    q.focusToggleElement = function() {
        p.toggleElement && p.toggleElement[0].focus()
    }
    ,
    q.$watch("isOpen", function(c, d) {
        if (u && p.dropdownMenu) {
            var e = h.positionElements(b, p.dropdownMenu, "bottom-left", !0)
              , i = {
                top: e.top + "px",
                display: c ? "block" : "none"
            }
              , l = p.dropdownMenu.hasClass("dropdown-menu-right");
            l ? (i.left = "auto",
            i.right = window.innerWidth - (e.left + b.prop("offsetWidth")) + "px") : (i.left = e.left + "px",
            i.right = "auto"),
            p.dropdownMenu.css(i)
        }
        if (g[c ? "addClass" : "removeClass"](b, r).then(function() {
            angular.isDefined(c) && c !== d && t(a, {
                open: !!c
            })
        }),
        c)
            p.dropdownMenuTemplateUrl && k(p.dropdownMenuTemplateUrl).then(function(a) {
                n = q.$new(),
                j(a.trim())(n, function(a) {
                    var b = a;
                    p.dropdownMenu.replaceWith(b),
                    p.dropdownMenu = b
                })
            }),
            q.focusToggleElement(),
            f.open(q);
        else {
            if (p.dropdownMenuTemplateUrl) {
                n && n.$destroy();
                var m = angular.element('<ul class="dropdown-menu"></ul>');
                p.dropdownMenu.replaceWith(m),
                p.dropdownMenu = m
            }
            f.close(q),
            p.selectedOption = null
        }
        angular.isFunction(s) && s(a, c)
    }),
    a.$on("$locationChangeSuccess", function() {
        "disabled" !== q.getAutoClose() && (q.isOpen = !1)
    });
    var w = a.$on("$destroy", function() {
        q.$destroy()
    });
    q.$on("$destroy", w)
}
]).directive("dropdown", ["$log", "$dropdownSuppressWarning", function(a, b) {
    return {
        controller: "DropdownController",
        link: function(c, d, e, f) {
            b || a.warn("dropdown is now deprecated. Use uib-dropdown instead."),
            f.init()
        }
    }
}
]).directive("dropdownMenu", ["$log", "$dropdownSuppressWarning", function(a, b) {
    return {
        restrict: "AC",
        require: "?^dropdown",
        link: function(c, d, e, f) {
            if (f && !angular.isDefined(e.dropdownNested)) {
                b || a.warn("dropdown-menu is now deprecated. Use uib-dropdown-menu instead."),
                d.addClass("dropdown-menu");
                var g = e.templateUrl;
                g && (f.dropdownMenuTemplateUrl = g),
                f.dropdownMenu || (f.dropdownMenu = d)
            }
        }
    }
}
]).directive("keyboardNav", ["$log", "$dropdownSuppressWarning", function(a, b) {
    return {
        restrict: "A",
        require: "?^dropdown",
        link: function(c, d, e, f) {
            b || a.warn("keyboard-nav is now deprecated. Use uib-keyboard-nav instead."),
            d.bind("keydown", function(a) {
                if (-1 !== [38, 40].indexOf(a.which)) {
                    a.preventDefault(),
                    a.stopPropagation();
                    var b = f.dropdownMenu.find("a");
                    switch (a.which) {
                    case 40:
                        angular.isNumber(f.selectedOption) ? f.selectedOption = f.selectedOption === b.length - 1 ? f.selectedOption : f.selectedOption + 1 : f.selectedOption = 0;
                        break;
                    case 38:
                        angular.isNumber(f.selectedOption) ? f.selectedOption = 0 === f.selectedOption ? 0 : f.selectedOption - 1 : f.selectedOption = b.length - 1
                    }
                    b[f.selectedOption].focus()
                }
            })
        }
    }
}
]).directive("dropdownToggle", ["$log", "$dropdownSuppressWarning", function(a, b) {
    return {
        require: "?^dropdown",
        link: function(c, d, e, f) {
            if (b || a.warn("dropdown-toggle is now deprecated. Use uib-dropdown-toggle instead."),
            f) {
                d.addClass("dropdown-toggle"),
                f.toggleElement = d;
                var g = function(a) {
                    a.preventDefault(),
                    d.hasClass("disabled") || e.disabled || c.$apply(function() {
                        f.toggle()
                    })
                };
                d.bind("click", g),
                d.attr({
                    "aria-haspopup": !0,
                    "aria-expanded": !1
                }),
                c.$watch(f.isOpen, function(a) {
                    d.attr("aria-expanded", !!a)
                }),
                c.$on("$destroy", function() {
                    d.unbind("click", g)
                })
            }
        }
    }
}
]),
angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function() {
    return {
        createNew: function() {
            var a = [];
            return {
                add: function(b, c) {
                    a.push({
                        key: b,
                        value: c
                    })
                },
                get: function(b) {
                    for (var c = 0; c < a.length; c++)
                        if (b == a[c].key)
                            return a[c]
                },
                keys: function() {
                    for (var b = [], c = 0; c < a.length; c++)
                        b.push(a[c].key);
                    return b
                },
                top: function() {
                    return a[a.length - 1]
                },
                remove: function(b) {
                    for (var c = -1, d = 0; d < a.length; d++)
                        if (b == a[d].key) {
                            c = d;
                            break
                        }
                    return a.splice(c, 1)[0]
                },
                removeTop: function() {
                    return a.splice(a.length - 1, 1)[0]
                },
                length: function() {
                    return a.length
                }
            }
        }
    }
}),
angular.module("ui.bootstrap.modal", ["ui.bootstrap.stackedMap"]).factory("$$multiMap", function() {
    return {
        createNew: function() {
            var a = {};
            return {
                entries: function() {
                    return Object.keys(a).map(function(b) {
                        return {
                            key: b,
                            value: a[b]
                        }
                    })
                },
                get: function(b) {
                    return a[b]
                },
                hasKey: function(b) {
                    return !!a[b]
                },
                keys: function() {
                    return Object.keys(a)
                },
                put: function(b, c) {
                    a[b] || (a[b] = []),
                    a[b].push(c)
                },
                remove: function(b, c) {
                    var d = a[b];
                    if (d) {
                        var e = d.indexOf(c);
                        -1 !== e && d.splice(e, 1),
                        d.length || delete a[b]
                    }
                }
            }
        }
    }
}).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function(a, b, c) {
    function d(b, d, f) {
        d.addClass("modal-backdrop"),
        f.modalInClass && (e ? e(d, {
            addClass: f.modalInClass
        }).start() : a.addClass(d, f.modalInClass),
        b.$on(c.NOW_CLOSING_EVENT, function(b, c) {
            var g = c();
            e ? e(d, {
                removeClass: f.modalInClass
            }).start().then(g) : a.removeClass(d, f.modalInClass).then(g)
        }))
    }
    var e = null;
    return b.has("$animateCss") && (e = b.get("$animateCss")),
    {
        replace: !0,
        templateUrl: "template/modal/backdrop.html",
        compile: function(a, b) {
            return a.addClass(b.backdropClass),
            d
        }
    }
}
]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animate", "$injector", function(a, b, c, d) {
    var e = null;
    return d.has("$animateCss") && (e = d.get("$animateCss")),
    {
        scope: {
            index: "@"
        },
        replace: !0,
        transclude: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/modal/window.html"
        },
        link: function(d, f, g) {
            f.addClass(g.windowClass || ""),
            f.addClass(g.windowTopClass || ""),
            d.size = g.size,
            d.close = function(b) {
                var c = a.getTop();
                c && c.value.backdrop && "static" !== c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(),
                b.stopPropagation(),
                a.dismiss(c.key, "backdrop click"))
            }
            ,
            f.on("click", d.close),
            d.$isRendered = !0;
            var h = b.defer();
            g.$observe("modalRender", function(a) {
                "true" == a && h.resolve()
            }),
            h.promise.then(function() {
                var h = null;
                g.modalInClass && (h = e ? e(f, {
                    addClass: g.modalInClass
                }).start() : c.addClass(f, g.modalInClass),
                d.$on(a.NOW_CLOSING_EVENT, function(a, b) {
                    var d = b();
                    e ? e(f, {
                        removeClass: g.modalInClass
                    }).start().then(d) : c.removeClass(f, g.modalInClass).then(d)
                })),
                b.when(h).then(function() {
                    var a = f[0].querySelector("[autofocus]");
                    a ? a.focus() : f[0].focus()
                });
                var i = a.getTop();
                i && a.modalRendered(i.key)
            })
        }
    }
}
]).directive("uibModalAnimationClass", function() {
    return {
        compile: function(a, b) {
            b.modalAnimation && a.addClass(b.uibModalAnimationClass)
        }
    }
}).directive("uibModalTransclude", function() {
    return {
        link: function(a, b, c, d, e) {
            e(a.$parent, function(a) {
                b.empty(),
                b.append(a)
            })
        }
    }
}).factory("$uibModalStack", ["$animate", "$timeout", "$document", "$compile", "$rootScope", "$q", "$injector", "$$multiMap", "$$stackedMap", function(a, b, c, d, e, f, g, h, i) {
    function j() {
        for (var a = -1, b = u.keys(), c = 0; c < b.length; c++)
            u.get(b[c]).value.backdrop && (a = c);
        return a
    }
    function k(a, b) {
        var d = c.find("body").eq(0)
          , e = u.get(a).value;
        u.remove(a),
        n(e.modalDomEl, e.modalScope, function() {
            var b = e.openedClass || t;
            v.remove(b, a),
            d.toggleClass(b, v.hasKey(b)),
            l(!0)
        }),
        m(),
        b && b.focus ? b.focus() : d.focus()
    }
    function l(a) {
        var b;
        u.length() > 0 && (b = u.top().value,
        b.modalDomEl.toggleClass(b.windowTopClass || "", a))
    }
    function m() {
        if (q && -1 == j()) {
            var a = r;
            n(q, r, function() {
                a = null
            }),
            q = void 0,
            r = void 0
        }
    }
    function n(b, c, d) {
        function e() {
            e.done || (e.done = !0,
            p ? p(b, {
                event: "leave"
            }).start().then(function() {
                b.remove()
            }) : a.leave(b),
            c.$destroy(),
            d && d())
        }
        var g, h = null, i = function() {
            return g || (g = f.defer(),
            h = g.promise),
            function() {
                g.resolve()
            }
        };
        return c.$broadcast(w.NOW_CLOSING_EVENT, i),
        f.when(h).then(e)
    }
    function o(a, b, c) {
        return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented
    }
    var p = null;
    g.has("$animateCss") && (p = g.get("$animateCss"));
    var q, r, s, t = "modal-open", u = i.createNew(), v = h.createNew(), w = {
        NOW_CLOSING_EVENT: "modal.stack.now-closing"
    }, x = 0, y = "a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable=true]";
    return e.$watch(j, function(a) {
        r && (r.index = a)
    }),
    c.bind("keydown", function(a) {
        if (a.isDefaultPrevented())
            return a;
        var b = u.top();
        if (b && b.value.keyboard)
            switch (a.which) {
            case 27:
                a.preventDefault(),
                e.$apply(function() {
                    w.dismiss(b.key, "escape key press")
                });
                break;
            case 9:
                w.loadFocusElementList(b);
                var c = !1;
                a.shiftKey ? w.isFocusInFirstItem(a) && (c = w.focusLastFocusableElement()) : w.isFocusInLastItem(a) && (c = w.focusFirstFocusableElement()),
                c && (a.preventDefault(),
                a.stopPropagation())
            }
    }),
    w.open = function(a, b) {
        var f = c[0].activeElement
          , g = b.openedClass || t;
        l(!1),
        u.add(a, {
            deferred: b.deferred,
            renderDeferred: b.renderDeferred,
            modalScope: b.scope,
            backdrop: b.backdrop,
            keyboard: b.keyboard,
            openedClass: b.openedClass,
            windowTopClass: b.windowTopClass
        }),
        v.put(g, a);
        var h = c.find("body").eq(0)
          , i = j();
        if (i >= 0 && !q) {
            r = e.$new(!0),
            r.index = i;
            var k = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
            k.attr("backdrop-class", b.backdropClass),
            b.animation && k.attr("modal-animation", "true"),
            q = d(k)(r),
            h.append(q)
        }
        var m = angular.element('<div uib-modal-window="modal-window"></div>');
        m.attr({
            "template-url": b.windowTemplateUrl,
            "window-class": b.windowClass,
            "window-top-class": b.windowTopClass,
            size: b.size,
            index: u.length() - 1,
            animate: "animate"
        }).html(b.content),
        b.animation && m.attr("modal-animation", "true");
        var n = d(m)(b.scope);
        u.top().value.modalDomEl = n,
        u.top().value.modalOpener = f,
        h.append(n),
        h.addClass(g),
        w.clearFocusListCache()
    }
    ,
    w.close = function(a, b) {
        var c = u.get(a);
        return c && o(c, b, !0) ? (c.value.modalScope.$$uibDestructionScheduled = !0,
        c.value.deferred.resolve(b),
        k(a, c.value.modalOpener),
        !0) : !c
    }
    ,
    w.dismiss = function(a, b) {
        var c = u.get(a);
        return c && o(c, b, !1) ? (c.value.modalScope.$$uibDestructionScheduled = !0,
        c.value.deferred.reject(b),
        k(a, c.value.modalOpener),
        !0) : !c
    }
    ,
    w.dismissAll = function(a) {
        for (var b = this.getTop(); b && this.dismiss(b.key, a); )
            b = this.getTop()
    }
    ,
    w.getTop = function() {
        return u.top()
    }
    ,
    w.modalRendered = function(a) {
        var b = u.get(a);
        b && b.value.renderDeferred.resolve()
    }
    ,
    w.focusFirstFocusableElement = function() {
        return s.length > 0 ? (s[0].focus(),
        !0) : !1
    }
    ,
    w.focusLastFocusableElement = function() {
        return s.length > 0 ? (s[s.length - 1].focus(),
        !0) : !1
    }
    ,
    w.isFocusInFirstItem = function(a) {
        return s.length > 0 ? (a.target || a.srcElement) == s[0] : !1
    }
    ,
    w.isFocusInLastItem = function(a) {
        return s.length > 0 ? (a.target || a.srcElement) == s[s.length - 1] : !1
    }
    ,
    w.clearFocusListCache = function() {
        s = [],
        x = 0
    }
    ,
    w.loadFocusElementList = function(a) {
        if ((void 0 === s || !s.length) && a) {
            var b = a.value.modalDomEl;
            b && b.length && (s = b[0].querySelectorAll(y))
        }
    }
    ,
    w
}
]).provider("$uibModal", function() {
    var a = {
        options: {
            animation: !0,
            backdrop: !0,
            keyboard: !0
        },
        $get: ["$injector", "$rootScope", "$q", "$templateRequest", "$controller", "$uibModalStack", "$modalSuppressWarning", "$log", function(b, c, d, e, f, g, h, i) {
            function j(a) {
                return a.template ? d.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl)
            }
            function k(a) {
                var c = [];
                return angular.forEach(a, function(a) {
                    angular.isFunction(a) || angular.isArray(a) ? c.push(d.when(b.invoke(a))) : angular.isString(a) ? c.push(d.when(b.get(a))) : c.push(d.when(a))
                }),
                c
            }
            var l = {}
              , m = null;
            return l.getPromiseChain = function() {
                return m
            }
            ,
            l.open = function(b) {
                function e() {
                    return r
                }
                var l = d.defer()
                  , n = d.defer()
                  , o = d.defer()
                  , p = {
                    result: l.promise,
                    opened: n.promise,
                    rendered: o.promise,
                    close: function(a) {
                        return g.close(p, a)
                    },
                    dismiss: function(a) {
                        return g.dismiss(p, a)
                    }
                };
                if (b = angular.extend({}, a.options, b),
                b.resolve = b.resolve || {},
                !b.template && !b.templateUrl)
                    throw new Error("One of template or templateUrl options is required.");
                var q, r = d.all([j(b)].concat(k(b.resolve)));
                return q = m = d.all([m]).then(e, e).then(function(a) {
                    var d = (b.scope || c).$new();
                    d.$close = p.close,
                    d.$dismiss = p.dismiss,
                    d.$on("$destroy", function() {
                        d.$$uibDestructionScheduled || d.$dismiss("$uibUnscheduledDestruction")
                    });
                    var e, j = {}, k = 1;
                    b.controller && (j.$scope = d,
                    j.$uibModalInstance = p,
                    Object.defineProperty(j, "$modalInstance", {
                        get: function() {
                            return h || i.warn("$modalInstance is now deprecated. Use $uibModalInstance instead."),
                            p
                        }
                    }),
                    angular.forEach(b.resolve, function(b, c) {
                        j[c] = a[k++]
                    }),
                    e = f(b.controller, j),
                    b.controllerAs && (b.bindToController && angular.extend(e, d),
                    d[b.controllerAs] = e)),
                    g.open(p, {
                        scope: d,
                        deferred: l,
                        renderDeferred: o,
                        content: a[0],
                        animation: b.animation,
                        backdrop: b.backdrop,
                        keyboard: b.keyboard,
                        backdropClass: b.backdropClass,
                        windowTopClass: b.windowTopClass,
                        windowClass: b.windowClass,
                        windowTemplateUrl: b.windowTemplateUrl,
                        size: b.size,
                        openedClass: b.openedClass
                    }),
                    n.resolve(!0)
                }, function(a) {
                    n.reject(a),
                    l.reject(a)
                })["finally"](function() {
                    m === q && (m = null)
                }),
                p
            }
            ,
            l
        }
        ]
    };
    return a
}),
angular.module("ui.bootstrap.modal").value("$modalSuppressWarning", !1).directive("modalBackdrop", ["$animate", "$injector", "$modalStack", "$log", "$modalSuppressWarning", function(a, b, c, d, e) {
    function f(b, f, h) {
        e || d.warn("modal-backdrop is now deprecated. Use uib-modal-backdrop instead."),
        f.addClass("modal-backdrop"),
        h.modalInClass && (g ? g(f, {
            addClass: h.modalInClass
        }).start() : a.addClass(f, h.modalInClass),
        b.$on(c.NOW_CLOSING_EVENT, function(b, c) {
            var d = c();
            g ? g(f, {
                removeClass: h.modalInClass
            }).start().then(d) : a.removeClass(f, h.modalInClass).then(d)
        }))
    }
    var g = null;
    return b.has("$animateCss") && (g = b.get("$animateCss")),
    {
        replace: !0,
        templateUrl: "template/modal/backdrop.html",
        compile: function(a, b) {
            return a.addClass(b.backdropClass),
            f
        }
    }
}
]).directive("modalWindow", ["$modalStack", "$q", "$animate", "$injector", "$log", "$modalSuppressWarning", function(a, b, c, d, e, f) {
    var g = null;
    return d.has("$animateCss") && (g = d.get("$animateCss")),
    {
        scope: {
            index: "@"
        },
        replace: !0,
        transclude: !0,
        templateUrl: function(a, b) {
            return b.templateUrl || "template/modal/window.html"
        },
        link: function(d, h, i) {
            f || e.warn("modal-window is now deprecated. Use uib-modal-window instead."),
            h.addClass(i.windowClass || ""),
            h.addClass(i.windowTopClass || ""),
            d.size = i.size,
            d.close = function(b) {
                var c = a.getTop();
                c && c.value.backdrop && "static" !== c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(),
                b.stopPropagation(),
                a.dismiss(c.key, "backdrop click"))
            }
            ,
            h.on("click", d.close),
            d.$isRendered = !0;
            var j = b.defer();
            i.$observe("modalRender", function(a) {
                "true" == a && j.resolve()
            }),
            j.promise.then(function() {
                var e = null;
                i.modalInClass && (e = g ? g(h, {
                    addClass: i.modalInClass
                }).start() : c.addClass(h, i.modalInClass),
                d.$on(a.NOW_CLOSING_EVENT, function(a, b) {
                    var d = b();
                    g ? g(h, {
                        removeClass: i.modalInClass
                    }).start().then(d) : c.removeClass(h, i.modalInClass).then(d)
                })),
                b.when(e).then(function() {
                    var a = h[0].querySelector("[autofocus]");
                    a ? a.focus() : h[0].focus()
                });
                var f = a.getTop();
                f && a.modalRendered(f.key)
            })
        }
    }
}
]).directive("modalAnimationClass", ["$log", "$modalSuppressWarning", function(a, b) {
    return {
        compile: function(c, d) {
            b || a.warn("modal-animation-class is now deprecated. Use uib-modal-animation-class instead."),
            d.modalAnimation && c.addClass(d.modalAnimationClass)
        }
    }
}
]).directive("modalTransclude", ["$log", "$modalSuppressWarning", function(a, b) {
    return {
        link: function(c, d, e, f, g) {
            b || a.warn("modal-transclude is now deprecated. Use uib-modal-transclude instead."),
            g(c.$parent, function(a) {
                d.empty(),
                d.append(a)
            })
        }
    }
}
]).service("$modalStack", ["$animate", "$timeout", "$document", "$compile", "$rootScope", "$q", "$injector", "$$multiMap", "$$stackedMap", "$uibModalStack", "$log", "$modalSuppressWarning", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    l || k.warn("$modalStack is now deprecated. Use $uibModalStack instead."),
    angular.extend(this, j)
}
]).provider("$modal", ["$uibModalProvider", function(a) {
    angular.extend(this, a),
    this.$get = ["$injector", "$log", "$modalSuppressWarning", function(b, c, d) {
        return d || c.warn("$modal is now deprecated. Use $uibModal instead."),
        b.invoke(a.$get)
    }
    ]
}
]),
angular.module("ui.bootstrap.pagination", []).controller("UibPaginationController", ["$scope", "$attrs", "$parse", function(a, b, c) {
    var d = this
      , e = {
        $setViewValue: angular.noop
    }
      , f = b.numPages ? c(b.numPages).assign : angular.noop;
    this.init = function(g, h) {
        e = g,
        this.config = h,
        e.$render = function() {
            d.render()
        }
        ,
        b.itemsPerPage ? a.$parent.$watch(c(b.itemsPerPage), function(b) {
            d.itemsPerPage = parseInt(b, 10),
            a.totalPages = d.calculateTotalPages()
        }) : this.itemsPerPage = h.itemsPerPage,
        a.$watch("totalItems", function() {
            a.totalPages = d.calculateTotalPages()
        }),
        a.$watch("totalPages", function(b) {
            f(a.$parent, b),
            a.page > b ? a.selectPage(b) : e.$render()
        })
    }
    ,
    this.calculateTotalPages = function() {
        var b = this.itemsPerPage < 1 ? 1 : Math.ceil(a.totalItems / this.itemsPerPage);
        return Math.max(b || 0, 1)
    }
    ,
    this.render = function() {
        a.page = parseInt(e.$viewValue, 10) || 1
    }
    ,
    a.selectPage = function(b, c) {
        c && c.preventDefault();
        var d = !a.ngDisabled || !c;
        d && a.page !== b && b > 0 && b <= a.totalPages && (c && c.target && c.target.blur(),
        e.$setViewValue(b),
        e.$render())
    }
    ,
    a.getText = function(b) {
        return a[b + "Text"] || d.config[b + "Text"]
    }
    ,
    a.noPrevious = function() {
        return 1 === a.page
    }
    ,
    a.noNext = function() {
        return a.page === a.totalPages
    }
}
]).constant("uibPaginationConfig", {
    itemsPerPage: 10,
    boundaryLinks: !1,
    directionLinks: !0,
    firstText: "First",
    previousText: "Previous",
    nextText: "Next",
    lastText: "Last",
    rotate: !0
}).directive("uibPagination", ["$parse", "uibPaginationConfig", function(a, b) {
    return {
        restrict: "EA",
        scope: {
            totalItems: "=",
            firstText: "@",
            previousText: "@",
            nextText: "@",
            lastText: "@",
            ngDisabled: "="
        },
        require: ["uibPagination", "?ngModel"],
        controller: "UibPaginationController",
        controllerAs: "pagination",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/pagination/pagination.html"
        },
        replace: !0,
        link: function(c, d, e, f) {
            function g(a, b, c) {
                return {
                    number: a,
                    text: b,
                    active: c
                }
            }
            function h(a, b) {
                var c = []
                  , d = 1
                  , e = b
                  , f = angular.isDefined(k) && b > k;
                f && (l ? (d = Math.max(a - Math.floor(k / 2), 1),
                e = d + k - 1,
                e > b && (e = b,
                d = e - k + 1)) : (d = (Math.ceil(a / k) - 1) * k + 1,
                e = Math.min(d + k - 1, b)));
                for (var h = d; e >= h; h++) {
                    var i = g(h, h, h === a);
                    c.push(i)
                }
                if (f && !l) {
                    if (d > 1) {
                        var j = g(d - 1, "...", !1);
                        c.unshift(j)
                    }
                    if (b > e) {
                        var m = g(e + 1, "...", !1);
                        c.push(m)
                    }
                }
                return c
            }
            var i = f[0]
              , j = f[1];
            if (j) {
                var k = angular.isDefined(e.maxSize) ? c.$parent.$eval(e.maxSize) : b.maxSize
                  , l = angular.isDefined(e.rotate) ? c.$parent.$eval(e.rotate) : b.rotate;
                c.boundaryLinks = angular.isDefined(e.boundaryLinks) ? c.$parent.$eval(e.boundaryLinks) : b.boundaryLinks,
                c.directionLinks = angular.isDefined(e.directionLinks) ? c.$parent.$eval(e.directionLinks) : b.directionLinks,
                i.init(j, b),
                e.maxSize && c.$parent.$watch(a(e.maxSize), function(a) {
                    k = parseInt(a, 10),
                    i.render()
                });
                var m = i.render;
                i.render = function() {
                    m(),
                    c.page > 0 && c.page <= c.totalPages && (c.pages = h(c.page, c.totalPages))
                }
            }
        }
    }
}
]).constant("uibPagerConfig", {
    itemsPerPage: 10,
    previousText: "« Previous",
    nextText: "Next »",
    align: !0
}).directive("uibPager", ["uibPagerConfig", function(a) {
    return {
        restrict: "EA",
        scope: {
            totalItems: "=",
            previousText: "@",
            nextText: "@",
            ngDisabled: "="
        },
        require: ["uibPager", "?ngModel"],
        controller: "UibPaginationController",
        controllerAs: "pagination",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/pagination/pager.html"
        },
        replace: !0,
        link: function(b, c, d, e) {
            var f = e[0]
              , g = e[1];
            g && (b.align = angular.isDefined(d.align) ? b.$parent.$eval(d.align) : a.align,
            f.init(g, a))
        }
    }
}
]),
angular.module("ui.bootstrap.pagination").value("$paginationSuppressWarning", !1).controller("PaginationController", ["$scope", "$attrs", "$parse", "$log", "$paginationSuppressWarning", function(a, b, c, d, e) {
    e || d.warn("PaginationController is now deprecated. Use UibPaginationController instead.");
    var f = this
      , g = {
        $setViewValue: angular.noop
    }
      , h = b.numPages ? c(b.numPages).assign : angular.noop;
    this.init = function(d, e) {
        g = d,
        this.config = e,
        g.$render = function() {
            f.render()
        }
        ,
        b.itemsPerPage ? a.$parent.$watch(c(b.itemsPerPage), function(b) {
            f.itemsPerPage = parseInt(b, 10),
            a.totalPages = f.calculateTotalPages()
        }) : this.itemsPerPage = e.itemsPerPage,
        a.$watch("totalItems", function() {
            a.totalPages = f.calculateTotalPages()
        }),
        a.$watch("totalPages", function(b) {
            h(a.$parent, b),
            a.page > b ? a.selectPage(b) : g.$render()
        })
    }
    ,
    this.calculateTotalPages = function() {
        var b = this.itemsPerPage < 1 ? 1 : Math.ceil(a.totalItems / this.itemsPerPage);
        return Math.max(b || 0, 1)
    }
    ,
    this.render = function() {
        a.page = parseInt(g.$viewValue, 10) || 1
    }
    ,
    a.selectPage = function(b, c) {
        c && c.preventDefault();
        var d = !a.ngDisabled || !c;
        d && a.page !== b && b > 0 && b <= a.totalPages && (c && c.target && c.target.blur(),
        g.$setViewValue(b),
        g.$render())
    }
    ,
    a.getText = function(b) {
        return a[b + "Text"] || f.config[b + "Text"]
    }
    ,
    a.noPrevious = function() {
        return 1 === a.page
    }
    ,
    a.noNext = function() {
        return a.page === a.totalPages
    }
}
]).directive("pagination", ["$parse", "uibPaginationConfig", "$log", "$paginationSuppressWarning", function(a, b, c, d) {
    return {
        restrict: "EA",
        scope: {
            totalItems: "=",
            firstText: "@",
            previousText: "@",
            nextText: "@",
            lastText: "@",
            ngDisabled: "="
        },
        require: ["pagination", "?ngModel"],
        controller: "PaginationController",
        controllerAs: "pagination",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/pagination/pagination.html"
        },
        replace: !0,
        link: function(e, f, g, h) {
            function i(a, b, c) {
                return {
                    number: a,
                    text: b,
                    active: c
                }
            }
            function j(a, b) {
                var c = []
                  , d = 1
                  , e = b
                  , f = angular.isDefined(m) && b > m;
                f && (n ? (d = Math.max(a - Math.floor(m / 2), 1),
                e = d + m - 1,
                e > b && (e = b,
                d = e - m + 1)) : (d = (Math.ceil(a / m) - 1) * m + 1,
                e = Math.min(d + m - 1, b)));
                for (var g = d; e >= g; g++) {
                    var h = i(g, g, g === a);
                    c.push(h)
                }
                if (f && !n) {
                    if (d > 1) {
                        var j = i(d - 1, "...", !1);
                        c.unshift(j)
                    }
                    if (b > e) {
                        var k = i(e + 1, "...", !1);
                        c.push(k)
                    }
                }
                return c
            }
            d || c.warn("pagination is now deprecated. Use uib-pagination instead.");
            var k = h[0]
              , l = h[1];
            if (l) {
                var m = angular.isDefined(g.maxSize) ? e.$parent.$eval(g.maxSize) : b.maxSize
                  , n = angular.isDefined(g.rotate) ? e.$parent.$eval(g.rotate) : b.rotate;
                e.boundaryLinks = angular.isDefined(g.boundaryLinks) ? e.$parent.$eval(g.boundaryLinks) : b.boundaryLinks,
                e.directionLinks = angular.isDefined(g.directionLinks) ? e.$parent.$eval(g.directionLinks) : b.directionLinks,
                k.init(l, b),
                g.maxSize && e.$parent.$watch(a(g.maxSize), function(a) {
                    m = parseInt(a, 10),
                    k.render()
                });
                var o = k.render;
                k.render = function() {
                    o(),
                    e.page > 0 && e.page <= e.totalPages && (e.pages = j(e.page, e.totalPages))
                }
            }
        }
    }
}
]).directive("pager", ["uibPagerConfig", "$log", "$paginationSuppressWarning", function(a, b, c) {
    return {
        restrict: "EA",
        scope: {
            totalItems: "=",
            previousText: "@",
            nextText: "@",
            ngDisabled: "="
        },
        require: ["pager", "?ngModel"],
        controller: "PaginationController",
        controllerAs: "pagination",
        templateUrl: function(a, b) {
            return b.templateUrl || "template/pagination/pager.html"
        },
        replace: !0,
        link: function(d, e, f, g) {
            c || b.warn("pager is now deprecated. Use uib-pager instead.");
            var h = g[0]
              , i = g[1];
            i && (d.align = angular.isDefined(f.align) ? d.$parent.$eval(f.align) : a.align,
            h.init(i, a))
        }
    }
}
]),
angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.stackedMap"]).provider("$uibTooltip", function() {
    function a(a) {
        var b = /[A-Z]/g
          , c = "-";
        return a.replace(b, function(a, b) {
            return (b ? c : "") + a.toLowerCase()
        })
    }
    var b = {
        placement: "top",
        animation: !0,
        popupDelay: 0,
        popupCloseDelay: 0,
        useContentExp: !1
    }
      , c = {
        mouseenter: "mouseleave",
        click: "click",
        focus: "blur",
        none: ""
    }
      , d = {};
    this.options = function(a) {
        angular.extend(d, a)
    }
    ,
    this.setTriggers = function(a) {
        angular.extend(c, a)
    }
    ,
    this.$get = ["$window", "$compile", "$timeout", "$document", "$uibPosition", "$interpolate", "$rootScope", "$parse", "$$stackedMap", function(e, f, g, h, i, j, k, l, m) {
        var n = m.createNew();
        return h.on("keypress", function(a) {
            if (27 === a.which) {
                var b = n.top();
                b && (b.value.close(),
                n.removeTop(),
                b = null)
            }
        }),
        function(e, k, m, o) {
            function p(a) {
                var b = (a || o.trigger || m).split(" ")
                  , d = b.map(function(a) {
                    return c[a] || a
                });
                return {
                    show: b,
                    hide: d
                }
            }
            o = angular.extend({}, b, d, o);
            var q = a(e)
              , r = j.startSymbol()
              , s = j.endSymbol()
              , t = "<div " + q + '-popup title="' + r + "title" + s + '" ' + (o.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + r + "content" + s + '" ') + 'placement="' + r + "placement" + s + '" popup-class="' + r + "popupClass" + s + '" animation="animation" is-open="isOpen"origin-scope="origScope" style="visibility: hidden; display: block; top: -9999px; left: -9999px;"></div>';
            return {
                compile: function(a, b) {
                    var c = f(t);
                    return function(a, b, d, f) {
                        function j() {
                            L.isOpen ? q() : m()
                        }
                        function m() {
                            (!K || a.$eval(d[k + "Enable"])) && (u(),
                            x(),
                            L.popupDelay ? F || (F = g(r, L.popupDelay, !1)) : r())
                        }
                        function q() {
                            s(),
                            L.popupCloseDelay ? G || (G = g(t, L.popupCloseDelay, !1)) : t()
                        }
                        function r() {
                            return s(),
                            u(),
                            L.content ? (v(),
                            void L.$evalAsync(function() {
                                L.isOpen = !0,
                                y(!0),
                                Q()
                            })) : angular.noop
                        }
                        function s() {
                            F && (g.cancel(F),
                            F = null),
                            H && (g.cancel(H),
                            H = null)
                        }
                        function t() {
                            s(),
                            u(),
                            L && L.$evalAsync(function() {
                                L.isOpen = !1,
                                y(!1),
                                L.animation ? E || (E = g(w, 150, !1)) : w()
                            })
                        }
                        function u() {
                            G && (g.cancel(G),
                            G = null),
                            E && (g.cancel(E),
                            E = null)
                        }
                        function v() {
                            C || (D = L.$new(),
                            C = c(D, function(a) {
                                I ? h.find("body").append(a) : b.after(a)
                            }),
                            z())
                        }
                        function w() {
                            A(),
                            E = null,
                            C && (C.remove(),
                            C = null),
                            D && (D.$destroy(),
                            D = null)
                        }
                        function x() {
                            L.title = d[k + "Title"],
                            O ? L.content = O(a) : L.content = d[e],
                            L.popupClass = d[k + "Class"],
                            L.placement = angular.isDefined(d[k + "Placement"]) ? d[k + "Placement"] : o.placement;
                            var b = parseInt(d[k + "PopupDelay"], 10)
                              , c = parseInt(d[k + "PopupCloseDelay"], 10);
                            L.popupDelay = isNaN(b) ? o.popupDelay : b,
                            L.popupCloseDelay = isNaN(c) ? o.popupCloseDelay : c
                        }
                        function y(b) {
                            N && angular.isFunction(N.assign) && N.assign(a, b)
                        }
                        function z() {
                            P.length = 0,
                            O ? (P.push(a.$watch(O, function(a) {
                                L.content = a,
                                !a && L.isOpen && t()
                            })),
                            P.push(D.$watch(function() {
                                M || (M = !0,
                                D.$$postDigest(function() {
                                    M = !1,
                                    L && L.isOpen && Q()
                                }))
                            }))) : P.push(d.$observe(e, function(a) {
                                L.content = a,
                                !a && L.isOpen ? t() : Q()
                            })),
                            P.push(d.$observe(k + "Title", function(a) {
                                L.title = a,
                                L.isOpen && Q()
                            })),
                            P.push(d.$observe(k + "Placement", function(a) {
                                L.placement = a ? a : o.placement,
                                L.isOpen && Q()
                            }))
                        }
                        function A() {
                            P.length && (angular.forEach(P, function(a) {
                                a()
                            }),
                            P.length = 0)
                        }
                        function B() {
                            var a = d[k + "Trigger"];
                            R(),
                            J = p(a),
                            "none" !== J.show && J.show.forEach(function(a, c) {
                                a === J.hide[c] ? b[0].addEventListener(a, j) : a && (b[0].addEventListener(a, m),
                                J.hide[c].split(" ").forEach(function(a) {
                                    b[0].addEventListener(a, q)
                                })),
                                b.on("keypress", function(a) {
                                    27 === a.which && q()
                                })
                            })
                        }
                        var C, D, E, F, G, H, I = angular.isDefined(o.appendToBody) ? o.appendToBody : !1, J = p(void 0), K = angular.isDefined(d[k + "Enable"]), L = a.$new(!0), M = !1, N = angular.isDefined(d[k + "IsOpen"]) ? l(d[k + "IsOpen"]) : !1, O = o.useContentExp ? l(d[e]) : !1, P = [], Q = function() {
                            C && C.html() && (H || (H = g(function() {
                                C.css({
                                    top: 0,
                                    left: 0
                                });
                                var a = i.positionElements(b, C, L.placement, I);
                                a.top += "px",
                                a.left += "px",
                                a.visibility = "visible",
                                C.css(a),
                                H = null
                            }, 0, !1)))
                        };
                        L.origScope = a,
                        L.isOpen = !1,
                        n.add(L, {
                            close: t
                        }),
                        L.contentExp = function() {
                            return L.content
                        }
                        ,
                        d.$observe("disabled", function(a) {
                            a && s(),
                            a && L.isOpen && t()
                        }),
                        N && a.$watch(N, function(a) {
                            L && !a === L.isOpen && j()
                        });
                        var R = function() {
                            J.show.forEach(function(a) {
                                b.unbind(a, m)
                            }),
                            J.hide.forEach(function(a) {
                                a.split(" ").forEach(function(a) {
                                    b[0].removeEventListener(a, q)
                                })
                            })
                        };
                        B();
                        var S = a.$eval(d[k + "Animation"]);
                        L.animation = angular.isDefined(S) ? !!S : o.animation;
                        var T = a.$eval(d[k + "AppendToBody"]);
                        I = angular.isDefined(T) ? T : I,
                        I && a.$on("$locationChangeSuccess", function() {
                            L.isOpen && t()
                        }),
                        a.$on("$destroy", function() {
                            s(),
                            u(),
                            R(),
                            w(),
                            n.remove(L),
                            L = null
                        })
                    }
                }
            }
        }
    }
    ]
}).directive("uibTooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function(a, b, c, d) {
    return {
        link: function(e, f, g) {
            var h, i, j, k = e.$eval(g.tooltipTemplateTranscludeScope), l = 0, m = function() {
                i && (i.remove(),
                i = null),
                h && (h.$destroy(),
                h = null),
                j && (a.leave(j).then(function() {
                    i = null
                }),
                i = j,
                j = null)
            };
            e.$watch(b.parseAsResourceUrl(g.uibTooltipTemplateTransclude), function(b) {
                var g = ++l;
                b ? (d(b, !0).then(function(d) {
                    if (g === l) {
                        var e = k.$new()
                          , i = d
                          , n = c(i)(e, function(b) {
                            m(),
                            a.enter(b, f)
                        });
                        h = e,
                        j = n,
                        h.$emit("$includeContentLoaded", b)
                    }
                }, function() {
                    g === l && (m(),
                    e.$emit("$includeContentError", b))
                }),
                e.$emit("$includeContentRequested", b)) : m()
            }),
            e.$on("$destroy", m)
        }
    }
}
]).directive("uibTooltipClasses", function() {
    return {
        restrict: "A",
        link: function(a, b, c) {
            a.placement && b.addClass(a.placement),
            a.popupClass && b.addClass(a.popupClass),
            a.animation() && b.addClass(c.tooltipAnimationClass)
        }
    }
}).directive("uibTooltipPopup", function() {
    return {
        replace: !0,
        scope: {
            content: "@",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/tooltip/tooltip-popup.html",
        link: function(a, b) {
            b.addClass("tooltip")
        }
    }
}).directive("uibTooltip", ["$uibTooltip", function(a) {
    return a("uibTooltip", "tooltip", "mouseenter")
}
]).directive("uibTooltipTemplatePopup", function() {
    return {
        replace: !0,
        scope: {
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "template/tooltip/tooltip-template-popup.html",
        link: function(a, b) {
            b.addClass("tooltip")
        }
    }
}).directive("uibTooltipTemplate", ["$uibTooltip", function(a) {
    return a("uibTooltipTemplate", "tooltip", "mouseenter", {
        useContentExp: !0
    })
}
]).directive("uibTooltipHtmlPopup", function() {
    return {
        replace: !0,
        scope: {
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/tooltip/tooltip-html-popup.html",
        link: function(a, b) {
            b.addClass("tooltip")
        }
    }
}).directive("uibTooltipHtml", ["$uibTooltip", function(a) {
    return a("uibTooltipHtml", "tooltip", "mouseenter", {
        useContentExp: !0
    })
}
]),
angular.module("ui.bootstrap.tooltip").value("$tooltipSuppressWarning", !1).provider("$tooltip", ["$uibTooltipProvider", function(a) {
    angular.extend(this, a),
    this.$get = ["$log", "$tooltipSuppressWarning", "$injector", function(b, c, d) {
        return c || b.warn("$tooltip is now deprecated. Use $uibTooltip instead."),
        d.invoke(a.$get)
    }
    ]
}
]).directive("tooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", "$log", "$tooltipSuppressWarning", function(a, b, c, d, e, f) {
    return {
        link: function(g, h, i) {
            f || e.warn("tooltip-template-transclude is now deprecated. Use uib-tooltip-template-transclude instead.");
            var j, k, l, m = g.$eval(i.tooltipTemplateTranscludeScope), n = 0, o = function() {
                k && (k.remove(),
                k = null),
                j && (j.$destroy(),
                j = null),
                l && (a.leave(l).then(function() {
                    k = null
                }),
                k = l,
                l = null)
            };
            g.$watch(b.parseAsResourceUrl(i.tooltipTemplateTransclude), function(b) {
                var e = ++n;
                b ? (d(b, !0).then(function(d) {
                    if (e === n) {
                        var f = m.$new()
                          , g = d
                          , i = c(g)(f, function(b) {
                            o(),
                            a.enter(b, h)
                        });
                        j = f,
                        l = i,
                        j.$emit("$includeContentLoaded", b)
                    }
                }, function() {
                    e === n && (o(),
                    g.$emit("$includeContentError", b))
                }),
                g.$emit("$includeContentRequested", b)) : o()
            }),
            g.$on("$destroy", o)
        }
    }
}
]).directive("tooltipClasses", ["$log", "$tooltipSuppressWarning", function(a, b) {
    return {
        restrict: "A",
        link: function(c, d, e) {
            b || a.warn("tooltip-classes is now deprecated. Use uib-tooltip-classes instead."),
            c.placement && d.addClass(c.placement),
            c.popupClass && d.addClass(c.popupClass),
            c.animation() && d.addClass(e.tooltipAnimationClass)
        }
    }
}
]).directive("tooltipPopup", ["$log", "$tooltipSuppressWarning", function(a, b) {
    return {
        replace: !0,
        scope: {
            content: "@",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/tooltip/tooltip-popup.html",
        link: function(c, d) {
            b || a.warn("tooltip-popup is now deprecated. Use uib-tooltip-popup instead."),
            d.addClass("tooltip")
        }
    }
}
]).directive("tooltip", ["$tooltip", function(a) {
    return a("tooltip", "tooltip", "mouseenter")
}
]).directive("tooltipTemplatePopup", ["$log", "$tooltipSuppressWarning", function(a, b) {
    return {
        replace: !0,
        scope: {
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "template/tooltip/tooltip-template-popup.html",
        link: function(c, d) {
            b || a.warn("tooltip-template-popup is now deprecated. Use uib-tooltip-template-popup instead."),
            d.addClass("tooltip")
        }
    }
}
]).directive("tooltipTemplate", ["$tooltip", function(a) {
    return a("tooltipTemplate", "tooltip", "mouseenter", {
        useContentExp: !0
    })
}
]).directive("tooltipHtmlPopup", ["$log", "$tooltipSuppressWarning", function(a, b) {
    return {
        replace: !0,
        scope: {
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/tooltip/tooltip-html-popup.html",
        link: function(c, d) {
            b || a.warn("tooltip-html-popup is now deprecated. Use uib-tooltip-html-popup instead."),
            d.addClass("tooltip")
        }
    }
}
]).directive("tooltipHtml", ["$tooltip", function(a) {
    return a("tooltipHtml", "tooltip", "mouseenter", {
        useContentExp: !0
    })
}
]),
angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("uibPopoverTemplatePopup", function() {
    return {
        replace: !0,
        scope: {
            title: "@",
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "template/popover/popover-template.html",
        link: function(a, b) {
            b.addClass("popover")
        }
    }
}).directive("uibPopoverTemplate", ["$uibTooltip", function(a) {
    return a("uibPopoverTemplate", "popover", "click", {
        useContentExp: !0
    })
}
]).directive("uibPopoverHtmlPopup", function() {
    return {
        replace: !0,
        scope: {
            contentExp: "&",
            title: "@",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/popover/popover-html.html",
        link: function(a, b) {
            b.addClass("popover")
        }
    }
}).directive("uibPopoverHtml", ["$uibTooltip", function(a) {
    return a("uibPopoverHtml", "popover", "click", {
        useContentExp: !0
    })
}
]).directive("uibPopoverPopup", function() {
    return {
        replace: !0,
        scope: {
            title: "@",
            content: "@",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/popover/popover.html",
        link: function(a, b) {
            b.addClass("popover")
        }
    }
}).directive("uibPopover", ["$uibTooltip", function(a) {
    return a("uibPopover", "popover", "click")
}
]),
angular.module("ui.bootstrap.popover").value("$popoverSuppressWarning", !1).directive("popoverTemplatePopup", ["$log", "$popoverSuppressWarning", function(a, b) {
    return {
        replace: !0,
        scope: {
            title: "@",
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "template/popover/popover-template.html",
        link: function(c, d) {
            b || a.warn("popover-template-popup is now deprecated. Use uib-popover-template-popup instead."),
            d.addClass("popover")
        }
    }
}
]).directive("popoverTemplate", ["$tooltip", function(a) {
    return a("popoverTemplate", "popover", "click", {
        useContentExp: !0
    })
}
]).directive("popoverHtmlPopup", ["$log", "$popoverSuppressWarning", function(a, b) {
    return {
        replace: !0,
        scope: {
            contentExp: "&",
            title: "@",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/popover/popover-html.html",
        link: function(c, d) {
            b || a.warn("popover-html-popup is now deprecated. Use uib-popover-html-popup instead."),
            d.addClass("popover")
        }
    }
}
]).directive("popoverHtml", ["$tooltip", function(a) {
    return a("popoverHtml", "popover", "click", {
        useContentExp: !0
    })
}
]).directive("popoverPopup", ["$log", "$popoverSuppressWarning", function(a, b) {
    return {
        replace: !0,
        scope: {
            title: "@",
            content: "@",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/popover/popover.html",
        link: function(c, d) {
            b || a.warn("popover-popup is now deprecated. Use uib-popover-popup instead."),
            d.addClass("popover")
        }
    }
}
]).directive("popover", ["$tooltip", function(a) {
    return a("popover", "popover", "click")
}
]),
angular.module("ui.bootstrap.progressbar", []).constant("uibProgressConfig", {
    animate: !0,
    max: 100
}).controller("UibProgressController", ["$scope", "$attrs", "uibProgressConfig", function(a, b, c) {
    var d = this
      , e = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;
    this.bars = [],
    a.max = angular.isDefined(a.max) ? a.max : c.max,
    this.addBar = function(b, c, f) {
        e || c.css({
            transition: "none"
        }),
        this.bars.push(b),
        b.max = a.max,
        b.title = f && angular.isDefined(f.title) ? f.title : "progressbar",
        b.$watch("value", function(a) {
            b.recalculatePercentage()
        }),
        b.recalculatePercentage = function() {
            var a = d.bars.reduce(function(a, b) {
                return b.percent = +(100 * b.value / b.max).toFixed(2),
                a + b.percent
            }, 0);
            a > 100 && (b.percent -= a - 100)
        }
        ,
        b.$on("$destroy", function() {
            c = null,
            d.removeBar(b)
        })
    }
    ,
    this.removeBar = function(a) {
        this.bars.splice(this.bars.indexOf(a), 1),
        this.bars.forEach(function(a) {
            a.recalculatePercentage()
        })
    }
    ,
    a.$watch("max", function(b) {
        d.bars.forEach(function(b) {
            b.max = a.max,
            b.recalculatePercentage()
        })
    })
}
]).directive("uibProgress", function() {
    return {
        replace: !0,
        transclude: !0,
        controller: "UibProgressController",
        require: "uibProgress",
        scope: {
            max: "=?"
        },
        templateUrl: "template/progressbar/progress.html"
    }
}).directive("uibBar", function() {
    return {
        replace: !0,
        transclude: !0,
        require: "^uibProgress",
        scope: {
            value: "=",
            type: "@"
        },
        templateUrl: "template/progressbar/bar.html",
        link: function(a, b, c, d) {
            d.addBar(a, b, c)
        }
    }
}).directive("uibProgressbar", function() {
    return {
        replace: !0,
        transclude: !0,
        controller: "UibProgressController",
        scope: {
            value: "=",
            max: "=?",
            type: "@"
        },
        templateUrl: "template/progressbar/progressbar.html",
        link: function(a, b, c, d) {
            d.addBar(a, angular.element(b.children()[0]), {
                title: c.title
            })
        }
    }
}),
angular.module("ui.bootstrap.progressbar").value("$progressSuppressWarning", !1).controller("ProgressController", ["$scope", "$attrs", "uibProgressConfig", "$log", "$progressSuppressWarning", function(a, b, c, d, e) {
    e || d.warn("ProgressController is now deprecated. Use UibProgressController instead.");
    var f = this
      , g = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;
    this.bars = [],
    a.max = angular.isDefined(a.max) ? a.max : c.max,
    this.addBar = function(b, c, d) {
        g || c.css({
            transition: "none"
        }),
        this.bars.push(b),
        b.max = a.max,
        b.title = d && angular.isDefined(d.title) ? d.title : "progressbar",
        b.$watch("value", function(a) {
            b.recalculatePercentage()
        }),
        b.recalculatePercentage = function() {
            b.percent = +(100 * b.value / b.max).toFixed(2);
            var a = f.bars.reduce(function(a, b) {
                return a + b.percent
            }, 0);
            a > 100 && (b.percent -= a - 100)
        }
        ,
        b.$on("$destroy", function() {
            c = null,
            f.removeBar(b)
        })
    }
    ,
    this.removeBar = function(a) {
        this.bars.splice(this.bars.indexOf(a), 1)
    }
    ,
    a.$watch("max", function(b) {
        f.bars.forEach(function(b) {
            b.max = a.max,
            b.recalculatePercentage()
        })
    })
}
]).directive("progress", ["$log", "$progressSuppressWarning", function(a, b) {
    return {
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        require: "progress",
        scope: {
            max: "=?",
            title: "@?"
        },
        templateUrl: "template/progressbar/progress.html",
        link: function() {
            b || a.warn("progress is now deprecated. Use uib-progress instead.")
        }
    }
}
]).directive("bar", ["$log", "$progressSuppressWarning", function(a, b) {
    return {
        replace: !0,
        transclude: !0,
        require: "^progress",
        scope: {
            value: "=",
            type: "@"
        },
        templateUrl: "template/progressbar/bar.html",
        link: function(c, d, e, f) {
            b || a.warn("bar is now deprecated. Use uib-bar instead."),
            f.addBar(c, d)
        }
    }
}
]).directive("progressbar", ["$log", "$progressSuppressWarning", function(a, b) {
    return {
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        scope: {
            value: "=",
            max: "=?",
            type: "@"
        },
        templateUrl: "template/progressbar/progressbar.html",
        link: function(c, d, e, f) {
            b || a.warn("progressbar is now deprecated. Use uib-progressbar instead."),
            f.addBar(c, angular.element(d.children()[0]), {
                title: e.title
            })
        }
    }
}
]),
angular.module("ui.bootstrap.rating", []).constant("uibRatingConfig", {
    max: 5,
    stateOn: null,
    stateOff: null,
    titles: ["one", "two", "three", "four", "five"]
}).controller("UibRatingController", ["$scope", "$attrs", "uibRatingConfig", function(a, b, c) {
    var d = {
        $setViewValue: angular.noop
    };
    this.init = function(e) {
        d = e,
        d.$render = this.render,
        d.$formatters.push(function(a) {
            return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)),
            a
        }),
        this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn,
        this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff;
        var f = angular.isDefined(b.titles) ? a.$parent.$eval(b.titles) : c.titles;
        this.titles = angular.isArray(f) && f.length > 0 ? f : c.titles;
        var g = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);
        a.range = this.buildTemplateObjects(g)
    }
    ,
    this.buildTemplateObjects = function(a) {
        for (var b = 0, c = a.length; c > b; b++)
            a[b] = angular.extend({
                index: b
            }, {
                stateOn: this.stateOn,
                stateOff: this.stateOff,
                title: this.getTitle(b)
            }, a[b]);
        return a
    }
    ,
    this.getTitle = function(a) {
        return a >= this.titles.length ? a + 1 : this.titles[a]
    }
    ,
    a.rate = function(b) {
        !a.readonly && b >= 0 && b <= a.range.length && (d.$setViewValue(d.$viewValue === b ? 0 : b),
        d.$render())
    }
    ,
    a.enter = function(b) {
        a.readonly || (a.value = b),
        a.onHover({
            value: b
        })
    }
    ,
    a.reset = function() {
        a.value = d.$viewValue,
        a.onLeave()
    }
    ,
    a.onKeydown = function(b) {
        /(37|38|39|40)/.test(b.which) && (b.preventDefault(),
        b.stopPropagation(),
        a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)))
    }
    ,
    this.render = function() {
        a.value = d.$viewValue
    }
}
]).directive("uibRating", function() {
    return {
        require: ["uibRating", "ngModel"],
        scope: {
            readonly: "=?",
            onHover: "&",
            onLeave: "&"
        },
        controller: "UibRatingController",
        templateUrl: "template/rating/rating.html",
        replace: !0,
        link: function(a, b, c, d) {
            var e = d[0]
              , f = d[1];
            e.init(f)
        }
    }
}),
angular.module("ui.bootstrap.rating").value("$ratingSuppressWarning", !1).controller("RatingController", ["$scope", "$attrs", "$controller", "$log", "$ratingSuppressWarning", function(a, b, c, d, e) {
    e || d.warn("RatingController is now deprecated. Use UibRatingController instead."),
    angular.extend(this, c("UibRatingController", {
        $scope: a,
        $attrs: b
    }))
}
]).directive("rating", ["$log", "$ratingSuppressWarning", function(a, b) {
    return {
        require: ["rating", "ngModel"],
        scope: {
            readonly: "=?",
            onHover: "&",
            onLeave: "&"
        },
        controller: "RatingController",
        templateUrl: "template/rating/rating.html",
        replace: !0,
        link: function(c, d, e, f) {
            b || a.warn("rating is now deprecated. Use uib-rating instead.");
            var g = f[0]
              , h = f[1];
            g.init(h)
        }
    }
}
]),
angular.module("ui.bootstrap.tabs", []).controller("UibTabsetController", ["$scope", function(a) {
    var b = this
      , c = b.tabs = a.tabs = [];
    b.select = function(a) {
        angular.forEach(c, function(b) {
            b.active && b !== a && (b.active = !1,
            b.onDeselect(),
            a.selectCalled = !1)
        }),
        a.active = !0,
        a.selectCalled || (a.onSelect(),
        a.selectCalled = !0)
    }
    ,
    b.addTab = function(a) {
        c.push(a),
        1 === c.length && a.active !== !1 ? a.active = !0 : a.active ? b.select(a) : a.active = !1
    }
    ,
    b.removeTab = function(a) {
        var e = c.indexOf(a);
        if (a.active && c.length > 1 && !d) {
            var f = e == c.length - 1 ? e - 1 : e + 1;
            b.select(c[f])
        }
        c.splice(e, 1)
    }
    ;
    var d;
    a.$on("$destroy", function() {
        d = !0
    })
}
]).directive("uibTabset", function() {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        scope: {
            type: "@"
        },
        controller: "UibTabsetController",
        templateUrl: "template/tabs/tabset.html",
        link: function(a, b, c) {
            a.vertical = angular.isDefined(c.vertical) ? a.$parent.$eval(c.vertical) : !1,
            a.justified = angular.isDefined(c.justified) ? a.$parent.$eval(c.justified) : !1
        }
    }
}).directive("uibTab", ["$parse", function(a) {
    return {
        require: "^uibTabset",
        restrict: "EA",
        replace: !0,
        templateUrl: "template/tabs/tab.html",
        transclude: !0,
        scope: {
            active: "=?",
            heading: "@",
            onSelect: "&select",
            onDeselect: "&deselect"
        },
        controller: function() {},
        link: function(b, c, d, e, f) {
            b.$watch("active", function(a) {
                a && e.select(b)
            }),
            b.disabled = !1,
            d.disable && b.$parent.$watch(a(d.disable), function(a) {
                b.disabled = !!a
            }),
            b.select = function() {
                b.disabled || (b.active = !0)
            }
            ,
            e.addTab(b),
            b.$on("$destroy", function() {
                e.removeTab(b)
            }),
            b.$transcludeFn = f
        }
    }
}
]).directive("uibTabHeadingTransclude", function() {
    return {
        restrict: "A",
        require: ["?^uibTab", "?^tab"],
        link: function(a, b) {
            a.$watch("headingElement", function(a) {
                a && (b.html(""),
                b.append(a))
            })
        }
    }
}).directive("uibTabContentTransclude", function() {
    function a(a) {
        return a.tagName && (a.hasAttribute("tab-heading") || a.hasAttribute("data-tab-heading") || a.hasAttribute("x-tab-heading") || a.hasAttribute("uib-tab-heading") || a.hasAttribute("data-uib-tab-heading") || a.hasAttribute("x-uib-tab-heading") || "tab-heading" === a.tagName.toLowerCase() || "data-tab-heading" === a.tagName.toLowerCase() || "x-tab-heading" === a.tagName.toLowerCase() || "uib-tab-heading" === a.tagName.toLowerCase() || "data-uib-tab-heading" === a.tagName.toLowerCase() || "x-uib-tab-heading" === a.tagName.toLowerCase())
    }
    return {
        restrict: "A",
        require: ["?^uibTabset", "?^tabset"],
        link: function(b, c, d) {
            var e = b.$eval(d.uibTabContentTransclude);
            e.$transcludeFn(e.$parent, function(b) {
                angular.forEach(b, function(b) {
                    a(b) ? e.headingElement = b : c.append(b)
                })
            })
        }
    }
}),
angular.module("ui.bootstrap.tabs").value("$tabsSuppressWarning", !1).controller("TabsetController", ["$scope", "$controller", "$log", "$tabsSuppressWarning", function(a, b, c, d) {
    d || c.warn("TabsetController is now deprecated. Use UibTabsetController instead."),
    angular.extend(this, b("UibTabsetController", {
        $scope: a
    }))
}
]).directive("tabset", ["$log", "$tabsSuppressWarning", function(a, b) {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        scope: {
            type: "@"
        },
        controller: "TabsetController",
        templateUrl: "template/tabs/tabset.html",
        link: function(c, d, e) {
            b || a.warn("tabset is now deprecated. Use uib-tabset instead."),
            c.vertical = angular.isDefined(e.vertical) ? c.$parent.$eval(e.vertical) : !1,
            c.justified = angular.isDefined(e.justified) ? c.$parent.$eval(e.justified) : !1
        }
    }
}
]).directive("tab", ["$parse", "$log", "$tabsSuppressWarning", function(a, b, c) {
    return {
        require: "^tabset",
        restrict: "EA",
        replace: !0,
        templateUrl: "template/tabs/tab.html",
        transclude: !0,
        scope: {
            active: "=?",
            heading: "@",
            onSelect: "&select",
            onDeselect: "&deselect"
        },
        controller: function() {},
        link: function(d, e, f, g, h) {
            c || b.warn("tab is now deprecated. Use uib-tab instead."),
            d.$watch("active", function(a) {
                a && g.select(d)
            }),
            d.disabled = !1,
            f.disable && d.$parent.$watch(a(f.disable), function(a) {
                d.disabled = !!a
            }),
            d.select = function() {
                d.disabled || (d.active = !0)
            }
            ,
            g.addTab(d),
            d.$on("$destroy", function() {
                g.removeTab(d)
            }),
            d.$transcludeFn = h
        }
    }
}
]).directive("tabHeadingTransclude", ["$log", "$tabsSuppressWarning", function(a, b) {
    return {
        restrict: "A",
        require: "^tab",
        link: function(c, d) {
            b || a.warn("tab-heading-transclude is now deprecated. Use uib-tab-heading-transclude instead."),
            c.$watch("headingElement", function(a) {
                a && (d.html(""),
                d.append(a))
            })
        }
    }
}
]).directive("tabContentTransclude", ["$log", "$tabsSuppressWarning", function(a, b) {
    function c(a) {
        return a.tagName && (a.hasAttribute("tab-heading") || a.hasAttribute("data-tab-heading") || a.hasAttribute("x-tab-heading") || "tab-heading" === a.tagName.toLowerCase() || "data-tab-heading" === a.tagName.toLowerCase() || "x-tab-heading" === a.tagName.toLowerCase())
    }
    return {
        restrict: "A",
        require: "^tabset",
        link: function(d, e, f) {
            b || a.warn("tab-content-transclude is now deprecated. Use uib-tab-content-transclude instead.");
            var g = d.$eval(f.tabContentTransclude);
            g.$transcludeFn(g.$parent, function(a) {
                angular.forEach(a, function(a) {
                    c(a) ? g.headingElement = a : e.append(a)
                })
            })
        }
    }
}
]),
angular.module("ui.bootstrap.timepicker", []).constant("uibTimepickerConfig", {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: !0,
    meridians: null,
    readonlyInput: !1,
    mousewheel: !0,
    arrowkeys: !0,
    showSpinners: !0
}).controller("UibTimepickerController", ["$scope", "$element", "$attrs", "$parse", "$log", "$locale", "uibTimepickerConfig", function(a, b, c, d, e, f, g) {
    function h() {
        var b = parseInt(a.hours, 10)
          , c = a.showMeridian ? b > 0 && 13 > b : b >= 0 && 24 > b;
        return c ? (a.showMeridian && (12 === b && (b = 0),
        a.meridian === r[1] && (b += 12)),
        b) : void 0
    }
    function i() {
        var b = parseInt(a.minutes, 10);
        return b >= 0 && 60 > b ? b : void 0
    }
    function j(a) {
        return angular.isDefined(a) && a.toString().length < 2 ? "0" + a : a.toString()
    }
    function k(a) {
        l(),
        q.$setViewValue(new Date(p)),
        m(a)
    }
    function l() {
        q.$setValidity("time", !0),
        a.invalidHours = !1,
        a.invalidMinutes = !1
    }
    function m(b) {
        var c = p.getHours()
          , d = p.getMinutes();
        a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12),
        a.hours = "h" === b ? c : j(c),
        "m" !== b && (a.minutes = j(d)),
        a.meridian = p.getHours() < 12 ? r[0] : r[1]
    }
    function n(a, b) {
        var c = new Date(a.getTime() + 6e4 * b)
          , d = new Date(a);
        return d.setHours(c.getHours(), c.getMinutes()),
        d
    }
    function o(a) {
        p = n(p, a),
        k()
    }
    var p = new Date
      , q = {
        $setViewValue: angular.noop
    }
      , r = angular.isDefined(c.meridians) ? a.$parent.$eval(c.meridians) : g.meridians || f.DATETIME_FORMATS.AMPMS;
    a.tabindex = angular.isDefined(c.tabindex) ? c.tabindex : 0,
    b.removeAttr("tabindex"),
    this.init = function(b, d) {
        q = b,
        q.$render = this.render,
        q.$formatters.unshift(function(a) {
            return a ? new Date(a) : null
        });
        var e = d.eq(0)
          , f = d.eq(1)
          , h = angular.isDefined(c.mousewheel) ? a.$parent.$eval(c.mousewheel) : g.mousewheel;
        h && this.setupMousewheelEvents(e, f);
        var i = angular.isDefined(c.arrowkeys) ? a.$parent.$eval(c.arrowkeys) : g.arrowkeys;
        i && this.setupArrowkeyEvents(e, f),
        a.readonlyInput = angular.isDefined(c.readonlyInput) ? a.$parent.$eval(c.readonlyInput) : g.readonlyInput,
        this.setupInputEvents(e, f)
    }
    ;
    var s = g.hourStep;
    c.hourStep && a.$parent.$watch(d(c.hourStep), function(a) {
        s = parseInt(a, 10)
    });
    var t = g.minuteStep;
    c.minuteStep && a.$parent.$watch(d(c.minuteStep), function(a) {
        t = parseInt(a, 10)
    });
    var u;
    a.$parent.$watch(d(c.min), function(a) {
        var b = new Date(a);
        u = isNaN(b) ? void 0 : b
    });
    var v;
    a.$parent.$watch(d(c.max), function(a) {
        var b = new Date(a);
        v = isNaN(b) ? void 0 : b
    }),
    a.noIncrementHours = function() {
        var a = n(p, 60 * s);
        return a > v || p > a && u > a
    }
    ,
    a.noDecrementHours = function() {
        var a = n(p, 60 * -s);
        return u > a || a > p && a > v
    }
    ,
    a.noIncrementMinutes = function() {
        var a = n(p, t);
        return a > v || p > a && u > a
    }
    ,
    a.noDecrementMinutes = function() {
        var a = n(p, -t);
        return u > a || a > p && a > v
    }
    ,
    a.noToggleMeridian = function() {
        return p.getHours() < 13 ? n(p, 720) > v : n(p, -720) < u
    }
    ,
    a.showMeridian = g.showMeridian,
    c.showMeridian && a.$parent.$watch(d(c.showMeridian), function(b) {
        if (a.showMeridian = !!b,
        q.$error.time) {
            var c = h()
              , d = i();
            angular.isDefined(c) && angular.isDefined(d) && (p.setHours(c),
            k())
        } else
            m()
    }),
    this.setupMousewheelEvents = function(b, c) {
        var d = function(a) {
            a.originalEvent && (a = a.originalEvent);
            var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;
            return a.detail || b > 0
        };
        b.bind("mousewheel wheel", function(b) {
            a.$apply(d(b) ? a.incrementHours() : a.decrementHours()),
            b.preventDefault()
        }),
        c.bind("mousewheel wheel", function(b) {
            a.$apply(d(b) ? a.incrementMinutes() : a.decrementMinutes()),
            b.preventDefault()
        })
    }
    ,
    this.setupArrowkeyEvents = function(b, c) {
        b.bind("keydown", function(b) {
            38 === b.which ? (b.preventDefault(),
            a.incrementHours(),
            a.$apply()) : 40 === b.which && (b.preventDefault(),
            a.decrementHours(),
            a.$apply())
        }),
        c.bind("keydown", function(b) {
            38 === b.which ? (b.preventDefault(),
            a.incrementMinutes(),
            a.$apply()) : 40 === b.which && (b.preventDefault(),
            a.decrementMinutes(),
            a.$apply())
        })
    }
    ,
    this.setupInputEvents = function(b, c) {
        if (a.readonlyInput)
            return a.updateHours = angular.noop,
            void (a.updateMinutes = angular.noop);
        var d = function(b, c) {
            q.$setViewValue(null),
            q.$setValidity("time", !1),
            angular.isDefined(b) && (a.invalidHours = b),
            angular.isDefined(c) && (a.invalidMinutes = c)
        };
        a.updateHours = function() {
            var a = h()
              , b = i();
            angular.isDefined(a) && angular.isDefined(b) ? (p.setHours(a),
            u > p || p > v ? d(!0) : k("h")) : d(!0)
        }
        ,
        b.bind("blur", function(b) {
            !a.invalidHours && a.hours < 10 && a.$apply(function() {
                a.hours = j(a.hours)
            })
        }),
        a.updateMinutes = function() {
            var a = i()
              , b = h();
            angular.isDefined(a) && angular.isDefined(b) ? (p.setMinutes(a),
            u > p || p > v ? d(void 0, !0) : k("m")) : d(void 0, !0)
        }
        ,
        c.bind("blur", function(b) {
            !a.invalidMinutes && a.minutes < 10 && a.$apply(function() {
                a.minutes = j(a.minutes)
            })
        })
    }
    ,
    this.render = function() {
        var b = q.$viewValue;
        isNaN(b) ? (q.$setValidity("time", !1),
        e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (b && (p = b),
        u > p || p > v ? (q.$setValidity("time", !1),
        a.invalidHours = !0,
        a.invalidMinutes = !0) : l(),
        m())
    }
    ,
    a.showSpinners = angular.isDefined(c.showSpinners) ? a.$parent.$eval(c.showSpinners) : g.showSpinners,
    a.incrementHours = function() {
        a.noIncrementHours() || o(60 * s)
    }
    ,
    a.decrementHours = function() {
        a.noDecrementHours() || o(60 * -s)
    }
    ,
    a.incrementMinutes = function() {
        a.noIncrementMinutes() || o(t)
    }
    ,
    a.decrementMinutes = function() {
        a.noDecrementMinutes() || o(-t)
    }
    ,
    a.toggleMeridian = function() {
        a.noToggleMeridian() || o(720 * (p.getHours() < 12 ? 1 : -1))
    }
}
]).directive("uibTimepicker", function() {
    return {
        restrict: "EA",
        require: ["uibTimepicker", "?^ngModel"],
        controller: "UibTimepickerController",
        controllerAs: "timepicker",
        replace: !0,
        scope: {},
        templateUrl: function(a, b) {
            return b.templateUrl || "template/timepicker/timepicker.html"
        },
        link: function(a, b, c, d) {
            var e = d[0]
              , f = d[1];
            f && e.init(f, b.find("input"))
        }
    }
}),
angular.module("ui.bootstrap.timepicker").value("$timepickerSuppressWarning", !1).controller("TimepickerController", ["$scope", "$element", "$attrs", "$controller", "$log", "$timepickerSuppressWarning", function(a, b, c, d, e, f) {
    f || e.warn("TimepickerController is now deprecated. Use UibTimepickerController instead."),
    angular.extend(this, d("UibTimepickerController", {
        $scope: a,
        $element: b,
        $attrs: c
    }))
}
]).directive("timepicker", ["$log", "$timepickerSuppressWarning", function(a, b) {
    return {
        restrict: "EA",
        require: ["timepicker", "?^ngModel"],
        controller: "TimepickerController",
        controllerAs: "timepicker",
        replace: !0,
        scope: {},
        templateUrl: function(a, b) {
            return b.templateUrl || "template/timepicker/timepicker.html"
        },
        link: function(c, d, e, f) {
            b || a.warn("timepicker is now deprecated. Use uib-timepicker instead.");
            var g = f[0]
              , h = f[1];
            h && g.init(h, d.find("input"))
        }
    }
}
]),
angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position"]).factory("uibTypeaheadParser", ["$parse", function(a) {
    var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
        parse: function(c) {
            var d = c.match(b);
            if (!d)
                throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');
            return {
                itemName: d[3],
                source: a(d[4]),
                viewMapper: a(d[2] || d[1]),
                modelMapper: a(d[1])
            }
        }
    }
}
]).controller("UibTypeaheadController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$uibPosition", "uibTypeaheadParser", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m() {
        K.moveInProgress || (K.moveInProgress = !0,
        K.$digest()),
        S && g.cancel(S),
        S = g(function() {
            K.matches.length && n(),
            K.moveInProgress = !1
        }, r)
    }
    function n() {
        K.position = C ? k.offset(b) : k.position(b),
        K.position.top += b.prop("offsetHeight")
    }
    var o, p, q = [9, 13, 27, 38, 40], r = 200, s = a.$eval(c.typeaheadMinLength);
    s || 0 === s || (s = 1);
    var t, u, v = a.$eval(c.typeaheadWaitMs) || 0, w = a.$eval(c.typeaheadEditable) !== !1, x = e(c.typeaheadLoading).assign || angular.noop, y = e(c.typeaheadOnSelect), z = angular.isDefined(c.typeaheadSelectOnBlur) ? a.$eval(c.typeaheadSelectOnBlur) : !1, A = e(c.typeaheadNoResults).assign || angular.noop, B = c.typeaheadInputFormatter ? e(c.typeaheadInputFormatter) : void 0, C = c.typeaheadAppendToBody ? a.$eval(c.typeaheadAppendToBody) : !1, D = c.typeaheadAppendToElementId || !1, E = a.$eval(c.typeaheadFocusFirst) !== !1, F = c.typeaheadSelectOnExact ? a.$eval(c.typeaheadSelectOnExact) : !1, G = e(c.ngModel), H = e(c.ngModel + "($$$p)"), I = function(b, c) {
        return angular.isFunction(G(a)) && p && p.$options && p.$options.getterSetter ? H(b, {
            $$$p: c
        }) : G.assign(b, c)
    }, J = l.parse(c.uibTypeahead), K = a.$new(), L = a.$on("$destroy", function() {
        K.$destroy()
    });
    K.$on("$destroy", L);
    var M = "typeahead-" + K.$id + "-" + Math.floor(1e4 * Math.random());
    b.attr({
        "aria-autocomplete": "list",
        "aria-expanded": !1,
        "aria-owns": M
    });
    var N = angular.element("<div uib-typeahead-popup></div>");
    N.attr({
        id: M,
        matches: "matches",
        active: "activeIdx",
        select: "select(activeIdx)",
        "move-in-progress": "moveInProgress",
        query: "query",
        position: "position"
    }),
    angular.isDefined(c.typeaheadTemplateUrl) && N.attr("template-url", c.typeaheadTemplateUrl),
    angular.isDefined(c.typeaheadPopupTemplateUrl) && N.attr("popup-template-url", c.typeaheadPopupTemplateUrl);
    var O = function() {
        K.matches = [],
        K.activeIdx = -1,
        b.attr("aria-expanded", !1)
    }
      , P = function(a) {
        return M + "-option-" + a
    };
    K.$watch("activeIdx", function(a) {
        0 > a ? b.removeAttr("aria-activedescendant") : b.attr("aria-activedescendant", P(a))
    });
    var Q = function(a, b) {
        return K.matches.length > b && a ? a.toUpperCase() === K.matches[b].label.toUpperCase() : !1
    }
      , R = function(c) {
        var d = {
            $viewValue: c
        };
        x(a, !0),
        A(a, !1),
        f.when(J.source(a, d)).then(function(e) {
            var f = c === o.$viewValue;
            if (f && t)
                if (e && e.length > 0) {
                    K.activeIdx = E ? 0 : -1,
                    A(a, !1),
                    K.matches.length = 0;
                    for (var g = 0; g < e.length; g++)
                        d[J.itemName] = e[g],
                        K.matches.push({
                            id: P(g),
                            label: J.viewMapper(K, d),
                            model: e[g]
                        });
                    K.query = c,
                    n(),
                    b.attr("aria-expanded", !0),
                    F && 1 === K.matches.length && Q(c, 0) && K.select(0)
                } else
                    O(),
                    A(a, !0);
            f && x(a, !1)
        }, function() {
            O(),
            x(a, !1),
            A(a, !0)
        })
    };
    C && (angular.element(i).bind("resize", m),
    h.find("body").bind("scroll", m));
    var S;
    K.moveInProgress = !1,
    K.query = void 0;
    var T, U = function(a) {
        T = g(function() {
            R(a)
        }, v)
    }, V = function() {
        T && g.cancel(T)
    };
    O(),
    K.select = function(d) {
        var e, f, h = {};
        u = !0,
        h[J.itemName] = f = K.matches[d].model,
        e = J.modelMapper(a, h),
        I(a, e),
        o.$setValidity("editable", !0),
        o.$setValidity("parse", !0),
        y(a, {
            $item: f,
            $model: e,
            $label: J.viewMapper(a, h)
        }),
        O(),
        K.$eval(c.typeaheadFocusOnSelect) !== !1 && g(function() {
            b[0].focus()
        }, 0, !1)
    }
    ,
    b.bind("keydown", function(a) {
        if (0 !== K.matches.length && -1 !== q.indexOf(a.which)) {
            if (-1 === K.activeIdx && (9 === a.which || 13 === a.which))
                return O(),
                void K.$digest();
            a.preventDefault(),
            40 === a.which ? (K.activeIdx = (K.activeIdx + 1) % K.matches.length,
            K.$digest()) : 38 === a.which ? (K.activeIdx = (K.activeIdx > 0 ? K.activeIdx : K.matches.length) - 1,
            K.$digest()) : 13 === a.which || 9 === a.which ? K.$apply(function() {
                K.select(K.activeIdx)
            }) : 27 === a.which && (a.stopPropagation(),
            O(),
            K.$digest())
        }
    }),
    b.bind("blur", function() {
        z && K.matches.length && -1 !== K.activeIdx && !u && (u = !0,
        K.$apply(function() {
            K.select(K.activeIdx)
        })),
        t = !1,
        u = !1
    });
    var W = function(a) {
        b[0] !== a.target && 3 !== a.which && 0 !== K.matches.length && (O(),
        j.$$phase || K.$digest())
    };
    h.bind("click", W),
    a.$on("$destroy", function() {
        h.unbind("click", W),
        (C || D) && X.remove(),
        C && (angular.element(i).unbind("resize", m),
        h.find("body").unbind("scroll", m)),
        N.remove()
    });
    var X = d(N)(K);
    C ? h.find("body").append(X) : D !== !1 ? angular.element(h[0].getElementById(D)).append(X) : b.after(X),
    this.init = function(b, c) {
        o = b,
        p = c,
        o.$parsers.unshift(function(b) {
            return t = !0,
            0 === s || b && b.length >= s ? v > 0 ? (V(),
            U(b)) : R(b) : (x(a, !1),
            V(),
            O()),
            w ? b : b ? void o.$setValidity("editable", !1) : (o.$setValidity("editable", !0),
            null)
        }),
        o.$formatters.push(function(b) {
            var c, d, e = {};
            return w || o.$setValidity("editable", !0),
            B ? (e.$model = b,
            B(a, e)) : (e[J.itemName] = b,
            c = J.viewMapper(a, e),
            e[J.itemName] = void 0,
            d = J.viewMapper(a, e),
            c !== d ? c : b)
        })
    }
}
]).directive("uibTypeahead", function() {
    return {
        controller: "UibTypeaheadController",
        require: ["ngModel", "^?ngModelOptions", "uibTypeahead"],
        link: function(a, b, c, d) {
            d[2].init(d[0], d[1])
        }
    }
}).directive("uibTypeaheadPopup", function() {
    return {
        scope: {
            matches: "=",
            query: "=",
            active: "=",
            position: "&",
            moveInProgress: "=",
            select: "&"
        },
        replace: !0,
        templateUrl: function(a, b) {
            return b.popupTemplateUrl || "template/typeahead/typeahead-popup.html"
        },
        link: function(a, b, c) {
            a.templateUrl = c.templateUrl,
            a.isOpen = function() {
                return a.matches.length > 0
            }
            ,
            a.isActive = function(b) {
                return a.active == b
            }
            ,
            a.selectActive = function(b) {
                a.active = b
            }
            ,
            a.selectMatch = function(b) {
                a.select({
                    activeIdx: b
                })
            }
        }
    }
}).directive("uibTypeaheadMatch", ["$templateRequest", "$compile", "$parse", function(a, b, c) {
    return {
        scope: {
            index: "=",
            match: "=",
            query: "="
        },
        link: function(d, e, f) {
            var g = c(f.templateUrl)(d.$parent) || "template/typeahead/typeahead-match.html";
            a(g).then(function(a) {
                b(a.trim())(d, function(a) {
                    e.replaceWith(a)
                })
            })
        }
    }
}
]).filter("uibTypeaheadHighlight", ["$sce", "$injector", "$log", function(a, b, c) {
    function d(a) {
        return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
    }
    function e(a) {
        return /<.*>/g.test(a)
    }
    var f;
    return f = b.has("$sanitize"),
    function(b, g) {
        return !f && e(b) && c.warn("Unsafe use of typeahead please use ngSanitize"),
        b = g ? ("" + b).replace(new RegExp(d(g),"gi"), "<strong>$&</strong>") : b,
        f || (b = a.trustAsHtml(b)),
        b
    }
}
]),
angular.module("ui.bootstrap.typeahead").value("$typeaheadSuppressWarning", !1).service("typeaheadParser", ["$parse", "uibTypeaheadParser", "$log", "$typeaheadSuppressWarning", function(a, b, c, d) {
    return d || c.warn("typeaheadParser is now deprecated. Use uibTypeaheadParser instead."),
    b
}
]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$uibPosition", "typeaheadParser", "$log", "$typeaheadSuppressWarning", function(a, b, c, d, e, f, g, h, i, j, k) {
    var l = [9, 13, 27, 38, 40]
      , m = 200;
    return {
        require: ["ngModel", "^?ngModelOptions"],
        link: function(n, o, p, q) {
            function r() {
                N.moveInProgress || (N.moveInProgress = !0,
                N.$digest()),
                V && d.cancel(V),
                V = d(function() {
                    N.matches.length && s(),
                    N.moveInProgress = !1
                }, m)
            }
            function s() {
                N.position = F ? h.offset(o) : h.position(o),
                N.position.top += o.prop("offsetHeight")
            }
            k || j.warn("typeahead is now deprecated. Use uib-typeahead instead.");
            var t = q[0]
              , u = q[1]
              , v = n.$eval(p.typeaheadMinLength);
            v || 0 === v || (v = 1);
            var w, x, y = n.$eval(p.typeaheadWaitMs) || 0, z = n.$eval(p.typeaheadEditable) !== !1, A = b(p.typeaheadLoading).assign || angular.noop, B = b(p.typeaheadOnSelect), C = angular.isDefined(p.typeaheadSelectOnBlur) ? n.$eval(p.typeaheadSelectOnBlur) : !1, D = b(p.typeaheadNoResults).assign || angular.noop, E = p.typeaheadInputFormatter ? b(p.typeaheadInputFormatter) : void 0, F = p.typeaheadAppendToBody ? n.$eval(p.typeaheadAppendToBody) : !1, G = p.typeaheadAppendToElementId || !1, H = n.$eval(p.typeaheadFocusFirst) !== !1, I = p.typeaheadSelectOnExact ? n.$eval(p.typeaheadSelectOnExact) : !1, J = b(p.ngModel), K = b(p.ngModel + "($$$p)"), L = function(a, b) {
                return angular.isFunction(J(n)) && u && u.$options && u.$options.getterSetter ? K(a, {
                    $$$p: b
                }) : J.assign(a, b)
            }, M = i.parse(p.typeahead), N = n.$new(), O = n.$on("$destroy", function() {
                N.$destroy()
            });
            N.$on("$destroy", O);
            var P = "typeahead-" + N.$id + "-" + Math.floor(1e4 * Math.random());
            o.attr({
                "aria-autocomplete": "list",
                "aria-expanded": !1,
                "aria-owns": P
            });
            var Q = angular.element("<div typeahead-popup></div>");
            Q.attr({
                id: P,
                matches: "matches",
                active: "activeIdx",
                select: "select(activeIdx)",
                "move-in-progress": "moveInProgress",
                query: "query",
                position: "position"
            }),
            angular.isDefined(p.typeaheadTemplateUrl) && Q.attr("template-url", p.typeaheadTemplateUrl),
            angular.isDefined(p.typeaheadPopupTemplateUrl) && Q.attr("popup-template-url", p.typeaheadPopupTemplateUrl);
            var R = function() {
                N.matches = [],
                N.activeIdx = -1,
                o.attr("aria-expanded", !1)
            }
              , S = function(a) {
                return P + "-option-" + a
            };
            N.$watch("activeIdx", function(a) {
                0 > a ? o.removeAttr("aria-activedescendant") : o.attr("aria-activedescendant", S(a))
            });
            var T = function(a, b) {
                return N.matches.length > b && a ? a.toUpperCase() === N.matches[b].label.toUpperCase() : !1
            }
              , U = function(a) {
                var b = {
                    $viewValue: a
                };
                A(n, !0),
                D(n, !1),
                c.when(M.source(n, b)).then(function(c) {
                    var d = a === t.$viewValue;
                    if (d && w)
                        if (c && c.length > 0) {
                            N.activeIdx = H ? 0 : -1,
                            D(n, !1),
                            N.matches.length = 0;
                            for (var e = 0; e < c.length; e++)
                                b[M.itemName] = c[e],
                                N.matches.push({
                                    id: S(e),
                                    label: M.viewMapper(N, b),
                                    model: c[e]
                                });
                            N.query = a,
                            s(),
                            o.attr("aria-expanded", !0),
                            I && 1 === N.matches.length && T(a, 0) && N.select(0)
                        } else
                            R(),
                            D(n, !0);
                    d && A(n, !1)
                }, function() {
                    R(),
                    A(n, !1),
                    D(n, !0)
                })
            };
            F && (angular.element(f).bind("resize", r),
            e.find("body").bind("scroll", r));
            var V;
            N.moveInProgress = !1,
            R(),
            N.query = void 0;
            var W, X = function(a) {
                W = d(function() {
                    U(a)
                }, y)
            }, Y = function() {
                W && d.cancel(W)
            };
            t.$parsers.unshift(function(a) {
                return w = !0,
                0 === v || a && a.length >= v ? y > 0 ? (Y(),
                X(a)) : U(a) : (A(n, !1),
                Y(),
                R()),
                z ? a : a ? void t.$setValidity("editable", !1) : (t.$setValidity("editable", !0),
                null)
            }),
            t.$formatters.push(function(a) {
                var b, c, d = {};
                return z || t.$setValidity("editable", !0),
                E ? (d.$model = a,
                E(n, d)) : (d[M.itemName] = a,
                b = M.viewMapper(n, d),
                d[M.itemName] = void 0,
                c = M.viewMapper(n, d),
                b !== c ? b : a)
            }),
            N.select = function(a) {
                var b, c, e = {};
                x = !0,
                e[M.itemName] = c = N.matches[a].model,
                b = M.modelMapper(n, e),
                L(n, b),
                t.$setValidity("editable", !0),
                t.$setValidity("parse", !0),
                B(n, {
                    $item: c,
                    $model: b,
                    $label: M.viewMapper(n, e)
                }),
                R(),
                N.$eval(p.typeaheadFocusOnSelect) !== !1 && d(function() {
                    o[0].focus()
                }, 0, !1)
            }
            ,
            o.bind("keydown", function(a) {
                if (0 !== N.matches.length && -1 !== l.indexOf(a.which)) {
                    if (-1 === N.activeIdx && (9 === a.which || 13 === a.which))
                        return R(),
                        void N.$digest();
                    a.preventDefault(),
                    40 === a.which ? (N.activeIdx = (N.activeIdx + 1) % N.matches.length,
                    N.$digest()) : 38 === a.which ? (N.activeIdx = (N.activeIdx > 0 ? N.activeIdx : N.matches.length) - 1,
                    N.$digest()) : 13 === a.which || 9 === a.which ? N.$apply(function() {
                        N.select(N.activeIdx)
                    }) : 27 === a.which && (a.stopPropagation(),
                    R(),
                    N.$digest())
                }
            }),
            o.bind("blur", function() {
                C && N.matches.length && -1 !== N.activeIdx && !x && (x = !0,
                N.$apply(function() {
                    N.select(N.activeIdx)
                })),
                w = !1,
                x = !1
            });
            var Z = function(a) {
                o[0] !== a.target && 3 !== a.which && 0 !== N.matches.length && (R(),
                g.$$phase || N.$digest())
            };
            e.bind("click", Z),
            n.$on("$destroy", function() {
                e.unbind("click", Z),
                (F || G) && $.remove(),
                F && (angular.element(f).unbind("resize", r),
                e.find("body").unbind("scroll", r)),
                Q.remove()
            });
            var $ = a(Q)(N);
            F ? e.find("body").append($) : G !== !1 ? angular.element(e[0].getElementById(G)).append($) : o.after($)
        }
    }
}
]).directive("typeaheadPopup", ["$typeaheadSuppressWarning", "$log", function(a, b) {
    return {
        scope: {
            matches: "=",
            query: "=",
            active: "=",
            position: "&",
            moveInProgress: "=",
            select: "&"
        },
        replace: !0,
        templateUrl: function(a, b) {
            return b.popupTemplateUrl || "template/typeahead/typeahead-popup.html"
        },
        link: function(c, d, e) {
            a || b.warn("typeahead-popup is now deprecated. Use uib-typeahead-popup instead."),
            c.templateUrl = e.templateUrl,
            c.isOpen = function() {
                return c.matches.length > 0
            }
            ,
            c.isActive = function(a) {
                return c.active == a
            }
            ,
            c.selectActive = function(a) {
                c.active = a
            }
            ,
            c.selectMatch = function(a) {
                c.select({
                    activeIdx: a
                })
            }
        }
    }
}
]).directive("typeaheadMatch", ["$templateRequest", "$compile", "$parse", "$typeaheadSuppressWarning", "$log", function(a, b, c, d, e) {
    return {
        restrict: "EA",
        scope: {
            index: "=",
            match: "=",
            query: "="
        },
        link: function(f, g, h) {
            d || e.warn("typeahead-match is now deprecated. Use uib-typeahead-match instead.");
            var i = c(h.templateUrl)(f.$parent) || "template/typeahead/typeahead-match.html";
            a(i).then(function(a) {
                b(a.trim())(f, function(a) {
                    g.replaceWith(a)
                })
            })
        }
    }
}
]).filter("typeaheadHighlight", ["$sce", "$injector", "$log", "$typeaheadSuppressWarning", function(a, b, c, d) {
    function e(a) {
        return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
    }
    function f(a) {
        return /<.*>/g.test(a)
    }
    var g;
    return g = b.has("$sanitize"),
    function(b, h) {
        return d || c.warn("typeaheadHighlight is now deprecated. Use uibTypeaheadHighlight instead."),
        !g && f(b) && c.warn("Unsafe use of typeahead please use ngSanitize"),
        b = h ? ("" + b).replace(new RegExp(e(h),"gi"), "<strong>$&</strong>") : b,
        g || (b = a.trustAsHtml(b)),
        b
    }
}
]),
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function(a) {
    a.put("template/accordion/accordion-group.html", '<div class="panel {{panelClass || \'panel-default\'}}">\n  <div class="panel-heading" ng-keypress="toggleOpen($event)">\n    <h4 class="panel-title">\n      <a href tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" uib-accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse collapse" uib-collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')
}
]),
angular.module("template/accordion/accordion.html", []).run(["$templateCache", function(a) {
    a.put("template/accordion/accordion.html", '<div class="panel-group" ng-transclude></div>')
}
]),
angular.module("template/alert/alert.html", []).run(["$templateCache", function(a) {
    a.put("template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissible\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close({$event: $event})">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')
}
]),
angular.module("template/carousel/carousel.html", []).run(["$templateCache", function(a) {
    a.put("template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n  <div class="carousel-inner" ng-transclude></div>\n  <a role="button" href class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1">\n    <span aria-hidden="true" class="glyphicon glyphicon-chevron-left"></span>\n    <span class="sr-only">previous</span>\n  </a>\n  <a role="button" href class="right carousel-control" ng-click="next()" ng-show="slides.length > 1">\n    <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>\n    <span class="sr-only">next</span>\n  </a>\n  <ol class="carousel-indicators" ng-show="slides.length > 1">\n    <li ng-repeat="slide in slides | orderBy:indexOfSlide track by $index" ng-class="{ active: isActive(slide) }" ng-click="select(slide)">\n      <span class="sr-only">slide {{ $index + 1 }} of {{ slides.length }}<span ng-if="isActive(slide)">, currently active</span></span>\n    </li>\n  </ol>\n</div>')
}
]),
angular.module("template/carousel/slide.html", []).run(["$templateCache", function(a) {
    a.put("template/carousel/slide.html", '<div ng-class="{\n    \'active\': active\n  }" class="item text-center" ng-transclude></div>\n')
}
]),
angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function(a) {
    a.put("template/datepicker/datepicker.html", '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <uib-daypicker ng-switch-when="day" tabindex="0"></uib-daypicker>\n  <uib-monthpicker ng-switch-when="month" tabindex="0"></uib-monthpicker>\n  <uib-yearpicker ng-switch-when="year" tabindex="0"></uib-yearpicker>\n</div>')
}
]),
angular.module("template/datepicker/day.html", []).run(["$templateCache", function(a) {
    a.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{::5 + showWeeks}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-if="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in ::labels track by $index" class="text-center"><small aria-label="{{::label.full}}">{{::label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-if="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{::dt.uid}}" ng-class="::dt.customClass">\n        <button type="button" style="min-width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="::{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/datepicker/month.html", []).run(["$templateCache", function(a) {
    a.put("template/datepicker/month.html", '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{::dt.uid}}" ng-class="::dt.customClass">\n        <button type="button" style="min-width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/datepicker/popup.html", []).run(["$templateCache", function(a) {
    a.put("template/datepicker/popup.html", '<ul class="dropdown-menu" dropdown-nested ng-if="isOpen" style="display: block" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)" ng-click="$event.stopPropagation()">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group pull-left">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')" ng-disabled="isDisabled(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')
}
]),
angular.module("template/datepicker/year.html", []).run(["$templateCache", function(a) {
    a.put("template/datepicker/year.html", '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{::dt.uid}}" ng-class="::dt.customClass">\n        <button type="button" style="min-width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/modal/backdrop.html", []).run(["$templateCache", function(a) {
    a.put("template/modal/backdrop.html", '<div uib-modal-animation-class="fade"\n     modal-in-class="in"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')
}
]),
angular.module("template/modal/window.html", []).run(["$templateCache", function(a) {
    a.put("template/modal/window.html", '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n    uib-modal-animation-class="fade"\n    modal-in-class="in"\n    ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}">\n    <div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'"><div class="modal-content" uib-modal-transclude></div></div>\n</div>\n')
}
]),
angular.module("template/pagination/pager.html", []).run(["$templateCache", function(a) {
    a.put("template/pagination/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious()||ngDisabled, previous: align}"><a href ng-click="selectPage(page - 1, $event)">{{::getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext()||ngDisabled, next: align}"><a href ng-click="selectPage(page + 1, $event)">{{::getText(\'next\')}}</a></li>\n</ul>\n')
}
]),
angular.module("template/pagination/pagination.html", []).run(["$templateCache", function(a) {
    a.put("template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href ng-click="selectPage(1, $event)">{{::getText(\'first\')}}</a></li>\n  <li ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-prev"><a href ng-click="selectPage(page - 1, $event)">{{::getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href ng-click="selectPage(page.number, $event)">{{page.text}}</a></li>\n  <li ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-next"><a href ng-click="selectPage(page + 1, $event)">{{::getText(\'next\')}}</a></li>\n  <li ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href ng-click="selectPage(totalPages, $event)">{{::getText(\'last\')}}</a></li>\n</ul>\n')
}
]),
angular.module("template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function(a) {
    a.put("template/tooltip/tooltip-html-popup.html", '<div\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html="contentExp()"></div>\n</div>\n')
}
]),
angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function(a) {
    a.put("template/tooltip/tooltip-popup.html", '<div\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
}
]),
angular.module("template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function(a) {
    a.put("template/tooltip/tooltip-template-popup.html", '<div\n  tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner"\n    uib-tooltip-template-transclude="contentExp()"\n    tooltip-template-transclude-scope="originScope()"></div>\n</div>\n')
}
]),
angular.module("template/popover/popover-html.html", []).run(["$templateCache", function(a) {
    a.put("template/popover/popover-html.html", '<div tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content" ng-bind-html="contentExp()"></div>\n  </div>\n</div>\n')
}
]),
angular.module("template/popover/popover-template.html", []).run(["$templateCache", function(a) {
    a.put("template/popover/popover-template.html", '<div tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content"\n        uib-tooltip-template-transclude="contentExp()"\n        tooltip-template-transclude-scope="originScope()"></div>\n  </div>\n</div>\n')
}
]),
angular.module("template/popover/popover.html", []).run(["$templateCache", function(a) {
    a.put("template/popover/popover.html", '<div tooltip-animation-class="fade"\n  uib-tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')
}
]),
angular.module("template/progressbar/bar.html", []).run(["$templateCache", function(a) {
    a.put("template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" aria-labelledby="{{::title}}" style="min-width: 0;" ng-transclude></div>\n')
}
]),
angular.module("template/progressbar/progress.html", []).run(["$templateCache", function(a) {
    a.put("template/progressbar/progress.html", '<div class="progress" ng-transclude aria-labelledby="{{::title}}"></div>')
}
]),
angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function(a) {
    a.put("template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" aria-labelledby="{{::title}}" style="min-width: 0;" ng-transclude></div>\n</div>\n')
}
]),
angular.module("template/rating/rating.html", []).run(["$templateCache", function(a) {
    a.put("template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <span ng-repeat-start="r in range track by $index" class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    <i ng-repeat-end ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')" ng-attr-title="{{r.title}}" aria-valuetext="{{r.title}}"></i>\n</span>\n');
}
]),
angular.module("template/tabs/tab.html", []).run(["$templateCache", function(a) {
    a.put("template/tabs/tab.html", '<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" uib-tab-heading-transclude>{{heading}}</a>\n</li>\n')
}
]),
angular.module("template/tabs/tabset.html", []).run(["$templateCache", function(a) {
    a.put("template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         uib-tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')
}
]),
angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function(a) {
    a.put("template/timepicker/timepicker.html", '<table>\n  <tbody>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td><a ng-click="incrementHours()" ng-class="{disabled: noIncrementHours()}" class="btn btn-link" ng-disabled="noIncrementHours()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td>&nbsp;</td>\n      <td><a ng-click="incrementMinutes()" ng-class="{disabled: noIncrementMinutes()}" class="btn btn-link" ng-disabled="noIncrementMinutes()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n    <tr>\n      <td class="form-group" ng-class="{\'has-error\': invalidHours}">\n        <input style="width:50px;" type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}">\n      </td>\n      <td>:</td>\n      <td class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n        <input style="width:50px;" type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}">\n      </td>\n      <td ng-show="showMeridian"><button type="button" ng-class="{disabled: noToggleMeridian()}" class="btn btn-default text-center" ng-click="toggleMeridian()" ng-disabled="noToggleMeridian()" tabindex="{{::tabindex}}">{{meridian}}</button></td>\n    </tr>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td><a ng-click="decrementHours()" ng-class="{disabled: noDecrementHours()}" class="btn btn-link" ng-disabled="noDecrementHours()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td>&nbsp;</td>\n      <td><a ng-click="decrementMinutes()" ng-class="{disabled: noDecrementMinutes()}" class="btn btn-link" ng-disabled="noDecrementMinutes()" tabindex="{{::tabindex}}"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function(a) {
    a.put("template/typeahead/typeahead-match.html", '<a href tabindex="-1" ng-bind-html="match.label | uibTypeaheadHighlight:query"></a>\n')
}
]),
angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function(a) {
    a.put("template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen() && !moveInProgress" ng-style="{top: position().top+\'px\', left: position().left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{::match.id}}">\n        <div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
}
]),
!angular.$$csp() && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');
