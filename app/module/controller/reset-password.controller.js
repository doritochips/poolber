"use strict";

front.controller("ResetCtrl", ['$window','$scope', '$http','$timeout', '$routeParams','$location',
	function($window, $scope, $http, $timeout, $routeParams,$location){
		// user

		$scope.token = $routeParams.id;

		// submit form
		$scope.submit = function(){
			if ($scope.password !== $scope.passwordRepeat) {
				$scope.message = "Passwords don't match";
			}
			else{
				$scope.send = {
					"newPassword" : $scope.password,
					"verifyPassword": $scope.passwordRepeat
				};
				$http.post("/api/auth/reset/" + $scope.token, $scope.send).then(function(res){				
					$scope.message = "Your password has been reset, you'll be redirected in 3 seconds...";
					$timeout(function() {
						$location.path('/login');
					}, 3000);
				}, function(err){
					$scope.message = err.data.message;
					//console.log(err);
				});			
			}

		};

}]);