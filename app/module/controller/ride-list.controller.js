dash.controller("rideListCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		$scope.rides = [];
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		
		$http.get('/api/rides').then(function(res){
			$scope.rides = res.data;
			processData();
			console.log($scope.rides);
		},function(res){
			console.log(res);
		})
		var processData = function(){
			var l = $scope.rides.length;
			$scope.numberOfPages = function(){
				return Math.ceil($scope.rides.length/$scope.pageSize);
			}
		}
}]);