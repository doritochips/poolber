dash.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl:"views/dash.view.html"		
	})
	.when("/requestRide", {
		templateUrl:"views/request_ride.view.html"
	})
	.when("/postRide",{
		templateUrl:"views/post_ride.view.html"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.otherwise({
		redirectTo:'/404'
	})
})