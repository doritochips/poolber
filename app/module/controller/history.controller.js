"use strict";

dash.controller("historyCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){
	
	$scope.postedRequest = [];
	$scope.appliedRequest = [];
	$scope.postedRides = [];
	$scope.appliedRides = [];

	$scope.mergedList = [];
	var driverList = ['postedRides', 'appliedRequest'];
	var postedList = ['postedRides', 'postedRequest'];
	$scope.viewAsDriver = 'passenger';
	$scope.showElement = function(type){
		if ($scope.viewAsDriver === 'driver'){
			return driverList.indexOf(type) > -1;
		}else{
			return driverList.indexOf(type) <= -1;
		}
	};

	$scope.GenerateNote = function(type){
		if (type === "postedRequest") {
			return "you posted this request";
		}else if (type === "appliedRequest"){
			return "you responsed to this request";
		}else if (type === "postedRides"){
			return "you posted this ride";
		}else if (type === "appliedRides"){
			return "you applied to this ride";
		}
	};
	//on left or right
	$scope.defineMainClass = function(type){
		if (type === "appliedRequest" || type === "appliedRides"){
			return "alt";
		}
		else {
			return "";
		}
	};

	//define icon
	$scope.defineIconClass = function(type){
		if (type === 'postedRides'){
			return "fa fa-car";
		}
		else if (type === 'appliedRides'){
			return "fa fa-user";
		}
		else if (type === 'postedRequest'){
			return "fa fa-map-signs";
		}
		else if (type === 'appliedRequest'){
			return "fa fa-comment";
		}
	};

	//define color
	$scope.defineIconColorClass = function(type){
		if (type === 'postedRides'){
			return "btn-info";
		}
		else if (type === 'appliedRides'){
			return "btn-dark";
		}
		else if (type === 'postedRequest'){
			return "btn-danger";
		}
		else if (type === 'appliedRequest'){
			return "btn-warning";
		}
	};

	var compare = function(a,b) {
		return new Date(b.endTime) - new Date(a.endTime);
	};

	var importData = function(data){
		$scope.postedRequest = data.postedRequest;
		$scope.appliedRequest = data.appliedRequest;
		$scope.postedRides = data.postedRides;
		$scope.appliedRides = data.appliedRides;

		for (var i = 0; i < data.postedRequest.length; i++) {
			data.postedRequest[i].source = "postedRequest";
			$scope.mergedList.push(data.postedRequest[i]);
		}
		for (var j = 0; j < data.appliedRequest.length; j++) {
			data.appliedRequest[j].source = "appliedRequest";
			$scope.mergedList.push(data.appliedRequest[j]);
		}		
		for (var m = 0; m < data.postedRides.length; m++) {
			data.postedRides[m].source = "postedRides";
			$scope.mergedList.push(data.postedRides[m]);
		}
		for (var n = 0; n < data.appliedRides.length; n++) {
			data.appliedRides[n].source = "appliedRides";
			$scope.mergedList.push(data.appliedRides[n]);
		}
		$scope.mergedList = $scope.mergedList.sort(compare);
		console.log($scope.mergedList);
	};

	var init = function(){
		//if userinfo is cached
		if (UserService.userInfo === {}) {
			UserService.getRideHistory().then(function(res){
				importData(res.data);
			});
		}
		//get user info then get history
		else {
			UserService.saveUserInfo().then(function(firstRes){
				UserService.getRideHistory().then(function(res){
					importData(res.data);
				});
			});
		}
	}();
}]);