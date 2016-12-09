dash.controller("historyCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){
	
	$scope.postedRequest = [];
	$scope.appliedRequest = [];
	$scope.postedRides = [];
	$scope.appliedRides = [];

	$scope.mergedList = [];
	var driverList = ['postedRides', 'appliedRequest'];

	$scope.showElement = function(type){
		if ($scope.viewAsDriver){
			return driverList.indexOf(type) > -1;
		}else{
			return driverList.indexOf(type) <= -1;
		}
	}

	$scope.GenerateNote = function(type){
		if (type === "postedRequest") {
			return "you posted this request"
		}else if (type === "appliedRequest"){
			return "you responsed to this request"
		}else if (type === "postedRides"){
			return "you posted this ride"
		}else if (type === "appliedRides"){
			return "you applied to this ride"
		}
	}
	//on left or right
	$scope.defineMainClass = function(type){
		if (type === "appliedRequest" || type === "appliedRides"){
			return "alt";
		}
		else {
			return "";
		}
	}

	//define icon
	$scope.defineIconClass = function(type){
		if (driverList.indexOf(type) > -1){
			return "fa fa-car";
		}
		else {
			return "fa fa-user";
		}
	}

	//define color
	$scope.defineIconColorClass = function(type){
		if (driverList.indexOf(type) > -1){
			return "btn-danger";
		}
		else {
			return "btn-dark";
		}
	}

	var compare = function(a,b) {
		return new Date(b.endTime) - new Date(a.endTime);
	}

	var importData = function(data){
		$scope.postedRequest = data.postedRequest;
		$scope.appliedRequest = data.appliedRequest;
		$scope.postedRides = data.postedRides;
		$scope.appliedRides = data.appliedRides;

		for (var i = 0; i < data.postedRequest.length; i++) {
			data.postedRequest[i].source = "postedRequest";
			$scope.mergedList.push(data.postedRequest[i]);
		}
		for (var i = 0; i < data.appliedRequest.length; i++) {
			data.appliedRequest[i].source = "appliedRequest";
			$scope.mergedList.push(data.appliedRequest[i]);
		}		
		for (var i = 0; i < data.postedRides.length; i++) {
			data.postedRides[i].source = "postedRides";
			$scope.mergedList.push(data.postedRides[i]);
		}
		for (var i = 0; i < data.appliedRides.length; i++) {
			data.appliedRides[i].source = "appliedRides";
			$scope.mergedList.push(data.appliedRides[i]);
		}
		$scope.mergedList = $scope.mergedList.sort(compare);
		console.log($scope.mergedList);
	}

	var init = function(){
		//if userinfo is cached
		if (UserService.userInfo === {}) {
			UserService.getRideHistory().then(function(res){
				importData(res.data);
			})
		}
		//get user info then get history
		else {
			UserService.saveUserInfo().then(function(firstRes){
				UserService.getRideHistory().then(function(res){
					importData(res.data);
				})
			});
		}
	}();
}]);