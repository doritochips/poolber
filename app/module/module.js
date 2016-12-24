"use strict";

var dash = angular.module('dash', ['ngRoute','ngAnimate', 'ui.bootstrap','toaster','routeStyles']);
var front = angular.module('front', ['ngRoute','routeStyles']);

dash.run(['$rootScope', function($rootScope){
	$rootScope.$on('$routeChangeStart', function(e, curr, prev) {
    	if (curr.$$route && curr.$$route.resolve) {
      	// Show a loading message until promises aren't resolved
      	// $rootScope.$broadcast("loading","start");
    	}
	});
	$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
  	// loading end
    // $rootScope.$broadcast("loading", "end");
  	
	});
}]);