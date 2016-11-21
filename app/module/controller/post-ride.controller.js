dash.controller("postRideCtrl", ["$http", "$scope", function($http, $scope){
	// hardcode data
	$scope.cities = ["Select a city", "London", "Waterloo", "Kitchener", "Toronto"];
	$scope.passengers = [1,2,3,4];	
	// init
	$scope.form = {				
		startTime: new Date(),
		endTime: new Date()
	};	
	$scope.popup = {
		opened:false
	};

	$scope.open = function(){
		$scope.popup.opened  = true;		
	};
	
}])