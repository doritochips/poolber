"use strict";

dash.controller("requestRideCtrl", ["$http", "$scope", 'toaster', 'CityList','UserService',function($http, $scope, toaster, CityList, UserService){
	var roundTime = function(time){
		var mins = time.getMinutes();
		var quarterHours = Math.round(mins/15);
		if (quarterHours === 4)
		{
		    time.setHours(time.getHours()+1);
		}
		var rounded = (quarterHours*15)%60;
		time.setMinutes(rounded);
		return time;
	};

	// hardcode data	
	$scope.cities = CityList.commonCities;
	$scope.passengers = [1,2,3,4];	
	
	// init
	$scope.errorMsg = "";
	$scope.noError = true;
	$scope.form = {				
		startTime: roundTime(new Date()),
		endTime: roundTime(new Date())
	};
	$scope.popup = {
		opened:false
	};
	$scope.dateOptions = {
	    formatYear: 'yy',
	    minDate: new Date()
	};	
	// get user id
	
	$scope.form.user_id = UserService.getUserId();
	if($scope.form.user_id === ""){
		UserService.getUserInfo().then(function(res){
			$scope.form.user_id = res.data[0]._id;
		});
	}

	$scope.open = function(){
		$scope.popup.opened  = true;		
	};
	
	$scope.submit = function(){
		if(!validation()){
			return;
		}

		// manipulate date
		var user_id = $scope.form.user_id;
		var year = $scope.form.date.getFullYear();
		var month = $scope.form.date.getMonth();
		var day = $scope.form.date.getDate();

		var startingH = $scope.form.startTime.getHours();
		var startingM = $scope.form.startTime.getMinutes();
		var endingH = $scope.form.endTime.getHours();
		var endingM = $scope.form.endTime.getMinutes();
		$scope.form.startTime = new Date(year, month, day, startingH, startingM);
		$scope.form.endTime = new Date(year, month, day, endingH, endingM);

		$http.post('/api/request', $scope.form).then(function(res){
			if(res){				
				toaster.pop('success', "Success", "Your request has been posted!");
				$scope.form = {
					user_id: user_id
				};				
			}else{
				toaster.pop('error', "Failure", "Some unexpected error occurs!");
			}
		}, function(err){
			console.log(err);
		});

	};




	function validation(){
		if($scope.form.departure === "Select a city"){
			$scope.errorMsg = "Please select a departure location.";
			$scope.noError = false;
			return false;
		}
		if($scope.form.destination === "Select a city"){
			$scope.errorMsg = "Please select a destination.";
			$scope.noError = false;
			return false;
		}
		if(!$scope.form.date){
			$scope.errorMsg = "Please select a date.";
			$scope.noError = false;
			return false;
		}else{
			var yesterday = new Date(new Date().getTime()  - 24 * 60 * 60 * 1000);
			if($scope.form.date < yesterday){
				$scope.errorMsg = "Please select a valid date.";
				$scope.noError = false;
				return false;	
			}			
		}
		
		if(!$scope.form.startTime){
			$scope.errorMsg = "Please select a valid time.";
			$scope.noError = false;
			return false;
		}
		if(!$scope.form.endTime){
			$scope.errorMsg = "Please select a valid time.";
			$scope.noError = false;
			return false;
		}

		if($scope.form.endTime < $scope.form.startTime){
			$scope.errorMsg = "Time period is invalid.";
			$scope.noError = false;
			return false;
		}
		$scope.noError = true;
		return true;
	}
		
}]);
