dash.directive('poolHeader', ['UserService', '$location', '$window', '$rootScope', function(UserService, $location, $window, $rootScope){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		link: function(scope, element, attr){
			// get _id
			var url = $location.absUrl();
			var session = url.substring(url.indexOf('?')+1, url.indexOf('#'));			
			UserService.getUserInfo(session).then(function(res){				
				if(!res.data[0]){
					$window.location.href = '/#/login';	
					return;
				}
				scope.user = res.data[0];				
				scope.user.name = scope.user.firstName == ""? scope.username:scope.user.firstName + " " + scope.user.lastName;
				// broadcast userid so any scope can get it
				$rootScope.$broadcast('getUserId', scope.user._id)
			
			}, function(err){
				$window.location.href = '/#/login';
			});
			
			scope.logout = function(){
				UserService.logoutUser(session).then(function(res){
					$window.location.href = '/#/';	
				});				
			}
			
		}	
	}
}]);