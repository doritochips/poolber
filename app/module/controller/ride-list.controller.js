dash.controller("rideListCtrl", ['$window','$scope', '$http', 'CityList',
	function($window, $scope, $http, CityList){
		
		//initialize
		init = function(){
			$scope.filter = {};
			$scope.cities = CityList.commonCities;
			$scope.dateOptions = {
			    formatYear: 'yy',
			    minDate: new Date()
			};	
			$scope.popup = {
				opened:false
			}
			$scope.form = {};	
			$scope.form.passengers = 1;
			$scope.form.date= new Date();

			//pagination
			$scope.rides = [];
			$scope.currentPage = 0;
			$scope.pageSize = 10;
			$scope.options = [10,20,50];
		}();
		
		
		$scope.open = function(){
			document.getElementById("datepicker").focus();
			$scope.popup.opened  = true;		
		};


		//Form validation
		$scope.invalidInput = false;
		$scope.applyFilter = function(){
			if (!($scope.form.departure&&$scope.form.destination&&$scope.form.passengers&&$scope.form.date)){
				$scope.invalidInput = true;
				if (!$scope.form.departure){
					$scope.invalidDeparture = true;
				}
				if (!$scope.form.destination){
					$scope.invalidDestination = true;
				}
				if (!$scope.form.passengers){
					$scope.invalidPassenger = true;
				}
				if (!$scope.form.date){
					$scope.invalidDate = true;
				}		
			}
			else{
				$scope.invalidInput = false;
				$scope.invalidDeparture = false;
				$scope.invalidDestination = false;
				$scope.invalidPassenger = false;
				$scope.invalidDate = false;


				$scope.filter.departure = $scope.form.departure.trim();	//remove line break and shit
				$scope.filter.destination = $scope.form.destination.trim();
				$scope.filter.passengers = $scope.form.passengers;
				$scope.filter.date = $scope.form.date;
					
			}
		}

		//List rides

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


}]);