'use strict';

dash.controller("historyCtrl", ["$scope","$location", "$http", "UserService", "$uibModal", "$window","$rootScope", function($scope, $location, $http, UserService, $uibModal, $window, $rootScope){
	
	$scope.postedRequest = [];
	$scope.appliedRequest = [];
	$scope.postedRides = [];
	$scope.appliedRides = [];
	$scope.mergedList = [];
	var optionsForDrivers = ['postedRides', 'appliedRequest'];
	var optionsForPosting = ['postedRides', 'postedRequest'];
	$scope.viewAsDriver = 'passenger';

	$scope.passengerViewEmpty = false;
	$scope.driverViewEmpty = false;

	$scope.showElement = function(type){
		if ($scope.viewAsDriver === 'driver'){
			return optionsForDrivers.indexOf(type) > -1;
		}else{
			return optionsForDrivers.indexOf(type) <= -1;
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
		$scope.checkEmptyView();

	};

	$scope.checkEmptyView = function(){
		if ($scope.postedRequest.length + $scope.appliedRides.length === 0){
			$scope.passengerViewEmpty = true;
		}
		if ($scope.postedRides.length + $scope.appliedRequest.length === 0){
			$scope.driverViewEmpty = true;
		}
	};

	$scope.isDefined = function(v) {
		//console.log(v);
		if (typeof v === 'undefined'){
			return false;
		}else {
			return true;
		}
	};

	var getPostsURL = function(ride){
		var roleUrl = '';
		if (optionsForDrivers.indexOf(ride.source) >= 0){
			roleUrl = '/api/delete_ride_post/';
		}
		else {
			roleUrl = '/api/delete_request_post/';
		}
		return roleUrl;
	};



	var deletePost = function(ride){
		var data = {
			session: UserService.session
		};
		$http.post(getPostsURL(ride) + ride._id, data).then(function(data){
			var allLists = [$scope.mergedList, $scope.postedRequest, $scope.postedRides, $scope.appliedRequest, $scope.postedRides];
			for (var x in allLists){
				var rideIndex = allLists[x].indexOf(ride);
				if (rideIndex >=0){
					allLists[x].splice(rideIndex, 1);
				}
			}	
			$scope.checkEmptyView();	
		}, function(err){
			console.log(err);
		});
	};

	// var getRemoveListURL = function(ride){
	// 	var roleUrl = '';
	// 	if (optionsForDrivers.indexOf(ride.source) >= 0){
	// 		roleUrl = '/api/remove_from_driver_list/';
	// 	}
	// 	else {
	// 		roleUrl = '/api/remove_from_passenger_list/';
	// 	}
	// 	return roleUrl;
	// };


	// var removeFromList = function(ride){
	// 	var data = {
	// 		session: UserService.session
	// 	};
	// 	$http.post(getRemoveListURL(ride) + ride._id, data).then(function(data){
	// 		var rideIndex = $scope.mergedList.indexOf(ride);
	// 		if (rideIndex >=0){
	// 			$scope.mergedList.splice(rideIndex, 1);
	// 		}
	// 	}, function(err){
	// 		console.log(err);
	// 	});
	// };

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
					var result = confirm("Are you sure you want to delete?");
					if(result){
						$uibModalInstance.close(function(){	//callback after close
							if(optionsForPosting.indexOf(ride.source) >= 0){
								deletePost(ride);
							}
							// else {
							//  REMOVE FROM LIST, DISABLED
							// 	removeFromList(ride);
							// }
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
		$rootScope.$broadcast("loading", "start");
		//if userinfo is cached
		if (UserService.userInfo === {}) {
			UserService.getRideHistory().then(function(res){
				$rootScope.$broadcast("loading", "end");
				importData(res.data);
			});
		}
		//get user info then get history
		else {
			UserService.getRideHistory().then(function(res){
				$rootScope.$broadcast("loading", "end");
				importData(res.data);
			});
		}
	}();
}]);