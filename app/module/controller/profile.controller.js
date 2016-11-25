dash.controller("profileCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){

	// init
	$scope.editing = false;
	$scope.showCar = $window.innerWidth < 990? false:true;

	// get user info
	var url = $location.absUrl();
	var session = url.substring(url.indexOf('?')+1, url.indexOf('#'));
	UserService.getUserInfo(session).then(function(res){				
		if(!res.data[0]){
			$window.location.href = '/#/login';	
			return;
		}
		$scope.user = res.data[0];				
				
	
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
	})	

	$scope.disableCar = function(){
		$scope.showCar = false;
	}

	$scope.editInfo = function(){
		$scope.editing = true;
	}

	$scope.saveInfo = function(){
		$scope.editing = false;
	}
}]);