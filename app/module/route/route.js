front.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl:"views/home.view.html",
		css:"styles/landing.css"
	})
	.when("/login", {
		templateUrl:"views/login.view.html",
		controller: "SigninCtrl",
		css:"styles/login.css"
	})
	.when("/signup",{
		templateUrl:"views/signup.view.html",
		controller: "SignupCtrl",
		css:"styles/signup.css"
	})
	.when("/forgot-password",{
		templateUrl:"views/password/forgot-password.view.html",
		controller: "forgotCtrl"
	})
	.when("/password/reset/:id",{
		templateUrl:"views/password/reset-password.view.html",
		controller: "resetCtrl"
	})
	.when("/password/resetinvalid",{
		templateUrl:"views/password/reset-password-invalid.view.html"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.otherwise({
		redirectTo:'/404'
	})
})
