// Define Module
var wikipediaApp = angular.module('wikipediaApp', []);

// Configuration settings
wikipediaApp.config(function ($sceDelegateProvider) {

	// Whitelist wikipedia API
	$sceDelegateProvider.resourceUrlWhitelist(['self', 'http://en.wikipedia.org/w/api.php?']);
});

// Service
wikipediaApp.service('wikipediaService', ['$http', '$q', function ($http, $q) {
	// Define Wikipedia API url
	var queryUrl = 'http://en.wikipedia.org/w/api.php?';

	return {
		getData: function (queryValue, queryOffsetValue) {
			return $http.jsonp(queryUrl, {
				// Settings for JSONP request
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

				// Returns response
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

	// Declare initial variables
	$scope.searchQuery = '';
	$scope.lastSearchQuery = '';
	$scope.results = [];
	$scope.numberOfResults = 0;
	$scope.searchQueryResults = '';
	$scope.currentOffset = 0;

	// Declare initial flag variables
	$scope.initialFlag = false;
	$scope.prevButtonDisableFlag = true;
	$scope.nextButtonDisableFlag = false;

	// Function for a new search
	$scope.newSearch = function () {
		// Sets previous search query
		$scope.lastSearchQuery = $scope.searchQuery;
		$scope.currentOffset = 0;
		$scope.prevButtonDisableFlag = true;
		$scope.search($scope.searchQuery);
	}

	// Search function
	$scope.search = function (searchTerm) {

		// Repopulate search box
		$scope.searchQuery = searchTerm;

		// Removes focus from input search box
		$scope.removeFocus();

		// Call Wikipedia service
		wikipediaService.getData(searchTerm, $scope.currentOffset).then(function (data) {
			if (data.status === 200) {
				// API call success
				console.log("API call success!");
				console.log(data);

				// At least one page result
				if (data.data.hasOwnProperty('query')) {
					$scope.dataReturned = data.data.query.pages;
					$scope.numberOfResults = $scope.dataReturned.length;

					// Conditional statement to disable next button
					$scope.nextButtonDisableFlag = false;
					if ($scope.numberOfResults < 10 ) {
						$scope.nextButtonDisableFlag = true;
					}

					// Reset results container
					$scope.results = $scope.dataReturned.map(function (page) {
						// Store relevant data in object
						var dataReturned = {
							"title": page.title,
							"textExtract": page.extract,
							"pageUrl": page.fullurl,
						}

						// Store thumbnail image data
						if (page.hasOwnProperty('thumbnail')) {
							dataReturned.imageUrl = page.thumbnail.source;
						} else {
							dataReturned.imageUrl = "http://www.freeiconspng.com/uploads/no-image-icon-23.jpg";
						}

						return dataReturned
					});

				} else {

					// No results found
					$scope.nextButtonDisableFlag = true;
					$scope.numberOfResults = 0;
					$scope.results = 0;

				}

				// Set initialFlag to false
				$scope.initialFlag = true;
				// Set correct value for number of query results
				$scope.searchQueryResults = $scope.searchQuery;

			} else {

				// Error calling API
				$scope.dataReturned = "Something went wrong!";

			}
		}, function (error) {

			// Something went wrong
			console.log("API call failed!");
			console.log(error);

		});
	}

	// Function to clear search value
	$scope.inputClear = function () {
		$scope.searchQuery = '';
	}

	// Function for increase search offset values
	$scope.increaseOffset = function () {
		$scope.currentOffset += 10;
		$scope.search($scope.lastSearchQuery);
		$scope.prevButtonDisableFlag = false;
	}

	// Function for decreasing search offset values
	$scope.decreaseOffset = function () {
		$scope.currentOffset -= 10;
		$scope.search($scope.lastSearchQuery);
		if ($scope.currentOffset === 0) {
			$scope.prevButtonDisableFlag = true;
		}
	}

	// Function to remove focus from input search field
	$scope.removeFocus = function () {
		document.getElementById("searchField").blur();
	}

}]);

// Directives
wikipediaApp.directive('searchResults', function () {
	return {
		restrict: 'E',
		templateUrl: 'directives/searchResults.html'
	}
});