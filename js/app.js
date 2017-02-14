// Define Module
var wikipediaApp = angular.module('wikipediaApp', []);

// Configuration settings
wikipediaApp.config(function ($sceDelegateProvider) {

	// Whitelist wikipedia API
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikipedia.org/w/api.php?']);

});

// Service - http://stackoverflow.com/questions/39203472/angularjs-service-call-api-and-return-json
//         - http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular
wikipediaApp.service('wikipediaService', ['$http', function ($http) {
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
		return data;
	});
}]);

// Set up main controller
wikipediaApp.controller('mainController', ['$scope', '$http', 'wikipediaService', function ($scope, $http, wikipediaService) {
	console.log(wikipediaService);

}]);
