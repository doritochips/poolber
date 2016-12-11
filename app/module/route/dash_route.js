dash.config(function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$locationProvider.html5Mode(false);

	$routeProvider
	.when("/",{
		templateUrl:"views/rideList.view.html",
		controller: "rideListCtrl",
		css: '/styles/ride-list.css'
	})
	.when("/requestRide", {
		templateUrl:"views/request_ride.view.html",
		controller:"requestRideCtrl"
	})
	.when("/postRide",{
		templateUrl:"views/post_ride.view.html",
		controller:"postRideCtrl"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.when("/rides",{
		templateUrl:"views/ride-list.view.html",
		controller: "rideListCtrl"
	})
	.when("/profile",{
		templateUrl:"views/profile.view.html",
		controller: "profileCtrl",
		css:"/styles/profile.css"
	})
	.when("/history",{
		templateUrl:"views/history.view.html",
		controller: "historyCtrl"
	})
	.when("/requestList",{
		templateUrl:"views/requestList.view.html",
		controller: "requestListCtrl"
	})
	.otherwise({
		redirectTo:'/404'
	});
})
