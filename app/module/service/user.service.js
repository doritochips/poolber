"use strict";

dash.factory('UserService', ["$location", "$http", function($location, $http){
	// getting userInfo in controller: UserService.data[0]

	var userService = {	
		session:"",	
		userInfo: {}
	};

	userService.getSession = function(){
		var url = $location.absUrl();
		userService.session = url.substring(url.indexOf('?')+1, url.indexOf('#'));		
		return userService.session;		
	};

	userService.getUserInfo = function(){	
		
		var session = userService.session === ""? userService.getSession(): userService.session;
		var promise = $http({
			method: 'post',
			url: 'api/data/userinfo',
			data: {"session": session}
		});

		return promise;
	};	
	userService.getUserInfoForDirectives = function(){
		var session = userService.session === ""? userService.getSession(): userService.session;
		return $http.post('api/data/userinfo', {"session": session});
	};

	userService.getUser = function(){
		return userService.userInfo;
	};

	userService.logoutUser = function(){
		return $http.post('api/auth/signout', {"session": userService.session});
	};
	

	userService.getRideHistory = function(){
		return $http.get('api/history/' + userService.userInfo._id);
	};

	//save user info in service
	userService.saveUserInfo = function(user){
		userService.userInfo = user;
	};
	return userService;

}]);