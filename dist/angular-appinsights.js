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

                console.log('start');
                if (!appId) {
                    throw new Error('Argument "appId" expected');
                }

                _appName = appName || '(Application Root)';

                if (window.appInsights.start) {
                    window.appInsights.start(appId);
                } else if (angular.isFunction(window.appInsights)) {
				    window.appInsights=window.appInsights({ instrumentationKey: appId });
				} else if (window.appInsights.config) {
                    window.appInsights.config.instrumentationKey = appId;
                } else {
                    console.warn('Application Insights not initialized');
                }
            };

            this.$get = function() {
                console.log('Creating Insights object');
                return  window.appInsights || {};
            };

        }

        function onAppRun($rootScope, $location, insights) {

            $rootScope.$on('$locationChangeSuccess', function() {
                console.log('$locationChangeSuccess');
                var pagePath,
                    trackPageView = insights.trackPageView || function() {console.warn('noop');};
                try {
                    pagePath = $location.path().substr(1);
                    pagePath =  _appName + '/' + pagePath;
                }
                finally {
                    trackPageView(pagePath);
                }
            });
        }

}());
