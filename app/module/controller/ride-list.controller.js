dash.controller("rideListCtrl", ['$window','$scope', '$http', 'CityList','UserService', '$uibModal', 'toaster',
	function($window, $scope, $http, CityList, UserService, $uibModal, toaster){
		
		//initialize
		init = function(){
			$scope.form = {};
			$scope.user = {};
			$scope.filter = {};
			$scope.cities = CityList.commonCities;
			$scope.dateOptions = {
			    formatYear: 'yy',
			    minDate: new Date()
			};	
			$scope.popup = {
				opened:false
			}
			$scope.isCollapsed = true;
			$scope.form.passengers = 1;
			$scope.form.date= new Date();
			//pagination
			$scope.rides = [];
			$scope.currentPage = 0;
			$scope.pageSize = 10;
			$scope.options = [10,20,50];
		}();
		
		// apply for ride
		$scope.requestRide = function(ride){
			console.log(ride);
			$uibModal.open({
				animation: true,
				arialLabelledBy:'modal-title',
				arialDescribedBy:'modal-body',
				templateUrl: 'views/components/requestRideModal.html',
				controller: function($scope, $uibModalInstance, $timeout){	

					$scope.selected = {
						email: false,
						phone: false,
						wechat: false
					}

					$scope.selectAll = function(){
						$scope.selected.email = true;
						$scope.selected.phone = true;
						$scope.selected.wechat = true;
					}

					$scope.unSelectAll = function(){
						$scope.selected.email = false;
						$scope.selected.phone = false;
						$scope.selected.wechat = false;
					}

					$scope.cancel = function(){
						$uibModalInstance.dismiss('cancel');
					}
					$scope.submit = function(){
						$uibModalInstance.close($scope.selected);
					}
				},
				size: 'sm'
			}).result.then(function(selected){
				$http.post("/api/requestRide",{
					selected: selected,
					ride_id: ride._id,
					passenger_id: $scope.user._id
				}).then(function(res){
					console.log(res);
					//toast message
					if(res.data == "success"){
						console.log(toaster);
						toaster.pop('success', "Success", "Your contact has been sent to the driver!");						
					}else{
						toaster.pop('error', "Failure", "Some unexpected error occurs!");
					}
					ride.isApplied = true;
				});
			});
		}

		$scope.open = function(){
			document.getElementById("datepicker").focus();
			$scope.popup.opened  = true;		
		};


		//Form validation
		$scope.invalidInput = false;
		$scope.applyFilter = function(){
			if (!($scope.form.departure&&$scope.form.destination&&$scope.form.passengers&&$scope.form.date&&$scope.form.departure !== $scope.cities[0]&&$scope.form.destination !== $scope.cities[0])){
				$scope.invalidInput = true;
				if (!$scope.form.departure || $scope.form.departure === $scope.cities[0]){
					$scope.invalidDeparture = true;
				}
				if (!$scope.form.destination  || $scope.form.destination === $scope.cities[0]){
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
		},function(res){
			console.log(res);
		});

		$scope.getDetail = function(ride){			
			return;
		};
		var processData = function(){
			var l = $scope.rides.length;
			$scope.numberOfPages = function(){
				return Math.ceil($scope.rides.length/$scope.pageSize);
			}
			UserService.getUserInfo().then(function(res){				
				$scope.user = res.data[0];
				addRelations($scope.user._id);
			});						
		};

		var addRelations = function(userId){

			// add mine and applied
			$scope.rides.forEach(function(iterator){
				if(iterator.user == userId){
					iterator.isMine = true;
				}
				iterator.passengerList.forEach(function(it){
					if(it.userid == userId){
						iterator.isApplied = true;
						return;						
					}
				});
			});				

		}


}]);
