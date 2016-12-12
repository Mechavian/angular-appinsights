/*! angular-appinsights - v0.0.3 - 2016-12-11
* https://github.com/johnhidey/angular-appinsights#readme
* Copyright (c) 2016 ; Licensed  */
(function () {
    "use strict";

    angular.module('angular-appinsights', [])
        .provider('insights', InsightsProvider)
        .run(['$rootScope', '$location', 'insights', onAppRun]);

    var _appName = '';

    function InsightsProvider() {

        this.start = function (appId, appName) {

            if (!appId) {
                throw new Error('Argument "appId" expected');
            }

            _appName = appName || '(Application Root)';

            if (window.appInsights.start) {
                window.appInsights.start(appId);
            } else if (angular.isFunction(window.appInsights)) {
                window.appInsights = window.appInsights({ instrumentationKey: appId });
            } else if (window.appInsights.config) {
                window.appInsights.config.instrumentationKey = appId;
            } else {
                console.warn('Application Insights not initialized');
            }
        };

        this.$get = function () {
            return window.appInsights || {};
        };

    }

    function onAppRun($rootScope, $location, insights) {

        if (insights.trackPageView) {
            $rootScope.$on('$locationChangeStart', function () {
                var pagePath;
                try {
                    pagePath = _appName + '/' + $location.path().substr(1);
                }
                finally {
                    console.log("startTrackPage('" + pagePath + "')");
                    insights.startTrackPage(pagePath);
                }
            });

            $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
                var pagePath;
                try {
                    pagePath = _appName + '/' + $location.path().substr(1);
                }
                finally {
                    console.log("stopTrackPage('" + pagePath + "', '" + newUrl + "')");
                    insights.stopTrackPage(pagePath, newUrl);
                }
            });
        }
    }

} ());
