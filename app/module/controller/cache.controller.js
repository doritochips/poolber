'use strict';

dash.controller("Cache", ['UserService','$scope','$window', function(UserService, $scope, $window){
	$scope.cacheFinished = false;

	UserService.getUserInfoForDirectives().then(function(res){				
		if(res.data === "failure"){
			$window.location.href = '/#/login';	
			return;
		}	
		UserService.saveUserInfo(res.data[0]);
		$scope.cacheFinished = true;
	}, function(err){
		$window.location.href = '/#/login';
	});
}]);