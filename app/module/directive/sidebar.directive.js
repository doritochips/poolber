dash.directive("poolSidebar", ['$location', function($location){

    var controller = ['$scope', function($scope){
		var activeClass = "open active";
		var nonActiveClass = "";

		$scope.activate = function(s){
			$scope.active = s;
			console.log($scope.active);
			if(s === "home"){
				$scope.homeClass = activeClass;
				$scope.requestClass = nonActiveClass;
				$scope.postClass = nonActiveClass;
			}else if(s ==="request"){
				$scope.homeClass = nonActiveClass;
				$scope.requestClass = activeClass;
				$scope.postClass = nonActiveClass;
			}else if(s === "post"){
				$scope.homeClass = nonActiveClass;
				$scope.requestClass = nonActiveClass;
				$scope.postClass = activeClass;
			}
		};
    }]
    return{
        templateUrl:'views/layout/sidebar.view.html',
        restrict:'A',
        controller: controller,
        link: function(scope, element, attr){
			// get _id
		}
    };
}]);