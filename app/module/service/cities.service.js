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
