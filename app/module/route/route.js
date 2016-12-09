front.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$locationProvider.html5Mode(false);

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
		controller: "ForgotCtrl"
	})
	.when("/password/reset/:id",{
		templateUrl:"views/password/reset-password.view.html",
		controller: "ResetCtrl"
	})
	.when("/password/resetinvalid",{
		templateUrl:"views/password/reset-password-invalid.view.html"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.when("/terms-and-condition",{
		templateUrl:"views/terms/term.view.html"
	})
	.when("/privacy-policy",{
		templateUrl:"views/terms/privacy.view.html"
	})
	.otherwise({
		redirectTo:'/404'
	});
	}]);
