"use strict";

dash.directive('poolHeader', ['UserService', '$window', function(UserService, $window){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		scope: {
			cacheProgress: '=progress'
		},
		link: function(scope, element, attr){	
			
			var unwatch = scope.$watch('cacheProgress', function(new_val, old_val){
				if(new_val){
					scope.user = UserService.getUser();
					unwatch();
				}

			});
			scope.showNav = function(){	
				var toggle = document.querySelectorAll("#nav-container")[0].style.display; 							
				if(toggle === "block"){
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

			
			
			scope.logout = function(){
				UserService.logoutUser().then(function(res){
					$window.location.href = '/#/';	
				});				
			};
			
		}	
	};
}]);