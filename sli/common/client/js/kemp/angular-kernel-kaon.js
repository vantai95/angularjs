/*!
 * Angular KAONSOFT Framework
 * http://www.kaonsoft.com
 * v1.4.1
 */
(function( window, angular, undefined ){
"use strict";

(function(){
"use strict";

angular.module('ngKaon', ["ng","kaon.kernel","kaon.kernel.http","kaon.kernel.native"]);
})();
(function(){
"use strict";

/**
 * Initialization function that validates environment
 * requirements.
 */
angular
    .module('kaon.kernel', [
        "ngCookies",
        "kaon.kernel.http",
        "kaon.kernel.native"
    ])
})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name kaon.kernel.http
 * @description
 * nttp Expectations for ngKaon components.
 */

angular
    .module('kaon.kernel.http', [])
    .provider('$ksHttp', KsKernelHttpProvider)

function KsKernelHttpProvider() {
    var CONTENT_TYPE_JSON = "application/json";
    var CONTENT_TYPE = "application/x-www-form-urlencoded; charset=UTF-8";
    var X_REQUESTED_WITH = "XMLHttpRequest";
    this.$http = null;
    this.$q = null;
    var vm = this;
    return {
        $get: ["$http", "$q", function($http, $q) {
            vm.$http = $http;
            vm.$q = $q;
            return {
                post: post,
                postJson: postJson,
                put: put,
                putJson: putJson,
                get: get,
                delete: _delete,
                error: error
            }
        }]
    };


    function post(url, data) {
        var headers = { 'Content-Type': CONTENT_TYPE, 'X-Requested-With': X_REQUESTED_WITH };
        if (data != null) {
            data = jQueryLikeParamSerializer(data) //$.param(data);
        }
        return _http("POST", url, data, headers);
    }

    function put(url, data) {
        var headers = { 'Content-Type': CONTENT_TYPE, 'X-Requested-With': X_REQUESTED_WITH };
        if (data != null) {
            data = jQueryLikeParamSerializer(data) //$.param(data);
        }
        return _http("PUT", url, data, headers);
    }

    function postJson(url, data) {
        var headers = { 'Content-Type': CONTENT_TYPE_JSON };
        return _http("POST", url, data, headers);
    }

    function putJson(url, data) {
        var headers = { 'Content-Type': CONTENT_TYPE_JSON };
        return _http("PUT", url, data, headers);
    }

    function get(url, option) {
        var headers = { 'Content-Type': CONTENT_TYPE, 'X-Requested-With': X_REQUESTED_WITH };
        return _http("GET", url, {}, headers);
    }

    function _delete(url, option) {
        var headers = { 'Content-Type': CONTENT_TYPE, 'X-Requested-With': X_REQUESTED_WITH };
        return _http("DELETE", url, {}, headers);
    }



    function _http(method, url, data, header) {
        var postUrl = '../InquireData/' + url;
        var defer = vm.$q.defer();

        var promise = vm.$http({
            method: method,
            url: postUrl,
            data: data,
            headers: header,
            cache: false
        })
        promise.then(function(result) {
            if (result.status == 200) {
                success(result.data, defer);
            } else {
                defer.reject(result);
            }
        }, function(result) {
            return defer.reject(error(result));;
        })

        return defer.promise;
    }

    function success(data, defer) {
        if (data.result == 'ok') {
            var values = data.values;
            if (values != null) {
                var promises = [];
                var promisesValue = [];
                angular.forEach(values, function(value, key) {
                    var promise;
                    if (value.adapterProvider == "KEMP.Webservice") {
                        promise = successWebService(value);
                    } else {
                        promise = successOthers(value);
                    }
                    if (promise != null) {
                        promises.push(promise);
                        promisesValue.push(key);
                    }
                });

                vm.$q.all(promises).then(function(results) {
                    var size = results.length;
                    if (size == 1) {
                        defer.resolve(results[0]);
                    } else {
                        var datas = {};
                        for (var i = 0; i < size; i++) {
                            if (promisesValue[i] != null) {
                                datas[promisesValue[i]] = results[i];
                            }
                        }
                        defer.resolve(datas);
                    }
                });
            } else {
                defer.resolve(data);
            }
        } else {
            defer.resolve(data);
        }
    }


    function successWebService(value) {
        if (value.statusCode == 200) {
            return value.responseBody;
        }
        return null;
    }

    function successOthers(value) {
        return value.responseBody;
    }

    function error(result) {
        return result;
    }

    function errorWebService(value) {

    }


    function jQueryLikeParamSerializer(params) {
        if (!params) return '';
        var parts = [];
        serialize(params, '', true);
        return parts.join('&');

        function isObject(value) { return value !== null && typeof value === 'object'; }

        function isDate(value) {
            return typeof value === 'object' && value instanceof Date;
        }

        function encodeUriQuery(val, pctEncodeSpaces) {
            return encodeURIComponent(val).
            replace(/%40/gi, '@').
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%3B/gi, ';').
            replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
        }

        function serialize(toSerialize, prefix, topLevel) {
            if (Array.isArray(toSerialize)) {
                toSerialize.forEach(function(value, index) {
                    serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']');
                });
            } else if (isObject(toSerialize) && !isDate(toSerialize)) {

                Object.keys(toSerialize).forEach(function(key) {
                    var value = toSerialize[key];
                    serialize(value, prefix +
                        (topLevel ? '' : '[') +
                        key +
                        (topLevel ? '' : ']'));
                });
            } else {
                parts.push(encodeUriQuery(prefix) + '=' +
                    (toSerialize == null ? '' : encodeUriQuery(serializeValue(toSerialize))));
            }
        }

        function serializeValue(v) {
            if (isObject(v)) {
                return isDate(v) ? v.toISOString() : JSON.parse(v);
            }
            return v;
        }

    }
}
})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name kaon.kernel.native
 * @description
 * native Expectations for ngKaon components.
 */

ksIsKempService.$inject = ["$cookies", "$timeout"];
KsNativeService.$inject = ["$timeout", "$location", "$window", "$rootScope", "$q", "$ksIsKemp"];
angular
    .module('kaon.kernel.native', ["ngCookies"])
    .service('$ksIsKemp', ksIsKempService)
    .service('$ksNative', KsNativeService)

/* ksIsKemp Provider */
function ksIsKempService($cookies, $timeout) {
    var kempNative = kempNative || {};
    var isMock = false;
    var isKemp = navigator.userAgent.match(/Meerue|KEMP/i) != null;
    var osType = null;
    var iosQue = [];
    var iosReqCnt = (Math.floor(Math.random() * 1000) + 100);
    var iosSending = null;
    var iosQueCookieName = 'iosReqCnt';


    // device browser os type
    if (navigator.userAgent.match(/Windows Phone 8.1/i) != null) {
        osType = 'wp8'
    } else if (navigator.userAgent.match(/Android/i) != null) {
        osType = 'android';
    } else if (navigator.userAgent.match(/iPad|iPhone|Macintosh/i) != null) {
        osType = 'ios';
    } else {
        osType = 'unknown';
    }

    // is kaon    
    Object.defineProperty(kempNative, 'isAgent', {
        get: function() { return isKemp; }
    });

    Object.defineProperty(kempNative, 'isNative', {
        get: function() { return isKemp; }
    });

    // get os type
    Object.defineProperty(kempNative, 'osType', {
        get: function() { return osType; }
    });

    // get cookie
    function fnGetCookie(key) {
        if ($cookies.get(key))
            return $cookies.get(key);
        return "";
    };
    // set cookie
    /*     function fnSetCookie(key, val, hour) {
            var options = {};
            if (hour) {
                options.path = '/';
                options.expires = moment().add(hour, 'hours')._d;
            }
            $cookies.put(key, val, options);
        }; */

    function fnSetCookie(key, val) {
        var options = {};
        $cookies.put(key, val, options);
    };

    // ios function
    function fnGetReqCnt4IOS() {
        var no = fnGetCookie(iosQueCookieName);
        if (no == undefined || no == "") {
            no = Math.floor(Math.random() * 1000) + 100;
        }
        return no;
    };

    function fnSendIOS() {
        if (iosQue.length > 0) {
            var obj = iosQue[0];
            document.location = obj.req;
        } else {
            clearInterval(iosSending);
            iosSending = null;
        }
    };

    function fnRequestToIOS(cmd) {
        iosReqCnt = fnGetReqCnt4IOS();
        ++iosReqCnt;
        fnSetCookie('iosReqCnt', iosReqCnt);

        var no = "" + iosReqCnt;
        no = "00000".substring(0, 5 - no.length) + no;

        cmd = "BRIDGE:" + no + ":" + cmd;
        iosQue.push({ no: iosReqCnt, req: cmd });

        if (iosSending == null) {
            iosSending = setInterval(fnSendIOS, 100);
        }
    };

    function fnRedirect(location) {
        if (!angular.isElement('iframe#__iframe__')) {
            var template = "<iframe id='__iframe__'></iframe>";
            var elm = angular.element(template);
            var elmCss = { 'width': '0px', 'height': '0px', 'position': 'absolute', 'top': '0', 'left': '0' };
            elm.css(elmCss);
            angular.element('body').append(elm);
        }
        angular.element('iframe#__iframe__').attr('src', location);
    };


    // get mock
    kempNative.isMock = function() {
        return isMock;
    };

    // set mock
    kempNative.setMock = function(mock) {
        if (typeof(mock) === 'boolean' && mock) {
            isMock = mock;
        }
    };

    // set os type
    kempNative.setOsType = function(ot) {
        if (isMock) {
            osType = ot;
        }
    };

    // call native
    kempNative.toNative = function(funcname, param) {
        var paramjson = null;
        if (typeof(param) === 'object') {
            paramjson = JSON.stringify(param);
        } else {
            paramjson = param;
        }

        if (osType == 'ios') {
            if (navigator.userAgent.match(/KEMP/i) != null) { //new sdk

                var url = "JSTONATIVE:/SPLIT/:" + funcname + ":/SPLIT/:" + paramjson;
                $timeout(function() {
                    document.location = url;
                }, 200);
            } else { //old meerue sdk
                var url = "IOS:/SPLIT/:toApp:/SPLIT/:" + funcname + ":/SPLIT/:" + paramjson;
                fnRequestToIOS(url);
            }
        } else if (osType == 'android') {
            $timeout(function() {
                window.Bridge.jsToNative(funcname, paramjson);
            }, 300);
        } else if (osType == 'wp8') {
            var param = '{"functionName":"' + funcname + '",';
            if (!paramjson || paramjson.length <= 7) param += '"warn":"noparam"}'; // if length less than {"":""}
            else param += paramjson.substr(1);
            //console.log('toWP8:'+param);
            window.external.notify(param);
        }
    };

    // call native log
    kempNative.log = function() {
        if (typeof(kempNative) == 'object' && kempNative.isAgent) {
            var msg = "";
            for (var i = 0; i < arguments.length; ++i) {
                var str = String(arguments[i]);
                str = str.replace(/"/g, '\\"');
                msg += str;
                if (i != arguments.length - 1) msg += ", ";
            }
            kempNative.toNative("logging", '{"msg":"' + msg + '"}');
        }
    };

    // receiveOk
    kempNative.receiveOK = function(no) {
        if (iosQue.length > 0) {
            var obj = iosQue[0];
            if (obj.no == no) iosQue.shift();
        }
    };

    kempNative.launchApp = function(obj) {
        if (!obj) return;

        var scheme = null;
        var storeUrl = null;
        if (osType == 'ios' && obj['iScheme']) scheme = obj['iScheme'];
        else if (osType == 'android' && obj['aScheme']) scheme = obj['aScheme'];
        else if (osType == 'wp8' && obj['wScheme']) scheme = obj['wScheme'];

        if (osType == 'ios') storeUrl = obj.iStoreUrl;
        else if (osType == 'android') storeUrl = obj.aStoreUrl;
        else if (osType == 'wp8') storeUrl = obj.wStoreUrl;

        if (!scheme) scheme = obj.scheme;
        if (!scheme) return;

        if (osType == 'android' && kempNative.isAgent) {
            kempNative.toNative('launchApp', "{\"scheme\":\"" + scheme + "\",\"storeUrl\":\"" + storeUrl + "\"}");
            return;
        }

        var lt = new Date;
        setTimeout(function() {
            var nt = new Date;
            if (nt - lt > 2000) {
                console.log('time over...');
                return;
            }
            if (osType == 'android') {
                console.log('call store');
                // window.location.href = storeUrl;
            } else if (osType == 'ios') redirect(storeUrl);
        }, 500);

        fnRedirect(scheme);
    };

    return kempNative;
};

function KsNativeService($timeout, $location, $window, $rootScope, $q, $ksIsKemp) {
    /** @private @const {!angular.$timeout} */
    this.$timeout = $timeout;
    /** @private @const {!angular.$location} */
    this.$location = $location;
    /** @private @const {!angular.$window} */
    this.$window = $window;
    /** @private @const {!angular.$rootScope} */
    this.$rootScope = $rootScope;
    /** @private @const {!angular.$q} */
    this.$q = $q;

    this.toNativeArry = [];
    this.toNativeWatchArray = [];
    this.nativeReset = true;

    /** kempNative **/
    this.$window.kempNative = $ksIsKemp;
    /* if ($) {
         if (!$.Meerue) {
             $.Meerue = {};
             $.Meerue.Native = {};
             $.Meerue.Native.receiveOK = kempNative.receiveOK;
         }
     }*/
}


/**
 * @ngdoc method
 * @name $KsNativeService#toNativeAdd
 * @description  for native function call to add
 */
KsNativeService.prototype.toNativeAdd = function() {
        var k = this.toNativeArry.length;
        var maxLength = this.toNativeArry.length;
        for (; k <= maxLength; k++) {
            if (k == this.toNativeArry.length)
                this.toNativeArry[k] = new NativeCallBack();
        }
    }
    /**
     * @ngdoc method
     * @name NativeCallBack
     * @description  NativeCallBack
     */
function NativeCallBack() {

}


/**
 * @ngdoc method
 * @name $KsNativeService#isNative
 * @description  check native
 */
KsNativeService.prototype.isNative = function() {
    if (kempNative) {
        return kempNative.isAgent;
    } else {
        return false;
    }
};

KsNativeService.prototype.getOsType = function() {
    if (kempNative) {
        //if($.Meerue.Native.getOsType()=='android'){
        return kempNative.osType;
    } else {
        return "";
    }
};

KsNativeService.prototype.isAndroid = function() {
    if (this.getOsType() == 'android') {
        return true;
    } else {
        return false;
    }
};

KsNativeService.prototype.isIOS = function() {
    if (this.getOsType() == 'ios') {
        return true;
    } else {
        return false;
    }
};


/**
 * @ngdoc method
 * @name $KsNativeService#fnNativeArryReset
 * @description  Native call back function reset
 */
KsNativeService.prototype.fnNativeArryReset = function() {
    if (this.nativeReset) {
        this.toNativeArry = [];
        this.nativeReset = false;
    }
};

/**
 * @ngdoc method
 * @name $KsNativeService#fnNativeArryReset
 * @description Native call back function add
 */
KsNativeService.prototype.fnNativeAdd = function() {
    this.fnNativeArryReset();
    this.toNativeAdd();
};

KsNativeService.prototype.toNativeWatch = function(state, param, callback) {
    var vm = this;
    vm[state] = {};
    vm[state].toNative = function(data) {
        console.info(data);
        data = data.replace(/\r/gi, "\\r").replace(/\n/gi, "\\n");
        if (data != null && data.length > 0) {
            try {
                if (typeof data == 'object') {
                    var result = data;
                } else {
                    var result = JSON.parse(data);
                }
            } catch (e) {
                console.info(e);
                var result = data;
            }
        } else {
            var result = {};
        }

        if (!vm.$rootScope.$$phase && (vm.$rootScope.$$phase == '$apply' || vm.$rootScope.$$phase == '$digest')) {
            vm.$rootScope.$apply(function() {
                callback(result);
            });
        } else {
            callback(result);
        }
    };

    if (vm.isNative()) {
        if (param == null) {
            param = {};
        }
        vm.$window[state] = vm[state];
        param.callback = state + ".toNative";
        kempNative.toNative(state, JSON.stringify(param));
    } else {
        vm.$timeout(function() {
            vm[state].toNative('{"result":"This data is dummy","resultCode":-1}');
        }, 200);
    }
};

KsNativeService.prototype.toNative = function(state, param, needCallBack) {
    if (needCallBack == null) {
        needCallBack = true;
    }

    var defer = this.$q.defer();
    var classLeng = this.toNativeArry.length;
    var vm = this;

    var fnNtiveArrayCheck = function() {
        vm.toNativeArry[classLeng].toNative = null;

        var runNative = vm.toNativeArry.filter(function(array, idx) {
            return array.toNative != null;
        });

        if (!runNative) {
            vm.nativeReset = true;
        }

        if (!vm.nativeReset) {
            var toNativeCnt = 0;
            Object.keys(vm.toNativeArry).map(function(objectKey, index) {
                if (vm.toNativeArry[objectKey].toNative) {
                    toNativeCnt++;
                }
            });
            if (toNativeCnt == 0) {
                vm.nativeReset = true;
            }
        }
    };

    if (needCallBack) {
        this.fnNativeAdd();
        if (this.toNativeArry.length == 1) {
            classLeng = 0;
        }
        this.toNativeArry[classLeng].toNative = function(data) {
            console.info(data);
            data = data.replace(/\r/gi, "\\r").replace(/\n/gi, "\\n");
            if (data != null && data.length > 0) {
                try {
                    if (typeof data == 'object') {
                        var result = data;
                    } else {
                        var result = JSON.parse(data);
                    }
                } catch (e) {
                    console.info(e);
                    var result = data;
                }
            } else {
                var result = {};
            }
            if (!vm.$rootScope.$$phase) {
                vm.$rootScope.$apply(function() {
                    defer.resolve(result);
                    fnNtiveArrayCheck();
                });
            } else {
                defer.resolve(result);
                fnNtiveArrayCheck();
            }
        }
    }

    if (this.isNative()) {
        if (param == null) {
            param = {};
        }
        if (needCallBack) {
            this.$window.toNativeArry = this.toNativeArry;
            param.callback = "toNativeArry[" + classLeng + "].toNative";
        }
        kempNative.toNative(state, JSON.stringify(param));
    } else {
        if (needCallBack) {
            this.$timeout(function() {
                vm.toNativeArry[classLeng].toNative('{"resultCode":-1,"result":"This data is dummy"}');
            }, 200);
        }
    }
    return defer.promise;
};
})();
})(window, window.angular);;window.ngKaon={version:{full: "1.4.1"}};