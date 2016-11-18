front.controller("SigninCtrl", ['$scope', '$http', function($scope, $http){
		// user
		$scope.user = {
			username:"",
			password:""
		};

		// submit form
		$scope.submitUserinfo = function(){
			console.log($scope.user);
			$http.post("/api/auth/signin", $scope.user).then(function(res){
				console.log("logged in");
				console.log(res);
			}, function(err){
				console.log("something went wrong");
				console.log(err);
			});
		};


}]);