"use strict";

dash.config(function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$locationProvider.html5Mode(false);

	$routeProvider
	.when("/rideList",{
		templateUrl:"views/ride_list.view.html",
		controller: "rideListCtrl",
		css: '/styles/ride-list.css',
		resolve:{
			user: function(UserService){				
				return UserService.getUserInfo();
			}
		}
	})
	.when("/requestList",{
		templateUrl:"views/request_list.view.html",
		controller: "requestListCtrl",
		css: '/styles/ride-list.css',
		resolve:{
			user: function(UserService){				
				return UserService.getUserInfo();
			}
		}
	})
	.when("/requestRide", {
		templateUrl:"views/request_ride.view.html",
		controller:"requestRideCtrl",
		resolve:{
			user: function(UserService){				
				return UserService.getUserInfo();
			}
		}
	})
	.when("/postRide",{
		templateUrl:"views/post_ride.view.html",
		controller:"postRideCtrl",
		resolve:{
			user: function(UserService){				
				return UserService.getUserInfo();
			}
		}
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"		
	})	
	.when("/profile",{
		templateUrl:"views/profile.view.html",
		controller: "profileCtrl",
		css:"/styles/profile.css",
		resolve:{
			user: function(UserService){
				return UserService.getUserInfo();
			}
		}
	})
	.when("/history",{
		templateUrl:"views/history.view.html",
		controller: "historyCtrl",
		resolve:{
			user: function(UserService){
				return UserService.getUserInfo();
			}
		}
	})	
	.otherwise({
		redirectTo:'/404'
	});
});
