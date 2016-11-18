front.controller("SigninCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		// user
		$scope.user = {
			username:"",
			password:""
		};

		$scope.duplicateKey = false;
		$scope.keyErrorMsg = "";
		// submit form
		$scope.submitUserinfo = function(){
			$http.post("/api/auth/signin", $scope.user).then(function(res){
				$window.location.href = '/';
			}, function(err){
				$scope.duplicateKey = true;
				console.log(err.data);
				$scope.keyErrorMsg = err.data.errorMsg;
			});
		};


}]);