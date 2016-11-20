dash.controller("postRideCtrl", ["$http", "$scope", function($http, $scope){
	$scope.form = {		
	};	
	$scope.cities = ["London", "Waterloo", "Kitchener", "Toronto"];
	
	$scope.popup = {
		opened:false
	}
	$scope.open = function(){
		document.getElementById("datepicker").focus();
		$scope.popup.opened  = true;		
	}
	
}])