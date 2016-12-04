dash.factory('UserService', ["$location", "$http", function($location, $http){
	var userService = {
		userId: "",
		session: ""
	}

	userService.getSession = function(){
		var url = $location.absUrl();
		userService.session = url.substring(url.indexOf('?')+1, url.indexOf('#'));	
		return userService.session;		
	}

	userService.getUserInfo = function(){	
		if(userService.session == ""){
			userService.getSession();
		}	
		return $http.post('api/data/userinfo', {"session": userService.session});
	}	
	userService.logoutUser = function(){
		return $http.post('api/auth/signout', {"session": userService.session});
	}
	userService.saveUserId = function(userId){
		userService.userId = userId;
	}
	userService.getUserId = function(){		
		return userService.userId;			
	}

	return userService;
}]);