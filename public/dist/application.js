"use strict";

var dash = angular.module('dash', ['ngRoute','ngAnimate', 'ui.bootstrap','toaster','routeStyles']);
var front = angular.module('front', ['ngRoute','routeStyles']);
"use strict";

front.controller("ForgotCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		// user
		$scope.user = {
			email:"",
		};

		// submit form
		$scope.submit = function(){
			$scope.user.email = $scope.email;
			$http.post("/api/auth/forgot", $scope.user).then(function(res){				
				$scope.message = res.data.message;
			}, function(err){
				$scope.message = err.data.message;
				console.log(err);
			});
		};


}]);
"use strict";

dash.controller("historyCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){
	
	$scope.postedRequest = [];
	$scope.appliedRequest = [];
	$scope.postedRides = [];
	$scope.appliedRides = [];

	$scope.mergedList = [];
	var driverList = ['postedRides', 'appliedRequest'];
	var postedList = ['postedRides', 'postedRequest'];
	$scope.viewAsDriver = 'passenger';
	$scope.showElement = function(type){
		if ($scope.viewAsDriver === 'driver'){
			return driverList.indexOf(type) > -1;
		}else{
			return driverList.indexOf(type) <= -1;
		}
	};

	$scope.GenerateNote = function(type){
		if (type === "postedRequest") {
			return "you posted this request";
		}else if (type === "appliedRequest"){
			return "you responsed to this request";
		}else if (type === "postedRides"){
			return "you posted this ride";
		}else if (type === "appliedRides"){
			return "you applied to this ride";
		}
	};
	//on left or right
	$scope.defineMainClass = function(type){
		if (type === "appliedRequest" || type === "appliedRides"){
			return "alt";
		}
		else {
			return "";
		}
	};

	//define icon
	$scope.defineIconClass = function(type){
		if (type === 'postedRides'){
			return "fa fa-car";
		}
		else if (type === 'appliedRides'){
			return "fa fa-user";
		}
		else if (type === 'postedRequest'){
			return "fa fa-map-signs";
		}
		else if (type === 'appliedRequest'){
			return "fa fa-comment";
		}
	};

	//define color
	$scope.defineIconColorClass = function(type){
		if (type === 'postedRides'){
			return "btn-info";
		}
		else if (type === 'appliedRides'){
			return "btn-dark";
		}
		else if (type === 'postedRequest'){
			return "btn-danger";
		}
		else if (type === 'appliedRequest'){
			return "btn-warning";
		}
	};

	var compare = function(a,b) {
		return new Date(b.endTime) - new Date(a.endTime);
	};

	var importData = function(data){
		$scope.postedRequest = data.postedRequest;
		$scope.appliedRequest = data.appliedRequest;
		$scope.postedRides = data.postedRides;
		$scope.appliedRides = data.appliedRides;

		for (var i = 0; i < data.postedRequest.length; i++) {
			data.postedRequest[i].source = "postedRequest";
			$scope.mergedList.push(data.postedRequest[i]);
		}
		for (var j = 0; j < data.appliedRequest.length; j++) {
			data.appliedRequest[j].source = "appliedRequest";
			$scope.mergedList.push(data.appliedRequest[j]);
		}		
		for (var m = 0; m < data.postedRides.length; m++) {
			data.postedRides[m].source = "postedRides";
			$scope.mergedList.push(data.postedRides[m]);
		}
		for (var n = 0; n < data.appliedRides.length; n++) {
			data.appliedRides[n].source = "appliedRides";
			$scope.mergedList.push(data.appliedRides[n]);
		}
		$scope.mergedList = $scope.mergedList.sort(compare);
		console.log($scope.mergedList);
	};

	var init = function(){
		//if userinfo is cached
		if (UserService.userInfo === {}) {
			UserService.getRideHistory().then(function(res){
				importData(res.data);
			});
		}
		//get user info then get history
		else {
			UserService.saveUserInfo().then(function(firstRes){
				UserService.getRideHistory().then(function(res){
					importData(res.data);
				});
			});
		}
	}();
}]);
"use strict";

dash.controller("postRideCtrl", ["$http", "$scope", 'toaster', 'CityList','UserService',function($http, $scope, toaster, CityList, UserService){
	$scope.roundTime = function(time){
		var mins = time.getMinutes();
		var quarterHours = Math.round(mins/15);
		if (quarterHours === 4)
		{
		    time.setHours(time.getHours()+1);
		}
		var rounded = (quarterHours*15)%60;
		time.setMinutes(rounded);
		return time;
	};

	// hardcode data	
	$scope.cities = CityList.commonCities;
	$scope.passengers = [1,2,3,4];		
	// init
	$scope.errorMsg = "";
	$scope.noError = true;
	$scope.form = {		
		startTime: $scope.roundTime(new Date()),
		endTime: $scope.roundTime(new Date()),
		price: 0
	};
	console.log($scope.form);
	$scope.popup = {
		opened:false
	};
	$scope.dateOptions = {
	    formatYear: 'yy',
	    minDate: new Date()
	};	
	// get user id
	
	$scope.form.user_id = UserService.getUserId();
	if($scope.form.user_id === ""){
		UserService.getUserInfo().then(function(res){
			$scope.form.user_id = res.data[0]._id;
		});
	}

	$scope.open = function(){
		$scope.popup.opened  = true;		
	};
	
	$scope.submit = function(){
		if(!validation()){
			return;
		}

		// manipulate date
		var year = $scope.form.date.getFullYear();
		var month = $scope.form.date.getMonth();
		var day = $scope.form.date.getDate();
		var user_id = $scope.form.user_id;
		var startingH = $scope.form.startTime.getHours();
		var startingM = $scope.form.startTime.getMinutes();
		var endingH = $scope.form.endTime.getHours();
		var endingM = $scope.form.endTime.getMinutes();
		$scope.form.startTime = new Date(year, month, day, startingH, startingM);
		$scope.form.endTime = new Date(year, month, day, endingH, endingM);

		$http.post('/api/ride', $scope.form).then(function(res){
			if(res){				
				toaster.pop('success', "Success", "Your ride has been posted!");
				$scope.form = {
					user_id: user_id,
					startTime: $scope.roundTime(new Date()),
					endTime: $scope.roundTime(new Date()),
					departure: "Select a city",
					destination: "Select a city",
					passenger: 1,
					price: 0
				};

			}else{
				toaster.pop('error', "Failure", "Some unexpected error occurs!");
			}
		}, function(err){
			console.log(err);
		});

	};

	function validation(){
		if($scope.form.price < 0){
			$scope.errorMsg = "Please enter a valid price.";
			$scope.noError = false;
			return false;
		}
		if($scope.form.departure === "Select a city"){
			$scope.errorMsg = "Please select a departure location.";
			$scope.noError = false;
			return false;
		}
		if($scope.form.destination === "Select a city"){
			$scope.errorMsg = "Please select a destination.";
			$scope.noError = false;
			return false;
		}
		if(!$scope.form.date){
			$scope.errorMsg = "Please select a date.";
			$scope.noError = false;
			return false;
		}else{
			var yesterday = new Date(new Date().getTime()  - 24 * 60 * 60 * 1000);
			if($scope.form.date < yesterday){
				$scope.errorMsg = "Please select a valid date.";
				$scope.noError = false;
				return false;	
			}			
		}
		
		if(!$scope.form.startTime){
			$scope.errorMsg = "Please select a valid time.";
			$scope.noError = false;
			return false;
		}
		if(!$scope.form.endTime){
			$scope.errorMsg = "Please select a valid time.";
			$scope.noError = false;
			return false;
		}

		if($scope.form.endTime < $scope.form.startTime){
			$scope.errorMsg = "Time period is invalid.";
			$scope.noError = false;
			return false;
		}
		$scope.noError = true;
		return true;
	}
		
}]);

"use strict";

dash.controller("profileCtrl", ["$scope","$location", "$http", "UserService", "toaster", "$window", function($scope, $location, $http, UserService, toaster, $window){

	// init
	$scope.editing = false;
	$scope.showCar = $window.innerWidth < 990? false:true;
	var backup = {};

	UserService.getUserInfo().then(function(res){				
		if(res === "failure"){
			$window.location.href = '/#/login';	
			return;
		}
		$scope.user = res.data[0];				
		backup.displayName = res.data[0].displayName;		
		backup.email = res.data[0].email;
		backup.phone = res.data[0].phone;
		backup.wechat = res.data[0].wechat;
	
	}, function(err){
		$window.location.href = '/#/login';
	});


	// car manipulate according to window size
	angular.element($window).on('resize', function(){			
		if($window.innerWidth < 990){
			
			$scope.$apply(function(){
				$scope.disableCar();
			});
			$scope.$digest();
		}
	});	

	$scope.disableCar = function(){
		$scope.showCar = false;
	};

	$scope.editInfo = function(){
		$scope.editing = true;
	};

	$scope.saveInfo = function(){
		$http.post("/api/data/saveProfile",
			{
				displayName: $scope.user.displayName,
				email: $scope.user.email,
				phone: $scope.user.phone,
				wechat: $scope.user.wechat,
				session: UserService.getSession()
			}).then(function(res){
				if(res){				
					toaster.pop('success', "Success", "Your profile has been updated!");			
				}else{
					toaster.pop('error', "Failure", "Some unexpected error occurs!");
				}
			});
		$scope.editing = false;
	};
	$scope.cancelEdit = function(){
		$scope.user.displayName = backup.displayName;		
		$scope.user.email = backup.email;
		$scope.user.phone = backup.phone;
		$scope.user.wechat = backup.wechat;
		$scope.editing = false;
	};
}]);
"use strict";

dash.controller("requestListCtrl", ['$scope', '$http', function($scope, $http){

}]);
"use strict";

dash.controller("requestRideCtrl", ["$http", "$scope", 'toaster', 'CityList','UserService',function($http, $scope, toaster, CityList, UserService){
	var roundTime = function(time){
		var mins = time.getMinutes();
		var quarterHours = Math.round(mins/15);
		if (quarterHours === 4)
		{
		    time.setHours(time.getHours()+1);
		}
		var rounded = (quarterHours*15)%60;
		time.setMinutes(rounded);
		return time;
	};

	// hardcode data	
	$scope.cities = CityList.commonCities;
	$scope.passengers = [1,2,3,4];	
	
	// init
	$scope.errorMsg = "";
	$scope.noError = true;
	$scope.form = {				
		startTime: roundTime(new Date()),
		endTime: roundTime(new Date())
	};
	$scope.popup = {
		opened:false
	};
	$scope.dateOptions = {
	    formatYear: 'yy',
	    minDate: new Date()
	};	
	// get user id
	
	$scope.form.user_id = UserService.getUserId();
	if($scope.form.user_id === ""){
		UserService.getUserInfo().then(function(res){
			$scope.form.user_id = res.data[0]._id;
		});
	}

	$scope.open = function(){
		$scope.popup.opened  = true;		
	};
	
	$scope.submit = function(){
		if(!validation()){
			return;
		}

		// manipulate date
		var user_id = $scope.form.user_id;
		var year = $scope.form.date.getFullYear();
		var month = $scope.form.date.getMonth();
		var day = $scope.form.date.getDate();

		var startingH = $scope.form.startTime.getHours();
		var startingM = $scope.form.startTime.getMinutes();
		var endingH = $scope.form.endTime.getHours();
		var endingM = $scope.form.endTime.getMinutes();
		$scope.form.startTime = new Date(year, month, day, startingH, startingM);
		$scope.form.endTime = new Date(year, month, day, endingH, endingM);

		$http.post('/api/request', $scope.form).then(function(res){
			if(res){				
				toaster.pop('success', "Success", "Your request has been posted!");
				$scope.form = {
					user_id: user_id
				};				
			}else{
				toaster.pop('error', "Failure", "Some unexpected error occurs!");
			}
		}, function(err){
			console.log(err);
		});

	};




	function validation(){
		if($scope.form.departure === "Select a city"){
			$scope.errorMsg = "Please select a departure location.";
			$scope.noError = false;
			return false;
		}
		if($scope.form.destination === "Select a city"){
			$scope.errorMsg = "Please select a destination.";
			$scope.noError = false;
			return false;
		}
		if(!$scope.form.date){
			$scope.errorMsg = "Please select a date.";
			$scope.noError = false;
			return false;
		}else{
			var yesterday = new Date(new Date().getTime()  - 24 * 60 * 60 * 1000);
			if($scope.form.date < yesterday){
				$scope.errorMsg = "Please select a valid date.";
				$scope.noError = false;
				return false;	
			}			
		}
		
		if(!$scope.form.startTime){
			$scope.errorMsg = "Please select a valid time.";
			$scope.noError = false;
			return false;
		}
		if(!$scope.form.endTime){
			$scope.errorMsg = "Please select a valid time.";
			$scope.noError = false;
			return false;
		}

		if($scope.form.endTime < $scope.form.startTime){
			$scope.errorMsg = "Time period is invalid.";
			$scope.noError = false;
			return false;
		}
		$scope.noError = true;
		return true;
	}
		
}]);

"use strict";

front.controller("ResetCtrl", ['$window','$scope', '$http','$timeout', '$routeParams','$location',
	function($window, $scope, $http, $timeout, $routeParams,$location){
		// user

		$scope.token = $routeParams.id;

		// submit form
		$scope.submit = function(){
			if ($scope.password !== $scope.passwordRepeat) {
				$scope.message = "Passwords don't match";
			}
			else{
				$scope.send = {
					"newPassword" : $scope.password,
					"verifyPassword": $scope.passwordRepeat
				};
				$http.post("/api/auth/reset/" + $scope.token, $scope.send).then(function(res){				
					$scope.message = "Your password has been reset, you'll be redirected in 3 seconds...";
					$timeout(function() {
						$location.path('/login');
					}, 3000);
				}, function(err){
					$scope.message = err.data.message;
					//console.log(err);
				});			
			}

		};

}]);
'use strict';

dash.controller("rideListCtrl", ['$window','$scope', '$http', 'CityList','UserService', '$uibModal', 'toaster',
	function($window, $scope, $http, CityList, UserService, $uibModal, toaster){
		

		
		//toggle filter
		$scope.toggleFilter = function(){
			$scope.showFilter = !$scope.showFilter;
		};
		// apply for ride
		$scope.requestRide = function(ride){
			$uibModal.open({
				animation: true,
				arialLabelledBy:'modal-title',
				arialDescribedBy:'modal-body',
				templateUrl: 'views/components/requestRideModal.html',
				controller: ["$scope", "$uibModalInstance", "$timeout", function($scope, $uibModalInstance, $timeout){	

					$scope.selected = {
						email: false,
						phone: false,
						wechat: false
					};

					$scope.selectAll = function(){
						$scope.selected.email = true;
						$scope.selected.phone = true;
						$scope.selected.wechat = true;
					};

					$scope.unSelectAll = function(){
						$scope.selected.email = false;
						$scope.selected.phone = false;
						$scope.selected.wechat = false;
					};

					$scope.cancel = function(){
						$uibModalInstance.dismiss('cancel');
					};
					$scope.submit = function(){
						if($scope.validate()){
							$scope.showError = true;
							return;
						}else{	
							$scope.showError = false;
						}
						$uibModalInstance.close($scope.selected);
					};
					$scope.validate = function(){
						return !($scope.selected.email || $scope.selected.phone || $scope.selected.wechat);
					};
				}],
				size: 'sm'
			}).result.then(function(selected){
				$http.post("/api/requestRide",{
					selected: selected,
					ride_id: ride._id,
					passenger_id: $scope.user._id
				}).then(function(res){
					//toast message
					if(res.data === "success"){
						toaster.pop('success', "Success", "Your contact has been sent to the driver!");						
					}else{
						toaster.pop('error', "Failure", "Some unexpected error occurs!");
					}
					ride.isApplied = true;
				});
			});
		};

		$scope.open = function(){
			document.getElementById("datepicker").focus();
			$scope.popup.opened  = true;		
		};

		var addRelations = function(userId){

			// add mine and applied
			$scope.rides.forEach(function(iterator){
				if(iterator.user === userId){
					iterator.isMine = true;
				}
				iterator.passengerList.forEach(function(it){
					if(it.userid === userId){
						iterator.isApplied = true;
						return;						
					}
				});
			});				
		};

		var processData = function(){
			var l = $scope.rides.length;
			$scope.numberOfPages = function(){
				return Math.ceil($scope.rides.length/$scope.pageSize);
			};
			UserService.getUserInfo().then(function(res){				
				$scope.user = res.data[0];
				addRelations($scope.user._id);
			});						
		};



		//Form validation
		$scope.invalidInput = false;
		$scope.applyFilter = function(){
			if (!($scope.form.departure&&$scope.form.destination&&$scope.form.passengers&&$scope.form.date&&$scope.form.departure !== $scope.cities[0]&&$scope.form.destination !== $scope.cities[0])){
				$scope.invalidInput = true;
				if (!$scope.form.departure || $scope.form.departure === $scope.cities[0]){
					$scope.invalidDeparture = true;
				}
				if (!$scope.form.destination  || $scope.form.destination === $scope.cities[0]){
					$scope.invalidDestination = true;
				}
				if (!$scope.form.passengers){
					$scope.invalidPassenger = true;
				}
				if (!$scope.form.date){
					$scope.invalidDate = true;
				}		
			}else{
				$scope.invalidInput = false;
				$scope.invalidDeparture = false;
				$scope.invalidDestination = false;
				$scope.invalidPassenger = false;
				$scope.invalidDate = false;

				$scope.filter.departure = $scope.form.departure.trim();	//remove line break and shit
				$scope.filter.destination = $scope.form.destination.trim();
				$scope.filter.passengers = $scope.form.passengers;
				$scope.filter.date = $scope.form.date;
					
			}
		};

		//List rides

		$http.get('/api/rides').then(function(res){
			$scope.rides = res.data;			
			processData();
		},function(res){
			console.log(res);
		});

		$scope.getDetail = function(ride){			
			return;
		};

		//initialize
		var init = function(){
			$scope.form = {};
			$scope.user = {};
			$scope.filter = {};
			$scope.cities = CityList.commonCities;
			$scope.dateOptions = {
			    formatYear: 'yy',
			    minDate: new Date()
			};	
			$scope.popup = {
				opened:false
			};
			$scope.showFilter = false;
			$scope.isCollapsed = true;
			$scope.form.passengers = 1;
			$scope.form.date= new Date();
			//pagination
			$scope.rides = [];
			$scope.currentPage = 0;
			$scope.pageSize = 10;
			$scope.options = [10,20,50];
		}();



}]);

"use strict";

front.controller("SigninCtrl", ['$window','$scope', '$http', 
	function($window, $scope, $http){
		// user
		$scope.user = {
			email:"",
			password:""
		};

		$scope.duplicateKey = false;
		$scope.errorMsg = "";
		// submit form
		$scope.submitUserinfo = function(){
			$scope.user.email = $scope.user.email.toLowerCase();
			$http.post("/api/auth/signin", $scope.user).then(function(res){				
				$window.location.href = '/dash.html?' + res.data;
			}, function(err){
				$scope.duplicateKey = true;
				console.log(err.data);
				$scope.errorMsg = err.data.message;
			});
		};


}]);
"use strict";

front.controller("SignupCtrl", ['$window','$scope', '$http', function($window, $scope, $http){
		// user
		$scope.user = {
			email:"",
			password:"",
			phone:""
		};

		$scope.duplicateKeyError = false;
		$scope.keyErrorMsg = "";

		$scope.validateAndSubmit = function(){
			var validated = false;
			//validate before submit
			for (var i = 1; i <= 3; i++) { 
			    if ($scope.user.validate(i)) {
			    	validated = false;
			    	break;
			    }
			    else {
			    	validated = true;
			    }
			}
			if (validated){
				$scope.submitUserinfo();
			}
		};

		// submit form
		$scope.submitUserinfo = function(){
			$scope.user.email = $scope.user.email.toLowerCase();
			$http.post("/api/auth/signup", $scope.user).then(function(res){
				$window.location.href = '/dash.html?'+ res.data;
			}, function(err){
				$scope.duplicateKeyError = true;
				$scope.keyErrorMsg = err.data.errorMsg;
			});
		};

		// validation
		$scope.formValidated = false;

		$scope.user.validate = function(index){
			if(index === 1){
				var password = $scope.user.password;
				if(password === "" || !password){
					$scope.errorMsg2 = "Password should not be empty";
					$scope.formValidated = true;
					return true;
				}else if(password.length < 6){
					$scope.errorMsg2 = "Password should be at least 6 characters";
					$scope.formValidated = true;
					return true;
				}else if(password.length > 16){
					$scope.formValidated = true;
					$scope.errorMsg2 = "Password should not be more than 16 characters";
					return true;
				}else if(password.indexOf(" ") > 0){
					$scope.formValidated = true;
					$scope.errorMsg2 = "password should not contain any space";
					return true;
				}
				$scope.formValidated = false;
				$scope.errorMsg2 = "";
				return false;
			}
			else if (index === 2){
				var email = $scope.user.email;
				var re = /\S+@\S+\.\S+/;
    			if (!re.test(email)){
    				$scope.errorMsg2 = "invalid email";
    				$scope.formValidated = true;
    				return true;
    			}
				if (email === "" || !email){
					$scope.errorMsg2 = "email should not be empty";
					$scope.formValidated = true;
					return true;
				}
				$scope.formValidated = false;
				$scope.errorMsg2 = "";
				return false;
			}
			else if(index === 3){
				var phone = $scope.user.phone;
				if (phone.length > 0 && phone.length < 10){
					$scope.errorMsg2 = "Password should not be empty";
					$scope.formValidated = true;
					return true;
				}
				$scope.formValidated = false;
				$scope.errorMsg1 = "";
				return false;
			}
			else{
				return true;
			}
		};
}]);
"use strict";

dash.directive('poolHeader', ['UserService', '$window', function(UserService, $window){
	return{
		templateUrl:'views/layout/header.view.html',
		restrict: 'A',
		link: function(scope, element, attr){	
			
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

			UserService.getUserInfo().then(function(res){				
				if(!res.data[0]){
					$window.location.href = '/#/login';	
					return;
				}
				scope.user = res.data[0];
				scope.user.name = scope.user.displayName;
				UserService.saveUserId(scope.user._id);
				//console.log(UserService.getUserId());
			
			}, function(err){
				$window.location.href = '/#/login';
			});
			
			scope.logout = function(){
				UserService.logoutUser().then(function(res){
					$window.location.href = '/#/';	
				});				
			};

			var init = function(){
				UserService.saveUserInfo();
			}();
			
		}	
	};
}]);
"use strict";

dash.directive('phoneInput', ["$filter", "$browser", function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
}]);
dash.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});
"use strict";

dash.directive("poolSidebar", ['$location', '$routeParams', function($location, $routeParams ){
    var controller = ['$scope', function($scope){
		
		$scope.driverMode = true;
		$scope.switchMode = function(){
			$scope.driverMode = !$scope.driverMode;
		};

		//when lick, clear all class and reassign the one clicked
		$scope.activate = function(s){
			for (var i in $scope.classList){
				$scope.classList[i] = "";
			}
			$scope.classList[s] = $scope.activeClass;
		};

		var init = function(){
			$scope.activeClass = "open active";
			$scope.nonActiveClass = "";
			//assign default
			$scope.classList = ["","","",""];
			//list ride, assign the index as active class
			var routeList = ["/history","/requestRide","/postRide","/","/requestList"];
			$scope.classList[routeList.indexOf($location.path())] = $scope.activeClass;
			//console.log($scope.classList);
		}();
    }];
    return{
        templateUrl:'views/layout/sidebar.view.html',
        restrict:'A',
        controller: controller,
        link: function(scope, element, attr){
			// get _id
		}
    };
}]);
"use strict";

front.directive('phoneInput', ["$filter", "$browser", function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
}]);
front.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});
"use strict";

dash.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});
"use strict";

dash.filter('startFrom', function() {
	return function(input, start){
		start = + start;
		return input.slice(start);
	};
});
"use strict";

dash.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$locationProvider.html5Mode(false);

	$routeProvider
	.when("/",{
		templateUrl:"views/rideList.view.html",
		controller: "rideListCtrl",
		css: '/styles/ride-list.css'
	})
	.when("/requestRide", {
		templateUrl:"views/request_ride.view.html",
		controller:"requestRideCtrl"
	})
	.when("/postRide",{
		templateUrl:"views/post_ride.view.html",
		controller:"postRideCtrl"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.when("/rides",{
		templateUrl:"views/ride-list.view.html",
		controller: "rideListCtrl"
	})
	.when("/profile",{
		templateUrl:"views/profile.view.html",
		controller: "profileCtrl",
		css:"/styles/profile.css"
	})
	.when("/history",{
		templateUrl:"views/history.view.html",
		controller: "historyCtrl"
	})
	.when("/requestList",{
		templateUrl:"views/requestList.view.html",
		controller: "requestListCtrl"
	})
	.otherwise({
		redirectTo:'/404'
	});
}]);

"use strict";

front.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$locationProvider.html5Mode(false);

	$routeProvider
	.when("/",{
		templateUrl:"views/home.view.html",
		css:"styles/landing.css"
	})
	.when("/login", {
		templateUrl:"views/login.view.html",
		controller: "SigninCtrl",
		css:"styles/login.css"
	})
	.when("/signup",{
		templateUrl:"views/signup.view.html",
		controller: "SignupCtrl",
		css:"styles/signup.css"
	})
	.when("/forgot-password",{
		templateUrl:"views/password/forgot-password.view.html",
		controller: "ForgotCtrl"
	})
	.when("/password/reset/:id",{
		templateUrl:"views/password/reset-password.view.html",
		controller: "ResetCtrl"
	})
	.when("/password/resetinvalid",{
		templateUrl:"views/password/reset-password-invalid.view.html"
	})
	.when("/404",{
		templateUrl:"views/error/404.view.html"
	})
	.when("/terms-and-condition",{
		templateUrl:"views/terms/term.view.html"
	})
	.when("/privacy-policy",{
		templateUrl:"views/terms/privacy.view.html"
	})
	.otherwise({
		redirectTo:'/404'
	});
	}]);

"use strict";

dash.factory('CityList', ["$http", function($http){
	var cityList = function() {
		var a = {
			"commonCities" : [
			"Toronto Downtown",
			"Toronto Richmond Hill",
			"Toronto Scarborough",
			"Toronto North York",
			"Toronto Markham",
			"Toronto Missisauga",
			"London", 
			"Waterloo", 
			"Kitchener",
			"Niagara",
			"Ottawa",
			"Hamilton",
			"Windsor",
			"Guelph",
			],
			"otherCities":[
		]};
		a.commonCities.sort();
		a.commonCities.unshift("Select a city");
		return a;
	};
	
	return cityList();
}]);

"use strict";

dash.factory('UserService', ["$location", "$http", function($location, $http){
	var userService = {
		userId: "",
		session: "",
		userInfo: {}
	};

	userService.getSession = function(){
		var url = $location.absUrl();
		userService.session = url.substring(url.indexOf('?')+1, url.indexOf('#'));	
		return userService.session;		
	};

	userService.getUserInfo = function(){	
		if(userService.session === ""){
			userService.getSession();
		}	
		return $http.post('api/data/userinfo', {"session": userService.session});
	};	
	userService.logoutUser = function(){
		return $http.post('api/auth/signout', {"session": userService.session});
	};
	userService.saveUserId = function(userId){
		userService.userId = userId;
	};
	userService.getUserId = function(){		
		return userService.userId;			
	};

	userService.getRideHistory = function(){
		return $http.get('api/history/' + userService.userInfo._id);
	};

	//save user info in service
	userService.saveUserInfo = function(){
		return $http.post('api/data/userinfo', {"session": userService.session}).then(function(res){
			userService.userInfo = res.data[0];
		});	
	};
	return userService;

}]);