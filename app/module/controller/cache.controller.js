'use strict';

dash.controller("Cache", ['UserService','$scope','$window', function(UserService, $scope, $window){
	$scope.cacheFinished = false;
	$scope.hideLoading = true;
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

	$scope.$on("loading", function(e, data){
		if(data === "start"){
			$scope.hideLoading = false;
		}else{
			$scope.hideLoading = true;
		}

	});
}]);