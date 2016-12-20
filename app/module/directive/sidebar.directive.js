"use strict";

dash.directive("poolSidebar", ['$location', '$routeParams', '$rootScope', '$window', function($location, $routeParams, $rootScope, $window){
    var controller = ['$scope', function($scope){
    	
		$scope.dict = {
			"history": 0,
			"requestRide": 1,
			"postRide": 2,
			"rideList": 3,
			"requestList": 4
		};

		$scope.reverseDict = {
			0: "history",
			1: "requestRide",
			2: "postRide",
			3: "rideList",
			4: "requestList"			
		};

    	$scope.getLocationNum = function(){
			var newLocation = $location.path();
			newLocation = newLocation.slice(1, newLocation.length);
			return $scope.dict[newLocation];
    	};


		$rootScope.$on('$routeChangeSuccess', 
		function(e, current, pre) {
			var t = $scope.getLocationNum();
			$scope.activateTab(t);
    	});

		$scope.setDriverMode = function(){
			var l =  $scope.getLocationNum();
			if ([1,2].indexOf(l) > -1){
				$scope.driverMode = true;
			}
			else{
				$scope.driverMode = false;
			}			
		};
		
		$scope.switchMode = function(){
			var t = $scope.getLocationNum();
			if (t === 1){
				t = 2;
			}
			else if (t === 2){
				t = 1;
			}
			else if (t === 3){
				t = 4;
			}
			else if (t === 4){
				t = 3;
			}
			if (t){
				$window.location.href = '#/'+ $scope.reverseDict[t];
			}
			$scope.driverMode = !$scope.driverMode;
		};

		//when lick, clear all class and reassign the one clicked
		$scope.activateTab = function(s){
			for (var i in $scope.classList){
				$scope.classList[i] = "";
			}
			if (typeof s !== "undefined"){
				$scope.classList[s] = $scope.activeClass;
			}
			$rootScope.$broadcast("navClicking", ($window.innerWidth < 768));
		};


		var init = function(){
			$scope.setDriverMode();
			$scope.activeClass = "open active";
			$scope.nonActiveClass = "";
			//assign default
			$scope.classList = ["","","",""];
			var t = $scope.getLocationNum();
			$scope.activateTab(t);
		}();
    }];
    return{
        templateUrl:'views/layout/sidebar.view.html',
        restrict:'A',
        controller: controller        
    };
}]);