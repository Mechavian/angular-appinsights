/*! angular-appinsights - v0.0.3 - 2016-12-11
* https://github.com/johnhidey/angular-appinsights#readme
* Copyright (c) 2016 ; Licensed  */
(function () {
    "use strict";

    angular.module('angular-appInsights', [])
        .provider('insights', InsightsProvider)
        .run(['$rootScope', '$location', 'insights', onAppRun]);

        function InsightsProvider() {

            var _appId,
                _appName,
                appInsights = window.appInsights || {},
                insightsWrapper = {
                    'logEvent': appInsights.logEvent || appInsights.trackEvent || angular.noop,
                    'logPageView': appInsights.logPageView || appInsights.trackPageView || angular.noop,
                    'appName': _appName
                };

            this.start = function (appId, appName) {

                if (!appId) {
                    throw new Error('Argument "appId" expected');
                }

                _appId = appId;
                _appName = appName || '(Application Root)';

                if (appInsights.start) {
                    appInsights.start(appId);
                } else if (angular.isFunction(appInsights)) {
				    appInsights=appInsights({ instrumentationKey: appId });
				} else {
                    console.warn('Application Insights not initialized');
                }

            };

            this.$get = function() {
                return insightsWrapper;
            };

        }

        function onAppRun($rootScope, $location, insights) {
            $rootScope.$on('$locationChangeSuccess', function() {
                var pagePath;
                try {
                    pagePath = $location.path().substr(1);
                    pagePath =  insights.appName + '/' + pagePath;
                }
                finally {
                    insights.logPageView(pagePath);
                }
            });
        }

}());
