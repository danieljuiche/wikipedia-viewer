// Define Module
var wikipediaApp = angular.module('wikipediaApp', []);

// Configuration settings
wikipediaApp.config(function ($sceDelegateProvider) {

	// Whitelist wikipedia API
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikipedia.org/w/api.php?action=opensearch&search=testing&limit=10&namespace=0']);

});

// Set up main controller
wikipediaApp.controller('mainController', ['$http', function ($http) {

	// Testing API call to wikipedia
	console.log($http.jsonp('http://en.wikipedia.org/w/api.php?action=opensearch&search=testing&limit=10&namespace=0', {jsonpCallbackParam: 'callback'}));

}]);
