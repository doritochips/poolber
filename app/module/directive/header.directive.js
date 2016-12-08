dash.directive('poolHeader', ['UserService', '$window', function(UserService, $window){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		link: function(scope, element, attr){	
			
			scope.showNav = function(){	
				var toggle = document.querySelectorAll("#nav-container")[0].style.display; 							
				if(toggle == "block"){
					document.querySelectorAll("#nav-container")[0].style.display = "none";	
				}else{
					document.querySelectorAll("#nav-container")[0].style.display = "block";	
				}
				
			};

			angular.element($window).bind('resize', function(){
				scope.width = $window.innerWidth;				
				// change is 960px width
				if(scope.width >= 768){				
					document.querySelectorAll("#nav-container")[0].style.display = "block";		
				}else{
					document.querySelectorAll("#nav-container")[0].style.display = "none";
				}
				scope.$digest();
			});

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

			var init = function(){
				UserService.saveUserInfo();
			}();
			
		}	
	}
}]);