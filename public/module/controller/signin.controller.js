front.controller("SigninCtrl", ['$scope', '$http', function($scope, $http){
		// user
		$scope.user = {
			username:"",
			password:""
		};

		// submit form
		$scope.submitUserinfo = function(){
			$http.post("/api/auth/signup", $scope.user).then(function(res){
				console.log(res);
			}, function(err){
				console.log(err);
			});
		}

		// validation
		$scope.formValidated = false;

		$scope.user.validate = function(index){
			if(index == 0){
				var username = $scope.user.username;
				if(username == ""){
					$scope.errorMsg = "Username should not be empty";
					$scope.formValidated = true;
					return true;
				}else if(username.length < 5){
					$scope.errorMsg = "Username should be at least 5 characters";
					$scope.formValidated = true;
					return true;
				}else if(username.length > 12){
					$scope.formValidated = true;
					$scope.errorMsg = "Username should not be more than 12 characters";
					return true;
				}else if(username.indexOf(" ") > 0){
					$scope.formValidated = true;
					$scope.errorMsg = "Username should not contain any space";
					return true;
				}
				$scope.formValidated = false;
				$scope.errorMsg = "";				
				return false;
			}else if(index == 1){
				var password = $scope.user.password;
				if(password == "" || !password){
					$scope.errorMsg2 = "Password should not be empty";
					$scope.formValidated = true;
					return true;
				}else if(password.length < 6){
					$scope.errorMsg2 = "Password should be at least 6 characters";
					$scope.formValidated = true;
					return true;
				}else if(password.length > 16){
					$scope.formValidated = true;
					$scope.errorMsg2 = "Password should not be more than 16 characters";
					return true;
				}else if(password.indexOf(" ") > 0){
					$scope.formValidated = true;
					$scope.errorMsg2 = "password should not contain any space";
					return true;
				}
				$scope.formValidated = false;
				$scope.errorMsg2 = "";
				return false;
			}else{
				return true;
			}
		} 

}]);