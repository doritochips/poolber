dash.factory('UserService', ["$http", function($http){
	var userService = {}
	userService.getUserInfo = function(uid){		
		return $http.post('api/data/userinfo', {"u_id": uid});
	}	
	return userService;
}]);