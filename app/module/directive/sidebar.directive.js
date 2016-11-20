dash.directive("poolSidebar", ['$location', function($location){

    var controller = ['$scope', function($scope){
		var activeClass = "open active";
		var nonActiveClass = "";
		//assign default
		$scope.classList = [activeClass,"",""];
		
		//when lick, clear all class and reassign the one clicked
		$scope.activate = function(s){
			for (var i in $scope.classList){
				$scope.classList[i] = "";
			}
			$scope.classList[s] = activeClass;
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