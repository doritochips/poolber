"use strict";

dash.filter('greaterThan', function() {
	return function (input, passengerNum) {
		var output = [];
		if (isNaN(passengerNum)) {
 
			output = input;
		}
		else {
			angular.forEach(input, function (item) {
 
				if (item.passenger >= passengerNum) {
					output.push(item)
				}
			});
		}
		return output;
	}
});