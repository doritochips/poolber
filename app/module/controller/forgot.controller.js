"use strict";

front.controller("ForgotCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		// user
		$scope.user = {
			email:"",
		};

		// submit form
		$scope.submit = function(){
			$scope.user.email = $scope.email;
			$http.post("/api/auth/forgot", $scope.user).then(function(res){				
				$scope.message = res.data.message;
			}, function(err){
				$scope.message = err.data.message;
				console.log(err);
			});
		};


}]);