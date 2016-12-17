"use strict";

dash.directive("poolSidebar", ['$location', '$routeParams', '$rootScope', '$window', function($location, $routeParams, $rootScope, $window){
    var controller = ['$scope', function($scope){
		
		$scope.driverMode = true;
		$scope.switchMode = function(){
			$scope.driverMode = !$scope.driverMode;
		};

		//when lick, clear all class and reassign the one clicked
		$scope.activate = function(s){
			for (var i in $scope.classList){
				$scope.classList[i] = "";
			}
			$scope.classList[s] = $scope.activeClass;
			$rootScope.$broadcast("navClicking", ($window.innerWidth < 768));
		};

		var init = function(){
			$scope.activeClass = "open active";
			$scope.nonActiveClass = "";
			//assign default
			$scope.classList = ["","","",""];
			//list ride, assign the index as active class
			var routeList = ["/history","/requestRide","/postRide","/rideList","/requestList"];
			$scope.classList[routeList.indexOf($location.path())] = $scope.activeClass;
			//console.log($scope.classList);
		}();
    }];
    return{
        templateUrl:'views/layout/sidebar.view.html',
        restrict:'A',
        controller: controller        
    };
}]);