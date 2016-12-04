front.controller("SignupCtrl", ['$window','$scope', '$http', function($window, $scope, $http){
		// user
		$scope.user = {
			email:"",
			password:"",
			phone:""
		};

		$scope.duplicateKeyError = false;
		$scope.keyErrorMsg = "";

		// submit form
		$scope.submitUserinfo = function(){
			$http.post("/api/auth/signup", $scope.user).then(function(res){
				$window.location.href = '/dash.html';
			}, function(err){
				$scope.duplicateKeyError = true;
				$scope.keyErrorMsg = err.data.errorMsg;
			});
		}

		// validation
		$scope.formValidated = false;

		$scope.user.validate = function(index){
			if(index == 1){
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
			}
			else if(index == 3){
				var phone = $scope.user.phone;
				if (phone.length > 0 && phone.length < 10){
					$scope.errorMsg2 = "Password should not be empty";
					$scope.formValidated = true;
					return true;
				}
				$scope.formValidated = false;
				$scope.errorMsg1 = "";
				return false;
			}
			else{
				return true;
			}
		} 
}]);