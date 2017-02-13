// Define Module
var wikipediaApp = angular.module('wikipediaApp', []);

// Configuration settings
wikipediaApp.config(function ($sceDelegateProvider) {

	// Whitelist wikipedia API
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikipedia.org/w/api.php?']);

});

// Service
wikipediaApp.service('wikipediaService', ['$scope', '$http', function ($scope, $http) {
	var queryUrl = 'http://en.wikipedia.org/w/api.php?';

	// Testing API call to wikipedia
	$http.jsonp(queryUrl, {
		jsonpCallbackParam: 'callback',
		params: {
			action: 'opensearch',
			search: 'testing',
			limit: 10,
			namespace: 0
		}
	})	
	.then(function(data){
		console.log(data);
	});
}]);

// Set up main controller
wikipediaApp.controller('mainController', ['$http', 'wikipediaService', function ($http, wikipediaService) {

	/*var queryUrl = 'http://en.wikipedia.org/w/api.php?';

	// Testing API call to wikipedia
	$http.jsonp(queryUrl, {
		jsonpCallbackParam: 'callback',
		params: {
			action: 'opensearch',
			search: 'testing',
			limit: 10,
			namespace: 0
		}
	})	
	.then(function(data){
		console.log(data);
	});*/

}]);
