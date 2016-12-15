'use strict';

dash.controller("historyCtrl", ["$scope","$location", "$http", "UserService", "$uibModal", "$window", function($scope, $location, $http, UserService, $uibModal, $window){
	
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
		for (var k = 0; k < data.postedRides.length; k++) {
			data.postedRides[k].source = "postedRides";
			$scope.mergedList.push(data.postedRides[k]);
		}
		for (var l = 0; l < data.appliedRides.length; l++) {
			data.appliedRides[l].source = "appliedRides";
			$scope.mergedList.push(data.appliedRides[l]);
		}
		$scope.mergedList = $scope.mergedList.sort(compare);
		console.log(data);
	};

	$scope.isDefined = function(v) {
		//console.log(v);
		if (typeof v === 'undefined'){
			return false;
		}else {
			return true;
		}
	};


	//Modal Control
	$scope.viewDetail = function(ride){
		$uibModal.open({
			animation: true,
			arialLabelledBy:'modal-title',
			arialDescribedBy:'modal-body',
			templateUrl: 'views/modals/history-detail.component.html',
			controller: function($scope, $uibModalInstance, $timeout){	
				$scope.ride = ride;

				$scope.goToRideList = function(newURL){
					$uibModalInstance.close(function(){	//callback after close
						$window.location.href = newURL;
					});
				};

				$scope.delete = function(){
					var result = confirm("Are you sure you want to delete this?");
					if(result){
						$uibModalInstance.close(function(){	//callback after close
							//delete callback goes here!!!!!!!!!!
						});
					}
				};

				$scope.submit = function(){
					$uibModalInstance.close();
				};

				$scope.validate = function(){
					return true;
				};
			},
			size: 'sm'
		}).result.then(function(callback){
			if (callback){
				callback();
			}

		});
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