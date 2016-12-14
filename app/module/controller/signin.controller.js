"use strict";

front.controller("SigninCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		// user
		$scope.user = {
			email:"",
			password:""
		};

		$scope.duplicateKey = false;
		$scope.errorMsg = "";
		// submit form
		$scope.submitUserinfo = function(){
			$scope.user.email = $scope.user.email.toLowerCase();
			$http.post("/api/auth/signin", $scope.user).then(function(res){				
				$window.location.href = '/dash.html?' + res.data;
			}, function(err){
				$scope.duplicateKey = true;
				console.log(err.data);
				$scope.errorMsg = err.data.message;
			});
		};

		$scope.facebookLogin = function(){
			$scope.redirectTo = '/';
			$http.post("api/auth/facebook",$scope.redirectTo).then(function(res){
				//success
			}, function(err){
				//error
			});
		}


}]);