dash.controller("postRideCtrl", ["$http", "$scope", function($http, $scope){
	// init form
	$scope.form = {				
	};

	$scope.cities = ["Select a city", "London", "Waterloo", "Kitchener", "Toronto"];
	
	$scope.popup = {
		opened:false
	};
	$scope.open = function(){
		$scope.popup.opened  = true;		
	};
	
}])