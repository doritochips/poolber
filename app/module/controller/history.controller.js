dash.controller("historyCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){
	
	$scope.listAsDriver = [];
	$scope.listAsPassenger = [];
	$scope.mergedList = [];
	
	$scope.defineClass = function(type){
		if (type == "driver"){
			return "alt";
		}
		else {
			return "";
		}
	}

	var compare = function(a,b) {
		return new Date(b.endTime) - new Date(a.endTime);
	}

	var importData = function(data){
		$scope.listAsDriver = data.listAsDriver;
		$scope.listAsPassenger = data.listAsPassenger;
		for (var i = 0; i < data.listAsDriver.length; i++) {
			data.listAsDriver[i].role = "driver";
			$scope.mergedList.push(data.listAsDriver[i]);
		}
		for (var i = 0; i < data.listAsPassenger.length; i++) {
			data.listAsPassenger[i].role = "passenger";
			$scope.mergedList.push(data.listAsPassenger[i]);
		}
		$scope.mergedList = $scope.mergedList.sort(compare);
		console.log($scope.mergedList);
	}

	var init = function(){
		if (UserService.userInfo === {}) {
			UserService.getRideHistory().then(function(res){
				importData(res.data);
			})
		}
		else {
			UserService.saveUserInfo().then(function(firstRes){
				UserService.getRideHistory().then(function(res){
					importData(res.data);
				})
			});
		}
	}();
}]);