dash.directive('poolHeader', ['UserService', '$location', '$window', function(UserService, $location, $window){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		link: function(scope, element, attr){
			// get _id
			var url = $location.absUrl();
			var session = url.substring(url.indexOf('?')+1, url.indexOf('#'));
			UserService.getUserInfo(session).then(function(res){
				scope.user = res.data[0];
				if(!scope.user){
					$window.location.href = '/#/login';	
				}
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