front.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl:"views/home.view.html"
	})
	.when("/login", {
		templateUrl:"views/login.view.html"
	})
	.when("/signup",{
		templateUrl:"views/signup.view.html",
		controller: "SignupCtrl"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.otherwise({
		redirectTo:'/404'
	})
})
