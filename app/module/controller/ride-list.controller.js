front.controller("rideListCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		//do something
		$http.get('/api/ride').then(function(req,res){
			console.log(res);
		},function(req,res){
			console.log(res);
		})
}]);