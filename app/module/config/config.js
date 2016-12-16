'use strict';

dash.factory('httpRequestInterceptor', ['$location', function ($location) {
	return {
		request: function (config) {
			var session = $location.absUrl().split('?')[1].split('#')[0];
			config.headers['session'] = session;
			return config;
		}
	};
}]);

dash.config(function ($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
});