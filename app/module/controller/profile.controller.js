"use strict";

dash.controller("profileCtrl", ["$scope","$location", "$http", "user", "toaster", "$window", function($scope, $location, $http, user, toaster, $window){

	// init
	$scope.editing = false;
	$scope.showCar = $window.innerWidth < 990? false:true;
	$scope.newFeature = false;
	var backup = {};

	$scope.user = user.data[0];				
	backup.displayName = user.data[0].displayName;		
	backup.email = user.data[0].email;
	backup.phone = user.data[0].phone;
	backup.wechat = user.data[0].wechat;


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
				id: $scope.user._id 
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