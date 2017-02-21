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
				params: {
					"action": "query",
					"format": "json",
					"prop": "extracts|pageimages|info",
					"continue": "gsroffset||",
					"generator": "search",
					"formatversion": "2",
					"exsentences": "2",
					"exlimit": "max",
					"exintro": 1,
					"explaintext": 1,
					"piprop": "original",
					"pilimit": "max",
					"inprop": "url",
					"gsrsearch": queryValue,
					"gsrnamespace": "0",
					"gsrlimit": "10",
					"gsroffset": "0"
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
	$scope.initialFlag = false;
	$scope.searchQuery = '';
	$scope.results = [];
	$scope.numberOfResults = 0;
	
	$scope.search = function () {
		wikipediaService.getData($scope.searchQuery).then(function (data) {
			if (data.status === 200) {
				// API call success
				console.log("API call success!");
				$scope.dataReturned = data.data.query.pages;
				$scope.numberOfResults = $scope.dataReturned.length;

				// Console data logging
				console.log($scope.dataReturned);

				// Reset results container
				$scope.results = $scope.dataReturned.map(function (page) {
					var dataReturned = {
						"title": page.title,
						"textExtract": page.extract,
						"pageUrl": page.fullurl,
					}

					if (page.hasOwnProperty('original')) {
						dataReturned.imageUrl = page.original.source;
					} else {
						dataReturned.imageUrl = "http://www.freeiconspng.com/uploads/no-image-icon-23.jpg";
					}

					return dataReturned
				});

				// Set initialFlag to false
				$scope.initialFlag = true;

				// Console logging
				console.log($scope.results);

			} else {

				$scope.dataReturned = "Something went wrong!";

			}
		}, function (error) {

			// Something went wrong
			console.log("API call failed!");
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