dash.controller("rideListCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		$scope.form = {		
		};	
		$scope.cities = ["London", "Waterloo", "Kitchener", "Toronto"];
		
		$scope.popup = {
			opened:false
		}
		$scope.open = function(){
			document.getElementById("datepicker").focus();
			$scope.popup.opened  = true;		
		};

		//List controller
		$scope.rides = [];
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		$scope.options = [10,20,50];

		$http.get('/api/rides').then(function(res){
			$scope.rides = res.data;
			processData();
			console.log($scope.rides);
		},function(res){
			console.log(res);
		});

		$scope.getDetail = function(ride){
			console.log(ride._id);
			$http.get('/api/ride/' + ride._id).then(function(res){
				console.log(res);
			},function(res){
				console.log(res);
			});
		};
		var processData = function(){
			var l = $scope.rides.length;
			$scope.numberOfPages = function(){
				return Math.ceil($scope.rides.length/$scope.pageSize);
			}
		};

		//initialize
		init = function(){

		}();
}]);