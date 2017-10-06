'use strict';
front.controller("HomeCtrl", ["$scope", "$http", function($scope, $http){
	$scope.showRides = false;	
	$scope.seeRides = function(){
		$http.get('/api/rides').then(function(res){
			$scope.rides = res.data;
			console.log($scope.rides);
			$scope.showRides = true;
		},function(res){
			console.log(res);
		});	
	};	
	
}]);