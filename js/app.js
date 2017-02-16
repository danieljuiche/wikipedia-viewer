// Define Module
var wikipediaApp = angular.module('wikipediaApp', []);

// Configuration settings
wikipediaApp.config(function ($sceDelegateProvider) {

	// Whitelist wikipedia API
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikipedia.org/w/api.php?', 'https://api.github.com/events?']);
});

// Service
wikipediaApp.service('wikipediaService', ['$http', '$q', function ($http, $q) {
	var queryUrl = 'http://en.wikipedia.org/w/api.php?';
	return {
		getData: function () {
			return $http.jsonp(queryUrl, {
				jsonpCallbackParam: 'callback',
				params: {
					action: 'opensearch',
					search: 'Vancouver',
					limit: 10,
					namespace: 0
				}
			}).then(function (response) {
				if (typeof response === 'object') {
					return response;
				}
				else {
					// Something went wrong
					return $q.reject(response);
				}
			}, function (response) {
				// Something went wrong
				return $q.reject(response);
			});
		}
	}
}]);

// Set up main controller
wikipediaApp.controller('mainController', ['$scope', 'wikipediaService', function ($scope, wikipediaService) {
	wikipediaService.getData().then(function (data) {
		if (data.status === 200) {
			$scope.dataReturned = data;
		} else {
			$scope.dataReturned = "Something went wrong!";
		}
	}, function (error) {
		// Something went wrong
		console.log(error);
	});
}]);