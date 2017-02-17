// Define Module
var wikipediaApp = angular.module('wikipediaApp', []);

// Configuration settings
wikipediaApp.config(function ($sceDelegateProvider) {

	// Whitelist wikipedia API
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikipedia.org/w/api.php?']);
});

// Service
wikipediaApp.service('wikipediaService', ['$http', '$q', function ($http, $q) {
	var queryUrl = 'http://en.wikipedia.org/w/api.php?';
	return {
		getData: function (queryValue) {
			return $http.jsonp(queryUrl, {
				jsonpCallbackParam: 'callback',
				params: {
					action: 'opensearch',
					search: queryValue,
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
	$scope.searchQuery = '';
	$scope.results = [];
	
	$scope.search = function () {
		wikipediaService.getData($scope.searchQuery).then(function (data) {
			if (data.status === 200) {
				// API call success
				$scope.dataReturned = data;

				// Console data logging
				console.log(data);

				$scope.results = [];
				for (var i = 0; i < data.data[1].length; i++) {
					$scope.results.push({
						resultID: i,
						title: data.data[1][i],
						description: data.data[2][i],
						url: data.data[3][i]
					});
				}
				// Console logging
				console.log($scope.results);
			} else {
				$scope.dataReturned = "Something went wrong!";
			}
		}, function (error) {
			// Something went wrong
			console.log(error);
		});
	}
	$scope.inputClear = function () {
		$scope.searchQuery = '';
	}
}]);

// Directives
wikipediaApp.directive('searchResults', function () {
	return {
		restrict: 'E',
		templateUrl: 'directives/searchResults.html'
	}
});