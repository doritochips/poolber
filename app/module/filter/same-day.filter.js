"use strict";

dash.filter('sameDay', function() {
	return function (input, selectedDate) {
		if (!selectedDate){
			return input;
		}
		var output = [];
		angular.forEach(input, function (item) {
			var rideDate = new Date(item.endTime);
			if (!(rideDate.getDate() !== selectedDate.getDate() || 
				rideDate.getMonth() !== selectedDate.getMonth() || 
				rideDate.getFullYear() !== selectedDate.getFullYear())) {
				output.push(item);
			}
		});
		return output;
	};
});