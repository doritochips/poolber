dash.directive('poolHeader', ['UserService', '$window', function(UserService, $window){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		link: function(scope, element, attr){		
			UserService.getUserInfo().then(function(res){				
				if(!res.data[0]){
					$window.location.href = '/#/login';	
					return;
				}
				scope.user = res.data[0];
				scope.user.name = scope.user.firstName == ""? scope.username:scope.user.firstName + " " + scope.user.lastName;				
				UserService.saveUserId(scope.user._id);
				//console.log(UserService.getUserId());
			
			}, function(err){
				$window.location.href = '/#/login';
			});
			
			scope.logout = function(){
				UserService.logoutUser().then(function(res){
					$window.location.href = '/#/';	
				});				
			}
			
		}	
	}
}]);