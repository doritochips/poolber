front.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl:"views/home.view.html"
	})
	.when("/login", {
		templateUrl:"views/login.view.html"
	})
})