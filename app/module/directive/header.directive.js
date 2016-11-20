dash.directive('poolHeader', ['UserService', '$location', '$window', function(UserService, $location, $window){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		link: function(scope, element, attr){
			// get _id
			var url = $location.absUrl();
			var u_id = url.substring(url.indexOf('?')+1, url.indexOf('#'));	
			UserService.getUserInfo(u_id).then(function(res){
				scope.user = res.data[0];
				console.log(scope.user);
			}, function(err){
				$window.location.href = '/#/login';
			});
			scope.logout = function(){
				$window.location.href = '/#/';
			}
			
		}	
	}
}]);