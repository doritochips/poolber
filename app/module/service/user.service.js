dash.factory('UserService', ["$http", function($http){
	var userService = {}
	userService.getUserInfo = function(session){		
		return $http.post('api/data/userinfo', {"session": session});
	}	
	userService.logoutUser = function(session){
		return $http.post('api/auth/signout', {"session": session});
	}
	return userService;
}]);