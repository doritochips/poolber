front.controller("forgotCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		// user
		$scope.user = {
			username:"",
			password:""
		};

		$scope.duplicateKey = false;
		$scope.errorMsg = "";
		// submit form
		$scope.submitUserinfo = function(){
			$http.post("/api/auth/signin", $scope.user).then(function(res){				
				$window.location.href = '/dash.html?' + res.data;
			}, function(err){
				$scope.duplicateKey = true;
				console.log(err.data);
				$scope.errorMsg = err.data.message;
			});
		};


}]);