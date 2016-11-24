dash.factory('CityList', ["$http", function($http){
	var cityList = {}
	cityList.commonCities = [
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
	].sort();
	cityList.otherCities = [

	];
	return cityList;
}]);