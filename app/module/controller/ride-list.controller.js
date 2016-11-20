front.controller("rideListCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		//do something
		$http.get('/api/rides').then(function(res){
			console.log(res);
		},function(res){
			console.log(res);
		})
}]);