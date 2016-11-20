dash.controller("rideListCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		//do something

		$http.get('/api/rides').then(function(res){
			$scope.rides = res.data;
			console.log($scope.rides);
		},function(res){
			console.log(res);
		})
}]);