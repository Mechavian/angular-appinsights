
/*global angular: true */
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
                    'appName': _appName,
                    'trackEvent': appInsights.trackEvent || angular.noop,
                    'trackPageView': appInsights.trackPageView || angular.noop,
                    // below retained for back-compat
                    'logEvent': appInsights.logEvent || appInsights.trackEvent || angular.noop,
                    'logPageView': appInsights.logPageView || appInsights.trackPageView || angular.noop
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
                    pagePath = $location.path();
                    pagePath =  insights.appName + '/' + pagePath;
                }
                finally {
                    insights.trackPageView(pagePath);
                }
            });
        }

}());
