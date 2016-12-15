"use strict";

dash.controller("profileCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){

	// init
	$scope.editing = false;
	$scope.showCar = $window.innerWidth < 990? false:true;
	$scope.newFeature = false;
	var backup = {};

	UserService.getUserInfo().then(function(res){				
		if(res === "failure"){
			$window.location.href = '/#/login';	
			return;
		}
		console.log(res.data[0]);
		$scope.user = res.data[0];				
		backup.displayName = res.data[0].displayName;		
		backup.email = res.data[0].email;
		backup.phone = res.data[0].phone;
		backup.wechat = res.data[0].wechat;
	
	}, function(err){
		$window.location.href = '/#/login';
	});


	// car manipulate according to window size
	angular.element($window).on('resize', function(){			
		if($window.innerWidth < 990){
			
			$scope.$apply(function(){
				$scope.disableCar();
			});
			$scope.$digest();
		}
	});	
	$scope.getNewFeature = function(){
		$scope.newFeature = true;
	};


	$scope.disableCar = function(){
		$scope.showCar = false;
	};

	$scope.editInfo = function(){
		$scope.editing = true;
	};

	$scope.saveInfo = function(){
		$http.post("/api/data/saveProfile",
			{
				displayName: $scope.user.displayName,
				email: $scope.user.email,
				phone: $scope.user.phone,
				wechat: $scope.user.wechat,
				session: UserService.getSession()
			}).then(function(res){
				if(res){				
					toaster.pop('success', "Success", "Your profile has been updated!");			
				}else{
					toaster.pop('error', "Failure", "Some unexpected error occurs!");
				}
			});
		$scope.editing = false;
	};
	$scope.cancelEdit = function(){
		$scope.user.displayName = backup.displayName;		
		$scope.user.email = backup.email;
		$scope.user.phone = backup.phone;
		$scope.user.wechat = backup.wechat;
		$scope.editing = false;
	};
}]);