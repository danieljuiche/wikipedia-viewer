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
		getData: function (queryValue, queryOffsetValue) {
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
					"piprop": "original|thumbnail",
					"pilimit": "max",
					"inprop": "url",
					"gsrsearch": queryValue,
					"gsrnamespace": "0",
					"gsrlimit": "10",
					"gsroffset": queryOffsetValue
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
	$scope.searchQueryResults = '';
	$scope.currentOffset = 0;
	$scope.prevButtonDisable = true;
	$scope.nextButtonDisable = false;

	$scope.newSearch = function () {
		$scope.currentOffset = 0;
		$scope.prevButtonDisable = true;
		$scope.search();
	}

	$scope.search = function () {
		wikipediaService.getData($scope.searchQuery, $scope.currentOffset).then(function (data) {
			if (data.status === 200) {
				// API call success
				console.log("API call success!");
				console.log(data);

				// At least one page result
				if (data.data.hasOwnProperty('query')) {
					$scope.dataReturned = data.data.query.pages;
					$scope.numberOfResults = $scope.dataReturned.length;

					$scope.nextButtonDisable = false;
					if ($scope.numberOfResults < 10 ) {
						$scope.nextButtonDisable = true;
					}

					// Reset results container
					$scope.results = $scope.dataReturned.map(function (page) {
						var dataReturned = {
							"title": page.title,
							"textExtract": page.extract,
							"pageUrl": page.fullurl,
						}

						if (page.hasOwnProperty('thumbnail')) {
							dataReturned.imageUrl = page.thumbnail.source;
						} else {
							dataReturned.imageUrl = "http://www.freeiconspng.com/uploads/no-image-icon-23.jpg";
						}

						return dataReturned
					});

				} else {

					$scope.nextButtonDisable = true;
					$scope.numberOfResults = 0;
					$scope.results = 0;

				}

				// Set initialFlag to false
				$scope.initialFlag = true;
				// Set correct value for number of query results
				$scope.searchQueryResults = $scope.searchQuery;

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

	$scope.increaseOffset = function () {
		$scope.currentOffset += 10;
		$scope.search();
		$scope.prevButtonDisable = false;
	}

	$scope.decreaseOffset = function () {
		$scope.currentOffset -= 10;
		$scope.search();
		if ($scope.currentOffset === 0) {
			$scope.prevButtonDisable = true;
		}
	}

}]);

// Directives
wikipediaApp.directive('searchResults', function () {
	return {
		restrict: 'E',
		templateUrl: 'directives/searchResults.html'
	}
});